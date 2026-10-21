const token = localStorage.getItem("tecnosol-token");
if (!token) window.location.href = "/admin/login.html";

const lista = document.getElementById("lista");
const modal = document.getElementById("modal-form");
const form = document.getElementById("form-producto");
const campo = (id) => document.getElementById(id);
const pesos = (n) => Number(n).toLocaleString("es-CO");
const esc = (t) =>
  String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

let productos = [];
let editandoId = null;
let imagenes = [];

async function api(url, opciones = {}) {
  const res = await fetch(url, {
    ...opciones,
    headers: { Authorization: `Bearer ${token}`, ...(opciones.headers || {}) },
  });
  if (res.status === 401) {
    localStorage.removeItem("tecnosol-token");
    window.location.href = "/admin/login.html";
    throw new Error("Sesión vencida");
  }
  return res;
}

async function cargar() {
  const res = await api("/api/productos/admin/todos");
  productos = await res.json();
  dibujar();
}

function dibujar() {
  if (productos.length === 0) {
    lista.innerHTML = '<p class="vacio">Aún no tienes productos. Pulsa "+ Nuevo producto".</p>';
    return;
  }
  lista.innerHTML = productos
    .map(
      (p) => `
    <div class="fila ${p.activo ? "" : "fila--oculta"}" data-id="${p._id}">
      <img class="fila__img" src="${esc(p.imagenes[0] || "/img/logo.png")}" alt="">
      <div class="fila__info">
        <p class="fila__nombre">${esc(p.nombre)}</p>
        <p class="fila__detalle">$${pesos(p.precio)} · Stock: ${p.stock}${p.activo ? "" : " · Oculto"}</p>
      </div>
      <div class="fila__botones">
        <button data-accion="visible">${p.activo ? "Ocultar" : "Mostrar"}</button>
        <button data-accion="editar">Editar</button>
        <button data-accion="eliminar" class="peligro">Eliminar</button>
      </div>
    </div>`
    )
    .join("");
}

lista.addEventListener("click", async (e) => {
  const boton = e.target.closest("button[data-accion]");
  if (!boton) return;
  const id = boton.closest(".fila").dataset.id;
  const producto = productos.find((p) => p._id === id);

  if (boton.dataset.accion === "visible") {
    await api(`/api/productos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activo: !producto.activo }),
    });
    cargar();
  }
  if (boton.dataset.accion === "editar") abrirForm(producto);
  if (boton.dataset.accion === "eliminar") {
    if (confirm(`¿Eliminar "${producto.nombre}" para siempre?`)) {
      await api(`/api/productos/${id}`, { method: "DELETE" });
      cargar();
    }
  }
});

function mostrarPreview() {
  const img = campo("f-preview");
  if (imagenes[0]) {
    img.src = imagenes[0];
    img.hidden = false;
  } else {
    img.hidden = true;
  }
}

function abrirForm(p = null) {
  editandoId = p ? p._id : null;
  imagenes = p ? [...p.imagenes] : [];
  campo("form-titulo").textContent = p ? "Editar producto" : "Nuevo producto";
  campo("f-nombre").value = p ? p.nombre : "";
  campo("f-sku").value = p?.sku || "";
  campo("f-categoria").value = p?.categoria || "";
  campo("f-precio").value = p ? p.precio : "";
  campo("f-stock").value = p ? p.stock : 0;
  campo("f-activo").checked = p ? p.activo : true;
  campo("f-imagen").value = "";
  campo("f-error").textContent = "";
  mostrarPreview();
  modal.classList.add("modal--open");
}

campo("btn-nuevo").addEventListener("click", () => abrirForm());
campo("f-cancelar").addEventListener("click", () => modal.classList.remove("modal--open"));
campo("btn-salir").addEventListener("click", () => {
  localStorage.removeItem("tecnosol-token");
  window.location.href = "/admin/login.html";
});

campo("f-imagen").addEventListener("change", async (e) => {
  const archivo = e.target.files[0];
  if (!archivo) return;
  const aviso = campo("f-error");
  aviso.textContent = "Subiendo foto...";
  const datos = new FormData();
  datos.append("imagen", archivo);
  const res = await api("/api/imagenes", { method: "POST", body: datos });
  const resp = await res.json();
  if (!res.ok) {
    aviso.textContent = resp.error || "No se pudo subir la foto";
    return;
  }
  imagenes = [resp.url];
  aviso.textContent = "";
  mostrarPreview();
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const cuerpo = {
    nombre: campo("f-nombre").value.trim(),
    sku: campo("f-sku").value.trim(),
    categoria: campo("f-categoria").value.trim(),
    precio: Number(campo("f-precio").value),
    stock: Number(campo("f-stock").value),
    activo: campo("f-activo").checked,
    imagenes,
  };
  const res = await api(editandoId ? `/api/productos/${editandoId}` : "/api/productos", {
    method: editandoId ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cuerpo),
  });
  if (!res.ok) {
    campo("f-error").textContent = "No se pudo guardar. Revisa los datos.";
    return;
  }
  modal.classList.remove("modal--open");
  cargar();
});

cargar();