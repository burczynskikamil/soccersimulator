window.deletePlayerConfirm = async (playerId, playerName) => {
  const ok = confirm(`Usunąć zawodnika ${playerName}?`);
  if (!ok) return;

  playerState.remove(playerId);
  await window.db.savePlayers(playerState.getAll());

  window.renderPlayersList();
  window.updateStats();
};
