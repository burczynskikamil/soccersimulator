// modules/player/detail/team-assignment.js
window.renderPlayerDetailTeamAssignment = (playerId) => {
  const player = playerState.getById(playerId);
  const teams = teamState.getAll();
  const teamName = player.teamId ? teams.find(t => t.id === player.teamId)?.name : 'Brak';
  el('pv-team').textContent = teamName;
  
  const teamSelect = el('pv-team-select');
  teamSelect.innerHTML = '<option value="">Brak drużyny</option>';
  teams.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t.id;
    opt.textContent = t.name;
    if (player.teamId === t.id) opt.selected = true;
    teamSelect.appendChild(opt);
  });
  
  el('pv-assign-team').onclick = async () => {
    playerState.update(playerId, { teamId: teamSelect.value || null });
    await window.db.savePlayers(playerState.getAll());
    const { dbStatus } = getDOMElements();
    dbStatus.textContent = '✅ Zawodnik przypisany';
    window.showPlayerDetail(playerId);
  };
};