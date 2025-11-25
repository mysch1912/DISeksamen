const form = document.getElementById("login-form");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    const response = await fetch("/auth/login", {
      method: "POST",
      body: formData,
    });

    // RATE LIMITING (429)
    if (response.status === 429) {
      const data = await response.json().catch(() => ({}));
      alert(data.message || "For mange login forsøg - prøv igen om 15 minutter.");
      return;
    }

    // SUCCES (redirect)
    if (response.redirected) {
      window.location.href = response.url;
      return;
    }

    // Normal login-fejl
    const text = await response.text();
    alert(text);
  });
}
