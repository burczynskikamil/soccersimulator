// modules/player/generation/generator.js
window.generatePlayer = () => {
  const position = sample(POSITIONS); // zakładam: ['GK','CB','CM','ST']
  const age = randInt(16, 37);

  const country = sample(COUNTRIES); // równa szansa jeśli COUNTRIES ma 10 elementów

  // wstępne ovr do wygenerowania skilli
  const baseOvr = randInt(52, 86);
  const skills = generateSkillsByPosition(position, baseOvr);
  const ovr = computeOvrFromSkills(position, skills);

  const hiddenPotentialMin = clampSkill(ovr + randInt(1, 4));
  const hiddenPotentialMax = clampSkill(hiddenPotentialMin + randInt(2, 8));
  const realPotential = clampSkill((hiddenPotentialMin + hiddenPotentialMax) / 2);

  return {
    id: 'player_' + Math.random().toString(36).slice(2, 10),
    name: generateUniqueName(country.code),
    age,
    position,

    country: country.code,
    countryName: country.name,
    countryFlag: country.flag,
    countryColor: country.color,

    skills,
    ovr,
    hiddenPotentialMin,
    hiddenPotentialMax,
    realPotential,

    // jeśli masz swoje liczenie wartości, zostaw swoje
    value: typeof calculatePlayerValue === 'function'
      ? calculatePlayerValue({ position, age, ovr, realPotential, skills })
      : (ovr * 100000)
  };
};
