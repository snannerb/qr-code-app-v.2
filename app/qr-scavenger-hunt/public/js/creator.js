const qrLocations = [];
const clues = [];

document.getElementById('location-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const latitude = parseFloat(document.getElementById('latitude').value);
  const longitude = parseFloat(document.getElementById('longitude').value);
  const clue = document.getElementById('clue').value;

  if (isNaN(latitude) || isNaN(longitude)) {
    alert('Invalid coordinates');
    return;
  }

  try {
    const response = await fetch('/api/qr-locations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ latitude, longitude, clue }),
    });
    if (!response.ok) throw new Error('Failed to save QR code location');
    qrLocations.push({ latitude, longitude });
    clues.push(clue);
    renderClues();
    document.getElementById('location-form').reset();
  } catch (error) {
    alert(error.message);
  }
});

function renderClues() {
  const cluesList = document.getElementById('clues-list');
  cluesList.innerHTML = '';
  clues.forEach((clue, index) => {
    const div = document.createElement('div');
    div.innerHTML = `<strong>QR Code ${index + 1}:</strong> ${clue}`;
    cluesList.appendChild(div);
  });
}

// Generate Join Game QR Code
generateQRCode('Game123', 'join-game-qr');