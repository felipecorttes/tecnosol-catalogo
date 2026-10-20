require("dotenv").config();
const mongoose = require("mongoose");
const Producto = require("./models/Producto");

async function main() {
  await mongoose.connect(process.env.MONGODB_URI, { dbName: "tecnosol" });

  const producto = await Producto.create({
    nombre: "JT 500W Reflector Solar",
    sku: "JT500W",
    categoria: "Reflectores",
    precio: 98000,
    imagen: { url: "img/producto1.jpg" },
  });

  console.log("Producto guardado:", producto.nombre, "-", producto.sku);
  await mongoose.disconnect();
}

main().catch((error) => {
  console.error("Error:", error.message);
  process.exit(1);
});