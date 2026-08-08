// app.js - complete player generation system with position-based skills
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

  // Position-based skill weights - what each position emphasizes
  const SKILL_WEIGHTS = {
    'ST': {
      'Strzały': 10,
      'Główki': 10,
      'Siła': 9,
      'Szybkość': 9,
      'Kondycja': 9,
      'Drybling': 8,
      'Przyspieszenie': 8,
      'Podanie': 7,
      'Wizja': 7,
      'Odbiór': 3,
      'Krycie': 3
    },
    'CM': {
      'Podanie': 10,
      'Wizja': 10,
      'Kondycja': 9,
      'Szybkość': 9,
      'Drybling': 9,
      'Odbiór': 8,
      'Przyspieszenie': 8,
      'Strzały': 8,
      'Krycie': 6,
      'Główki': 6,
      'Siła': 6
    },
    'CB': {
      'Odbiór': 10,
      'Krycie': 10,
      'Siła': 9,
      'Szybkość': 9,
      'Główki': 9,
      'Podanie': 8,
      'Przyspieszenie': 8,
      'Wizja': 8,
      'Strzały': 5,
      'Drybling': 5,
      'Kondycja': 5
    },
    'GK': {
      'Sam na sam': 100,
      'Obrona strzałów': 100,
      'Łapanie': 100
    }
  };

  // Position-based skill tiers (for display purposes)
  const POSITION_SKILLS = {
    'ST': {
      tier1: ['Strzały', 'Główki'],
      tier2: ['Siła', 'Szybkość', 'Kondycja'],
      tier3: ['Drybling', 'Przyspieszenie'],
      tier4: ['Podanie', 'Wizja'],
      tier5: ['Odbiór', 'Krycie']
    },
    'CM': {
      tier1: ['Podanie', 'Wizja'],
      tier2: ['Kondycja', 'Szybkość', 'Drybling'],
      tier3: ['Odbiór', 'Przyspieszenie', 'Strzały'],
      tier4: ['Krycie', 'Główki', 'Siła']
    },
    'CB': {
      tier1: ['Odbiór', 'Krycie'],
      tier2: ['Siła', 'Szybkość', 'Główki'],
      tier3: ['Podanie', 'Przyspieszenie', 'Wizja'],
      tier4: ['Strzały', 'Drybling', 'Kondycja']
    },
    'GK': {
      tier1: ['Sam na sam', 'Obrona strzałów', 'Łapanie']
    }
  };

  // Height generation weights by position (cm ranges)
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
  const $table = document.querySelector('#players-table tbody');
  const filterCountry = el('filter-country');
  const searchInput = el('search');
  const dbStatus = el('db-status');

  let players = [];
  let lastSort = { k: 'name', dir: 1 };

  async function init(){
    try {
      dbStatus.textContent = '⏳ Inicjalizacja bazy danych...';
      await window.db.initSupabase();
      dbStatus.textContent = '✅ Baza danych połączona';
      
      players = await window.db.loadPlayers();
      console.log('Loaded players:', players.length);
      
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

    document.getElementById('tab-dashboard').addEventListener('click', ()=>showTab('dashboard'));
    document.getElementById('tab-players').addEventListener('click', ()=>showTab('players'));
    document.getElementById('generate-player').addEventListener('click', generateAndSave);
    document.getElementById('back-to-list').addEventListener('click', ()=>{showTab('players')});

    document.querySelectorAll('#players-table thead th[data-sort]').forEach(th=>th.addEventListener('click', ()=>{sortBy(th.dataset.sort)}));
    filterCountry.addEventListener('change', renderList);
    searchInput.addEventListener('input', renderList);

    renderList();
  }

  function showTab(name){ 
    document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active')); 
    const tabEl = document.getElementById('tab-'+name);
    if(tabEl) tabEl.classList.add('active'); 
    document.querySelectorAll('.view').forEach(v=>v.classList.add('hidden')); 
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
    
    // Initialize all skills to 0
    for (let skill in weights) {
      skills[skill] = 0;
    }

    // Calculate total points to distribute
    const multiplier = position === 'GK' ? 3 : 11;
    const totalPoints = ovr * multiplier;

    // Build a weighted array: if skill has weight 10, add it 10 times
    const weightedSkills = [];
    for (let skill in weights) {
      const weight = weights[skill];
      for (let i = 0; i < weight; i++) {
        weightedSkills.push(skill);
      }
    }

    // Distribute points: randomly pick from weighted array
    for (let i = 0; i < totalPoints; i++) {
      const randomIndex = Math.floor(Math.random() * weightedSkills.length);
      const selectedSkill = weightedSkills[randomIndex];
      skills[selectedSkill]++;
    }

    return skills;
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

    const player = {
      id, name, age, position, country: country.code, countryName: country.name,
      countryFlag: country.flag, countryColor: country.color,
      height, ovr, realPotential, hiddenPotentialMin: hidden.min, hiddenPotentialMax: hidden.max,
      growth, skills, created: Date.now()
    };
    
    return player;
  }

  async function generateAndSave(){
    const p = generatePlayer();
    players.push(p);
    await window.db.savePlayers(players);
    dbStatus.textContent = '✅ Zawodnik zapisany';
    renderList();
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

  function avatarUrl(p){
    const seed = encodeURIComponent((p.name || p.id));
    return `https://avatars.dicebear.com/api/avataaars/${seed}.svg?eyes=${p.ovr>60? 'happy':'default'}&mouth=${p.ovr>50? 'smile':'serious'}&top[]=shortWaved&accessories[]=none&background=%23ffffff00`;
  }

  function renderList(){
    if(!$table) return;
    $table.innerHTML='';
    const countryFilter = filterCountry.value;
    const q = searchInput.value.trim().toLowerCase();
    let list = players.slice();
    if(countryFilter) list = list.filter(p=>p.country===countryFilter);
    if(q) list = list.filter(p=>p.name.toLowerCase().includes(q));
    list.forEach(p=>{
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><div class="player-row"><img class="avatar small" src="${avatarUrl(p)}" alt="avatar" style="border-radius:8px;width:40px;height:40px;object-fit:cover"/><div><span class="link" onclick="window.showPlayerDetail('${p.id}')">${p.name}</span></div></div></td>
        <td>${p.age}</td>
        <td><img class="flag" src="${p.countryFlag}" alt="${p.countryName}"/> ${p.countryName}</td>
        <td><strong>${p.position}</strong></td>
        <td>${p.ovr}</td>
        <td>${p.hiddenPotentialMin}–${p.hiddenPotentialMax}</td>
        <td>${p.skills['Odbiór'] || '-'}</td>
        <td>${p.skills['Krycie'] || '-'}</td>
        <td>${p.skills['Podanie'] || '-'}</td>
        <td>${p.skills['Wizja'] || '-'}</td>
        <td>${p.skills['Szybkość'] || '-'}</td>
        <td>${p.skills['Drybling'] || '-'}</td>
        <td>${p.skills['Strzały'] || '-'}</td>
        <td>${p.skills['Główki'] || '-'}</td>
        <td>${p.skills['Siła'] || '-'}</td>
        <td>${p.skills['Przyspieszenie'] || '-'}</td>
        <td>${p.skills['Kondycja'] || '-'}</td>
        <td><button class="btn" onclick="window.deletePlayerConfirm('${p.id}', '${p.name.replace(/'/g, "\\'")}')" style="background:#ff4d4f;color:white;border:0">✕</button></td>
      `;
      $table.appendChild(tr);
    });
  }

  async function deletePlayer(id){
    players = players.filter(p=>p.id!==id);
    await window.db.savePlayers(players);
    dbStatus.textContent = '✅ Zawodnik usunięty';
    renderList();
  }

  function showPlayer(id){
    const p = players.find(x=>x.id===id);
    if(!p) {
      console.error('Player not found:', id);
      return;
    }
    showTab('player-view');
    el('pv-name').textContent = p.name;
    el('pv-age').textContent = p.age;
    el('pv-position').textContent = POSITION_NAMES[p.position] + ' (' + p.position + ')';
    el('pv-potential').textContent = p.hiddenPotentialMin + '–' + p.hiddenPotentialMax + ' (ukryty potencjał)';
    el('pv-country').innerHTML = `<img class="flag" src="${p.countryFlag}" alt="${p.countryName}"/> ${p.countryName}`;
    el('pv-avatar-img').src = avatarUrl(p);
    el('pv-ovr').textContent = p.ovr;
    el('pv-growth').textContent = p.growth.toFixed(2) + '/1.0';
    const grid = el('pv-skills-grid');
    if(!grid) return;
    grid.innerHTML='';

    const skillTiers = POSITION_SKILLS[p.position];
    
    if (p.position === 'GK') {
      const tierSkills = skillTiers.tier1 || [];
      if (tierSkills.length > 0) {
        grid.appendChild(renderSkillsColumn('Umiejętności bramkarza', tierSkills, p));
      }
      return;
    }

    const tierOrder = [
      { name: 'tier1', label: '★★★ Top Tier' },
      { name: 'tier2', label: '★★ Ważne' },
      { name: 'tier3', label: '★ Przydatne' },
      { name: 'tier4', label: 'Niche' },
      { name: 'tier5', label: 'Pozostałe' }
    ];

    tierOrder.forEach(tier => {
      const tierSkills = skillTiers[tier.name] || [];
      if (tierSkills.length > 0) {
        grid.appendChild(renderSkillsColumn(tier.label, tierSkills, p));
      }
    });
  }

  function renderSkillsColumn(title, keys, p){
    const col = document.createElement('div');
    col.className='skills-column';
    const h = document.createElement('h4');
    h.textContent = title;
    col.appendChild(h);
    keys.forEach(k=>{
      if(p.skills[k]!==undefined){
        const row = document.createElement('div');
        row.className='skill-row';
        row.innerHTML = `<div class="skill-name">${k}</div><div class="skill-bar"><div class="skill-fill ${colorClassFor(p.skills[k]||0)}" style="width:${(p.skills[k]/99)*100}%"></div></div><div class="skill-val">${p.skills[k]}</div>`;
        col.appendChild(row);
      }
    });
    return col;
  }

  function colorClassFor(val){
    if(val>=91) return 'color-veryhigh';
    if(val>=76) return 'color-high-dark';
    if(val>=61) return 'color-high';
    if(val>=46) return 'color-mid';
    if(val>=31) return 'color-low';
    if(val>=16) return 'color-lower';
    return 'color-bottom';
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
    return p.skills[k] || 0;
  }

  window.showPlayerDetail = showPlayer;
  window.deletePlayerConfirm = (id, name) => {
    if(confirm(`Usuń zawodnika ${name}?`)) {
      deletePlayer(id);
    }
  };

  init();

})();
