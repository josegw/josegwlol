import express from "express";
import os from "os";
import process from "process";

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());

let logs = [];

// Función para agregar logs simples
function addLog(msg) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${msg}`;
  logs.push(logEntry);
  if (logs.length > 100) logs.shift(); // máximo 100 logs guardados
  console.log(logEntry);
}

// Endpoint para info admin
app.get("/api/admin-info", (req, res) => {
  const uptime = process.uptime();
  const memUsage = process.memoryUsage();
  const cpuCount = os.cpus().length;
  const now = new Date();

  addLog("Admin info requested");

  res.json({
    uptimeSeconds: Math.floor(uptime),
    memory: {
      rssMB: (memUsage.rss / 1024 / 1024).toFixed(2),
      heapTotalMB: (memUsage.heapTotal / 1024 / 1024).toFixed(2),
      heapUsedMB: (memUsage.heapUsed / 1024 / 1024).toFixed(2),
    },
    cpuCount,
    serverTime: now.toISOString(),
    nodeVersion: process.version,
  });
});

// Endpoint para obtener logs
app.get("/api/logs", (req, res) => {
  res.json({ logs });
  addLog("Logs requested");
});

// Endpoint para reiniciar servidor (simulado)
app.post("/api/restart", (req, res) => {
  addLog("Restart requested");
  res.json({ message: "Servidor se reiniciará (simulado)." });
  // Si quieres reiniciar de verdad, tendrías que hacer un shutdown o reinicio de proceso:
  // process.exit(0);
});

// Endpoint para enviar mensaje global (simulado)
app.post("/api/send-message", (req, res) => {
  const { message } = req.body;
  if (!message) {
    res.status(400).json({ error: "Mensaje requerido" });
    return;
  }
  addLog(`Mensaje enviado: ${message}`);
  res.json({ message: "Mensaje enviado (simulado)." });
});

// Simular lista de usuarios conectados
app.get("/api/users", (req, res) => {
  const users = [
    { id: "1307562402958676048", username: "TuUsuario#1234", status: "online" },
    { id: "111222333444555666", username: "UsuarioFake#5678", status: "offline" },
  ];
  addLog("Usuarios listados");
  res.json({ users });
});

app.listen(PORT, () => {
  console.log(`Admin backend running on port ${PORT}`);
  addLog(`Servidor iniciado en puerto ${PORT}`);
});
