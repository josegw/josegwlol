const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Almacenamiento en memoria (cambiar por base de datos si quieres)
const clavesRegistradas = {}; // { clave: userId }
const clavesUsadas = {};      // { clave: true }

// Endpoint para registrar la clave enviada desde Roblox
app.post("/api/registrar-clave", (req, res) => {
  const { userId, clave } = req.body;

  if (!userId || !clave) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  clavesRegistradas[clave] = userId;

  console.log(`[+] Clave registrada para ${userId}: ${clave}`);
  res.json({ status: "ok" });
});

// Endpoint para verificar si una clave es válida y no usada
app.post("/api/verificar-clave", (req, res) => {
  const { clave } = req.body;

  if (!clave) {
    return res.status(400).json({ valida: false, error: "Falta la clave" });
  }

  const usuarioId = clavesRegistradas[clave];

  if (usuarioId && !clavesUsadas[clave]) {
    clavesUsadas[clave] = true; // marcar como usada para no repetir

    console.log(`[✓] Clave válida para ${usuarioId}: ${clave}`);
    return res.json({ valida: true });
  }

  console.log(`[✗] Clave inválida o usada: ${clave}`);
  return res.json({ valida: false });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en puerto ${port}`);
});
