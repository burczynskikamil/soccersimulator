// app.js - updated: DiceBear avatars, flags via FlagsAPI, preview opens static page, Save/Load replace localStorage, skill columns rendering
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

  const NAME_POOL = {/* same as before */
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
  const SKILLS = ['Odbiór','Krycie','Podanie','Wizja','Szybkość','Drybling','Strzały','Główki','Siła','Przyspieszenie','Kondycja'];
  const GK_SKILLS = ['Obrona strzałów','Łapanie','Sam na sam'];

  const el = id => document.getElementById(id);
  const $table = document.querySelector('#players-table tbody');
  const filterCountry = el('filter-country');
  const searchInput = el('search');

  let players = loadPlayers();

  function init(){
    COUNTRIES.forEach(c=>{ const opt = document.createElement('option'); opt.value=c.code; opt.textContent=c.name; filterCountry.appendChild(opt); });

    document.getElementById('tab-dashboard').addEventListener('click', ()=>showTab('dashboard'));
    document.getElementById('tab-players').addEventListener('click', ()=>showTab('players'));
    document.getElementById('generate-player').addEventListener('click', ()=>{ const p = generatePlayer(); players.push(p); savePlayers(); renderList(); window.open('players/'+p.id+'.html','_blank'); });
    document.getElementById('save-json').addEventListener('click', saveJSON);
    document.getElementById('load-json').addEventListener('change', loadJSONFile);
    document.getElementById('back-to-list').addEventListener('click', ()=>{showTab('players')});

    document.querySelectorAll('#players-table thead th[data-sort]').forEach(th=>th.addEventListener('click', ()=>{sortBy(th.dataset.sort)}));
    filterCountry.addEventListener('change', renderList);
    searchInput.addEventListener('input', renderList);

    // initial render from localStorage
    renderList();
  }

  function showTab(name){ document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active')); document.getElementById('tab-'+name).classList.add('active'); document.querySelectorAll('.view').forEach(v=>v.classList.add('hidden')); document.getElementById(name).classList.remove('hidden'); }

  function uid(){ return 'p_' + Math.random().toString(36).slice(2,10); }

  function generatePlayer(){
    const age = 11; const country = sample(COUNTRIES); const isGK = Math.random() < 0.08; const potential = samplePotential(); const id = uid(); const name = generateUniqueName(country.code, players);
    const skills = {}; if(isGK){ GK_SKILLS.forEach(s=>skills[s]=initialSkillForPotential(potential)); } else { SKILLS.forEach(s=>skills[s]=initialSkillForPotential(potential)); }
    const sum = Object.values(skills).reduce((a,b)=>a+b,0); const ovr = Math.min(99, Math.round(sum / Object.values(skills).length));
    return { id, name, age, country: country.code, countryName: country.name, countryFlag: country.flag, countryColor: country.color, isGK, potential, skills, ovr, created: Date.now() };
  }

  function sample(x){ return x[Math.floor(Math.random()*x.length)]; }

  function samplePotential(){ if(Math.random()<0.01) return 99; let u=0,v=0; while(u===0) u=Math.random(); while(v===0) v=Math.random(); let num = Math.sqrt(-2.0*Math.log(u))*Math.cos(2*Math.PI*v); let val = Math.round(50 + num*14); if(val<1) val=1; if(val>99) val=99; return val; }

  function initialSkillForPotential(potential){ const maxStart=99; const minBase=Math.max(1, Math.round(potential*0.2-12)); const maxBase=Math.min(maxStart, Math.round(potential*0.7+6)); const val=randInt(minBase,maxBase); return Math.max(1, Math.min(maxStart, val+randInt(-8,8))); }
  function randInt(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }

  function computeHiddenRange(potential, age, ovr){ const ageFactor = Math.max(0, age-11); const spread = Math.max(6, 18-ageFactor*1.5); let low = Math.max(1, potential - Math.round(spread + Math.random()*6)); let high = Math.min(99, potential + Math.round(Math.random()*(99-potential))); const ovrBased = Math.floor(ovr); if(ovrBased>low) low = Math.min(ovrBased,potential); if(low>high) low = Math.max(1, high-6); return {low, high}; }

  function generateUniqueName(countryCode, existing){ const pool = NAME_POOL[countryCode] || NAME_POOL['PL']; const existingNames = new Set(existing.map(p=>p.name)); for(let i=0;i<500;i++){ const first = sample(pool.first); const last = sample(pool.last); const cand = first + ' ' + last; if(!existingNames.has(cand)) return cand; } return sample(pool.first)+' '+sample(pool.last)+' '+Math.floor(Math.random()*9999); }

  function savePlayers(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(players)); }
  function loadPlayers(){ try{ return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') }catch(e){return []} }

  function avatarUrl(p){ // use DiceBear Avataaars style with seed
    const seed = encodeURIComponent((p.name || p.id));
    // adjust options minimal, set mouth/eyes by ovr for variety
    return `https://avatars.dicebear.com/api/avataaars/${seed}.svg?eyes=${p.ovr>60? 'happy':'default'}&mouth=${p.ovr>50? 'smile':'serious'}&top[]=shortWaved&accessories[]=none&background=%23ffffff00`;
  }

  function renderList(){ $table.innerHTML=''; const countryFilter = filterCountry.value; const q = searchInput.value.trim().toLowerCase(); let list = players.slice(); if(countryFilter) list = list.filter(p=>p.country===countryFilter); if(q) list = list.filter(p=>p.name.toLowerCase().includes(q)); list.sort((a,b)=>b.created - a.created);
    list.forEach(p=>{
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><div class="player-row"><img class="avatar small" src="${avatarUrl(p)}" alt="avatar" style="border-radius:8px;width:40px;height:40px;object-fit:cover"/><div><div><a class="link" href="players/${p.id}.html" target="_blank">${p.name}</a></div><div class="meta">${p.countryName}</div></div></div></td>
        <td>${p.age}</td>
        <td><img class="flag" src="${p.countryFlag}" alt="${p.countryName}"/> ${p.countryName}</td>
        <td>${p.ovr}</td>
        <td>${displayHidden(p)}</td>
        <td>${p.skills['Odbiór'] || '-'}</td>
        <td>${p.skills['Krycie'] || '-'}</td>
        <td>${p.skills['Podanie'] || '-'}</td>
        <td>${p.skills['Wizja'] || '-'}</td>
        <td>${p.skills['Szybkość'] || '-'}</td>
        <td><button class="btn" data-id="${p.id}">Podgląd</button> <button class="btn" data-delete="${p.id}" style="background:#ff4d4f;color:white;border:0">Usuń</button></td>
      `;
      tr.querySelector('button[data-id]')?.addEventListener('click',()=>{ window.open('players/'+p.id+'.html','_blank'); });
      tr.querySelector('button[data-delete]')?.addEventListener('click',()=>{ if(confirm('Usuń zawodnika '+p.name+'?')){ deletePlayer(p.id); } });
      $table.appendChild(tr);
    });
  }

  function deletePlayer(id){ players = players.filter(p=>p.id!==id); savePlayers(); renderList(); showTab('players'); }

  function avatarInitials(p){ const parts = p.name.split(' '); return ((parts[0]||'')[0]||'') + ((parts[1]||'')[0]||''); }
  function displayHidden(p){ const h = computeHiddenRange(p.potential,p.age,p.ovr); return h.low+'–'+h.high; }

  function showPlayer(id){ const p = players.find(x=>x.id===id); if(!p) return; showTab('player-view'); el('pv-name').textContent = p.name; el('pv-age').textContent = p.age; el('pv-potential').textContent = p.potential; el('pv-country').innerHTML = `<img class="flag" src="${p.countryFlag}"/> ${p.countryName}`; el('pv-avatar-img').src = avatarUrl(p); el('pv-ovr') && (el('pv-ovr').textContent = p.ovr);
    const grid = el('pv-skills-grid'); grid.innerHTML='';
    // categories
    const offensive = ['Strzały','Drybling','Główki','Podanie','Wizja'];
    const defensive = ['Odbiór','Krycie'];
    const physical = ['Siła','Przyspieszenie','Szybkość','Kondycja'];
    grid.appendChild(renderSkillsColumn('Ofensywne', offensive, p));
    grid.appendChild(renderSkillsColumn('Defensywne', defensive, p));
    grid.appendChild(renderSkillsColumn('Fizyczne', physical, p));
  }

  function renderSkillsColumn(title, keys, p){ const col = document.createElement('div'); col.className='skills-column'; const h = document.createElement('h4'); h.textContent = title; col.appendChild(h); keys.forEach(k=>{ const val = p.skills[k] || 0; const row = document.createElement('div'); row.className='skill-row'; const name = document.createElement('div'); name.className='skill-name'; name.textContent = k; const bar = document.createElement('div'); bar.className='skill-bar'; const fill = document.createElement('div'); fill.className='skill-fill ' + colorClassFor(val); fill.style.width = Math.max(0, Math.min(100,val)) + '%'; const valEl = document.createElement('div'); valEl.className='skill-val'; valEl.textContent = val; bar.appendChild(fill); row.appendChild(name); row.appendChild(bar); row.appendChild(valEl); col.appendChild(row); }); return col; }

  function colorClassFor(val){ if(val>=91) return 'color-veryhigh'; if(val>=76) return 'color-high-dark'; if(val>=61) return 'color-high'; if(val>=46) return 'color-mid'; if(val>=31) return 'color-low'; if(val>=16) return 'color-lower'; return 'color-bottom'; }

  // Load/Save logic
  function saveJSON(){ const data = JSON.stringify(players, null, 2); const blob = new Blob([data],{type:'application/json'}); saveAs(blob, 'players.json'); }

  function loadJSONFile(e){ const f = e.target.files[0]; if(!f) return; const r = new FileReader(); r.onload = async ()=>{ try{ const imported = JSON.parse(r.result); if(Array.isArray(imported)){
        // replace all players
        players = imported.map(p=>{ if(!p.id) p.id = uid(); p.skills = p.skills || {}; Object.keys(p.skills).forEach(k=>{ p.skills[k] = Math.max(0, Math.min(99, Math.round(p.skills[k]||0))); }); p.potential = Math.max(1, Math.min(99, Math.round(p.potential||50))); p.ovr = Math.min(99, Math.round(p.ovr || (Object.values(p.skills).reduce((a,b)=>a+b,0)/(Object.values(p.skills).length||1)))); const cc = COUNTRIES.find(c=>c.code===p.country) || sample(COUNTRIES); p.country = cc.code; p.countryName = cc.name; p.countryFlag = cc.flag; p.countryColor = cc.color; return p; });
        savePlayers(); renderList(); alert('Wczytano i podmieniono listę zawodników: '+players.length);
        // automatically generate static pages zip
        await generateStaticPagesZip(players);
      } else alert('Plik nie jest listą zawodników'); } catch(err){ console.error(err); alert('Błąd odczytu pliku'); } }; r.readAsText(f); e.target.value=''; }

  async function generateStaticPagesZip(list){ const zip = new JSZip(); zip.file('styles.css', await fetch('styles.css').then(r=>r.text()).catch(()=>'')); const folder = zip.folder('players'); list.forEach(p=>{ const html = generateStaticPlayerHTML(p); folder.file(p.id + '.html', html); }); const content = await zip.generateAsync({type:'blob'}); saveAs(content, 'players_static_pages.zip'); }

  function generateStaticPlayerHTML(p){ const skillsRowsOff = ['Strzały','Drybling','Główki','Podanie','Wizja'].map(k=>`<div class="skill-row"><div class="skill-name">${k}</div><div class="skill-bar"><div class="skill-fill ${colorClassForStatic(p.skills[k]||0)}" style="width:${(p.skills[k]||0)}%"></div></div><div class="skill-val">${p.skills[k]||0}</div></div>`).join('\n');
    const skillsRowsDef = ['Odbiór','Krycie'].map(k=>`<div class="skill-row"><div class="skill-name">${k}</div><div class="skill-bar"><div class="skill-fill ${colorClassForStatic(p.skills[k]||0)}" style="width:${(p.skills[k]||0)}%"></div></div><div class="skill-val">${p.skills[k]||0}</div></div>`).join('\n');
    const skillsRowsPhy = ['Siła','Przyspieszenie','Szybkość','Kondycja'].map(k=>`<div class="skill-row"><div class="skill-name">${k}</div><div class="skill-bar"><div class="skill-fill ${colorClassForStatic(p.skills[k]||0)}" style="width:${(p.skills[k]||0)}%"></div></div><div class="skill-val">${p.skills[k]||0}</div></div>`).join('\n');
    const avatar = `https://avatars.dicebear.com/api/avataaars/${encodeURIComponent(p.name||p.id)}.svg?background=%23ffffff00`;
    const hidden = computeHiddenRange(p.potential,p.age,p.ovr);
    return `<!doctype html>
<html lang="pl"><head><meta charset="utf-8"/><meta name="viewport"content="width=device-width,initial-scale=1"/><title>${escapeHtml(p.name)} — profil</title><link rel="stylesheet" href="../styles.css"></head><body><div class="app"><header class="topbar"><h1>Profil zawodnika</h1><nav><a class="link" href="../index.html">← Powrót do listy</a></nav></header><main><div class="card player-card"><div class="player-header"><img src="${avatar}" class="avatar-img"/><div><h2>${escapeHtml(p.name)}</h2><div><img class="flag" src="${p.countryFlag}"/> ${p.countryName}</div><div class="meta">Wiek: ${p.age} — Potencjał: ${p.potential} (${hidden.low}–${hidden.high})</div></div></div><div class="player-body skills-grid"><div class="skills-column"><h4>Ofensywne</h4>${skillsRowsOff}<div class="ovr">OVR: ${p.ovr}</div></div><div class="skills-column"><h4>Defensywne</h4>${skillsRowsDef}</div><div class="skills-column"><h4>Fizyczne</h4>${skillsRowsPhy}</div></div></div></main><footer class="footer">SoccerSimulator — Profil zawodnika</footer></div></body></html>`; }

  function colorClassForStatic(val){ if(val>=91) return 'color-veryhigh'; if(val>=76) return 'color-high-dark'; if(val>=61) return 'color-high'; if(val>=46) return 'color-mid'; if(val>=31) return 'color-low'; if(val>=16) return 'color-lower'; return 'color-bottom'; }
  function colorClassFor(val){ return colorClassForStatic(val); }

  function escapeHtml(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;'); }

  function sortBy(k){ if(lastSort.k===k) lastSort.dir *= -1; else { lastSort.k=k; lastSort.dir=1; } players.sort((a,b)=>{ let va=getSortValue(a,k); let vb=getSortValue(b,k); if(typeof va==='string') return va.localeCompare(vb)*lastSort.dir; return (va-vb)*lastSort.dir; }); renderList(); }
  function getSortValue(p,k){ if(k==='name') return p.name; if(k==='age') return p.age; if(k==='country') return p.countryName; if(k==='ovr') return p.ovr; if(k==='potential') return p.potential; return p.skills && p.skills[k.charAt(0).toUpperCase()+k.slice(1)] || 0; }

  // initial seed players if empty
  if(players.length===0){ for(let i=0;i<8;i++) players.push(generatePlayer()); savePlayers(); }

  init(); renderList();

})();
