// modules/player/list/sorter.js

// Kierunek domyślny dla pierwszego kliknięcia:
//  1  = rosnąco (A->Z, 0->9)
// -1  = malejąco (Z->A, 9->0)
window.playerSortDefaults = {
  age: -1,       // najstarsi najpierw
  name: 1,       // A->Z
  ovr: -1,       // najwyższy najpierw
  country: 1,    // A->Z
  position: 1,   // GK->CB->CM->ST
  value: -1,     // najwyższa wartość najpierw
  team: 1        // A->Z
};

// Aktualny stan sortowania
window.playerSortState = {
  k: 'name',
  dir: window.playerSortDefaults.name
};

// Kolejność pozycji (Twoje wymaganie)
const POSITION_ORDER = { GK: 0, CB: 1, CM: 2, ST: 3 };

function normalizeText(v) {
  return (v ?? '').toString().trim().toLowerCase();
}

function compareText(a, b) {
  return normalizeText(a).localeCompare(normalizeText(b), 'pl', { sensitivity: 'base' });
}

function compareNumber(a, b) {
  return (Number(a) || 0) - (Number(b) || 0);
}

function getTeamName(player, teamsById) {
  if (!player.teamId) return '';
  return teamsById[player.teamId]?.name || '';
}

// Główna funkcja sortująca listę graczy
window.sortPlayers = (players, key, dir) => {
  const teams = (typeof teamState !== 'undefined' && teamState.getAll) ? teamState.getAll() : [];
  const teamsById = Object.fromEntries(teams.map(t => [t.id, t]));

  const sorted = [...players].sort((a, b) => {
    let cmp = 0;

    switch (key) {
      case 'age':
        cmp = compareNumber(a.age, b.age);
        break;

      case 'name':
        cmp = compareText(a.name, b.name);
        break;

      case 'ovr':
        cmp = compareNumber(a.ovr, b.ovr);
        break;

      case 'country':
        cmp = compareText(a.countryName, b.countryName);
        break;

      case 'position': {
        const pa = POSITION_ORDER[a.position] ?? 999;
        const pb = POSITION_ORDER[b.position] ?? 999;
        cmp = compareNumber(pa, pb);
        break;
      }

      case 'value':
        cmp = compareNumber(a.value, b.value);
        break;

      case 'team': {
        const ta = getTeamName(a, teamsById);
        const tb = getTeamName(b, teamsById);
        cmp = compareText(ta, tb);
        break;
      }

      default:
        cmp = 0;
    }

    // stabilny tie-breaker
    if (cmp === 0) {
      cmp = compareText(a.name, b.name);
    }

    return cmp * dir;
  });

  return sorted;
};

// Obsługa kliknięcia nagłówka
window.sortPlayersByColumn = (key) => {
  if (window.playerSortState.k === key) {
    // drugie kliknięcie: odwrócenie kierunku
    window.playerSortState.dir *= -1;
  } else {
    // pierwsze kliknięcie na nowej kolumnie: jej domyślny kierunek
    window.playerSortState.k = key;
    window.playerSortState.dir = window.playerSortDefaults[key] ?? 1;
  }

  window.renderPlayersList();
};
