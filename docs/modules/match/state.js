// modules/match/state.js
window.matchState = (() => {
  const state = {
    selectedTeamAId: '',
    selectedTeamBId: '',
    lineups: {},
    currentMatch: null,
    isSimulating: false,
    simulationMode: 'fast',
    activeSimulation: null
  };

  return {
    get: () => ({ ...state }),
    setTeams: (teamAId, teamBId) => {
      state.selectedTeamAId = teamAId || '';
      state.selectedTeamBId = teamBId || '';
    },
    setLineup: (teamId, lineup) => {
      if (!teamId) return;
      state.lineups[teamId] = lineup;
    },
    getLineup: (teamId) => state.lineups[teamId] || null,
    clearLineups: () => {
      state.lineups = {};
    },
    setCurrentMatch: (match) => {
      state.currentMatch = match;
    },
    getCurrentMatch: () => state.currentMatch,
    setSimulating: (value) => {
      state.isSimulating = Boolean(value);
    },
    setSimulationMode: (mode) => {
      state.simulationMode = mode === 'slow' ? 'slow' : 'fast';
    },
    setActiveSimulation: (simulation) => {
      state.activeSimulation = simulation || null;
    },
    resetCurrent: () => {
      state.currentMatch = null;
      state.isSimulating = false;
      state.activeSimulation = null;
    }
  };
})();
