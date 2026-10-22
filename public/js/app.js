const NUMERO_WHATSAPP = "573132647682";

const grid = document.getElementById("grid");
const buscador = document.querySelector(".search__input");
const contador = document.getElementById("cart-count");
const totalEl = document.getElementById("cart-total");
const modal = document.querySelector(".modal");
const btnVerPedido = document.querySelector(".cart-bar__btn");
const btnCerrar = document.querySelector(".modal__close");
const btnEnviar = document.querySelector(".modal__send");
const listaEl = document.getElementById("pedido-lista");
const pedidoTotalEl = document.getElementById("pedido-total");
const inputNombre = document.getElementById("cliente-nombre");
const inputCiudad = document.getElementById("cliente-ciudad");
const detalle = document.getElementById("detalle");
const detalleImg = document.getElementById("detalle-img");
const detalleNombre = document.getElementById("detalle-nombre");
const detallePrecio = document.getElementById("detalle-precio");
const detalleDesc = document.getElementById("detalle-desc");
const detalleAgregar = document.getElementById("detalle-agregar");
const detalleCerrar = document.getElementById("detalle-cerrar");
let productoDetalle = null;

const esc = (t) =>
  String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const pesos = (n) => Number(n).toLocaleString("es-CO");

let productos = [];
let carrito = [];
try {
  const guardado = JSON.parse(localStorage.getItem("tecnosol-carrito"));
  if (Array.isArray(guardado)) carrito = guardado;
} catch {}

function guardarCarrito() {
  try {
    localStorage.setItem("tecnosol-carrito", JSON.stringify(carrito));
  } catch {}
}

function dibujar(lista) {
  if (lista.length === 0) {
    grid.innerHTML = '<p class="vacio">No se encontraron productos.</p>';
    return;
  }
  grid.innerHTML = lista
    .map((p) => {
      const hayStock = p.stock > 0;
      return `
      <article class="card" data-id="${p._id}">
        <span class="card__badge ${hayStock ? "" : "card__badge--agotado"}">${hayStock ? "✓ Disponible" : "Agotado"}</span>
        <button class="card__foto" data-accion="detalle" aria-label="Ver ${esc(p.nombre)}">
          <img src="${esc(p.imagenes[0] || "/img/logo.png")}" alt="${esc(p.nombre)}" class="card__img" loading="lazy">
        </button>
        <h2 class="card__title" data-accion="detalle">${esc(p.nombre)}</h2>
        <p class="card__price">$${pesos(p.precio)}</p>
        <div class="card__actions">
          <button class="qty__btn" data-accion="menos">−</button>
          <span class="qty__value">1</span>
          <button class="qty__btn" data-accion="mas">+</button>
          <button class="card__add" data-accion="agregar" ${hayStock ? "" : "disabled"}>Agregar</button>
        </div>
      </article>`;
    })
    .join("");
}

grid.addEventListener("click", (e) => {
  const elemento = e.target.closest("[data-accion]");
  if (!elemento) return;
  const tarjeta = elemento.closest(".card");
  const producto = productos.find((p) => p._id === tarjeta.dataset.id);
  const cantidadEl = tarjeta.querySelector(".qty__value");
  const actual = Number(cantidadEl.textContent);
  const accion = elemento.dataset.accion;

  if (accion === "detalle") abrirDetalle(producto);
  if (accion === "mas") cantidadEl.textContent = actual + 1;
  if (accion === "menos" && actual > 1) cantidadEl.textContent = actual - 1;
  if (accion === "agregar") agregarAlCarrito(producto, actual);
});

function agregarAlCarrito(producto, cantidad) {
  const existente = carrito.find((i) => i.id === producto._id);
  if (existente) {
    existente.cantidad += cantidad;
  } else {
    carrito.push({ id: producto._id, nombre: producto.nombre, precio: producto.precio, cantidad });
  }
  guardarCarrito();
  actualizarBarra();
}

function actualizarBarra() {
  const unidades = carrito.reduce((suma, i) => suma + i.cantidad, 0);
  const total = carrito.reduce((suma, i) => suma + i.precio * i.cantidad, 0);
  contador.textContent = unidades;
  totalEl.textContent = pesos(total);
}

function sincronizarCarrito() {
  carrito = carrito
    .map((item) => {
      const actual = productos.find((p) => p._id === item.id);
      return actual && actual.stock > 0 ? { ...item, nombre: actual.nombre, precio: actual.precio } : null;
    })
    .filter(Boolean);
  guardarCarrito();
  actualizarBarra();
}

buscador.addEventListener("input", () => {
  const q = buscador.value.trim().toLowerCase();
  const filtrados = productos.filter((p) =>
    [p.nombre, p.sku, p.categoria].some((campo) => (campo || "").toLowerCase().includes(q))
  );
  dibujar(filtrados);
});

function mostrarPedido() {
  listaEl.innerHTML = "";
  if (carrito.length === 0) {
    listaEl.innerHTML = '<p class="pedido__vacio">Aún no has agregado productos.</p>';
  }
  carrito.forEach((item) => {
    const fila = document.createElement("div");
    fila.className = "pedido__item";
    fila.innerHTML = `
      <div>
        <p class="pedido__nombre">${esc(item.nombre)}</p>
        <p class="pedido__detalle">${item.cantidad} und × $${pesos(item.precio)}</p>
      </div>
      <p class="pedido__subtotal">$${pesos(item.precio * item.cantidad)}</p>`;
    listaEl.appendChild(fila);
  });
  const total = carrito.reduce((suma, i) => suma + i.precio * i.cantidad, 0);
  pedidoTotalEl.textContent = pesos(total);
}

btnVerPedido.addEventListener("click", () => {
  mostrarPedido();
  modal.classList.add("modal--open");
});
btnCerrar.addEventListener("click", () => modal.classList.remove("modal--open"));

btnEnviar.addEventListener("click", () => {
  const nombre = inputNombre.value.trim();
  const ciudad = inputCiudad.value.trim();

  if (carrito.length === 0) {
    alert("Agrega al menos un producto a tu pedido.");
    return;
  }
  if (nombre === "" || ciudad === "") {
    alert("Escribe tu nombre y tu ciudad.");
    return;
  }

  const lineas = carrito.map((i) => `• ${i.cantidad} x ${i.nombre} — $${pesos(i.precio * i.cantidad)}`);
  const total = carrito.reduce((suma, i) => suma + i.precio * i.cantidad, 0);
  const mensaje = `Hola, soy ${nombre} de ${ciudad}. Quiero hacer este pedido:\n\n${lineas.join("\n")}\n\nTotal: $${pesos(total)}`;

  window.open(`https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`, "_blank");
});

async function cargarProductos() {
  try {
    const res = await fetch("/api/productos");
    if (!res.ok) throw new Error();
    productos = await res.json();
    dibujar(productos);
    sincronizarCarrito();
  } catch {
    grid.innerHTML = '<p class="vacio">No pudimos cargar los productos. Intenta de nuevo.</p>';
  }
}

function abrirDetalle(producto) {
  productoDetalle = producto;
  const hayStock = producto.stock > 0;
  detalleImg.src = producto.imagenes[0] || "/img/logo.png";
  detalleImg.alt = producto.nombre;
  detalleNombre.textContent = producto.nombre;
  detallePrecio.textContent = `$${pesos(producto.precio)}`;
  detalleDesc.textContent = producto.descripcion || "Este producto aún no tiene descripción.";
  detalleAgregar.disabled = !hayStock;
  detalleAgregar.textContent = hayStock ? "Agregar al pedido" : "Agotado";
  detalle.classList.add("detalle--open");
}

function cerrarDetalle() {
  detalle.classList.remove("detalle--open");
}

detalleCerrar.addEventListener("click", cerrarDetalle);
detalle.addEventListener("click", (e) => {
  if (e.target === detalle) cerrarDetalle();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") cerrarDetalle();
});
detalleAgregar.addEventListener("click", () => {
  agregarAlCarrito(productoDetalle, 1);
  cerrarDetalle();
});

actualizarBarra();
cargarProductos();