fetch("https://skill-share-platform.onrender.com/api/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "client@demo.com", password: "password" })
}).then(res => res.text()).then(console.log).catch(console.error);
