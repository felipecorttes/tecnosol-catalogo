require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/Usuario");

const [email, clave] = process.argv.slice(2);

if (!email || !clave) {
  console.log("Uso: node scripts/crearAdmin.js correo clave");
  process.exit(1);
}

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const passwordHash = await bcrypt.hash(clave, 10);
  await Usuario.findOneAndUpdate(
    { email: email.toLowerCase() },
    { email: email.toLowerCase(), passwordHash },
    { upsert: true }
  );
  console.log("Administrador listo:", email);
  await mongoose.disconnect();
})();