// modules/player/generation/name.js
window.generateUniqueName = (countryCode, existing) => {
  const pool = NAME_POOL[countryCode] || NAME_POOL['PL'];
  const existingNames = new Set(existing.map(p => p.name));
  for (let i = 0; i < 500; i++) {
    const fname = pool.first[Math.floor(Math.random() * pool.first.length)];
    const lname = pool.last[Math.floor(Math.random() * pool.last.length)];
    const full = fname + ' ' + lname;
    if (!existingNames.has(full)) return full;
  }
  return 'Player ' + uid();
};