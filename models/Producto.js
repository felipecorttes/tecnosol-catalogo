const mongoose = require("mongoose");

const productoSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    sku: { type: String, required: true, unique: true, trim: true, uppercase: true },
    categoria: { type: String, required: true, trim: true },
    precio: { type: Number, required: true, min: 0 },
    imagen: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Producto", productoSchema);