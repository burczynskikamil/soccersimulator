// modules/team/state.js
window.teamState = (() => {
  let teams = [];

  return {
    getAll: () => [...teams],
    setAll: (data) => { teams = data; },
    add: (team) => { teams.push(team); },
    remove: (id) => { teams = teams.filter(t => t.id !== id); },
    getById: (id) => teams.find(t => t.id === id),
    update: (id, updates) => {
      const team = teams.find(t => t.id === id);
      if (team) Object.assign(team, updates);
    }
  };
})();