const mongoose = require("mongoose");

const productoSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    sku: { type: String, trim: true },
    precio: { type: Number, required: true, min: 0 },
    categoria: { type: String, trim: true },
    descripcion: { type: String, trim: true, maxlength: 1000 },
    imagenes: [String],
    stock: { type: Number, default: 0, min: 0 },
    activo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Producto", productoSchema);