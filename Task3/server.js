const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Serve static files like index.html, styles.css, script.js
app.use(express.static(__dirname));

// Built-in body parser for form data
app.use(express.urlencoded({ extended: false }));

app.get("/",(req,res)=>{
  return res.send("Ok");
})

// Handle form submission
app.post("/submit", (req, res) => {
  console.log("Inside /submit route");

  if (!req.body) {
    console.log("⚠️ req.body is undefined");
    return res.status(500).send("Internal Server Error: req.body is undefined");
  }

  console.log("Request Body:", req.body);

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    console.log("⚠️ Missing fields");
    return res.status(400).send("All fields are required.");
  }

  console.log("✅ Form submitted successfully:", req.body);

  res.send(`
    <h2 style="text-align: center;">Thank you, ${name}! We received your message.</h2>
    <p style="text-align: center;"><a href="/">Go back to form</a></p>
  `);
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
