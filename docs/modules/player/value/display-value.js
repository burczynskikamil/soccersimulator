// modules/player/value/display-value.js
window.getDisplayValue = (baseValue, position) => {
  const multiplier = getPositionMultiplier(position);
  return Math.round(baseValue * multiplier);
};