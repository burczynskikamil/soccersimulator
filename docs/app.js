// app.js - Main application entry point that loads and initializes all modules
(() => {
  // ============ HELPER FUNCTIONS ============
  window.el = id => document.getElementById(id);
  
  window.getDOMElements = () => ({
    $playersTable: document.querySelector('#players-table tbody'),
    $teamsTable: document.querySelector('#teams-table tbody'),
    filterCountry: el('filter-country'),
    searchInput: el('search'),
    dbStatus: el('db-status')
  });

  window.formatCurrency = (value) => `€${value.toLocaleString('pl-PL')}`;

  window.showTab = (name) => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    const tabEl = document.getElementById('tab-' + name);
    if(tabEl) tabEl.classList.add('active');
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    const viewEl = document.getElementById(name);
    if(viewEl) viewEl.classList.remove('hidden');
  };

  window.fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  };

  window.sample = (x) => x[Math.floor(Math.random() * x.length)];
  window.randInt = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  
  // ============ INITIALIZATION ============
  async function init() {
    const { dbStatus } = getDOMElements();
    
    try {
      dbStatus.textContent = '⏳ Ładowanie modułów...';
      
      // Load all modules from localStorage or Supabase
      await window.db.initSupabase();
      
      const loadedPlayers = await window.db.loadPlayers();
      playerState.setAll(loadedPlayers);
      
      const loadedTeams = await window.db.loadTeams();
      teamState.setAll(loadedTeams || []);
      
      dbStatus.textContent = '✅ Baza danych połączona';
      
    } catch (err) {
      console.error('Init error:', err);
      dbStatus.textContent = '⚠️ Błąd bazy danych';
    }

    // Setup countries
    COUNTRIES.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.code;
      opt.textContent = c.name;
      el('filter-country').appendChild(opt);
    });

    const teamCountrySelect = el('team-country');
    COUNTRIES.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.code;
      opt.textContent = c.name;
      teamCountrySelect.appendChild(opt);
    });

    // Tab navigation
    el('tab-dashboard').addEventListener('click', () => showTab('dashboard'));
    el('tab-players').addEventListener('click', () => showTab('players'));
    el('tab-teams').addEventListener('click', () => {
      showTab('teams');
      renderTeamsList();
    });

    // Generate player buttons
    document.querySelectorAll('#generate-player').forEach(btn => {
      btn.addEventListener('click', generateNewPlayer);
    });

    // Team buttons
    el('create-team-btn').addEventListener('click', () => showTab('team-create'));
    el('back-to-list').addEventListener('click', () => showTab('players'));
    el('back-to-teams').addEventListener('click', () => showTab('teams'));
    el('back-to-teams-detail').addEventListener('click', () => showTab('teams'));
    el('team-form-submit').addEventListener('click', createNewTeam);

    // Table sorting
    document.querySelectorAll('#players-table thead th[data-sort]').forEach(th => {
      th.addEventListener('click', () => sortPlayersByColumn(th.dataset.sort));
    });

    el('filter-country').addEventListener('change', renderPlayersList);
    el('search').addEventListener('input', renderPlayersList);

    // Initial render
    window.renderPlayersList();
    window.renderTeamsList();
    window.updateStats();
  }

  // ============ PLAYER GENERATION ============
  async function generateNewPlayer() {
    const player = generatePlayer();
    playerState.add(player);
    await window.db.savePlayers(playerState.getAll());
    const { dbStatus } = getDOMElements();
    dbStatus.textContent = '✅ Zawodnik wygenerowany';
    renderPlayersList();
    updateStats();
  }

  // ============ TEAM MANAGEMENT ============
  async function createNewTeam() {
    const name = el('team-name').value.trim();
    const country = el('team-country').value;
    const logoInput = el('team-logo');

    if (!name || !country) {
      alert('Wypełnij wszystkie pola');
      return;
    }

    const countryData = COUNTRIES.find(c => c.code === country);
    let logo = 'data:image/svg+xml,<svg></svg>';

    if (logoInput.files.length > 0) {
      logo = await window.fileToBase64(logoInput.files[0]);
    }

    const team = {
      id: 'team_' + Math.random().toString(36).slice(2, 10),
      name,
      country,
      countryName: countryData.name,
      countryFlag: countryData.flag,
      countryColor: countryData.color,
      logo,
      budget: 5000000,
      created: Date.now()
    };

    teamState.add(team);
    await window.db.saveTeams(teamState.getAll());
    await window.db.savePlayers(playerState.getAll());  // Preserve all players
    const { dbStatus } = getDOMElements();
    dbStatus.textContent = '✅ Drużyna utworzona';
    el('team-name').value = '';
    el('team-logo').value = '';
    showTab('teams');
    renderTeamsList();
    updateStats();
  }

  // ============ SORTING & FILTERING ============
  let playerSortState = { k: 'name', dir: 1 };

  function sortPlayersByColumn(k) {
    if(playerSortState.k === k) playerSortState.dir *= -1;
    else { playerSortState.k = k; playerSortState.dir = 1; }
    renderPlayersList();
  }

  function getSortValue(p, k) {
    if(k === 'name') return p.name;
    if(k === 'age') return p.age;
    if(k === 'country') return p.countryName;
    if(k === 'position') return p.position;
    if(k === 'ovr') return p.ovr;
    if(k === 'potential') return p.realPotential;
    if(k === 'value') return p.value || 0;
    return p.skills[k] || 0;
  }

  // ============ EXPORT GLOBAL FUNCTIONS ============
  window.generateNewPlayer = generateNewPlayer;
  window.createNewTeam = createNewTeam;
  window.sortPlayersByColumn = sortPlayersByColumn;

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
