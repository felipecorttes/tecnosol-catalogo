const express = require("express");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const auth = require("../middleware/auth");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => cb(null, file.mimetype.startsWith("image/")),
});

const router = express.Router();

router.post("/", auth, upload.single("imagen"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Sube una imagen de hasta 5 MB" });
  }
  const flujo = cloudinary.uploader.upload_stream({ folder: "tecnosol" }, (error, resultado) => {
    if (error) return res.status(500).json({ error: "No se pudo subir la imagen" });
    res.json({ url: resultado.secure_url });
  });
  flujo.end(req.file.buffer);
});

module.exports = router;