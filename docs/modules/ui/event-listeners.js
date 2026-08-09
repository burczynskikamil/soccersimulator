// modules/ui/event-listeners.js
window.setupEventListeners = () => {
  const { filterCountry, searchInput } = getDOMElements();
  
  // Tab navigation
  el('tab-dashboard').addEventListener('click', () => window.showTab('dashboard'));
  el('tab-players').addEventListener('click', () => window.showTab('players'));
  el('tab-teams').addEventListener('click', () => {
    window.showTab('teams');
    window.renderTeamsList();
  });

  // Generate player buttons
  const generateBtns = document.querySelectorAll('#generate-player');
  generateBtns.forEach(btn => {
    btn.addEventListener('click', window.generateAndSavePlayer);
  });

  // Team buttons
  el('create-team-btn').addEventListener('click', () => window.showTab('team-create'));
  el('back-to-list').addEventListener('click', () => window.showTab('players'));
  el('back-to-teams').addEventListener('click', () => window.showTab('teams'));
  el('back-to-teams-detail').addEventListener('click', () => window.showTab('teams'));
  el('team-form-submit').addEventListener('click', window.saveTeam);

  // Table sorting
  document.querySelectorAll('#players-table thead th[data-sort]').forEach(th => {
    th.addEventListener('click', () => {
      window.renderPlayersList();
    });
  });

  filterCountry.addEventListener('change', window.renderPlayersList);
  searchInput.addEventListener('input', window.renderPlayersList);
};