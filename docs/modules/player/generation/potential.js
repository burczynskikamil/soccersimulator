// modules/player/generation/potential.js
window.generatePotential = () => {
  const rand = Math.random();
  // 40% common (30-50), 45% normal (51-80), 15% rare (81-99)
  if (rand < 0.40) {
    return randInt(30, 50);
  } else if (rand < 0.85) {
    return randInt(51, 80);
  } else {
    return randInt(81, 99);
  }
};

window.generateHiddenPotentialRange = (realPotential) => {
  const variance = randInt(3, 7);
  return {
    min: Math.max(30, realPotential - variance),
    max: Math.min(99, realPotential + variance)
  };
};