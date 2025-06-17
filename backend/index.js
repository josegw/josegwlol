import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

const clavesValidas = new Map(); // clave => userId

// 📥 Roblox manda la clave generada
app.post("/api/registrar-clave", (req, res) => {
  const { clave, userId } = req.body;

  if (!clave || !userId) {
    return res.status(400).json({ error: "Faltan datos clave o userId" });
  }

  clavesValidas.set(clave, userId);
  console.log(`[+] Clave registrada para ${userId}: ${clave}`);
  res.json({ ok: true });
});

// 🔍 Web consulta si la clave es válida
app.post("/api/verificar-clave", (req, res) => {
  const { clave } = req.body;

  if (!clave || !clavesValidas.has(clave)) {
    return res.status(400).json({ valido: false, mensaje: "Clave inválida o expirada" });
  }

  const userId = clavesValidas.get(clave);
  clavesValidas.delete(clave); // 🔐 Borra la clave para que no se reutilice

  console.log(`[✓] Clave válida para ${userId}: ${clave}`);
  res.json({ valido: true, userId });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
