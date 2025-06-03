import express from "express";
import os from "os";
import process from "process";

const app = express();
const PORT = 10000;

app.use(express.json());

let logs = [];

function addLog(msg) {
  const now = new Date().toISOString();
  logs.push(`[${now}] ${msg}`);
  if (logs.length > 100) logs.shift();
  console.log(msg);
}

// Endpoint para obtener info del servidor
app.get("/api/admin-info", (req, res) => {
  try {
    addLog("Petición de info servidor");
    const uptime = process.uptime();
    const mem = process.memoryUsage();
    res.json({
      uptimeSeconds: Math.floor(uptime),
      memory: {
        rssMB: (mem.rss / 1024 / 1024).toFixed(2),
        heapUsedMB: (mem.heapUsed / 1024 / 1024).toFixed(2),
      },
      cpuCount: os.cpus().length,
      serverTime: new Date().toISOString(),
      nodeVersion: process.version,
    });
  } catch (e) {
    res.status(500).json({ error: "Error al obtener info" });
  }
});

// Endpoint para obtener logs
app.get("/api/logs", (req, res) => {
  addLog("Petición de logs");
  res.json({ logs });
});

// Endpoint para enviar mensaje (simulado)
app.post("/api/send-message", (req, res) => {
  const { message } = req.body;
  if (!message || message.trim() === "") {
    return res.status(400).json({ error: "Mensaje vacío" });
  }
  addLog(`Mensaje global: ${message}`);
  res.json({ message: "Mensaje recibido (simulado)." });
});

// Endpoint para obtener lista de usuarios (simulado)
app.get("/api/users", (req, res) => {
  addLog("Petición lista usuarios");
  res.json({
    users: [
      { id: "1307562402958676048", username: "TuUsuario#1234", status: "online" },
      { id: "987654321098765432", username: "Amigo#4321", status: "offline" },
    ],
  });
});

// Endpoint para reiniciar servidor (simulado)
app.post("/api/restart", (req, res) => {
  addLog("Petición reinicio servidor");
  res.json({ message: "Reinicio simulado ejecutado." });
  // Aquí podrías agregar lógica real para reiniciar si quieres
});

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en puerto ${PORT}`);
});
