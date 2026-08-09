// modules/utils/dom.js
window.el = id => document.getElementById(id);

window.getDOMElements = () => ({
  $playersTable: document.querySelector('#players-table tbody'),
  $teamsTable: document.querySelector('#teams-table tbody'),
  filterCountry: el('filter-country'),
  searchInput: el('search'),
  dbStatus: el('db-status')
});