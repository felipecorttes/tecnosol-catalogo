require("dotenv").config();
const mongoose = require("mongoose");
const Producto = require("../models/Producto");

const datos = [
  { nombre: "JT 500w Reflector Solar", sku: "JT-500", precio: 98000, categoria: "Reflectores", imagenes: ["/img/producto1.jpg"], stock: 10 },
  { nombre: "Panel Solar Monocristalino 550W", sku: "PS-550", precio: 1250000, categoria: "Paneles", imagenes: ["/img/producto1.jpg"], stock: 5 },
  { nombre: "Batería de Litio 48V", sku: "BL-48", precio: 4550000, categoria: "Baterías", imagenes: ["/img/producto1.jpg"], stock: 0 },
];

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  await Producto.deleteMany({});
  await Producto.insertMany(datos);
  console.log("Productos de prueba cargados");
  await mongoose.disconnect();
})();