// app.js - complete player and team management system
(() => {
  const COUNTRIES = [
    {code:'PL',name:'Polska',flag:'https://flagsapi.com/PL/flat/64.png',color:'#ff4d4f'},
    {code:'NL',name:'Holandia',flag:'https://flagsapi.com/NL/flat/64.png',color:'#ff7a18'},
    {code:'GB',name:'Anglia',flag:'https://flagsapi.com/GB/flat/64.png',color:'#3f7fff'},
    {code:'ES',name:'Hiszpania',flag:'https://flagsapi.com/ES/flat/64.png',color:'#ffb300'},
    {code:'DE',name:'Niemcy',flag:'https://flagsapi.com/DE/flat/64.png',color:'#222831'},
    {code:'PT',name:'Portugalia',flag:'https://flagsapi.com/PT/flat/64.png',color:'#2db34a'},
    {code:'IT',name:'Włochy',flag:'https://flagsapi.com/IT/flat/64.png',color:'#009246'},
    {code:'FR',name:'Francja',flag:'https://flagsapi.com/FR/flat/64.png',color:'#002395'},
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
    'CM': { bg: '#52c41a', text: '#fff' },
    'CB': { bg: '#faad14', text: '#000' },
    'GK': { bg: '#1890ff', text: '#fff' }
  };

  const SKILL_CATEGORIES = {
    'ST': {
      'Strzelanie': ['Strzały', 'Pozycjonowanie', 'Precyzja', 'Główki'],
      'Bieganie': ['Szybkość', 'Przyspieszenie', 'Kondycja'],
      'Technika': ['Drybling', 'Kontrola', 'Równowaga'],
      'Taktyka': ['Wizja', 'Czytelność gry', 'Podanie']
    },
    'CM': {
      'Podawanie': ['Podanie', 'Wizja', 'Długie podania'],
      'Bieganie': ['Szybkość', 'Przyspieszenie', 'Kondycja', 'Wytrzymałość'],
      'Technika': ['Drybling', 'Kontrola', 'Równowaga'],
      'Obrona': ['Przejmowanie', 'Krycie', 'Odbijanie']
    },
    'CB': {
      'Obrona': ['Odbiór', 'Krycie', 'Siła', 'Główki'],
      'Bieganie': ['Szybkość', 'Przyspieszenie', 'Kondycja'],
      'Technika': ['Kontrola', 'Równowaga', 'Drybling'],
      'Taktyka': ['Wizja', 'Pozycjonowanie', 'Czytanie gry']
    },
    'GK': {
      'Bramkarskie': ['Sam na sam', 'Obrona strzałów', 'Łapanie', 'Rzuty'],
      'Bieganie': ['Szybkość', 'Przyspieszenie'],
      'Reakcja': ['Refleks', 'Zwinność', 'Rozpęd'],
      'Kolaboracja': ['Gra nogami', 'Wyrzuty', 'Zagrania']
    }
  };

  const CATEGORY_IMPORTANCE = {
    'ST': { 'Strzelanie': 0.4, 'Bieganie': 0.3, 'Technika': 0.2, 'Taktyka': 0.1 },
    'CM': { 'Podawanie': 0.3, 'Bieganie': 0.3, 'Technika': 0.2, 'Obrona': 0.2 },
    'CB': { 'Obrona': 0.4, 'Bieganie': 0.25, 'Technika': 0.2, 'Taktyka': 0.15 },
    'GK': { 'Bramkarskie': 0.5, 'Bieganie': 0.15, 'Reakcja': 0.25, 'Kolaboracja': 0.1 }
  };

  const CATEGORY_COLORS = {
    'Strzelanie': { bg: '#ff4d4f', text: '#fff' },
    'Podawanie': { bg: '#1890ff', text: '#fff' },
    'Obrona': { bg: '#52c41a', text: '#fff' },
    'Bieganie': { bg: '#faad14', text: '#000' },
    'Technika': { bg: '#722ed1', text: '#fff' },
    'Taktyka': { bg: '#13c2c2', text: '#fff' },
    'Bramkarskie': { bg: '#faad14', text: '#000' },
    'Reakcja': { bg: '#ff7a45', text: '#fff' },
    'Kolaboracja': { bg: '#f5222d', text: '#fff' }
  };

  const SKILL_DESCRIPTIONS = {
    'ST': {
      'Strzelanie': ['Strzały', 'Pozycjonowanie', 'Precyzja', 'Główki'],
      'Bieganie': ['Szybkość', 'Przyspieszenie', 'Kondycja'],
      'Technika': ['Drybling', 'Kontrola', 'Równowaga'],
      'Taktyka': ['Wizja', 'Czytelność gry', 'Podanie']
    },
    'CM': {
      'Podawanie': ['Podanie', 'Wizja', 'Długie podania'],
      'Bieganie': ['Szybkość', 'Przyspieszenie', 'Kondycja', 'Wytrzymałość'],
      'Technika': ['Drybling', 'Kontrola', 'Równowaga'],
      'Obrona': ['Przejmowanie', 'Krycie', 'Odbijanie']
    },
    'CB': {
      'Obrona': ['Odbiór', 'Krycie', 'Siła', 'Główki'],
      'Bieganie': ['Szybkość', 'Przyspieszenie', 'Kondycja'],
      'Technika': ['Kontrola', 'Równowaga', 'Drybling'],
      'Taktyka': ['Wizja', 'Pozycjonowanie', 'Czytanie gry']
    },
    'GK': {
      'Bramkarskie': ['Sam na sam', 'Obrona strzałów', 'Łapanie', 'Rzuty'],
      'Bieganie': ['Szybkość', 'Przyspieszenie'],
      'Reakcja': ['Refleks', 'Zwinność', 'Rozpęd'],
      'Kolaboracja': ['Gra nogami', 'Wyrzuty', 'Zagrania']
    }
  };

  const HEIGHT_RANGES = {
    'GK': { min: 185, max: 195, avg: 190 },
    'CB': { min: 182, max: 193, avg: 188 },
    'ST': { min: 175, max: 190, avg: 183 },
    'CM': { min: 170, max: 185, avg: 178 }
  };

  const NAME_POOL = {
    PL: {first:['Jan','Kacper','Jakub','Mateusz','Piotr','Filip','Michał','Oskar','Szymon','Kamil','Łukasz','Andrzej','Marcin','Grzegorz','Tomasz','Paweł','Rafał','Dariusz','Krzysztof','Arkadiusz','Zbigniew','Witold','Tadeusz','Marek','Bartosz','Cezary','Damian','Wojciech','Igor','Konrad'],last:['Nowak','Kowalski','Wiśniewski','Wójcik','Kubiak','Kaczmarek','Kamiński','Lewandowski','Zieliński','Sikora','Pawlak','Zaorski','Adamczyk','Białek','Cieślak','Dobrzyński','Ewczak','Fabisz','Gajda','Hałas','Imiołowski','Jabłoński','Kobylak','Lisowski','Majda','Nasiński','Olechowski','Pazura','Rabczewski','Szulc']},
    NL: {first:['Daan','Luca','Bram','Finn','Sem','Tijn','Luuk','Sven','Milan','Davy','Tom','Rutger','Joost','Jeroen','Michiel','Pieter','Stefan','Wouter','Ylian','Bas','Cas','Danny','Edwin','Frank','Guido','Henri','Jan','Kees','Lodewijk','Maarten'],last:['de Jong','Jansen','van Dijk','Bakker','Visser','Smit','de Vries','Mulder','Bos','Kuipers','van den Berg','van der Linden','Vermeulen','Hermans','Janssen','Kempes','Larsson','Mertens','Nijhuis','Olsen','Peters','Quint','Rademakers','Snoeks','Theunisse','Uyttendaele','van Velzeboer','Wagemakers','Xander','Zagen']},
    GB: {first:['Oliver','Harry','George','Noah','Jack','Charlie','Jacob','Alfie','Oscar','William','James','Benjamin','Ethan','Fredrick','Albert','Thomas','Arthur','Samuel','Edward','Mason','Lucas','Henry','Alexander','Liam','Jayden','Logan','Aiden','Matthew','Jackson','David'],last:['Smith','Brown','Taylor','Wilson','Evans','Johnson','Robinson','Walker','Wright','Green','Hall','Lewis','Harris','Clarke','Lee','Martin','Patel','Allen','Young','Hernandez','King','Wright','Lopez','Hill','Scott','Green','Adams','Nelson','Baker','Hall']},
    ES: {first:['Mateo','Hugo','Martín','Daniel','Pablo','Alejandro','Lucas','Adrián','Diego','Marco','Ignacio','Fernando','Javier','Manuel','Óscar','Antonio','Raúl','Sergio','Víctor','Enrique','Gonzalo','Guillermo','Humberto','Isidro','Joaquín','Karim','Leonardo','Miguel','Norberto','Oteo'],last:['García','Martínez','López','Sánchez','Pérez','González','Rodríguez','Fernández','Ruiz','Morales','Jiménez','Guzmán','Romero','Herrera','Reyes','Vega','Flores','Rivera','Campos','Aguirre','Bravo','Carrillo','Delgado','Estrada','Fuentes','Gómez','Huerta','Iglesias','Juárez','Landa']},
    DE: {first:['Lukas','Leon','Finn','Jonas','Elias','Noah','Paul','Ben','Luis','Felix','Maximilian','Alexander','Florian','Fabian','Tobias','Sebastian','Julian','Christian','Daniel','Michael','Robert','Wolfgang','Helmut','Klaus','Jürgen','Konrad','Lothar','Manfred','Norbert','Ottmar'],last:['Müller','Schmidt','Schneider','Fischer','Weber','Meyer','Wagner','Becker','Hoffmann','Koch','Schulz','Richter','Neumann','Huber','Friedrich','Zimmermann','Schwarz','Herrmann','Keller','Krämer','Löscher','Mühlbauer','Nägel','Otto','Pflüger','Quast','Richter','Sacher','Theis','Ueckert']},
    PT: {first:['João','Miguel','Rodrigo','Martim','Gonçalo','Tomás','Afonso','Diogo','Francisco','Duarte','António','Bartolomeu','Cristóvão','Damião','Estêvão','Fausto','Gregório','Hilário','Isidoro','Jácomo','Leandro','Mateus','Narciso','Octavio','Paulo','Quirino','Raimundo','Silvio','Teófilo','Urbano'],last:['Silva','Santos','Ferreira','Pereira','Oliveira','Costa','Rodrigues','Martins','Lopes','Gomes','Teixeira','Sousa','Alves','Ribeiro','Barbosa','Carvalho','Dias','Esteves','Fonseca','Goulart','Henriques','Iglésias','Jardim','Leal','Macedo','Neves','Ornelas','Pacheco','Quaresma','Ribeiro']},
    IT: {first:['Matteo','Andrea','Luca','Marco','Davide','Riccardo','Giovanni','Alessandro','Antonio','Michele','Lorenzo','Giuseppe','Francesco','Claudio','Domenico','Emilio','Fabio','Gaetano','Iacopo','Jacopo','Karim','Leonardo','Maurizio','Niccolò','Ottavio','Paolo','Quirino','Raffaele','Salvatore','Teodoro'],last:['Rossi','Russo','Ferrari','Esposito','Bianchi','Colombo','Rizzo','Marino','Greco','Bruno','Gallo','Conti','De Luca','Mancini','Riccardi','Costa','Giordano','Barbieri','Lombardi','Moretti','Orsini','Palmieri','Quirino','Raggi','Sala','Testa','Uzzo','Valli','Zanetti']},
    FR: {first:['Antoine','Matthieu','Quentin','Romain','Samuel','Théo','Valentin','Xavier','Yannick','Zacharie','Adrien','Bertrand','Christophe','Denis','Étienne','Fabrice','Gaston','Henri','Ignace','Jérôme','Laurent','Maxime','Nicolas','Olivier','Philippe','Raphaël','Stéphane','Thierry','Urbain','Vincent'],last:['Martin','Bernard','Thomas','Robert','Richard','Petit','Durand','Leroy','Moreau','Simon','Laurent','Lefebvre','Michel','Garcia','David','Bertrand','Roux','Vincent','Fournier','Morel','Gibert','Fournier','Guibert','Gérard','Garnier','Guillot','Girard','Granger','Guerrier','Garraud']},
    AR: {first:['Matías','Santiago','Juan','Martín','Facundo','Bruno','Ignacio','Lucas','Agustín','Tomás','Andrés','Ariel','Bernardo','Claudio','Damián','Ezequiel','Fabián','Gregorio','Hernán','Isidro','Julio','Karim','Leonidas','Manuel','Néstor','Óscar','Pablo','Quintín','Ramiro','Silvio'],last:['González','Rodríguez','Gómez','Fernández','López','Sosa','Pérez','Romero','Díaz','García','Hernández','Martínez','Álvarez','Benítez','Córdoba','Domínguez','Espinoza','Fajardo','Gallardo','Herrera','Iglesias','Jiménez','Kaplan','Ledesma','Montes','Núñez','Otero','Ponce','Quintero','Riquelme']},
    BR: {first:['Miguel','Arthur','Davi','Heitor','Bernardo','Gabriel','Lucas','Enzo','Gustavo','Pedro','Alexandre','Antônio','Benedito','Carlos','Diogo','Eduardo','Fábio','Geovani','Henrique','Inácio','Joaquim','Kléber','Leonardo','Maurício','Norberto','Otaviano','Paulo','Quirino','Robério','Sergio'],last:['Silva','Santos','Oliveira','Souza','Ferreira','Pereira','Gomes','Ribeiro','Almeida','Martins','Costa','Sousa','Barbosa','Teixeira','Dias','Carvalho','Moraes','Campos','Rocha','Lopes','Amaral','Andrade','Borges','Cardoso','Dantas','Escobar','Fonseca','Guzmán','Henriques','Ibáñez']},
    CN: {first:['Wei','Hao','Lei','Jie','Ming','Jun','Tao','Huan','Qiang','Liang','Ang','Ben','Cang','Deng','Fang','Gang','Hui','Jian','Kang','Lun','Meng','Ning','Ou','Peng','Quan','Rui','Sheng','Tao','Ung','Vong'],last:['Wang','Li','Zhang','Liu','Chen','Yang','Zhao','Huang','Zhou','Xu','Sun','Ma','Zhu','Lin','Guo','He','Gao','Zheng','Luo','Cao','Deng','Cao','Cao','Cai','Bian','Bian','Cao','Cai','Cao','Cai']},
    ZA: {first:['Liam','Noah','Ethan','Logan','Daniel','Jayden','Ryan','Tyler','Jordan','Kyle','Amahle','Bongani','Cebile','Dlamini','Enoch','Fezile','Gcinile','Hloniphile','Indlulamithi','Jabulani','Kamali','Lerato','Mandla','Nhlanhla','Obi','Phakamani','Quincy','Rethabile','Sizwe','Thabo'],last:['Nkosi','Dlamini','Nkuna','Mthethwa','van der Merwe','Botha','Smith','Mabuza','Mokwena','Khumalo','Mthembu','Nkomo','Ndlela','Khanyi','Zikalala','Zuma','Mazibuko','Nyathi','Majola','Lamola','Mbalula','Dike','Malinga','Nzuza','Olwale','Petje','Radebe','Sithole','Thabane','Umesha']},
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
    const rand = Math.random();
    if (rand < 0.40) {
      return randInt(30, 50);
    } else if (rand < 0.95) {
      return randInt(51, 80);
    } else {
      return randInt(81, 99);
    }
  }

  function generateOVR(potential) {
    const ratio = potential / 99;
    const minOVR = 20;
    const maxOVR = 60;
    const baseOVR = Math.round(minOVR + ratio * (maxOVR - minOVR));
    const variance = randInt(-3, 3);
    return Math.max(minOVR, Math.min(maxOVR, baseOVR + variance));
  }

  function generateHiddenPotentialRange(realPotential) {
    const variance = randInt(3, 7);
    return {
      min: Math.max(30, realPotential - variance),
      max: Math.min(99, realPotential + variance)
    };
  }

  function generateSkills(ovr, position) {
    const cats = SKILL_CATEGORIES[position];
    const imp = CATEGORY_IMPORTANCE[position];
    let skills = {};
    
    for (let cat in cats) {
      const skillList = cats[cat];
      const importance = imp[cat];
      
      skillList.forEach(skill => {
        const baseSkill = Math.round(ovr * importance);
        const variance = randInt(-5, 5);
        skills[skill] = Math.max(1, Math.min(99, baseSkill + variance));
      });
    }
    
    return skills;
  }

  function generateGrowth(position) {
    const baseGrowth = {
      'ST': 0.75,
      'CM': 0.70,
      'CB': 0.65,
      'GK': 0.60
    };
    const variance = Math.random() * 0.15 - 0.075;
    return baseGrowth[position] + variance;
  }

  function calculatePlayerValue(potential, skills) {
    const skillValue = Object.values(skills).reduce((a, b) => a + b, 0);
    const avgSkill = Math.round(skillValue / Object.keys(skills).length);
    return Math.round((potential + avgSkill) * 50000);
  }

  function getPositionMultiplier(position) {
    const positionCount = players.filter(p => p.position === position).length;
    if (positionCount === 0) return 2.0;
    if (positionCount === 1) return 1.8;
    if (positionCount === 2) return 1.5;
    if (positionCount === 3) return 1.2;
    if (positionCount === 4) return 1.1;
    return 1.0;
  }

  function getDisplayValue(baseValue, position) {
    const multiplier = getPositionMultiplier(position);
    return Math.round(baseValue * multiplier);
  }

  async function generateAndSave(){
    const player = generatePlayer();
    players.push(player);
    await window.db.savePlayers(players);
    dbStatus.textContent = '✅ Zawodnik wygenerowany';
    renderList();
    updateStats();
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

  function renderTeamsList(){
    if(!$teamsTable) return;
    $teamsTable.innerHTML='';
    
    teams.forEach(team => {
      const teamPlayers = players.filter(p => p.teamId === team.id);
      const teamValue = teamPlayers.reduce((sum, p) => sum + (p.value || 0), 0);
      const logoImg = `<img src="${team.logo || 'data:image/svg+xml,<svg></svg>'}" style="width:40px;height:40px;border-radius:4px;object-fit:cover;" alt="Logo" />`;
      
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${logoImg}</td>
        <td><span class="link" onclick="window.showTeamDetail('${team.id}')">${team.name}</span></td>
        <td><img class="flag" src="${team.countryFlag}" alt="${team.countryName}"/> ${team.countryName}</td>
        <td>${teamPlayers.length}</td>
        <td>€${(team.budget || 0).toLocaleString('pl-PL')}</td>
        <td>€${teamValue.toLocaleString('pl-PL')}</td>
        <td><button class="btn" onclick="window.deleteTeamConfirm('${team.id}', '${team.name.replace(/'/g, "\\'")}')" style="background:#ff4d4f;color:white;border:0">✕</button></td>
      `;
      $teamsTable.appendChild(tr);
    });
  }

  async function saveTeam(){
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
      logo = await fileToBase64(logoInput.files[0]);
    }

    const team = {
      id: uid(),
      name,
      country,
      countryName: countryData.name,
      countryFlag: countryData.flag,
      countryColor: countryData.color,
      logo,
      budget: 5000000,
      created: Date.now()
    };

    teams.push(team);
    await window.db.saveTeams(teams);
    dbStatus.textContent = '✅ Drużyna utworzona';
    el('team-name').value = '';
    el('team-logo').value = '';
    showTab('teams');
    renderTeamsList();
    updateStats();
  }

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
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

  function renderTeamPlayersTable(teamId) {
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
        <td><button class="btn" onclick="window.removePlayerFromTeam('${p.id}')" style="background:#ff4d4f;color:white;border:0">✕</button></td>
      `;
      $table.appendChild(tr);
    });
  }

  async function updateTeamBudget() {
    const team = teams.find(t => t.id === currentTeamId);
    if (!team) return;
    
    const newBudget = parseFloat(el('team-edit-budget').value) || 0;
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
      const displayValue = getDisplayValue(p.value, p.position);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><span style="background:${colors.bg};color:${colors.text};padding:4px 8px;border-radius:4px;font-weight:bold">${p.position}</span></td>
        <td><span class="link" onclick="window.showPlayerDetail('${p.id}')">${p.name}</span></td>
        <td>${p.age}</td>
        <td><img class="flag" src="${p.countryFlag}" alt="${p.countryName}"/> ${p.countryName}</td>
        <td>${p.ovr}</td>
        <td>${p.hiddenPotentialMin}–${p.hiddenPotentialMax}</td>
        <td>€${displayValue.toLocaleString('pl-PL')}</td>
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
