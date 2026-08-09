// modules/team/list/actions.js
window.deleteTeam = async (teamId) => {
  const players = playerState.getAll();
  players.forEach(p => {
    if (p.teamId === teamId) p.teamId = null;
  });
  teamState.remove(teamId);
  await window.db.saveTeams(teamState.getAll());
  await window.db.savePlayers(players);
  const { dbStatus } = getDOMElements();
  dbStatus.textContent = '✅ Drużyna usunięta';
  window.showTab('teams');
  window.renderTeamsList();
  window.updateStats();
};

window.deleteTeamConfirm = (id, name) => {
  if (confirm(`Usuń drużynę ${name}?`)) {
    deleteTeam(id);
  }
};