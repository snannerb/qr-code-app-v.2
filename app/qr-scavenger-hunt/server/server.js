const express = require('express');
const WebSocket = require('ws');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

const wss = new WebSocket.Server({ server });

const players = {};

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const { player, progress } = JSON.parse(message);
    players[player] = progress;
    // Broadcast updates to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ player, progress }));
      }
    });
  });
});

// API to save QR code locations
const qrLocations = [];
app.post('/api/qr-locations', (req, res) => {
  const { latitude, longitude, clue } = req.body;
  qrLocations.push({ latitude, longitude, clue });
  res.status(201).json({ message: 'QR code location saved' });
});