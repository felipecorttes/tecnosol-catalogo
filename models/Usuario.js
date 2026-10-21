const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
});

module.exports = mongoose.model("Usuario", usuarioSchema);