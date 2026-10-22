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
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => cb(null, file.mimetype.startsWith("image/")),
}).single("imagen");

const router = express.Router();

router.post("/", auth, (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: "La foto pesa más de 10 MB. Prueba con una más pequeña." });
    }
    if (!req.file) {
      return res.status(400).json({ error: "Ese archivo no es una imagen" });
    }
    const flujo = cloudinary.uploader.upload_stream(
      {
        folder: "tecnosol",
        transformation: [{ width: 1600, height: 1600, crop: "limit", quality: "auto" }],
      },
      (error, resultado) => {
        if (error) {
             console.error("Cloudinary:", error.message);
            return res.status(500).json({ error: "No se pudo subir la imagen" });
        }
        res.json({ url: resultado.secure_url });
      }
    );
    flujo.end(req.file.buffer);
  });
});

module.exports = router;