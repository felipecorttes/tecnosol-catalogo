const tarjetas = document.querySelectorAll(".card");
const carrito = [];

tarjetas.forEach((tarjeta) => {
  const [btnMenos, btnMas] = tarjeta.querySelectorAll(".qty__btn");
  const cantidad = tarjeta.querySelector(".qty__value");
  const btnAgregar = tarjeta.querySelector(".card__add");

  btnMas.addEventListener("click", () => {
    cantidad.textContent = Number(cantidad.textContent) + 1;
  });

  btnMenos.addEventListener("click", () => {
    const actual = Number(cantidad.textContent);
    if (actual > 1) {
      cantidad.textContent = actual - 1;
    }
  });

  btnAgregar.addEventListener("click", () => {
    const nombre = tarjeta.querySelector(".card__title").textContent.trim();
    const precio = Number(tarjeta.querySelector(".card__price").textContent.replace(/\./g, ""));

    const producto = {
        id: tarjeta.dataset.id,
      nombre: nombre,
      precio: precio,
      cantidad: Number(cantidad.textContent),
    };

        const existente = carrito.find((item) => item.id === producto.id);

    if (existente) {
      existente.cantidad += producto.cantidad;
    } else {
      carrito.push(producto);
    }

    const contador = document.getElementById("cart-count");
    const totalEl = document.getElementById("cart-total");

    function actualizarBarra() {
    const unidades = carrito.reduce((suma, item) => suma + item.cantidad, 0);
    const total = carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0);

    contador.textContent = unidades;
    totalEl.textContent = total.toLocaleString("es-CO");
}

        actualizarBarra();
  });
});

const modal = document.querySelector(".modal");
const btnVerPedido = document.querySelector(".cart-bar__btn");
const btnCerrar = document.querySelector(".modal__close");
const listaEl = document.getElementById("pedido-lista");
const pedidoTotalEl = document.getElementById("pedido-total");

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
        <p class="pedido__nombre">${item.nombre}</p>
        <p class="pedido__detalle">${item.cantidad} und × $${item.precio.toLocaleString("es-CO")}</p>
      </div>
      <p class="pedido__subtotal">$${(item.precio * item.cantidad).toLocaleString("es-CO")}</p>
    `;
    listaEl.appendChild(fila);
  });

  const total = carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0);
  pedidoTotalEl.textContent = total.toLocaleString("es-CO");
}

btnVerPedido.addEventListener("click", () => {
  mostrarPedido();
  modal.classList.add("modal--open");
});

btnCerrar.addEventListener("click", () => {
  modal.classList.remove("modal--open");
});

const NUMERO_WHATSAPP = "573219463103";

const btnEnviar = document.querySelector(".modal__send");
const inputNombre = document.getElementById("cliente-nombre");
const inputCiudad = document.getElementById("cliente-ciudad");

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

  const lineas = carrito.map(
    (item) => `• ${item.cantidad} x ${item.nombre} — $${(item.precio * item.cantidad).toLocaleString("es-CO")}`
  );
  const total = carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0);

  const mensaje = `Hola, soy ${nombre} de ${ciudad}. Quiero hacer este pedido:\n\n${lineas.join("\n")}\n\nTotal: $${total.toLocaleString("es-CO")}`;

  const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
});