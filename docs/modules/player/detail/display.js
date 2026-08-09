// modules/player/detail/display.js
window.showPlayerDetail = (id) => {
  const player = playerState.getById(id);
  if (!player) return;
  
  window.showTab('player-view');
  el('pv-name').textContent = player.name;
  el('pv-age').textContent = player.age;
  el('pv-position').textContent = POSITION_NAMES[player.position] + ' (' + player.position + ')';
  el('pv-potential').textContent = player.hiddenPotentialMin + '–' + player.hiddenPotentialMax;
  el('pv-country').innerHTML = `<img class="flag" src="${player.countryFlag}"/> ${player.countryName}`;
  el('pv-ovr').textContent = player.ovr;
  el('pv-value').textContent = formatCurrency(player.value || 0);
  el('pv-height').textContent = player.height + ' cm';
  el('pv-growth').textContent = player.growth.toFixed(2) + '/1.0';
  
  window.renderPlayerDetailTeamAssignment(id);
  window.renderPlayerDetailSkills(id);
};