// modules/player/generation/value.js
window.calculatePlayerValue = (potential, skills) => {
  const skillValue = Object.values(skills).reduce((a, b) => a + b, 0);
  const avgSkill = Math.round(skillValue / Object.keys(skills).length);
  return Math.round((potential + avgSkill) * 50000);
};