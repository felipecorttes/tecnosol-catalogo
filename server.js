require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/productos", require("./routes/productos"));
app.use("/api/auth", require("./routes/auth"));

app.use((err, req, res, next) => {
  console.error(err);
  if (err.name === "ValidationError" || err.name === "CastError") {
    return res.status(400).json({ error: "Datos inválidos" });
  }
  res.status(500).json({ error: "Error del servidor" });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Conectado a MongoDB");
    app.listen(PORT, () => console.log(`Servidor listo en http://localhost:${PORT}`));
  })
  .catch((err) => console.error("Error conectando a MongoDB:", err.message));