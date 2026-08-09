// modules/player/detail/skills-display.js
window.renderPlayerSkills = (player) => {
  const grid = el('pv-skills-grid');
  if (!grid || !player) return;

  const skills = player.skills || {};
  grid.innerHTML = '';

  // Zestawy umiejętności
  const gkSkills = ['reflexes', 'handling', 'positioning'];

  // Wszystkie "polowe" (ofensywne + defensywne + ogólne)
  const fieldSkills = [
    'pace',
    'shooting',
    'passing',
    'dribbling',
    'defending',
    'physical'
  ];

  // Dla GK tylko 3, dla reszty pełny zestaw polowy
  const keys = player.position === 'GK' ? gkSkills : fieldSkills;

  keys.forEach((key) => {
    const value = Number(skills[key] ?? 0);

    const row = document.createElement('div');
    row.className = 'skill-row';
    row.innerHTML = `
      <span class="skill-name">${key}</span>
      <div class="skill-bar-wrap">
        <div class="skill-bar" style="width:${Math.max(0, Math.min(100, value))}%"></div>
      </div>
      <span class="skill-value">${value}</span>
    `;
    grid.appendChild(row);
  });
};
