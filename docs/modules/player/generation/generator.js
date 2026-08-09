// modules/player/generation/generator.js
window.generatePlayer = () => {
  const players = playerState.getAll();
  const age = 11;
  const country = sample(COUNTRIES);
  const position = sample(POSITIONS);
  const height = generateHeight(position);
  const realPotential = generatePotential();
  const ovr = generateOVR(realPotential);
  const hidden = generateHiddenPotentialRange(realPotential);
  const id = uid();
  const name = generateUniqueName(country.code, players);
  const skills = generateSkills(ovr, position);
  const growth = generateGrowth(position);
  const value = calculatePlayerValue(hidden.max, skills);

  return {
    id, name, age, position, country: country.code, countryName: country.name,
    countryFlag: country.flag, countryColor: country.color,
    height, ovr, realPotential, hiddenPotentialMin: hidden.min, hiddenPotentialMax: hidden.max,
    growth, skills, value, created: Date.now(), teamId: null
  };
};

window.generateAndSavePlayer = async () => {
  const player = generatePlayer();
  playerState.add(player);
  await window.db.savePlayers(playerState.getAll());
  const { dbStatus } = getDOMElements();
  dbStatus.textContent = '✅ Zawodnik wygenerowany';
  window.renderPlayersList();
  window.updateStats();
};