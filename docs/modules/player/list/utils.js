// modules/player/list/utils.js
window.getDisplayValue = (baseValue, position) => {
  const positionCount = playerState.getAll().filter(p => p.position === position).length;
  let multiplier = 1.0;
  
  if (positionCount === 0) multiplier = 2.0;
  else if (positionCount === 1) multiplier = 1.8;
  else if (positionCount === 2) multiplier = 1.5;
  else if (positionCount === 3) multiplier = 1.2;
  else if (positionCount === 4) multiplier = 1.1;
  
  return Math.round(baseValue * multiplier);
};

window.applyPlayerFilters = (players, countryFilter, searchQuery) => {
  let filtered = players.slice();
  if(countryFilter) filtered = filtered.filter(p => p.country === countryFilter);
  if(searchQuery) filtered = filtered.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  return filtered;
};
