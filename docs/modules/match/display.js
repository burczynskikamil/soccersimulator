// modules/match/display.js
window.matchDisplay = (() => {
  function resetLiveView() {
    const log = el('match-live-log');
    const timer = el('match-live-timer');
    const score = el('match-live-score');
    if (log) log.innerHTML = '';
    if (timer) timer.textContent = '0\'';
    if (score) score.textContent = '0 : 0';
  }

  function appendLiveLog(minute, text) {
    const log = el('match-live-log');
    if (!log) return;

    const row = document.createElement('div');
    row.className = 'match-log-row';
    row.innerHTML = `<span class="minute">${minute}'</span><span>${text}</span>`;
    log.appendChild(row);
    log.scrollTop = log.scrollHeight;
  }

  function updateTimer(minute) {
    const timer = el('match-live-timer');
    if (timer) timer.textContent = `${minute}'`;
  }

  function updateScore(scoreA, scoreB) {
    const score = el('match-live-score');
    if (score) score.textContent = `${scoreA} : ${scoreB}`;
  }

  function renderResults(result) {
    const resultCard = el('match-results');
    const resultTitle = el('match-result-title');
    const statsTableBody = document.querySelector('#match-player-stats-table tbody');

    if (!resultCard || !resultTitle || !statsTableBody) return;

    resultCard.classList.remove('hidden');
    resultTitle.textContent = `${result.teamA.name} ${result.score.teamA} : ${result.score.teamB} ${result.teamB.name}`;

    statsTableBody.innerHTML = '';

    result.playerStats.forEach((stat) => {
      const player = playerState.getById(stat.playerId);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${player ? player.name : stat.playerId}</td>
        <td>${stat.minutes_played}</td>
        <td>${stat.goals}</td>
        <td>${stat.assists}</td>
        <td>${stat.passing_accuracy}%</td>
        <td>${stat.dribbles}</td>
        <td>${stat.tackles}</td>
        <td>${stat.interceptions}</td>
        <td>${stat.fouls}</td>
        <td>${stat.yellow_cards}/${stat.red_cards}</td>
        <td>${stat.saves}</td>
        <td>${stat.sprints}</td>
        <td>${stat.clearances}</td>
        <td>${stat.goals_conceded}</td>
        <td>${Number(stat.rating).toFixed(2)}</td>
      `;
      statsTableBody.appendChild(tr);
    });
  }

  return {
    resetLiveView,
    appendLiveLog,
    updateTimer,
    updateScore,
    renderResults
  };
})();
