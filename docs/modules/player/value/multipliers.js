// modules/player/value/multipliers.js
window.getPositionMultiplier = (position) => {
  const players = playerState.getAll();
  const positionCount = players.filter(p => p.position === position).length;
  if (positionCount === 0) return 2.0;
  if (positionCount === 1) return 1.8;
  if (positionCount === 2) return 1.5;
  if (positionCount === 3) return 1.2;
  if (positionCount === 4) return 1.1;
  return 1.0;
};