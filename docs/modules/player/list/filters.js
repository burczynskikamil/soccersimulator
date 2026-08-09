// modules/player/list/filters.js
window.applyPlayerFilters = (players, countryFilter, searchQuery) => {
  let filtered = players.slice();
  if (countryFilter) {
    filtered = filtered.filter(p => p.country === countryFilter);
  }
  if (searchQuery) {
    const q = searchQuery.trim().toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(q));
  }
  return filtered;
};