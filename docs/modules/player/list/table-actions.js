// modules/player/list/table-actions.js
window.deletePlayer = async (id) => {
  playerState.remove(id);
  await window.db.savePlayers(playerState.getAll());
  const { dbStatus } = getDOMElements();
  dbStatus.textContent = '✅ Zawodnik usunięty';
  window.renderPlayersList();
  window.updateStats();
};

window.deletePlayerConfirm = (id, name) => {
  if (confirm(`Usuń zawodnika ${name}?`)) {
    deletePlayer(id);
  }
};