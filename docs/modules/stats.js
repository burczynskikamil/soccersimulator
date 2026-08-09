// modules/stats.js
window.updateStats = () => {
  const players = playerState.getAll();
  const teams = teamState.getAll();
  const totalValue = players.reduce((sum, p) => sum + (p.value || 0), 0);
  
  el('stat-players').textContent = players.length;
  el('stat-teams').textContent = teams.length;
  el('stat-value').textContent = formatCurrency(totalValue);
};