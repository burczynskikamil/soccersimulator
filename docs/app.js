// app.js - with positions, position-based skills, hidden potential, and position-based OVR
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

  // Position-based skill importance (weights for OVR calculation)
  const POSITION_WEIGHTS = {
    'ST': {
      'Strzały': 10,
      'Główki': 10,
      'Siła': 8,
      'Szybkość': 8,
      'Przyspieszenie': 8,
      'Drybling': 6,
      'Kondycja': 6,
      'Podanie': 4,
      'Wizja': 4,
      'Odbiór': 1,
      'Krycie': 1
    },
    'CM': {
      'Podanie': 10,
      'Wizja': 10,
      'Kondycja': 8,
      'Szybkość': 8,
      'Drybling': 8,
      'Odbiór': 6,
      'Strzały': 4,
      'Krycie': 3,
      'Przyspieszenie': 3,
      'Główki': 2,
      'Siła': 2
    },
    'CB': {
      'Odbiór': 10,
      'Krycie': 10,
      'Siła': 10,
      'Główki': 8,
      'Szybkość': 8,
      'Podanie': 6,
      'Przyspieszenie': 6,
      'Wizja': 3,
      'Strzały': 2,
      'Drybling': 2,
      'Kondycja': 2
    },
    'GK': {
      'Obrona strzałów': 10,
      'Sam na sam': 10,
      'Stałe fragmenty gry': 8,
      'Podanie': 6,
      'Wizja': 6,
      'Szybkość': 5,
      'Siła': 5,
      'Przyspieszenie': 5,
      'Kondycja': 4
    }
  };

  // Position-specific growth rates
  const GROWTH_RATES = {
    'ST': { min: 0.6, max: 0.8 },
    'CM': { min: 0.5, max: 0.7 },
    'CB': { min: 0.5, max: 0.7 },
    'GK': { min: 0.7, max: 0.9 }
  };

  const SKILLS_BY_POSITION = {
    'ST': ['Strzały','Główki','Siła','Szybkość','Przyspieszenie','Drybling','Kondycja','Podanie','Wizja','Odbiór','Krycie'],
    'CM': ['Podanie','Wizja','Kondycja','Szybkość','Drybling','Odbiór','Strzały','Krycie','Przyspieszenie','Główki','Siła'],
    'CB': ['Odbiór','Krycie','Siła','Główki','Szybkość','Podanie','Przyspieszenie','Wizja','Strzały','Drybling','Kondycja'],
    'GK': ['Obrona strzałów','Sam na sam','Stałe fragmenty gry','Podanie','Wizja','Szybkość','Siła','Przyspieszenie','Kondycja']
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
      
      if(players.length === 0) {
        dbStatus.textContent = '📝 Generowanie zawodników...';
        for(let i=0; i<8; i++) {
          players.push(generatePlayer());
        }
        await window.db.savePlayers(players);
        dbStatus.textContent = '✅ Zawodnicy zapisani';
      }
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

  function generatePlayer(){
    const age = 11; 
    const country = sample(COUNTRIES); 
    const position = sample(POSITIONS);
    const potential = samplePotential(); 
    const id = uid(); 
    const name = generateUniqueName(country.code, players);
    const skills = {}; 
    const skillsList = SKILLS_BY_POSITION[position];
    
    skillsList.forEach(s => {
      skills[s] = initialSkillForPotential(potential, position, s);
    });

    const ovr = calculatePositionalOVR(skills, position);
    const growth = generateGrowth(position);

    return { 
      id, name, age, position, 
      country: country.code, countryName: country.name, countryFlag: country.flag, countryColor: country.color, 
      potential, realPotential: potential, // realPotential is hidden
      skills, ovr, growth, created: Date.now() 
    };
  }

  function generateGrowth(position) {
    const rates = GROWTH_RATES[position];
    return randInt(Math.round(rates.min * 10), Math.round(rates.max * 10)) / 10;
  }

  async function generateAndSave(){
    const p = generatePlayer(); 
    players.push(p); 
    await window.db.savePlayers(players);
    dbStatus.textContent = '✅ Zawodnik zapisany';
    renderList();
  }

  function sample(x){ return x[Math.floor(Math.random()*x.length)]; }

  function samplePotential(){ 
    if(Math.random()<0.01) return 99; 
    let u=0,v=0; 
    while(u===0) u=Math.random(); 
    while(v===0) v=Math.random(); 
    let num = Math.sqrt(-2.0*Math.log(u))*Math.cos(2*Math.PI*v); 
    num = Math.max(-3, Math.min(3, num)); 
    return Math.round(75 + num * 8); 
  }

  function initialSkillForPotential(potential, position, skill){ 
    const maxStart = 99; 
    const minBase = Math.max(1, Math.round(potential * 0.2 - 12)); 
    const maxBase = Math.min(maxStart, Math.round(potential * 0.7 + 6)); 
    const val = randInt(minBase, maxBase);
    return Math.max(1, Math.min(99, val)); 
  }
  
  function randInt(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }

  function calculatePositionalOVR(skills, position) {
    const weights = POSITION_WEIGHTS[position];
    if (!weights) return 50;

    let totalWeight = 0;
    let weightedSum = 0;

    Object.keys(weights).forEach(skill => {
      if (skills[skill] !== undefined) {
        const weight = weights[skill];
        weightedSum += skills[skill] * weight;
        totalWeight += weight;
      }
    });

    if (totalWeight === 0) return 50;
    return Math.min(99, Math.round(weightedSum / totalWeight));
  }

  function computeHiddenRange(realPotential, age, ovr){ 
    const ageFactor = Math.max(0, age - 11); 
    const spread = Math.max(6, 18 - ageFactor * 1.5); 
    let low = Math.max(1, realPotential - Math.round(spread + ageFactor)); 
    let high = Math.min(99, realPotential + Math.round(Math.max(0, 5 - ageFactor))); 
    return {low, high}; 
  }

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
        <td>${computeHiddenRange(p.realPotential, p.age, p.ovr).low}–${computeHiddenRange(p.realPotential, p.age, p.ovr).high}</td>
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
    console.log('Showing player:', p);
    showTab('player-view'); 
    el('pv-name').textContent = p.name; 
    el('pv-age').textContent = p.age; 
    el('pv-position').textContent = POSITION_NAMES[p.position] + ' (' + p.position + ')';
    const hidden = computeHiddenRange(p.realPotential, p.age, p.ovr);
    el('pv-potential').textContent = hidden.low + '–' + hidden.high + ' (ukryty potencjał)';
    el('pv-country').innerHTML = `<img class="flag" src="${p.countryFlag}" alt="${p.countryName}"/> ${p.countryName}`;
    el('pv-avatar-img').src = avatarUrl(p);
    el('pv-ovr').textContent = p.ovr;
    el('pv-growth').textContent = (p.growth || 0.5).toFixed(1) + '/10';
    const grid = el('pv-skills-grid'); 
    if(!grid) {
      console.error('Skills grid not found');
      return;
    }
    grid.innerHTML='';
    
    // Render skills organized by position type
    const skillsList = SKILLS_BY_POSITION[p.position];
    const topTier = skillsList.slice(0, 2);
    const secondTier = skillsList.slice(2, 5);
    const thirdTier = skillsList.slice(5, 8);
    const lowerTier = skillsList.slice(8);

    if (topTier.length > 0) grid.appendChild(renderSkillsColumn('★★★ Top Tier', topTier, p));
    if (secondTier.length > 0) grid.appendChild(renderSkillsColumn('★★ Ważne', secondTier, p));
    if (thirdTier.length > 0) grid.appendChild(renderSkillsColumn('★ Przydatne', thirdTier, p));
    if (lowerTier.length > 0) grid.appendChild(renderSkillsColumn('Pozostałe', lowerTier, p));
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

  // Expose functions globally for onclick handlers
  window.showPlayerDetail = showPlayer;
  window.deletePlayerConfirm = (id, name) => {
    if(confirm(`Usuń zawodnika ${name}?`)) {
      deletePlayer(id);
    }
  };

  init();

})();
