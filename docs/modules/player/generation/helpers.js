// modules/player/generation/helpers.js
window.generateHeight = (position) => {
  const range = HEIGHT_RANGES[position];
  const avg = range.avg;
  let u1 = Math.random();
  let u2 = Math.random();
  let z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  let height = Math.round(avg + z * 3);
  return Math.max(range.min, Math.min(range.max, height));
};

window.generatePotential = () => {
  const rand = Math.random();
  if (rand < 0.40) {
    return randInt(30, 50);
  } else if (rand < 0.85) {
    return randInt(51, 80);
  } else {
    return randInt(81, 99);
  }
};

window.generateOVR = (hiddenPotentialMin) => {
  const maxOVR = Math.min(60, hiddenPotentialMin);
  return randInt(20, maxOVR);
};

window.generateHiddenPotentialRange = (realPotential) => {
  const variance = randInt(3, 7);
  return {
    min: Math.max(30, realPotential - variance),
    max: Math.min(99, realPotential + variance)
  };
};

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

window.calculatePlayerValue = (potential, skills) => {
  const skillValue = Object.values(skills).reduce((a, b) => a + b, 0);
  const avgSkill = Math.round(skillValue / Object.keys(skills).length);
  return Math.round((potential + avgSkill) * 50000);
};

window.generateUniqueName = (countryCode, existing) => {
  const pool = NAME_POOL[countryCode] || NAME_POOL['PL'];
  const existingNames = new Set(existing.map(p => p.name));
  for(let i = 0; i < 500; i++){
    const fname = pool.first[Math.floor(Math.random() * pool.first.length)];
    const lname = pool.last[Math.floor(Math.random() * pool.last.length)];
    const full = fname + ' ' + lname;
    if(!existingNames.has(full)) return full;
  }
  return 'Player ' + uid();
};
