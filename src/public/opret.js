// public/opret.js
document.getElementById("create-btn").addEventListener("click", async () => {
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value.trim();
    const msg = document.getElementById("msg");
  
    if (!phone || !password) {
      msg.textContent = "Udfyld begge felter ✏️";
      return;
    }
  
    const res = await fetch("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, password })
    });
  
    const data = await res.json();
  
    if (data.status === "exists") {
      msg.textContent = "Dette telefonnummer er allerede i brug.";
    } else if (data.status === "missing") {
      msg.textContent = "Udfyld alle felter.";
    } else if (data.status === "ok") {
      msg.style.color = "green";
      msg.textContent = "Bruger oprettet! Sender dig videre...";
      setTimeout(() => {
        window.location.href = "view.html"; // login siden
      }, 1200);
    }
  });
  