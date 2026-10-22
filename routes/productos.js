const express = require("express");
const Producto = require("../models/Producto");
const auth = require("../middleware/auth");

const router = express.Router();

const CAMPOS = ["nombre", "sku", "precio", "categoria", "descripcion", "imagenes", "stock", "activo"];

function limpiar(body) {
  const datos = {};
  for (const campo of CAMPOS) {
    if (body[campo] !== undefined) datos[campo] = body[campo];
  }
  return datos;
}

// Público: solo productos activos
router.get("/", async (req, res) => {
  const productos = await Producto.find({ activo: true }).sort({ nombre: 1 });
  res.json(productos);
});

// Administrador: todos, incluso los ocultos
router.get("/admin/todos", auth, async (req, res) => {
  const productos = await Producto.find().sort({ nombre: 1 });
  res.json(productos);
});

router.post("/", auth, async (req, res) => {
  const producto = await Producto.create(limpiar(req.body));
  res.status(201).json(producto);
});

router.put("/:id", auth, async (req, res) => {
  const producto = await Producto.findByIdAndUpdate(req.params.id, limpiar(req.body), {
    new: true,
    runValidators: true,
  });
  if (!producto) return res.status(404).json({ error: "Producto no encontrado" });
  res.json(producto);
});

router.delete("/:id", auth, async (req, res) => {
  await Producto.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;