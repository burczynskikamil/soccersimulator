// modules/player/detail/skills-display.js
window.renderPlayerSkills = (player) => {
  const grid = el('pv-skills-grid');
  if (!grid || !player) return;

  const skills = player.skills || {};
  const keys = player.position === 'GK' ? window.GK_SKILLS : window.FIELD_SKILLS;

  grid.innerHTML = '';

  // 0 -> czerwony, 99 -> fioletowy
  const skillColor = (value) => {
    const v = Math.max(0, Math.min(99, Number(value) || 0));
    const t = v / 99; // 0..1

    // HSV/HSL po hue: red(0) -> purple(280)
    const hue = Math.round(0 + (280 * t));
    return `hsl(${hue}, 85%, 52%)`;
  };

  keys.forEach((key) => {
    const value = Number(skills[key] ?? 0);
    const safeValue = Math.max(0, Math.min(99, value));
    const percent = (safeValue / 99) * 100;
    const label = window.SKILL_LABELS_PL?.[key] || key;
    const color = skillColor(safeValue);

    const row = document.createElement('div');
    row.className = 'skill-row';
    row.innerHTML = `
      <span class="skill-name">${label}</span>
      <div class="skill-bar-wrap" style="background:#2a2a2a;border-radius:999px;overflow:hidden;height:10px;">
        <div class="skill-bar" style="width:${percent}%;height:100%;background:${color};transition:width .25s ease;"></div>
      </div>
      <span class="skill-value">${safeValue}</span>
    `;
    grid.appendChild(row);
  });
};

// alias zgodności
window.renderPlayerDetailSkills = window.renderPlayerSkills;
