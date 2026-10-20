require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Producto = require("./models/Producto"); 

const app = express();
const PORT = 3000;

mongoose
  .connect(process.env.MONGODB_URI, { dbName: "tecnosol" })
  .then(() => console.log("Conectado a MongoDB"))
  .catch((error) =>
    console.error("Error al conectar a MongoDB:", error.message)
  );


app.get("/api/productos", async (req, res) => {
  try {
    const productos = await Producto.find({ visible: true })
      .sort({ nombre: 1 })
      .lean();
    res.json(productos);
  } catch (error) {
    console.error("Error al listar productos:", error.message);
    res.status(500).json({ error: "No se pudieron cargar los productos" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor listo en http://localhost:${PORT}`);
});