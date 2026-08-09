// modules/player/detail/skills-display.js
window.renderPlayerSkills = (player) => {
  const grid = el('pv-skills-grid');
  if (!grid || !player) return;

  const skills = player.skills || {};
  const keys = player.position === 'GK' ? window.GK_SKILLS : window.FIELD_SKILLS;

  grid.innerHTML = '';

  keys.forEach((key) => {
    const value = Number(skills[key] ?? 0);
    const safeValue = Math.max(0, Math.min(100, value));
    const label = window.SKILL_LABELS_PL?.[key] || key;

    const row = document.createElement('div');
    row.className = 'skill-row';
    row.innerHTML = `
      <span class="skill-name">${label}</span>
      <div class="skill-bar-wrap">
        <div class="skill-bar" style="width:${safeValue}%"></div>
      </div>
      <span class="skill-value">${value}</span>
    `;
    grid.appendChild(row);
  });
};

// Główna nazwa używana przez display.js
window.renderPlayerDetailSkills = window.renderPlayerSkills;
