const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');
const rateLimit = require('express-rate-limit');

dotenv.config();
const app = express();

app.use(express.static(__dirname));

// Rate limiter
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: '🚫 Too many requests. Try again in 1 minute.'
});
app.use('/api/weather', limiter);

// Serve home.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

// API route
app.get('/api/weather', async (req, res) => {
  const city = req.query.city;
  const apiKey = process.env.WEATHER_API_KEY;

  if (!city) {
    return res.status(400).json({ error: 'City name is required' });
  }

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
    );

    const data = response.data;
    res.json({
      city: data.name,
      country: data.sys.country,
      temperature: data.main.temp,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed
    });

  } catch (err) {
    if (err.response?.status === 404) {
      res.status(404).json({ error: 'City not found' });
    } else {
      console.error('❌ Weather API error:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
