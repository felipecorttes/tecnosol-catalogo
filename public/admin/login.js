const form = document.getElementById("form-login");
const errorEl = document.getElementById("error");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorEl.textContent = "";
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: document.getElementById("email").value.trim(),
        clave: document.getElementById("clave").value,
      }),
    });
    const datos = await res.json();
    if (!res.ok) {
      errorEl.textContent = datos.error || "No se pudo entrar";
      return;
    }
    localStorage.setItem("tecnosol-token", datos.token);
    window.location.href = "/admin/panel.html";
  } catch {
    errorEl.textContent = "No hay conexión con el servidor";
  }
});