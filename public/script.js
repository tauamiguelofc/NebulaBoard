const api = "http://localhost:3001/api";

async function loadPosts() {
  const res = await fetch(`${api}/posts`);
  const posts = await res.json();
  const feed = document.getElementById("feed");
  if (!feed) return;
  feed.innerHTML = posts.map(p => `
    <div class="post">
      <h3>${p.author}</h3>
      <p>${p.content}</p>
    </div>
  `).join("");
}

if (document.getElementById("postBtn")) {
  document.getElementById("postBtn").onclick = async () => {
    const content = document.getElementById("postInput").value;
    const author = "User123"; // simples pra teste
    await fetch(`${api}/posts`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ author, content })
    });
    loadPosts();
  };
}

if (document.getElementById("loginBtn")) {
  document.getElementById("loginBtn").onclick = async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    await fetch(`${api}/login`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ email, password })
    });
    location.href = "index.html";
  };
}

if (document.getElementById("registerBtn")) {
  document.getElementById("registerBtn").onclick = async () => {
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    await fetch(`${api}/register`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ username, email, password })
    });
    location.href = "login.html";
  };
}

loadPosts();
