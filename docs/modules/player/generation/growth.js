// modules/player/generation/growth.js
window.generateGrowth = (position) => {
  const baseGrowth = {
    'ST': 0.75,
    'CM': 0.70,
    'CB': 0.65,
    'GK': 0.60
  };
  const variance = Math.random() * 0.15 - 0.075;
  return baseGrowth[position] + variance;
};