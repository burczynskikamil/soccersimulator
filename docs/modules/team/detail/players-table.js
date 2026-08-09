// modules/team/detail/players-table.js
window.renderTeamPlayersTable = (teamId) => {
  const $table = document.querySelector('#team-players-table tbody');
  if (!$table) return;
  
  const players = playerState.getAll();
  const teamPlayers = players.filter(p => p.teamId === teamId);
  
  $table.innerHTML = '';
  
  teamPlayers.forEach(p => {
    const colors = POSITION_COLORS[p.position];
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span style="background:${colors.bg};color:${colors.text};padding:4px 8px;border-radius:4px;font-weight:bold">${p.position}</span></td>
      <td><span class="link" onclick="window.showPlayerDetail('${p.id}')">${p.name}</span></td>
      <td>${p.age}</td>
      <td>${p.ovr}</td>
      <td>${p.hiddenPotentialMin}–${p.hiddenPotentialMax}</td>
      <td>${formatCurrency(p.value || 0)}</td>
      <td><button class="btn" onclick="window.removePlayerFromTeam('${p.id}')" style="background:#ff4d4f;color:white;border:0">✕</button></td>
    `;
    $table.appendChild(tr);
  });
};

window.removePlayerFromTeam = async (playerId) => {
  playerState.update(playerId, { teamId: null });
  await window.db.savePlayers(playerState.getAll());
  window.renderTeamPlayersTable(window.currentTeamId);
};