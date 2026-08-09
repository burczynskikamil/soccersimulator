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
    const logoSrc = team.logo || 'data:image/svg+xml,<svg></svg>';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><img src="${logoSrc}" style="width:40px;height:40px;border-radius:4px;object-fit:cover;" alt="Logo" /></td>
      <td><span class="link team-detail-link">${team.name}</span></td>
      <td><img class="flag" src="${team.countryFlag}" alt="${team.countryName}"/> ${team.countryName}</td>
      <td>${teamPlayers.length}</td>
      <td>${formatCurrency(team.budget || 0)}</td>
      <td>${formatCurrency(teamValue)}</td>
      <td><button class="btn team-delete-btn" style="background:#ff4d4f;color:white;border:0">✕</button></td>
    `;

    const detailLink = tr.querySelector('.team-detail-link');
    if (detailLink) {
      detailLink.addEventListener('click', () => window.showTeamDetail(team.id));
    }

    const deleteBtn = tr.querySelector('.team-delete-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => window.deleteTeamConfirm(team.id, team.name));
    }

    $teamsTable.appendChild(tr);
  });
};
