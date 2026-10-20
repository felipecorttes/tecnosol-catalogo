require("dotenv").config(); 
const express = require("express");
const mongoose = require("mongoose"); 

const app = express();
const PORT = 3000;


mongoose
  .connect(process.env.MONGODB_URI, { dbName: "tecnosol" })
  .then(() => console.log("Conectado a MongoDB"))
  .catch((error) =>
    console.error("Error al conectar a MongoDB:", error.message)
  );

app.get("/api/productos", (req, res) => {
  res.json([
    { id: 1, nombre: "JT 500w Reflector Solar", precio: 98000 }
  ]);
});

app.listen(PORT, () => {
  console.log(`Servidor listo en http://localhost:${PORT}`);
});