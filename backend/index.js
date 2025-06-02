import express from 'express';
import cors from 'cors';
import os from 'os';
import osu from 'os-utils';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

let startTime = Date.now();

app.get('/api/uptime', (req, res) => {
  const uptime = Math.floor((Date.now() - startTime) / 1000);
  res.json({ uptime });
});

app.get('/api/health', (req, res) => {
  osu.cpuUsage((v) => {
    res.json({
      uptime: Math.floor((Date.now() - startTime) / 1000),
      freemem: os.freemem(),
      totalmem: os.totalmem(),
      cpuUsage: v,
      platform: os.platform(),
      cpus: os.cpus().length
    });
  });
});

app.listen(PORT, () => {
  console.log(`Admin backend running on port ${PORT}`);
});
