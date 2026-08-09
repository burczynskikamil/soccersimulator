// modules/player/detail/display.js
window.showPlayerDetail = (id) => {
  const player = playerState.getById(id);
  if (!player) return;

  const ovr = Number(player.ovr ?? 0);
  const value = Number(player.value ?? 0);
  const height = Number(player.height ?? 0);
  const potentialMin = Number(player.hiddenPotentialMin ?? 0);
  const potentialMax = Number(player.hiddenPotentialMax ?? 0);

  const positionName = (window.POSITION_NAMES && window.POSITION_NAMES[player.position])
    ? window.POSITION_NAMES[player.position]
    : (player.position ?? '-');

  window.showTab('player-view');

  el('pv-name').textContent = player.name ?? '-';
  el('pv-age').textContent = String(player.age ?? '-');
  el('pv-position').textContent = `${positionName} (${player.position ?? '-'})`;
  el('pv-potential').textContent = `${potentialMin}–${potentialMax}`;
  el('pv-country').innerHTML = `<img class="flag" src="${player.countryFlag ?? ''}" alt="${player.countryName ?? ''}"/> ${player.countryName ?? '-'}`;
  el('pv-ovr').textContent = String(ovr);
  el('pv-value').textContent = formatCurrency(value);
  el('pv-height').textContent = `${height} cm`;

  // usuwamy dziesiętny "wzrost/growth"
  const growthEl = el('pv-growth');
  if (growthEl) growthEl.textContent = '-';

  if (typeof window.renderPlayerDetailTeamAssignment === 'function') {
    window.renderPlayerDetailTeamAssignment(id);
  }

  if (typeof window.renderPlayerDetailSkills === 'function') {
    window.renderPlayerDetailSkills(player);
  } else if (typeof window.renderPlayerSkills === 'function') {
    window.renderPlayerSkills(player);
  }
};
