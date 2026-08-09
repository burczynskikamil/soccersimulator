// modules/player/generation/generator.js
window.generatePlayer = () => {
  // twarde fallbacki, żeby nic nie wywaliło się przez brak globali
  const _sample = typeof window.sample === 'function'
    ? window.sample
    : (arr) => arr[Math.floor(Math.random() * arr.length)];

  const _randInt = typeof window.randInt === 'function'
    ? window.randInt
    : ((a, b) => Math.floor(Math.random() * (b - a + 1)) + a);

  const _clampSkill = typeof window.clampSkill === 'function'
    ? window.clampSkill
    : ((v) => Math.max(1, Math.min(99, Math.round(v))));

  const _generateSkillsByPosition = typeof window.generateSkillsByPosition === 'function'
    ? window.generateSkillsByPosition
    : ((position, ovr) => {
        if (position === 'GK') {
          return {
            oneOnOne: _randInt(Math.max(1, ovr - 10), Math.min(99, ovr + 10)),
            shotStopping: _randInt(Math.max(1, ovr - 10), Math.min(99, ovr + 10)),
            handling: _randInt(Math.max(1, ovr - 10), Math.min(99, ovr + 10))
          };
        }
        const keys = ['shots','headers','tackling','marking','speed','dribbling','acceleration','strength','vision','passing','stamina'];
        const out = {};
        keys.forEach(k => out[k] = _randInt(Math.max(1, ovr - 12), Math.min(99, ovr + 12)));
        return out;
      });

  const _nameFn = typeof window.generateUniqueName === 'function'
    ? window.generateUniqueName
    : (() => {
        const first = ['Jan','Adam','Piotr','Kamil','Marek','Tomasz','Paweł','Michał','Luca','Marco','Leo','Noah','Oliver','Mateo','Victor','Nico'];
        const last = ['Nowak','Kowalski','Wiśniewski','Wójcik','Lewandowski','Zieliński','Rossi','Bianchi','Silva','García','Novák','Nagy','Popescu','Ionescu'];
        return () => `${_sample(first)} ${_sample(last)}`;
      })();

  const _countries = (Array.isArray(window.COUNTRIES) && window.COUNTRIES.length)
    ? window.COUNTRIES
    : [{ code:'PL', name:'Polska', flag:'', color:'#fff' }];

  const _positions = (Array.isArray(window.POSITIONS) && window.POSITIONS.length)
    ? window.POSITIONS
    : ['GK','CB','CM','ST'];

  const position = _sample(_positions);

  // ✅ WYMAGANIE: wszyscy mają 11 lat
  const age = 11;

  const country = _sample(_countries);

  // Potencjał: 30..99, najczęściej okolice 60
  const realPotential = generateTriangularInt(30, 99, 60);

  // OVR: max 60, skorelowany z potencjałem, ale losowy
  const ovr = generateOvrFromPotential(realPotential);

  const hiddenPotentialMin = _clampSkill(realPotential - _randInt(0, 15));
  const hiddenPotentialMax = _clampSkill(realPotential + _randInt(0, 15));
  const skills = _generateSkillsByPosition(position, ovr);

  return {
    id: 'player_' + Math.random().toString(36).slice(2, 10),

    // ✅ zawsze przez funkcję narodowości
    name: _nameFn(country.code),

    age,
    position,
    country: country.code,
    countryName: country.name,
    countryFlag: country.flag,
    countryColor: country.color,
    skills,
    ovr,
    hiddenPotentialMin,
    hiddenPotentialMax,
    realPotential,
    value: typeof window.calculatePlayerValue === 'function'
      ? window.calculatePlayerValue({ position, age, ovr, realPotential, skills })
      : (ovr * 100000)
  };
};

function triangular(min, max, mode) {
  const u = Math.random();
  const c = (mode - min) / (max - min);
  if (u < c) return min + Math.sqrt(u * (max - min) * (mode - min));
  return max - Math.sqrt((1 - u) * (max - min) * (max - mode));
}
function generateTriangularInt(min, max, mode) {
  return Math.round(triangular(min, max, mode));
}
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
function generateOvrFromPotential(potential) {
  const normalized = (potential - 30) / (99 - 30);
  const center = 25 + normalized * 30; // 25..55
  const noise = triangular(-18, 10, -2); // czasem niski ovr mimo wysokiego potencjału
  return Math.round(clamp(center + noise, 1, 60)); // OVR max 60
}
