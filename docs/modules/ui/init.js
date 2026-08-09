// modules/ui/init.js
window.initializeApp = async () => {
  const { dbStatus, filterCountry } = getDOMElements();
  
  try {
    dbStatus.textContent = '⏳ Inicjalizacja bazy danych...';
    await window.db.initSupabase();
    dbStatus.textContent = '✅ Baza danych połączona';
    
    const players = await window.db.loadPlayers();
    const teams = await window.db.loadTeams() || [];
    playerState.setAll(players);
    teamState.setAll(teams);
    console.log('Loaded players:', players.length, 'teams:', teams.length);
    
  } catch (err) {
    console.error('Init error:', err);
    dbStatus.textContent = '⚠️ Błąd bazy danych';
  }

  // Populate country filter
  COUNTRIES.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.code;
    opt.textContent = c.name;
    filterCountry.appendChild(opt);
  });

  // Populate team country select
  const teamCountrySelect = el('team-country');
  COUNTRIES.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.code;
    opt.textContent = c.name;
    teamCountrySelect.appendChild(opt);
  });

  window.setupEventListeners();
  window.renderPlayersList();
  window.updateStats();
};