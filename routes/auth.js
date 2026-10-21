const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, clave } = req.body;
  if (!email || !clave) {
    return res.status(400).json({ error: "Escribe tu correo y tu contraseña" });
  }

  const usuario = await Usuario.findOne({ email: String(email).toLowerCase().trim() });
  const ok = usuario && (await bcrypt.compare(clave, usuario.passwordHash));
  if (!ok) {
    return res.status(401).json({ error: "Correo o contraseña incorrectos" });
  }

  const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ token });
});

module.exports = router;