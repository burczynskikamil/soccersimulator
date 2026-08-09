// modules/match/display.js
window.matchDisplay = (() => {
  function formatMatchClock(totalSeconds) {
    const minutes = Math.floor((Number(totalSeconds) || 0) / 60);
    const seconds = Math.max(0, Number(totalSeconds) || 0) % 60;
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  }

  function formatChance(value) {
    return `${Math.round(Number(value || 0) * 100)}%`;
  }

  function formatModifier(modifier) {
    const sign = Number(modifier.value) >= 0 ? '+' : '−';
    return `${modifier.label} ${sign}${formatChance(Math.abs(Number(modifier.value) || 0))}`;
  }

  function buildProbabilityText(probabilityDetails) {
    if (!probabilityDetails) return '';
    const modifiers = (probabilityDetails.modifiers || []).map(formatModifier);
    const summary = [
      `${probabilityDetails.label || 'Szansa'} ${formatChance(probabilityDetails.final)}`,
      `(bazowe ${formatChance(probabilityDetails.base)}`,
      modifiers.length ? `; ${modifiers.join(', ')}` : '',
      ')'
    ].join('');
    return `Szansa: ${summary}`;
  }

  function resetLiveView() {
    const log = el('match-live-log');
    const timer = el('match-live-timer');
    const score = el('match-live-score');
    const resultCard = el('match-results');
    if (log) log.innerHTML = '';
    if (timer) timer.textContent = formatMatchClock(0);
    if (score) score.textContent = '0 : 0';
    if (resultCard) resultCard.classList.add('hidden');
  }

  function appendLiveLog(second, text, probabilityDetails) {
    const log = el('match-live-log');
    if (!log) return;

    const row = document.createElement('div');
    row.className = 'match-log-row';

    const minute = document.createElement('span');
    minute.className = 'minute';
    minute.textContent = formatMatchClock(second);

    const content = document.createElement('div');
    content.className = 'match-log-content';

    const description = document.createElement('div');
    description.className = 'match-log-description';
    description.textContent = text;
    content.appendChild(description);

    if (probabilityDetails) {
      const probability = document.createElement('div');
      probability.className = 'match-log-probability';
      probability.textContent = buildProbabilityText(probabilityDetails);
      content.appendChild(probability);
    }

    row.appendChild(minute);
    row.appendChild(content);
    log.appendChild(row);
    log.scrollTop = log.scrollHeight;
  }

  function updateTimer(totalSeconds) {
    const timer = el('match-live-timer');
    if (timer) timer.textContent = formatMatchClock(totalSeconds);
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
    formatMatchClock,
    updateTimer,
    updateScore,
    renderResults
  };
})();
