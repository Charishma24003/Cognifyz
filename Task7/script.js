const form = document.getElementById('weatherForm');
const resultDiv = document.getElementById('weatherResult');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = document.getElementById('cityInput').value;

  try {
    const res = await fetch(`/api/weather?city=${city}`);
    const data = await res.json();

    if (res.ok) {
      resultDiv.innerHTML = `
        <h2>📍 ${data.city}, ${data.country}</h2>
        <p>🌡️ Temperature: ${data.temperature} °C</p>
        <p>☁️ Condition: ${data.description}</p>
        <p>💧 Humidity: ${data.humidity}%</p>
        <p>💨 Wind Speed: ${data.windSpeed} m/s</p>
      `;

      // 🌤️ Change background
      const condition = data.description.toLowerCase();
      const body = document.body;
      body.className = ""; // Clear old
      if (condition.includes("clear")) body.classList.add("clear-bg");
      else if (condition.includes("cloud")) body.classList.add("cloudy-bg");
      else if (condition.includes("rain")) body.classList.add("rainy-bg");
      else if (condition.includes("snow")) body.classList.add("snowy-bg");
      else body.classList.add("default-bg");

    } else {
      resultDiv.innerHTML = `<p style="color:red;">❌ ${data.error}</p>`;
    }
  } catch (err) {
    resultDiv.innerHTML = `<p style="color:red;">⚠️ Unable to fetch data.</p>`;
  }
});
