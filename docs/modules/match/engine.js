// modules/match/engine.js
window.startFriendlyMatchSimulation = async () => {
  const state = matchState.get();
  const teamAId = state.selectedTeamAId;
  const teamBId = state.selectedTeamBId;

  if (!teamAId || !teamBId || teamAId === teamBId) {
    alert('Wybierz dwie różne drużyny.');
    return;
  }

  const teamA = teamState.getById(teamAId);
  const teamB = teamState.getById(teamBId);

  if (!teamA || !teamB) {
    alert('Nie znaleziono wybranych drużyn.');
    return;
  }

  const lineupA = state.lineups[teamAId] || matchTeamSelector.buildBestLineup(teamAId);
  const lineupB = state.lineups[teamBId] || matchTeamSelector.buildBestLineup(teamBId);

  if (!lineupA.starters.length || !lineupB.starters.length) {
    alert('Obie drużyny muszą mieć zawodników do rozegrania meczu.');
    return;
  }

  matchState.setSimulating(true);
  const startButton = el('start-friendly-match');
  if (startButton) startButton.disabled = true;

  matchDisplay.resetLiveView();

  const score = { teamA: 0, teamB: 0 };
  const statsByPlayerId = matchStatistics.initStats(lineupA, lineupB);
  const events = [];

  const teamAContext = { ...lineupA, name: teamA.name };
  const teamBContext = { ...lineupB, name: teamB.name };

  for (let minute = 1; minute <= 60; minute += 1) {
    matchStatistics.markMinutePlayed(statsByPlayerId, minute);

    if (minute === 31) {
      matchDisplay.appendLiveLog(30, 'Koniec pierwszej połowy (30 min). Krótka przerwa.');
    }

    const minuteEvents = matchEvents.generateMinuteEvent({
      minute,
      teamA: teamAContext,
      teamB: teamBContext,
      score
    });

    minuteEvents.forEach((event) => {
      events.push(event);
      if (event.eventType === 'pass') {
        matchStatistics.registerPass(statsByPlayerId, event.playerId, !event.description.includes('niedokładne'));
      }
      matchStatistics.registerEvent(statsByPlayerId, event);
      matchDisplay.appendLiveLog(minute, event.description);
    });

    if (!minuteEvents.length) {
      matchDisplay.appendLiveLog(minute, 'Spokojny fragment gry bez groźnych sytuacji.');
    }

    matchDisplay.updateTimer(minute);
    matchDisplay.updateScore(score.teamA, score.teamB);

    await new Promise((resolve) => setTimeout(resolve, 20));
  }

  const playerStats = matchStatistics.finalizeStats(statsByPlayerId);
  const result = {
    id: `match_${Math.random().toString(36).slice(2, 10)}`,
    status: 'finished',
    startedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    finishedAt: new Date().toISOString(),
    teamA,
    teamB,
    score,
    events,
    playerStats
  };

  try {
    await window.db.saveMatchSimulation(result);
    const { dbStatus } = getDOMElements();
    dbStatus.textContent = '✅ Mecz towarzyski zapisany';
  } catch (error) {
    console.error('Save match error:', error);
    const { dbStatus } = getDOMElements();
    dbStatus.textContent = '⚠️ Mecz rozegrany, ale zapis się nie powiódł';
  }

  matchState.setCurrentMatch(result);
  matchState.setSimulating(false);
  matchDisplay.renderResults(result);

  if (startButton) startButton.disabled = false;
};
