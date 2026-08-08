// app.js - complete player and team management system
(() => {
  const COUNTRIES = [
    {code:'PL',name:'Polska',flag:'https://flagsapi.com/PL/flat/64.png',color:'#ff4d4f'},
    {code:'NL',name:'Holandia',flag:'https://flagsapi.com/NL/flat/64.png',color:'#ff7a18'},
    {code:'GB',name:'Anglia',flag:'https://flagsapi.com/GB/flat/64.png',color:'#3f7fff'},
    {code:'ES',name:'Hiszpania',flag:'https://flagsapi.com/ES/flat/64.png',color:'#ffb300'},
    {code:'DE',name:'Niemcy',flag:'https://flagsapi.com/DE/flat/64.png',color:'#222831'},
    {code:'PT',name:'Portugalia',flag:'https://flagsapi.com/PT/flat/64.png',color:'#2db34a'},
    {code:'AR',name:'Argentyna',flag:'https://flagsapi.com/AR/flat/64.png',color:'#4ea8de'},
    {code:'BR',name:'Brazylia',flag:'https://flagsapi.com/BR/flat/64.png',color:'#1fbf4a'},
    {code:'CN',name:'Chiny',flag:'https://flagsapi.com/CN/flat/64.png',color:'#e63946'},
    {code:'ZA',name:'RPA',flag:'https://flagsapi.com/ZA/flat/64.png',color:'#f77f00'},
  ];

  const POSITIONS = ['ST', 'CM', 'CB', 'GK'];
  const POSITION_NAMES = {
    'ST': 'Napastnik',
    'CM': 'Pomocnik',
    'CB': 'Obrońca',
    'GK': 'Bramkarz'
  };

  const POSITION_COLORS = {
    'ST': { bg: '#ff4d4f', text: '#fff' },
    'CM': { bg: '#2db34a', text: '#fff' },
    'CB': { bg: '#ffb300', text: '#000' },
    'GK': { bg: '#3f7fff', text: '#fff' }
  };

  // Skill categories for all positions
  const SKILL_CATEGORIES = {
    'ST': {
      'Ofensywne': ['Strzały', 'Główki', 'Drybling'],
      'Fizyczne': ['Siła', 'Szybkość', 'Kondycja', 'Przyspieszenie'],
      'Techniczne': ['Podanie', 'Wizja'],
      'Defensywne': ['Odbiór', 'Krycie']
    },
    'CM': {
      'Techniczne': ['Podanie', 'Wizja'],
      'Fizyczne': ['Szybkość', 'Kondycja', 'Przyspieszenie'],
      'Ofensywne': ['Drybling', 'Strzały', 'Główki'],
      'Defensywne': ['Odbiór', 'Krycie']
    },
    'CB': {
      'Defensywne': ['Odbiór', 'Krycie'],
      'Fizyczne': ['Siła', 'Szybkość', 'Główki', 'Przyspieszenie'],
      'Techniczne': ['Podanie', 'Wizja'],
      'Ofensywne': ['Strzały', 'Drybling', 'Kondycja']
    },
    'GK': {
      'Bramkarskie': ['Sam na sam', 'Obrona strzałów', 'Łapanie']
    }
  };

  const CATEGORY_IMPORTANCE = {
    'ST': {
      'Ofensywne': 'primary',
      'Fizyczne': 'secondary',
      'Techniczne': 'secondary',
      'Defensywne': 'tertiary'
    },
    'CM': {
      'Techniczne': 'primary',
      'Fizyczne': 'secondary',
      'Ofensywne': 'secondary',
      'Defensywne': 'tertiary'
    },
    'CB': {
      'Defensywne': 'primary',
      'Fizyczne': 'secondary',
      'Techniczne': 'secondary',
      'Ofensywne': 'tertiary'
    },
    'GK': {
      'Bramkarskie': 'primary'
    }
  };

  const CATEGORY_COLORS = {
    'Ofensywne': { bg: '#ff4d4f', text: '#fff' },
    'Fizyczne': { bg: '#faad14', text: '#000' },
    'Defensywne': { bg: '#1890ff', text: '#fff' },
    'Techniczne': { bg: '#52c41a', text: '#fff' },
    'Bramkarskie': { bg: '#1890ff', text: '#fff' }
  };

  // Position-based skill weights
  const SKILL_WEIGHTS = {
    'ST': {
      'Strzały': 10, 'Główki': 10, 'Siła': 9, 'Szybkość': 9,
      'Kondycja': 9, 'Drybling': 8, 'Przyspieszenie': 8, 'Podanie': 7,
      'Wizja': 7, 'Odbiór': 3, 'Krycie': 3
    },
    'CM': {
      'Podanie': 10, 'Wizja': 10, 'Kondycja': 9, 'Szybkość': 9,
      'Drybling': 9, 'Odbiór': 8, 'Przyspieszenie': 8, 'Strzały': 8,
      'Krycie': 6, 'Główki': 6, 'Siła': 6
    },
    'CB': {
      'Odbiór': 10, 'Krycie': 10, 'Siła': 9, 'Szybkość': 9,
      'Główki': 9, 'Podanie': 8, 'Przyspieszenie': 8, 'Wizja': 8,
      'Strzały': 5, 'Drybling': 5, 'Kondycja': 5
    },
    'GK': {
      'Sam na sam': 100, 'Obrona strzałów': 100, 'Łapanie': 100
    }
  };

  const HEIGHT_RANGES = {
    'GK': { min: 185, max: 195, avg: 190 },
    'CB': { min: 182, max: 193, avg: 188 },
    'ST': { min: 175, max: 190, avg: 183 },
    'CM': { min: 170, max: 185, avg: 178 }
  };

  const NAME_POOL = {
    PL: {first:['Jan','Kacper','Jakub','Mateusz','Piotr','Filip','Michał','Oskar','Szymon','Kamil'],last:['Nowak','Kowalski','Wiśniewski','Wójcik','Kubiak','Kaczmarek','Kamiński','Lewandowski','Zieliński','Sikora']},
    NL: {first:['Daan','Luca','Bram','Finn','Sem','Tijn','Luuk','Sven','Milan','Davy'],last:['de Jong','Jansen','van Dijk','Bakker','Visser','Smit','de Vries','Mulder','Bos','Kuipers']},
    GB: {first:['Oliver','Harry','George','Noah','Jack','Charlie','Jacob','Alfie','Oscar','William'],last:['Smith','Brown','Taylor','Wilson','Evans','Johnson','Robinson','Walker','Wright','Green']},
    ES: {first:['Mateo','Hugo','Martín','Daniel','Pablo','Alejandro','Lucas','Adrián','Diego','Marco'],last:['García','Martínez','López','Sánchez','Pérez','González','Rodríguez','Fernández','Ruiz','Morales']},
    DE: {first:['Lukas','Leon','Finn','Jonas','Elias','Noah','Paul','Ben','Luis','Felix'],last:['Müller','Schmidt','Schneider','Fischer','Weber','Meyer','Wagner','Becker','Hoffmann','Koch']},
    PT: {first:['João','Miguel','Rodrigo','Martim','Gonçalo','Tomás','Afonso','Diogo','Francisco','Duarte'],last:['Silva','Santos','Ferreira','Pereira','Oliveira','Costa','Rodrigues','Martins','Lopes','Gomes']},
    AR: {first:['Matías','Santiago','Juan','Martín','Facundo','Bruno','Ignacio','Lucas','Agustín','Tomás'],last:['González','Rodríguez','Gómez','Fernández','López','Sosa','Pérez','Romero','Díaz','García']},
    BR: {first:['Miguel','Arthur','Davi','Heitor','Bernardo','Gabriel','Lucas','Enzo','Gustavo','Pedro'],last:['Silva','Santos','Oliveira','Souza','Ferreira','Pereira','Gomes','Ribeiro','Almeida','Martins']},
    CN: {first:['Wei','Hao','Lei','Jie','Ming','Jun','Tao','Huan','Qiang','Liang'],last:['Wang','Li','Zhang','Liu','Chen','Yang','Zhao','Huang','Zhou','Xu']},
    ZA: {first:['Liam','Noah','Ethan','Logan','Daniel','Jayden','Ryan','Tyler','Jordan','Kyle'],last:['Nkosi','Dlamini','Nkuna','Mthethwa','van der Merwe','Botha','Smith','Mabuza','Mokwena','Khumalo']},
  };

  const el = id => document.getElementById(id);
  const $playersTable = document.querySelector('#players-table tbody');
  const $teamsTable = document.querySelector('#teams-table tbody');
  const filterCountry = el('filter-country');
  const searchInput = el('search');
  const dbStatus = el('db-status');

  let players = [];
  let teams = [];
  let lastSort = { k: 'name', dir: 1 };
  let currentTeamId = null;

  async function init(){
    try {
      dbStatus.textContent = '⏳ Inicjalizacja bazy danych...';
      await window.db.initSupabase();
      dbStatus.textContent = '✅ Baza danych połączona';
      
      players = await window.db.loadPlayers();
      teams = await window.db.loadTeams() || [];
      console.log('Loaded players:', players.length, 'teams:', teams.length);
      
    } catch (err) {
      console.error('Init error:', err);
      dbStatus.textContent = '⚠️ Błąd bazy danych';
    }

    COUNTRIES.forEach(c=>{ 
      const opt = document.createElement('option'); 
      opt.value=c.code; 
      opt.textContent=c.name; 
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

    // Tab navigation
    el('tab-dashboard').addEventListener('click', () => showTab('dashboard'));
    el('tab-players').addEventListener('click', () => showTab('players'));
    el('tab-teams').addEventListener('click', () => {
      showTab('teams');
      renderTeamsList();
    });

    // Generate player buttons - ALL of them
    const generateBtns = document.querySelectorAll('#generate-player');
    generateBtns.forEach(btn => {
      btn.addEventListener('click', generateAndSave);
    });

    // Team buttons
    el('create-team-btn').addEventListener('click', () => showTab('team-create'));
    el('back-to-list').addEventListener('click', () => showTab('players'));
    el('back-to-teams').addEventListener('click', () => showTab('teams'));
    el('back-to-teams-detail').addEventListener('click', () => showTab('teams'));
    el('team-form-submit').addEventListener('click', saveTeam);

    // Table sorting
    document.querySelectorAll('#players-table thead th[data-sort]').forEach(th => {
      th.addEventListener('click', () => sortBy(th.dataset.sort));
    });

    filterCountry.addEventListener('change', renderList);
    searchInput.addEventListener('input', renderList);

    renderList();
    updateStats();
  }

  function showTab(name){ 
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active')); 
    const tabEl = document.getElementById('tab-' + name);
    if(tabEl) tabEl.classList.add('active'); 
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden')); 
    const viewEl = document.getElementById(name);
    if(viewEl) viewEl.classList.remove('hidden'); 
  }

  function uid(){ return 'p_' + Math.random().toString(36).slice(2,10); }

  function generateHeight(position) {
    const range = HEIGHT_RANGES[position];
    const avg = range.avg;
    let u1 = Math.random();
    let u2 = Math.random();
    let z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    let height = Math.round(avg + z * 3);
    return Math.max(range.min, Math.min(range.max, height));
  }

  function generatePotential() {
    let u1 = Math.random();
    let u2 = Math.random();
    let z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    let potential = Math.round(65 + z * 8);
    return Math.max(30, Math.min(99, potential));
  }

  function generateOVR(potential) {
    const minOVR = 20;
    const maxOVR = 60;
    const potentialRatio = (potential - 30) / (99 - 30);
    const expectedOVR = minOVR + (maxOVR - minOVR) * potentialRatio;
    const variance = randInt(-8, 8);
    const ovr = expectedOVR + variance;
    return Math.max(minOVR, Math.min(maxOVR, Math.round(ovr)));
  }

  function generateHiddenPotentialRange(realPotential) {
    const spread = 10;
    const minHidden = Math.max(30, realPotential - spread);
    const maxHidden = Math.min(99, realPotential + spread);
    return { min: minHidden, max: maxHidden };
  }

  function generateSkills(ovr, position) {
    const skills = {};
    const weights = SKILL_WEIGHTS[position];
    
    for (let skill in weights) {
      skills[skill] = 0;
    }

    const multiplier = position === 'GK' ? 3 : 11;
    const totalPoints = ovr * multiplier;

    const weightedSkills = [];
    for (let skill in weights) {
      const weight = weights[skill];
      for (let i = 0; i < weight; i++) {
        weightedSkills.push(skill);
      }
    }

    for (let i = 0; i < totalPoints; i++) {
      const randomIndex = Math.floor(Math.random() * weightedSkills.length);
      const selectedSkill = weightedSkills[randomIndex];
      skills[selectedSkill]++;
    }

    return skills;
  }

  function calculatePlayerValue(hiddenPot, skills) {
    const sumSkills = Object.values(skills).reduce((a, b) => a + b, 0);
    return Math.round((hiddenPot * 50000) + (sumSkills * 1000));
  }

  function generateGrowth(position) {
    const rates = {
      'GK': { min: 0.7, max: 0.9 },
      'CB': { min: 0.5, max: 0.7 },
      'CM': { min: 0.5, max: 0.7 },
      'ST': { min: 0.6, max: 0.8 }
    };
    const range = rates[position];
    return Math.round((Math.random() * (range.max - range.min) + range.min) * 100) / 100;
  }

  function generatePlayer(){
    const age = 11;
    const country = sample(COUNTRIES);
    const position = sample(POSITIONS);
    const height = generateHeight(position);
    const realPotential = generatePotential();
    const ovr = generateOVR(realPotential);
    const hidden = generateHiddenPotentialRange(realPotential);
    const id = uid();
    const name = generateUniqueName(country.code, players);
    const skills = generateSkills(ovr, position);
    const growth = generateGrowth(position);
    const value = calculatePlayerValue(hidden.max, skills);

    return {
      id, name, age, position, country: country.code, countryName: country.name,
      countryFlag: country.flag, countryColor: country.color,
      height, ovr, realPotential, hiddenPotentialMin: hidden.min, hiddenPotentialMax: hidden.max,
      growth, skills, value, created: Date.now(), teamId: null
    };
  }

  async function generateAndSave(){
    const p = generatePlayer();
    players.push(p);
    await window.db.savePlayers(players);
    dbStatus.textContent = '✅ Zawodnik zapisany';
    renderList();
    updateStats();
  }

  async function saveTeam(){
    const name = el('team-name').value.trim();
    const country = el('team-country').value;
    const logoInput = el('team-logo');
    
    if (!name || !country) {
      alert('Wypełnij wszystkie pola!');
      return;
    }

    let logoDataUrl = '';
    if (logoInput.files.length > 0) {
      logoDataUrl = await fileToBase64(logoInput.files[0]);
    }

    const team = {
      id: uid(),
      name,
      country,
      countryName: COUNTRIES.find(c => c.code === country)?.name || country,
      countryFlag: COUNTRIES.find(c => c.code === country)?.flag || '',
      logo: logoDataUrl,
      budget: 1000000,
      created: Date.now()
    };

    teams.push(team);
    await window.db.saveTeams(teams);
    dbStatus.textContent = '✅ Drużyna utworzona';
    
    el('team-name').value = '';
    el('team-country').value = '';
    logoInput.value = '';
    
    showTab('teams');
    renderTeamsList();
    updateStats();
  }

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function renderTeamsList(){
    if(!$teamsTable) return;
    $teamsTable.innerHTML='';
    
    teams.forEach(t=>{
      const playersInTeam = players.filter(p => p.teamId === t.id);
      const teamValue = playersInTeam.reduce((sum, p) => sum + (p.value || 0), 0);
      
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><img src="${t.logo || 'data:image/svg+xml,<svg></svg>'}" style="width:40px;height:40px;object-fit:cover;border-radius:4px"/></td>
        <td><span class="link" onclick="window.showTeamDetail('${t.id}')">${t.name}</span></td>
        <td><img class="flag" src="${t.countryFlag}" alt="${t.countryName}"/> ${t.countryName}</td>
        <td>${playersInTeam.length}</td>
        <td>€${(t.budget || 0).toLocaleString('pl-PL')}</td>
        <td>€${teamValue.toLocaleString('pl-PL')}</td>
        <td><button class="btn" onclick="window.deleteTeamConfirm('${t.id}', '${t.name.replace(/'/g, "\\'")}')" style="background:#ff4d4f;color:white;border:0">✕</button></td>
      `;
      $teamsTable.appendChild(tr);
    });
  }

  function showTeamDetail(teamId){
    const team = teams.find(t => t.id === teamId);
    if (!team) return;
    
    currentTeamId = teamId;
    showTab('team-detail');
    
    el('team-detail-name').textContent = team.name;
    el('team-detail-country').innerHTML = `<img class="flag" src="${team.countryFlag}"/> ${team.countryName}`;
    el('team-detail-logo').src = team.logo || 'data:image/svg+xml,<svg></svg>';
    el('team-detail-budget').textContent = `€${(team.budget || 0).toLocaleString('pl-PL')}`;
    el('team-edit-budget').value = team.budget || 1000000;
    el('team-edit-logo-input').value = '';
    
    const playersInTeam = players.filter(p => p.teamId === teamId);
    const teamValue = playersInTeam.reduce((sum, p) => sum + (p.value || 0), 0);
    el('team-detail-value').textContent = `€${teamValue.toLocaleString('pl-PL')}`;
    el('team-detail-players-count').textContent = playersInTeam.length;
    
    renderTeamPlayersTable(teamId);
  }

  function renderTeamPlayersTable(teamId){
    const $table = document.querySelector('#team-players-table tbody');
    if (!$table) return;
    
    $table.innerHTML = '';
    const teamPlayers = players.filter(p => p.teamId === teamId);
    
    teamPlayers.forEach(p => {
      const colors = POSITION_COLORS[p.position];
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><span style="background:${colors.bg};color:${colors.text};padding:4px 8px;border-radius:4px;font-weight:bold">${p.position}</span></td>
        <td><span class="link" onclick="window.showPlayerDetail('${p.id}')">${p.name}</span></td>
        <td>${p.age}</td>
        <td>${p.ovr}</td>
        <td>${p.hiddenPotentialMin}–${p.hiddenPotentialMax}</td>
        <td>€${(p.value || 0).toLocaleString('pl-PL')}</td>
        <td><button class="btn" onclick="window.removePlayerFromTeam('${p.id}')" style="background:#ff7a18;color:white;border:0">Usuń</button></td>
      `;
      $table.appendChild(tr);
    });
  }

  async function updateTeamBudget(){
    if (!currentTeamId) return;
    
    const team = teams.find(t => t.id === currentTeamId);
    if (!team) return;
    
    const newBudget = parseInt(el('team-edit-budget').value) || team.budget;
    team.budget = newBudget;
    
    const logoInput = el('team-edit-logo-input');
    if (logoInput.files.length > 0) {
      team.logo = await fileToBase64(logoInput.files[0]);
    }
    
    await window.db.saveTeams(teams);
    dbStatus.textContent = '✅ Drużyna zaktualizowana';
    showTeamDetail(currentTeamId);
  }

  async function deleteTeam(teamId){
    teams = teams.filter(t => t.id !== teamId);
    players = players.map(p => p.teamId === teamId ? {...p, teamId: null} : p);
    await window.db.saveTeams(teams);
    await window.db.savePlayers(players);
    dbStatus.textContent = '✅ Drużyna usunięta';
    showTab('teams');
    renderTeamsList();
    updateStats();
  }

  async function removePlayerFromTeam(playerId){
    const player = players.find(p => p.id === playerId);
    if (player) {
      player.teamId = null;
      await window.db.savePlayers(players);
      renderTeamPlayersTable(currentTeamId);
    }
  }

  function updateStats(){
    const totalValue = players.reduce((sum, p) => sum + (p.value || 0), 0);
    el('stat-players').textContent = players.length;
    el('stat-teams').textContent = teams.length;
    el('stat-value').textContent = `€${totalValue.toLocaleString('pl-PL')}`;
  }

  function sample(x){ return x[Math.floor(Math.random()*x.length)]; }
  function randInt(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }

  function generateUniqueName(countryCode, existing){
    const pool = NAME_POOL[countryCode] || NAME_POOL['PL'];
    const existingNames = new Set(existing.map(p=>p.name));
    for(let i=0;i<500;i++){
      const fname = pool.first[Math.floor(Math.random()*pool.first.length)];
      const lname = pool.last[Math.floor(Math.random()*pool.last.length)];
      const full = fname+' '+lname;
      if(!existingNames.has(full)) return full;
    }
    return 'Player '+uid();
  }

  function renderList(){
    if(!$playersTable) return;
    $playersTable.innerHTML='';
    const countryFilter = filterCountry.value;
    const q = searchInput.value.trim().toLowerCase();
    let list = players.slice();
    if(countryFilter) list = list.filter(p=>p.country===countryFilter);
    if(q) list = list.filter(p=>p.name.toLowerCase().includes(q));
    
    list.forEach(p=>{
      const colors = POSITION_COLORS[p.position];
      const teamName = p.teamId ? teams.find(t => t.id === p.teamId)?.name : '-';
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><span style="background:${colors.bg};color:${colors.text};padding:4px 8px;border-radius:4px;font-weight:bold">${p.position}</span></td>
        <td><span class="link" onclick="window.showPlayerDetail('${p.id}')">${p.name}</span></td>
        <td>${p.age}</td>
        <td><img class="flag" src="${p.countryFlag}" alt="${p.countryName}"/> ${p.countryName}</td>
        <td>${p.ovr}</td>
        <td>${p.hiddenPotentialMin}–${p.hiddenPotentialMax}</td>
        <td>€${(p.value || 0).toLocaleString('pl-PL')}</td>
        <td>${teamName}</td>
        <td><button class="btn" onclick="window.deletePlayerConfirm('${p.id}', '${p.name.replace(/'/g, "\\'")}')" style="background:#ff4d4f;color:white;border:0">✕</button></td>
      `;
      $playersTable.appendChild(tr);
    });
  }

  async function deletePlayer(id){
    players = players.filter(p=>p.id!==id);
    await window.db.savePlayers(players);
    dbStatus.textContent = '✅ Zawodnik usunięty';
    renderList();
    updateStats();
  }

  function showPlayer(id){
    const p = players.find(x=>x.id===id);
    if(!p) return;
    
    showTab('player-view');
    el('pv-name').textContent = p.name;
    el('pv-age').textContent = p.age;
    el('pv-position').textContent = POSITION_NAMES[p.position] + ' (' + p.position + ')';
    el('pv-potential').textContent = p.hiddenPotentialMin + '–' + p.hiddenPotentialMax;
    el('pv-country').innerHTML = `<img class="flag" src="${p.countryFlag}"/> ${p.countryName}`;
    el('pv-ovr').textContent = p.ovr;
    el('pv-value').textContent = `€${(p.value || 0).toLocaleString('pl-PL')}`;
    el('pv-height').textContent = p.height + ' cm';
    el('pv-growth').textContent = p.growth.toFixed(2) + '/1.0';
    
    const teamName = p.teamId ? teams.find(t => t.id === p.teamId)?.name : 'Brak';
    el('pv-team').textContent = teamName;
    
    // Team assignment
    const teamSelect = el('pv-team-select');
    teamSelect.innerHTML = '<option value="">Brak drużyny</option>';
    teams.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t.id;
      opt.textContent = t.name;
      if (p.teamId === t.id) opt.selected = true;
      teamSelect.appendChild(opt);
    });
    
    el('pv-assign-team').onclick = async () => {
      p.teamId = teamSelect.value || null;
      await window.db.savePlayers(players);
      dbStatus.textContent = '✅ Zawodnik przypisany';
      showPlayer(id);
    };
    
    // Skills by category
    const grid = el('pv-skills-grid');
    grid.innerHTML='';
    
    const categories = SKILL_CATEGORIES[p.position];
    const importance = CATEGORY_IMPORTANCE[p.position];
    
    for (let category in categories) {
      const skills = categories[category];
      const imp = importance[category];
      const categoryColors = CATEGORY_COLORS[category];
      
      const col = document.createElement('div');
      col.className='skills-column';
      col.style.color = '#e6eef8';
      col.style.borderRadius = '8px';
      col.style.padding = '12px';
      col.style.border = '1px solid rgba(255,255,255,0.05)';
      col.style.background = 'rgba(255,255,255,0.02)';
      
      const h = document.createElement('h4');
      h.textContent = category;
      h.style.color = categoryColors.bg;
      h.style.margin = '0 0 12px 0';
      col.appendChild(h);
      
      skills.forEach(k=>{
        if(p.skills[k]!==undefined){
          const row = document.createElement('div');
          row.className='skill-row';
          const pct = (p.skills[k]/99)*100;
          row.innerHTML = `<div class="skill-name">${k}</div><div class="skill-bar"><div class="skill-fill" style="width:${pct}%;background:${categoryColors.bg};opacity:0.8"></div></div><div class="skill-val">${p.skills[k]}</div>`;
          row.style.color = '#e6eef8';
          col.appendChild(row);
        }
      });
      grid.appendChild(col);
    }
  }

  function sortBy(k){
    if(lastSort.k===k) lastSort.dir *= -1;
    else { lastSort.k=k; lastSort.dir=1; }
    players.sort((a,b)=>{
      let va=getSortValue(a,k);
      let vb=getSortValue(b,k);
      if(typeof va==='string') return lastSort.dir * va.localeCompare(vb);
      return lastSort.dir * (va-vb);
    });
    renderList();
  }

  function getSortValue(p,k){
    if(k==='name') return p.name;
    if(k==='age') return p.age;
    if(k==='country') return p.countryName;
    if(k==='position') return p.position;
    if(k==='ovr') return p.ovr;
    if(k==='potential') return p.realPotential;
    if(k==='value') return p.value || 0;
    return p.skills[k] || 0;
  }

  window.showPlayerDetail = showPlayer;
  window.showTeamDetail = showTeamDetail;
  window.deletePlayerConfirm = (id, name) => {
    if(confirm(`Usuń zawodnika ${name}?`)) deletePlayer(id);
  };
  window.deleteTeamConfirm = (id, name) => {
    if(confirm(`Usuń drużynę ${name}?`)) deleteTeam(id);
  };
  window.removePlayerFromTeam = removePlayerFromTeam;
  window.updateTeamBudget = updateTeamBudget;

  init();

})();
