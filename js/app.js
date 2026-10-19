const tarjetas = document.querySelectorAll(".card");

tarjetas.forEach((tarjeta) => {
  const [btnMenos, btnMas] = tarjeta.querySelectorAll(".qty__btn");
  const cantidad = tarjeta.querySelector(".qty__value");

  btnMas.addEventListener("click", () => {
    cantidad.textContent = Number(cantidad.textContent) + 1;
  });

  btnMenos.addEventListener("click", () => {
    const actual = Number(cantidad.textContent);
    if (actual > 1) {
      cantidad.textContent = actual - 1;
    }
  });
});