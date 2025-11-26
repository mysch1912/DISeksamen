//public/limit.js
const form = document.getElementById("login-form");

//håndterer login formularen
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    //indsamler data fra formen
    const formData = new FormData(form);

    //omdanner til URLSearchParams
    const body = new URLSearchParams(formData);

    //sender login request til serveren
    const response = await fetch("/auth/login", {
      method: "POST",
      body,
    });

    //håndterer rate limiting svar
    if (response.status === 429) {
      const data = await response.json().catch(() => ({}));
      alert(data.message || "Too many login attempts - please try again in 15 minutes.");
      return;
    }

    //håndterer redirect ved succesfuldt login
    if (response.redirected) {
      window.location.href = response.url;
      return;
    }

    //viser fejlbesked
    const text = await response.text();
    alert(text);
  });
}
