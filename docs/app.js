// app.js - logika generowania zawodników, UI i persystencja
(() => {
  const COUNTRIES = [
    {code:'PL',name:'Polska',flag:'🇵🇱'},
    {code:'NL',name:'Holandia',flag:'🇳🇱'},
    {code:'GB',name:'Anglia',flag:'🏴'},
    {code:'ES',name:'Hiszpania',flag:'🇪🇸'},
    {code:'DE',name:'Niemcy',flag:'🇩🇪'},
    {code:'PT',name:'Portugalia',flag:'🇵🇹'},
    {code:'AR',name:'Argentyna',flag:'🇦🇷'},
    {code:'BR',name:'Brazylia',flag:'🇧🇷'},
    {code:'CN',name:'Chiny',flag:'🇨🇳'},
    {code:'ZA',name:'RPA',flag:'🇿🇦'},
  ];

  // przykładowe imiona i nazwiska (rozszerzalne) — staramy się unikać duplikatów
  const NAME_POOL = {
    PL: {first:['Jan','Kacper','Jakub','Mateusz','Piotr','Filip','Michał','Oskar','Szymon','Kamil'],last:['Nowak','Kowalski','Wiśniewski','Wójcik','Kubiak','Kaczmarek','Kamiński','Lewandowski','Zieliński','Sikora']},
    NL: {first:['Daan','Luca','Bram','Finn','Sem','Tijn','Luuk','Sven','Milan','Davy'],last:['de Jong','Jansen','van Dijk','Bakker','Visser','Smit','de Vries','Mulder','Bos','Kuipers']},
    GB: {first:['Oliver','Harry','George','Noah','Jack','Charlie','Jacob','Alfie','Oscar','William'],last:['Smith','Brown','Taylor','Wilson','Evans','Johnson','Robinson','Walker','Wright','Green']},
    ES: {first:['Mateo','Hugo','Martín','Daniel','Pablo','Alejandro','Lucas','Adrián','Diego','Marco'],last:['García','Martínez','López','Sánchez','Pérez','González','Rodríguez','Fernández','Ruiz','Morales']},
    DE: {first:['Lukas','Leon','Finn','Jonas','Elias','Noah','Paul','Ben','Luis','Felix'],last:['Müller','Schmidt','Schneider','Fischer','Weber','Meyer','Wagner','Becker','Hoffmann','Koch']},
    PT: {first:['João','Miguel','Rodrigo','Martim','Gonçalo','Tomás','Afonso','Diogo','Francisco','Duarte'],last:['Silva','Santos','Ferreira','Pereira','Oliveira','Costa','Rodrigues','Martins','Sousa','Gomes']},
    AR: {first:['Matías','Santiago','Juan','Martín','Facundo','Bruno','Ignacio','Lucas','Agustín','Tomás'],last:['González','Rodríguez','Gómez','Fernández','López','Sosa','Pérez','Romero','Álvarez','Ortiz']},
    BR: {first:['Miguel','Arthur','Davi','Heitor','Bernardo','Gabriel','Lucas','Enzo','Gustavo','Pedro'],last:['Silva','Santos','Oliveira','Souza','Ferreira','Pereira','Gomes','Ribeiro','Almeida','Costa']},
    CN: {first:['Wei','Hao','Lei','Jie','Ming','Jun','Tao','Huan','Qiang','Liang'],last:['Wang','Li','Zhang','Liu','Chen','Yang','Zhao','Huang','Zhou','Xu']},
    ZA: {first:['Liam','Noah','Ethan','Logan','Daniel','Jayden','Ryan','Tyler','Jordan','Kyle'],last:['Nkosi','Dlamini','Nkuna','Mthethwa','van der Merwe','Botha','Smith','Mabuza','Mokwena','Khumalo']},
  };

  const STORAGE_KEY = 'ss_players_v1';

  // podstawowe skille (pole pomocnicze), bramkarz: special
  const SKILLS = ['Odbiór','Krycie','Podanie','Wizja','Szybkość','Drybling','Strzały','Główki','Siła','Przyspieszenie','Kondycja'];
  const GK_SKILLS = ['Obrona strzałów','Łapanie','Sam na sam'];

  // UI
  const el = id => document.getElementById(id);
  const $table = document.querySelector('#players-table tbody');
  const filterCountry = el('filter-country');
  const searchInput = el('search');

  let players = loadPlayers();

  // init
  function init(){
    // populate country filter
    COUNTRIES.forEach(c=>{
      const opt = document.createElement('option'); opt.value=c.code; opt.textContent = c.name; filterCountry.appendChild(opt);
    });

    document.getElementById('tab-dashboard').addEventListener('click', ()=>showTab('dashboard'));
    document.getElementById('tab-players').addEventListener('click', ()=>showTab('players'));
    document.getElementById('generate-player').addEventListener('click', ()=>{ const p = generatePlayer(); players.push(p); savePlayers(); renderList(); showPlayer(p.id); });
    document.getElementById('export-json').addEventListener('click', exportJSON);
    document.getElementById('import-json').addEventListener('change', importJSON);
    document.getElementById('back-to-list').addEventListener('click', ()=>{showTab('players')});

    document.querySelectorAll('#players-table thead th[data-sort]').forEach(th=>th.addEventListener('click', ()=>{sortBy(th.dataset.sort)}));
    filterCountry.addEventListener('change', renderList);
    searchInput.addEventListener('input', renderList);

    renderList();
  }

  function showTab(name){
    document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
    document.getElementById('tab-'+name).classList.add('active');
    document.querySelectorAll('.view').forEach(v=>v.classList.add('hidden'));
    document.getElementById(name).classList.remove('hidden');
  }

  function uid(){ return 'p_' + Math.random().toString(36).slice(2,10); }

  function generatePlayer(){
    const age = 11;
    const country = sample(COUNTRIES);
    const isGK = Math.random() < 0.08; // ~8% bramkarzy
    const potential = samplePotential();
    const id = uid();
    const name = generateUniqueName(country.code, players);

    const skills = {};
    if(isGK){
      GK_SKILLS.forEach(s => {
        skills[s] = initialSkillForPotential(potential);
      });
    } else {
      SKILLS.forEach(s => {
        skills[s] = initialSkillForPotential(potential);
      });
    }

    const ovr = Object.values(skills).reduce((a,b)=>a+b,0);
    const hiddenRange = computeHiddenRange(potential,age,ovr);

    return {
      id, name, age, country: country.code, countryName: country.name, countryFlag: country.flag, isGK, potential, skills, ovr, created: Date.now()
    };
  }

  function sample(x){ return x[Math.floor(Math.random()*x.length)]; }

  function samplePotential(){
    // głównie rozkład centrowany wokół 50 (gauss), ale z drobnym prawdopodobieństwem 1% na "słoneczną" 99
    if(Math.random() < 0.01) return 99;
    // Box-Muller transform for approximate normal
    let u=0,v=0; while(u===0) u=Math.random(); while(v===0) v=Math.random();
    let num = Math.sqrt(-2.0*Math.log(u))*Math.cos(2*Math.PI*v);
    // num ~ N(0,1) -> scale
    let val = Math.round(50 + num * 14); // sd ~14
    if(val < 1) val = 1; if(val > 99) val = 99;
    return val;
  }

  function initialSkillForPotential(potential){
    // startowe umiejętności max ~60. Duży potencjał daje większe szanse na wyższe startowe, ale nie gwarantuje.
    const maxStart = 60;
    const minBase = Math.max(1, Math.round(potential*0.2 - 12));
    const maxBase = Math.min(maxStart, Math.round(potential*0.7 + 6));
    // allow low values also
    const val = randInt(minBase, maxBase);
    // small random perturbation
    return Math.max(1, Math.min(maxStart, val + randInt(-6,6)));
  }

  function randInt(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }

  function computeHiddenRange(potential, age, ovr){
    // pokazujemy przybliżony potencjał jako zakres. Z wiekiem zakres zawęża się.
    const ageFactor = Math.max(0, age - 11);
    const spread = Math.max(8, 18 - ageFactor*1.5); // młody = większy spread
    let low = Math.max(1, potential - Math.round(spread + Math.random()*6));
    let high = Math.min(99, potential + Math.round(Math.random()* (99-potential) ));
    // jeżeli umiejętności (ovr) już przekraczają dolną wartość -> zawężamy
    const ovrBased = Math.floor(ovr * 0.6);
    if(ovrBased > low) low = Math.min(ovrBased, potential);
    if(low > high) low = Math.max(1, high - 6);
    return {low, high};
  }

  function generateUniqueName(countryCode, existing){
    const pool = NAME_POOL[countryCode] || NAME_POOL['PL'];
    // try combinations, avoid duplicates in existing players
    const existingNames = new Set(existing.map(p=>p.name));
    for(let i=0;i<200;i++){
      const first = sample(pool.first);
      const last = sample(pool.last);
      const candidate = first + ' ' + last;
      if(!existingNames.has(candidate)) return candidate;
    }
    // fallback with random suffix
    return sample(pool.first) + ' ' + sample(pool.last) + ' ' + Math.floor(Math.random()*9999);
  }

  function savePlayers(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(players)); }
  function loadPlayers(){ try{ return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') }catch(e){return []} }

  function renderList(){
    $table.innerHTML = '';
    const countryFilter = filterCountry.value;
    const q = searchInput.value.trim().toLowerCase();
    let list = players.slice();
    if(countryFilter) list = list.filter(p=>p.country === countryFilter);
    if(q) list = list.filter(p => p.name.toLowerCase().includes(q));

    // default sort by created desc
    list.sort((a,b)=>b.created - a.created);

    list.forEach(p=>{
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><div style="display:flex;gap:8px;align-items:center"><div class="avatar small">${avatarText(p)}</div><div>${p.name}</div></div></td>
        <td>${p.age}</td>
        <td>${flagFor(p.country)} ${p.countryName}</td>
        <td>${p.ovr}</td>
        <td>${displayHidden(p)}</td>
        <td>${p.skills['Odbiór'] || '-'}</td>
        <td>${p.skills['Krycie'] || '-'}</td>
        <td>${p.skills['Podanie'] || '-'}</td>
        <td>${p.skills['Wizja'] || '-'}</td>
        <td>${p.skills['Szybkość'] || '-'}</td>
        <td><button class="btn" data-id="${p.id}">Podgląd</button></td>
      `;
      tr.querySelector('button').addEventListener('click',(e)=>{ showPlayer(p.id); });
      $table.appendChild(tr);
    });
  }

  function avatarText(p){ // inicjały
    const parts = p.name.split(' ');
    const initials = (parts[0][0] || '') + (parts[1] ? parts[1][0] : '');
    return initials.toUpperCase();
  }

  function flagFor(code){ const c = COUNTRIES.find(x=>x.code===code); return c?c.flag:''; }

  function displayHidden(p){
    const hidden = computeHiddenRange(p.potential, p.age, p.ovr);
    // cache? we compute on the fly. Show e.g. 78–99
    return hidden.low + '–' + hidden.high;
  }

  function showPlayer(id){
    const p = players.find(x=>x.id===id); if(!p) return;
    showTab('player-view');
    document.getElementById('pv-name').textContent = p.name;
    document.getElementById('pv-age').textContent = p.age;
    document.getElementById('pv-potential').textContent = p.potential;
    document.getElementById('pv-country').textContent = `${flagFor(p.country)} ${p.countryName}`;
    document.getElementById('pv-avatar').textContent = avatarText(p);
    document.getElementById('pv-ovr').textContent = p.ovr;
    // hidden
    const h = computeHiddenRange(p.potential, p.age, p.ovr);
    document.getElementById('pv-hidden').textContent = `${h.low}–${h.high}`;

    const ul = document.getElementById('pv-skills'); ul.innerHTML='';
    Object.keys(p.skills).forEach(k=>{
      const li = document.createElement('li'); li.innerHTML = `<strong>${k}</strong><span>${p.skills[k]}</span>`; ul.appendChild(li);
    });

    // radar chart
    renderRadar(p);
  }

  let radarChart = null;
  function renderRadar(p){
    const ctx = document.getElementById('radarChart');
    const labels = Object.keys(p.skills);
    const data = labels.map(k=>p.skills[k]);
    if(radarChart) radarChart.destroy();
    radarChart = new Chart(ctx.getContext('2d'),{
      type:'radar',
      data:{labels, datasets:[{label:'Umiejętności',data,backgroundColor:'rgba(123,103,255,0.15)',borderColor:'rgba(123,103,255,0.9)',pointBackgroundColor:'rgba(123,103,255,0.9)'}]},
      options:{scales:{r:{beginAtZero:true,max:100}},plugins:{legend:{display:false}}}
    });
  }

  // simple sorting
  let lastSort = {k:'created',dir:-1};
  function sortBy(k){
    if(lastSort.k===k) lastSort.dir *= -1; else { lastSort.k = k; lastSort.dir = 1; }
    players.sort((a,b)=>{
      let va = getSortValue(a,k); let vb = getSortValue(b,k);
      if(typeof va === 'string') return va.localeCompare(vb) * lastSort.dir;
      return (va - vb) * lastSort.dir;
    });
    renderList();
  }
  function getSortValue(p,k){ if(k==='name') return p.name; if(k==='age') return p.age; if(k==='country') return p.countryName; if(k==='ovr') return p.ovr; if(k==='potential') return p.potential; return p.skills && p.skills[k.charAt(0).toUpperCase()+k.slice(1)] || 0; }

  function exportJSON(){ const data = JSON.stringify(players, null, 2); const blob = new Blob([data],{type:'application/json'}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download = 'players_export.json'; a.click(); URL.revokeObjectURL(url); }
  function importJSON(e){ const f = e.target.files[0]; if(!f) return; const r = new FileReader(); r.onload = ()=>{ try{ const imported = JSON.parse(r.result); if(Array.isArray(imported)){ // merge, avoid id collisions
        const ids = new Set(players.map(p=>p.id));
        imported.forEach(p=>{ if(!p.id) p.id = uid(); while(ids.has(p.id)){ p.id = uid(); } ids.add(p.id); players.push(p); }); savePlayers(); renderList(); alert('Zaimportowano: '+imported.length+' zawodników'); } else alert('Plik nie jest listą zawodników'); } catch(err){ alert('Błąd odczytu pliku'); } }; r.readAsText(f); e.target.value=''; }

  // inicjalne dane - jeśli pusta lista, utwórz kilka przykładowych
  if(players.length===0){ for(let i=0;i<6;i++) players.push(generatePlayer()); savePlayers(); }

  init();
  renderList();

})();
