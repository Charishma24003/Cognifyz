const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.static(__dirname)); // Serve index.html and style.css

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("✅ Connected to MongoDB:", mongoose.connection.name);
})
.catch(err => {
  console.error("❌ DB Connection Error:", err);
});

// Define Schema and Model
const recordSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  feedback: String
});
const Record = mongoose.model('user5', recordSchema);

// Serve HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index1.html'));
});

// API Route
app.post('/api/submit', async (req, res) => {
  try {
    const { fullName, email, feedback } = req.body;
    const newRecord = new Record({ fullName, email, feedback });
    await newRecord.save();
    res.status(201).json({ message: "✅ Record submitted successfully" });
  } catch (error) {
    console.error("❌ API Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
