// modules/player/list/renderer.js
window.renderPlayersList = () => {
  const { $playersTable, filterCountry, searchInput } = getDOMElements();
  if (!$playersTable) return;
  
  const players = playerState.getAll();
  const teams = teamState.getAll();
  const countryFilter = filterCountry.value;
  const searchQuery = searchInput.value;
  
  const filtered = applyPlayerFilters(players, countryFilter, searchQuery);
  const sorted = window.sortPlayers(
    filtered,
    window.playerSortState.k,
    window.playerSortState.dir
  );
  
  $playersTable.innerHTML = '';
  
  sorted.forEach(p => {
    const colors = POSITION_COLORS[p.position];
    const teamName = p.teamId ? teams.find(t => t.id === p.teamId)?.name : '-';
    const displayValue = (typeof window.getDisplayValue === 'function')
      ? window.getDisplayValue(p.value, p.position)
      : p.value;
    
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span style="background:${colors.bg};color:${colors.text};padding:4px 8px;border-radius:4px;font-weight:bold">${p.position}</span></td>
      <td><span class="link" onclick="window.showPlayerDetail('${p.id}')">${p.name}</span></td>
      <td>${p.age}</td>
      <td><img class="flag" src="${p.countryFlag}" alt="${p.countryName}"/> ${p.countryName}</td>
      <td>${p.ovr}</td>
      <td>${p.hiddenPotentialMin}–${p.hiddenPotentialMax}</td>
      <td>${formatCurrency(displayValue)}</td>
      <td>${teamName}</td>
      <td><button class="btn player-delete-btn" style="background:#ff4d4f;color:white;border:0">✕</button></td>
    `;

    const deleteBtn = tr.querySelector('.player-delete-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => window.deletePlayerConfirm(p.id, p.name));
    }

    $playersTable.appendChild(tr);
  });
};
