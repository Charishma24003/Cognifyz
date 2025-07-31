const apiUrl = 'http://localhost:5000';

async function register() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const res = await fetch(`${apiUrl}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  document.getElementById('output').innerText = data.message;
}

async function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const res = await fetch(`${apiUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  if (data.token) {
    localStorage.setItem('token', data.token);
    document.getElementById('output').innerText = "Login successful";
  } else {
    document.getElementById('output').innerText = data.message;
  }
}

async function getProfile() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${apiUrl}/profile`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const data = await res.json();
  document.getElementById('output').innerText = data.message || data.error;
}
