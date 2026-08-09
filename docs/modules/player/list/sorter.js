// modules/player/list/sorter.js
window.playerSortState = { k: 'name', dir: 1 };

window.getSortValue = (player, key) => {
  if (key === 'name') return player.name;
  if (key === 'age') return player.age;
  if (key === 'country') return player.countryName;
  if (key === 'position') return player.position;
  if (key === 'ovr') return player.ovr;
  if (key === 'potential') return player.realPotential;
  if (key === 'value') return player.value || 0;
  return player.skills[key] || 0;
};

window.sortPlayers = (players, key) => {
  if (playerSortState.k === key) playerSortState.dir *= -1;
  else { playerSortState.k = key; playerSortState.dir = 1; }
  
  return players.sort((a, b) => {
    let va = getSortValue(a, key);
    let vb = getSortValue(b, key);
    if (typeof va === 'string') return playerSortState.dir * va.localeCompare(vb);
    return playerSortState.dir * (va - vb);
  });
};