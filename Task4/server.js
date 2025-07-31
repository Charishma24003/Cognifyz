const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname)); // Serve index.html and style.css

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB Task4"))
.catch(err => console.error("❌ DB Error:", err));

// Schema and Model
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String
});
const User = mongoose.model('user4', userSchema);

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

app.post('/submit', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newUser = new User({ name, email, message });
    await newUser.save();
    res.send("<h2>✅ Submitted successfully! <a href='/'>Back</a></h2>");
  } catch (err) {
    console.error("❌ Submission error:", err);
    res.status(500).send("Error saving data.");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
