// modules/player/state.js
window.playerState = (() => {
  let players = [];

  return {
    getAll: () => players,
    setAll: (data) => { players = data; },
    add: (player) => { players.push(player); },
    remove: (id) => { players = players.filter(p => p.id !== id); },
    getById: (id) => players.find(p => p.id === id),
    update: (id, updates) => {
      const player = players.find(p => p.id === id);
      if (player) Object.assign(player, updates);
    },
    getAll: () => [...players]
  };
})();