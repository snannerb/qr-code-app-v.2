let progress = 0;
const qrLocations = []; // Should be populated with QR code locations from the server or shared.js

// Track player's location
navigator.geolocation.watchPosition(
  (position) => {
    const playerLat = position.coords.latitude;
    const playerLon = position.coords.longitude;
    qrLocations.forEach((qr, index) => {
      const distance = calculateDistance(playerLat, playerLon, qr.latitude, qr.longitude);
      if (distance <= 100) { // 100 meters radius
        document.getElementById('status').textContent = `You are near QR Code ${index + 1}!`;
      }
    });
  },
  (error) => {
    if (error.code === error.PERMISSION_DENIED) {
      alert('Please enable location services to play the game.');
    } else {
      alert('Geolocation is not supported or an error occurred.');
    }
  },
  { enableHighAccuracy: true, timeout: 5000 }
);

// Initialize QR Code Scanner
const scanner = new Instascan.Scanner({ video: document.getElementById('scanner') });
scanner.addListener('scan', function (content) {
  if (content === 'Game123') {
    progress++;
    document.getElementById('status').textContent = 'QR Code Scanned!';
    updateProgress();
  } else {
    document.getElementById('status').textContent = 'Invalid QR Code';
  }
});

Instascan.Camera.getCameras().then(function (cameras) {
  if (cameras.length > 0) {
    scanner.start(cameras[0]);
  } else {
    alert('No cameras found. Please ensure your device has a camera.');
  }
}).catch(function (e) {
  alert('Error accessing camera: ' + e.message);
});

function updateProgress() {
  const progressDiv = document.getElementById('progress');
  progressDiv.textContent = `Progress: ${progress} QR codes scanned`;

  // Send progress update to server
  const ws = new WebSocket('ws://localhost:3000');
  ws.onopen = () => {
    ws.send(JSON.stringify({ player: 'Player 1', progress }));
  };
}

// Simulate scoreboard updates
const ws = new WebSocket('ws://localhost:3000');
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  document.getElementById('scoreboard').textContent = `${data.player}: ${data.progress} points`;
};