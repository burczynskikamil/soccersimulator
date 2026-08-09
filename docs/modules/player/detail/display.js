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

  if (typeof window.renderPlayerMatchHistory === 'function') {
    window.renderPlayerMatchHistory(id);
  }
};

window.renderPlayerMatchHistory = async (playerId) => {
  const historyEl = el('pv-match-history');
  const careerEl = el('pv-career-stats');
  if (!historyEl || !careerEl) return;

  historyEl.innerHTML = '<p class="muted">Ładowanie historii meczów...</p>';
  careerEl.innerHTML = '';

  try {
    const [history, career] = await Promise.all([
      window.db.loadPlayerMatchHistory(playerId, 8),
      window.db.loadPlayerCareerStats(playerId)
    ]);

    const matchesPlayed = Number(career?.matches_played || 0);
    const goals = Number(career?.goals || 0);
    const assists = Number(career?.assists || 0);
    const avgRating = Number(career?.average_rating || 0).toFixed(2);

    careerEl.innerHTML = `
      <div class="stat-card"><h3>Mecze</h3><p>${matchesPlayed}</p></div>
      <div class="stat-card"><h3>Gole</h3><p>${goals}</p></div>
      <div class="stat-card"><h3>Asysty</h3><p>${assists}</p></div>
      <div class="stat-card"><h3>Śr. ocena</h3><p>${avgRating}</p></div>
    `;

    if (!history.length) {
      historyEl.innerHTML = '<p class="muted">Brak rozegranych meczów towarzyskich.</p>';
      return;
    }

    historyEl.innerHTML = history.map((item) => `
      <div class="history-item">
        <div><strong>${item.date ? new Date(item.date).toLocaleDateString('pl-PL') : '-'}</strong> • vs ${item.opponentName}</div>
        <div>Wynik: ${item.score} • G/A: ${item.goals}/${item.assists} • Ocena: ${Number(item.rating).toFixed(2)}</div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Player history error:', error);
    historyEl.innerHTML = '<p class="muted">Nie udało się wczytać historii meczów.</p>';
  }
};
