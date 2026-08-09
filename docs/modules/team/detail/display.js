// modules/team/detail/display.js
window.currentTeamId = null;

window.showTeamDetail = (teamId) => {
  const team = teamState.getById(teamId);
  if (!team) return;
  
  window.currentTeamId = teamId;
  window.showTab('team-detail');
  
  el('team-detail-name').textContent = team.name;
  el('team-detail-country').innerHTML = `<img class="flag" src="${team.countryFlag}"/> ${team.countryName}`;
  el('team-detail-logo').src = team.logo || 'data:image/svg+xml,<svg></svg>';
  el('team-detail-budget').textContent = formatCurrency(team.budget || 0);
  el('team-edit-budget').value = team.budget || 1000000;
  el('team-edit-logo-input').value = '';
  
  const players = playerState.getAll();
  const playersInTeam = players.filter(p => p.teamId === teamId);
  const teamValue = playersInTeam.reduce((sum, p) => sum + (p.value || 0), 0);
  el('team-detail-value').textContent = formatCurrency(teamValue);
  el('team-detail-players-count').textContent = playersInTeam.length;
  
  window.renderTeamPlayersTable(teamId);
};