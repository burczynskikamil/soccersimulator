// modules/player/generation/skills.js
window.generateSkills = (ovr, position) => {
  const cats = SKILL_CATEGORIES[position];
  const imp = CATEGORY_IMPORTANCE[position];
  let skills = {};
  
  for (let cat in cats) {
    const skillList = cats[cat];
    const importance = imp[cat];
    
    skillList.forEach(skill => {
      const baseSkill = Math.round(ovr * importance);
      const variance = randInt(-5, 5);
      skills[skill] = Math.max(1, Math.min(99, baseSkill + variance));
    });
  }
  
  return skills;
};