//public/opret.js
//håndterer oprettelse af ny bruger
document.getElementById("create-btn").addEventListener("click", async () => {
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value.trim();
    const msg = document.getElementById("msg");
  
    if (!phone || !password) {
      msg.textContent = "Please fill in both fields ✏️";
      return;
    }
  
    //sender data til serveren
    const res = await fetch("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, password })
    });
  
    //henter svar fra serveren
    const data = await res.json();
  
    //håndterer forskellige svar
    if (data.status === "exists") {
      msg.textContent = "This phone number is already in use.";
    } else if (data.status === "missing") {
      msg.textContent = "Please fill in all fields.";
    } else if (data.status === "ok") {
      msg.style.color = "green";
      msg.textContent = "User created! Redirecting...";
      setTimeout(() => {
        window.location.href = "view.html"; //login siden
      }, 1200);
    }
  });
  