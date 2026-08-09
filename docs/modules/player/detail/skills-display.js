// modules/player/detail/skills-display.js
window.renderPlayerDetailSkills = (playerId) => {
  const player = playerState.getById(playerId);
  const grid = el('pv-skills-grid');
  grid.innerHTML = '';
  
  const categories = SKILL_CATEGORIES[player.position];
  const importance = CATEGORY_IMPORTANCE[player.position];
  
  for (let category in categories) {
    const skills = categories[category];
    const categoryColors = CATEGORY_COLORS[category];
    
    const col = document.createElement('div');
    col.className = 'skills-column';
    col.style.color = '#e6eef8';
    col.style.borderRadius = '8px';
    col.style.padding = '12px';
    col.style.border = '1px solid rgba(255,255,255,0.05)';
    col.style.background = 'rgba(255,255,255,0.02)';
    
    const h = document.createElement('h4');
    h.textContent = category;
    h.style.color = categoryColors.bg;
    h.style.margin = '0 0 12px 0';
    col.appendChild(h);
    
    skills.forEach(k => {
      if (player.skills[k] !== undefined) {
        const row = document.createElement('div');
        row.className = 'skill-row';
        const pct = (player.skills[k] / 99) * 100;
        row.innerHTML = `<div class="skill-name">${k}</div><div class="skill-bar"><div class="skill-fill" style="width:${pct}%;background:${categoryColors.bg};opacity:0.8"></div></div><div class="skill-val">${player.skills[k]}</div>`;
        row.style.color = '#e6eef8';
        col.appendChild(row);
      }
    });
    grid.appendChild(col);
  }
};