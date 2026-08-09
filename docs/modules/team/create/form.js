// modules/team/create/form.js
window.createNewTeam = async () => {
  const name = el('team-name').value.trim();
  const country = el('team-country').value;
  const logoInput = el('team-logo');

  if (!name || !country) {
    alert('Wypełnij wszystkie pola');
    return;
  }

  const countryData = COUNTRIES.find(c => c.code === country);
  let logo = 'data:image/svg+xml,<svg></svg>';

  if (logoInput.files.length > 0) {
    logo = await window.fileToBase64(logoInput.files[0]);
  }

  const team = {
    id: uid(),
    name,
    country,
    countryName: countryData.name,
    countryFlag: countryData.flag,
    countryColor: countryData.color,
    logo,
    budget: 5000000,
    created: Date.now()
  };

  teamState.add(team);
  await window.db.saveTeams(teamState.getAll());
  await window.db.savePlayers(playerState.getAll());
  const { dbStatus } = getDOMElements();
  dbStatus.textContent = '✅ Drużyna utworzona';
  el('team-name').value = '';
  el('team-logo').value = '';
  window.showTab('teams');
  window.renderTeamsList();
  window.updateStats();
};
