const express = require("express");
const app = express();
const PORT = 3000;

app.get("/api/productos", (req, res) => {
  res.json([
    { id: 1, nombre: "JT 500w Reflector Solar", precio: 98000 }
  ]);
});

app.listen(PORT, () => {
  console.log(`Servidor listo en http://localhost:${PORT}`);
});