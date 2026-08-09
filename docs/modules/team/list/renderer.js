// modules/team/list/renderer.js
window.renderTeamsList = () => {
  const { $teamsTable } = getDOMElements();
  if (!$teamsTable) return;
  
  const teams = teamState.getAll();
  const players = playerState.getAll();
  $teamsTable.innerHTML = '';
  
  teams.forEach(team => {
    const teamPlayers = players.filter(p => p.teamId === team.id);
    const teamValue = teamPlayers.reduce((sum, p) => sum + (p.value || 0), 0);
    const logoImg = `<img src="${team.logo || 'data:image/svg+xml,<svg></svg>'}" style="width:40px;height:40px;border-radius:4px;object-fit:cover;" alt="Logo" />`;
    
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${logoImg}</td>
      <td><span class="link" onclick="window.showTeamDetail('${team.id}')">${team.name}</span></td>
      <td><img class="flag" src="${team.countryFlag}" alt="${team.countryName}"/> ${team.countryName}</td>
      <td>${teamPlayers.length}</td>
      <td>${formatCurrency(team.budget || 0)}</td>
      <td>${formatCurrency(teamValue)}</td>
      <td><button class="btn team-delete-btn" style="background:#ff4d4f;color:white;border:0">✕</button></td>
    `;

    const deleteBtn = tr.querySelector('.team-delete-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => window.deleteTeamConfirm(team.id, team.name));
    }

    $teamsTable.appendChild(tr);
  });
};
