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