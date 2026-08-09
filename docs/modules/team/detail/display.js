// modules/team/detail/display.js
window.currentTeamId = null;

window.showTeamDetail = (teamId) => {
  const team = teamState.getById(teamId);
  if (!team) return;

  window.currentTeamId = teamId;
  window.showTab('team-detail');

  el('team-detail-name').textContent = team.name;
  el('team-detail-country').innerHTML = `<img class="flag" src="${team.countryFlag}"/> ${team.countryName}`;
  el('team-detail-logo').src = team.logo || 'data:image/svg+xml,<svg></svg>';
  el('team-detail-budget').textContent = formatCurrency(team.budget || 0);
  el('team-edit-budget').value = team.budget || 1000000;
  el('team-edit-logo-input').value = '';

  const players = playerState.getAll();
  const playersInTeam = players.filter(p => p.teamId === teamId);
  const teamValue = playersInTeam.reduce((sum, p) => sum + (p.value || 0), 0);
  el('team-detail-value').textContent = formatCurrency(teamValue);
  el('team-detail-players-count').textContent = playersInTeam.length;

  window.renderTeamPlayersTable(teamId);

  if (typeof window.renderTeamMatchHistory === 'function') {
    window.renderTeamMatchHistory(teamId);
  }
};

window.renderTeamMatchHistory = async (teamId) => {
  const historyEl = el('team-match-history');
  const statsEl = el('team-career-stats');
  if (!historyEl || !statsEl) return;

  historyEl.innerHTML = '<p class="muted">Ładowanie historii meczów...</p>';
  statsEl.innerHTML = '';

  try {
    const [history, stats] = await Promise.all([
      window.db.loadTeamMatchHistory(teamId, 8),
      window.db.loadTeamStats(teamId)
    ]);

    statsEl.innerHTML = `
      <div class="stat-card"><h3>Mecze</h3><p>${Number(stats?.matches_played || 0)}</p></div>
      <div class="stat-card"><h3>W/R/P</h3><p>${Number(stats?.wins || 0)}/${Number(stats?.draws || 0)}/${Number(stats?.losses || 0)}</p></div>
      <div class="stat-card"><h3>Bramki</h3><p>${Number(stats?.goals_for || 0)}:${Number(stats?.goals_against || 0)}</p></div>
    `;

    if (!history.length) {
      historyEl.innerHTML = '<p class="muted">Brak rozegranych meczów towarzyskich.</p>';
      return;
    }

    historyEl.innerHTML = history.map((item) => `
      <div class="history-item">
        <div><strong>${item.date ? new Date(item.date).toLocaleDateString('pl-PL') : '-'}</strong> • vs ${item.opponentName}</div>
        <div>Wynik: ${item.score} • ${item.outcome}</div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Team history error:', error);
    historyEl.innerHTML = '<p class="muted">Nie udało się wczytać historii meczów.</p>';
  }
};
