// modules/match/engine.js
window.startFriendlyMatchSimulation = (() => {
  const MATCH_DURATION_SECONDS = 60 * 60;
  const HALF_TIME_SECONDS = 30 * 60;
  const FAST_SLICE_SECONDS = 60;
  const SLOW_SLICE_SECONDS = 10;
  const AUTO_STEP_DELAY_MS = 350;
  let autoStepInterval = null;

  function clearAutoStep() {
    if (!autoStepInterval) return;
    window.clearInterval(autoStepInterval);
    autoStepInterval = null;
  }

  function refreshControls() {
    if (window.matchTeamSelector?.refreshControls) {
      window.matchTeamSelector.refreshControls({
        isAutoPlaying: Boolean(autoStepInterval)
      });
    }
  }

  function buildMatchSetup() {
    const state = matchState.get();
    const teamAId = state.selectedTeamAId;
    const teamBId = state.selectedTeamBId;

    if (!teamAId || !teamBId || teamAId === teamBId) {
      alert('Wybierz dwie różne drużyny.');
      return null;
    }

    const teamA = teamState.getById(teamAId);
    const teamB = teamState.getById(teamBId);

    if (!teamA || !teamB) {
      alert('Nie znaleziono wybranych drużyn.');
      return null;
    }

    const lineupA = state.lineups[teamAId] || matchTeamSelector.buildBestLineup(teamAId);
    const lineupB = state.lineups[teamBId] || matchTeamSelector.buildBestLineup(teamBId);

    if (!lineupA.starters.length || !lineupB.starters.length) {
      alert('Obie drużyny muszą mieć zawodników do rozegrania meczu.');
      return null;
    }

    return {
      teamA,
      teamB,
      lineupA,
      lineupB
    };
  }

  function createSimulation(mode = 'fast') {
    const setup = buildMatchSetup();
    if (!setup) return null;

    const { teamA, teamB, lineupA, lineupB } = setup;
    const simulationStartedAt = new Date().toISOString();
    const score = { teamA: 0, teamB: 0 };
    const statsByPlayerId = matchStatistics.initStats(lineupA, lineupB);
    const teamAContext = { ...lineupA, name: teamA.name };
    const teamBContext = { ...lineupB, name: teamB.name };

    matchDisplay.resetLiveView();
    matchDisplay.updateScore(score.teamA, score.teamB);
    matchDisplay.updateTimer(0);

    const simulation = {
      id: `match_${Math.random().toString(36).slice(2, 10)}`,
      mode: mode === 'slow' ? 'slow' : 'fast',
      startedAt: simulationStartedAt,
      teamA,
      teamB,
      teamAContext,
      teamBContext,
      score,
      statsByPlayerId,
      events: [],
      currentSecond: 0,
      halfTimeLogged: false,
      sliceSeconds: mode === 'slow' ? SLOW_SLICE_SECONDS : FAST_SLICE_SECONDS
    };

    matchState.setCurrentMatch(null);
    matchState.setActiveSimulation(simulation);
    matchState.setSimulating(true);
    refreshControls();
    return simulation;
  }

  function applyEvents(simulation, sliceEvents) {
    sliceEvents.forEach((event) => {
      simulation.events.push(event);
      if (event.eventType === 'pass') {
        matchStatistics.registerPass(simulation.statsByPlayerId, event.playerId, Boolean(event.accurate));
      }
      matchStatistics.registerEvent(simulation.statsByPlayerId, event);
      matchDisplay.appendLiveLog(event.second || simulation.currentSecond, event.description, event.probabilityDetails);
    });
  }

  function markPlayedMinutes(simulation, previousSecond, currentSecond) {
    const previousWholeMinutes = Math.floor(previousSecond / 60);
    const currentWholeMinutes = Math.floor(currentSecond / 60);
    for (let minute = previousWholeMinutes + 1; minute <= currentWholeMinutes; minute += 1) {
      matchStatistics.markMinutePlayed(simulation.statsByPlayerId, minute);
    }
  }

  function stepSimulation() {
    const simulation = matchState.get().activeSimulation;
    if (!simulation) return null;

    const previousSecond = simulation.currentSecond;
    simulation.currentSecond = Math.min(simulation.currentSecond + simulation.sliceSeconds, MATCH_DURATION_SECONDS);
    markPlayedMinutes(simulation, previousSecond, simulation.currentSecond);

    if (!simulation.halfTimeLogged && previousSecond < HALF_TIME_SECONDS && simulation.currentSecond >= HALF_TIME_SECONDS) {
      simulation.halfTimeLogged = true;
      matchDisplay.appendLiveLog(HALF_TIME_SECONDS, 'Koniec pierwszej połowy (30:00). Krótka przerwa.');
    }

    const sliceEvents = matchEvents.generateTimeSliceEvents({
      elapsedSeconds: simulation.currentSecond,
      sliceSeconds: simulation.sliceSeconds,
      teamA: simulation.teamAContext,
      teamB: simulation.teamBContext,
      score: simulation.score
    });

    applyEvents(simulation, sliceEvents);

    if (!sliceEvents.length) {
      matchDisplay.appendLiveLog(simulation.currentSecond, 'Spokojny fragment gry bez groźnych sytuacji.');
    }

    matchDisplay.updateTimer(simulation.currentSecond);
    matchDisplay.updateScore(simulation.score.teamA, simulation.score.teamB);

    if (simulation.currentSecond >= MATCH_DURATION_SECONDS) {
      return finalizeSimulation(simulation);
    }

    return simulation;
  }

  async function finalizeSimulation(simulation) {
    clearAutoStep();

    const result = {
      id: simulation.id,
      status: 'finished',
      startedAt: simulation.startedAt,
      finishedAt: new Date().toISOString(),
      teamA: simulation.teamA,
      teamB: simulation.teamB,
      score: simulation.score,
      events: simulation.events,
      playerStats: matchStatistics.finalizeStats(simulation.statsByPlayerId)
    };

    const { dbStatus } = getDOMElements();
    try {
      await window.db.saveMatchSimulation(result);
      if (dbStatus) dbStatus.textContent = '✅ Mecz towarzyski zapisany';
    } catch (error) {
      console.error('Save match error:', error);
      if (dbStatus) dbStatus.textContent = '⚠️ Mecz rozegrany, ale zapis się nie powiódł';
    }

    matchState.setCurrentMatch(result);
    matchState.setActiveSimulation(null);
    matchState.setSimulating(false);
    matchDisplay.renderResults(result);
    refreshControls();
    return result;
  }

  async function runFastSimulation() {
    let simulation = matchState.get().activeSimulation;
    if (!simulation) simulation = createSimulation('fast');
    if (!simulation) return;

    while (matchState.get().activeSimulation) {
      const result = stepSimulation();
      if (result?.status === 'finished') break;
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
  }

  function toggleSlowAutoSimulation() {
    let simulation = matchState.get().activeSimulation;
    if (!simulation) simulation = createSimulation('slow');
    if (!simulation) return;

    if (autoStepInterval) {
      clearAutoStep();
      refreshControls();
      return;
    }

    autoStepInterval = window.setInterval(() => {
      const result = stepSimulation();
      if (result?.status === 'finished') {
        clearAutoStep();
      }
      refreshControls();
    }, AUTO_STEP_DELAY_MS);
    refreshControls();
  }

  function stepSlowSimulation() {
    let simulation = matchState.get().activeSimulation;
    if (!simulation) simulation = createSimulation('slow');
    if (!simulation) return;

    clearAutoStep();
    stepSimulation();
    refreshControls();
  }

  return async () => {
    const { simulationMode, activeSimulation } = matchState.get();
    if (simulationMode === 'slow') {
      toggleSlowAutoSimulation();
      return;
    }

    if (activeSimulation) return;
    await runFastSimulation();
  };
})();

window.stepFriendlyMatchSimulation = () => {
  if (!window.startFriendlyMatchSimulation) return;
  const state = matchState.get();
  if (state.simulationMode !== 'slow') {
    matchState.setSimulationMode('slow');
  }
  const stepHandler = window.startFriendlyMatchSimulation.stepSlowSimulation;
  if (typeof stepHandler === 'function') stepHandler();
};

window.startFriendlyMatchSimulation.stepSlowSimulation = (() => {
  const engine = window.startFriendlyMatchSimulation;
  return () => {
    if (!engine) return;
    const state = matchState.get();
    if (state.simulationMode !== 'slow') matchState.setSimulationMode('slow');
    const activeSimulation = state.activeSimulation;
    if (activeSimulation?.mode === 'fast') return;
    const stepSlow = (() => {
      const startFn = window.startFriendlyMatchSimulation;
      return startFn && startFn.name ? null : null;
    })();
    void stepSlow;
  };
})();
