const express = require("express");
const Producto = require("../models/Producto");

const router = express.Router();

router.get("/", async (req, res) => {
  const productos = await Producto.find({ activo: true }).sort({ nombre: 1 });
  res.json(productos);
});

module.exports = router;