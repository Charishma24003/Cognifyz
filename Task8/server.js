const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Redis = require('ioredis');
const { Queue, Worker } = require('bullmq');

dotenv.config();
const app = express();

// Redis Options for BullMQ
const redisOptions = { maxRetriesPerRequest: null };

// Redis
const redis = new Redis(process.env.REDIS_URL, redisOptions);
redis.on('connect', () => console.log('✅ Redis connected'));

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// MongoDB Model
const userSchema = new mongoose.Schema({
  name: String,
  email: String
}, { timestamps: true });

const User = mongoose.model('user8', userSchema); // collection name: user8

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Cache Middleware
async function cache(req, res, next) {
  const cached = await redis.get('user8');
  if (cached) {
    console.log('📦 Served from Redis');
    return res.json(JSON.parse(cached));
  }
  next();
}

// Queue & Worker
const queue = new Queue('emailQueue', { connection: new Redis(process.env.REDIS_URL, redisOptions) });

new Worker('emailQueue', async job => {
  console.log(`📨 Simulating email to ${job.data.email}`);
  await new Promise(r => setTimeout(r, 2000));
  console.log(`✅ Email sent to ${job.data.email}`);
}, { connection: new Redis(process.env.REDIS_URL, redisOptions) });

// Routes
app.post('/api/users', async (req, res) => {
  const user = new User(req.body);
  await user.save();
  await queue.add('sendEmail', { email: user.email, name: user.name });
  await redis.del('user8'); // clear cache
  res.status(201).json(user);
});

app.get('/api/users', cache, async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  await redis.set('user8', JSON.stringify(users));
  res.json(users);
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


// Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
