// modules/match/state.js
window.matchState = (() => {
  const state = {
    selectedTeamAId: '',
    selectedTeamBId: '',
    lineups: {},
    currentMatch: null,
    isSimulating: false
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
    setSimulating: (value) => {
      state.isSimulating = Boolean(value);
    },
    resetCurrent: () => {
      state.currentMatch = null;
      state.isSimulating = false;
    }
  };
})();
