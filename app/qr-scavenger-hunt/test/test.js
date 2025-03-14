const assert = require('assert');
const { calculateDistance, generateQRCode } = require('../public/js/shared.js');

describe('Geofencing Tests', () => {
  it('should calculate distance correctly', () => {
    const distance = calculateDistance(52.2296756, 21.0122287, 52.406374, 16.9251681);
    assert(Math.abs(distance - 278357) < 1000); // Approximate distance in meters
  });
});

describe('QR Code Generation Tests', () => {
  it('should generate a valid QR code URL', () => {
    const url = generateQRCode('Game123', 'qr-div');
    assert(url.includes('api.qrserver.com'));
  });
});