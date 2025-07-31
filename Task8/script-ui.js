const form = document.getElementById('userForm');
const list = document.getElementById('userList');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;

  await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email })
  });

  form.reset();
  loadUsers();
});

async function loadUsers() {
  const res = await fetch('/api/users');
  const users = await res.json();

  list.innerHTML = '';
  users.forEach(u => {
    const li = document.createElement('li');
    li.textContent = `${u.name} - ${u.email}`;
    list.appendChild(li);
  });
}

window.onload = loadUsers;
