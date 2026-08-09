// modules/player/generation/ovr.js
window.generateOVR = (potential) => {
  // OVR zawsze w przedziale 20-60, niezależnie od potencjału
  return randInt(20, 60);
};