// modules/constants/skills.js
window.SKILL_CATEGORIES = {
  'ST': {
    'Strzelanie': ['Strzały', 'Pozycjonowanie', 'Precyzja', 'Główki'],
    'Bieganie': ['Szybkość', 'Przyspieszenie', 'Kondycja'],
    'Technika': ['Drybling', 'Kontrola', 'Równowaga'],
    'Taktyka': ['Wizja', 'Czytelność gry', 'Podanie']
  },
  'CM': {
    'Podawanie': ['Podanie', 'Wizja', 'Długie podania'],
    'Bieganie': ['Szybkość', 'Przyspieszenie', 'Kondycja', 'Wytrzymałość'],
    'Technika': ['Drybling', 'Kontrola', 'Równowaga'],
    'Obrona': ['Przejmowanie', 'Krycie', 'Odbijanie']
  },
  'CB': {
    'Obrona': ['Odbiór', 'Krycie', 'Siła', 'Główki'],
    'Bieganie': ['Szybkość', 'Przyspieszenie', 'Kondycja'],
    'Technika': ['Kontrola', 'Równowaga', 'Drybling'],
    'Taktyka': ['Wizja', 'Pozycjonowanie', 'Czytanie gry']
  },
  'GK': {
    'Bramkarskie': ['Sam na sam', 'Obrona strzałów', 'Łapanie', 'Rzuty'],
    'Bieganie': ['Szybkość', 'Przyspieszenie'],
    'Reakcja': ['Refleks', 'Zwinność', 'Rozpęd'],
    'Kolaboracja': ['Gra nogami', 'Wyrzuty', 'Zagrania']
  }
};

window.CATEGORY_IMPORTANCE = {
  'ST': { 'Strzelanie': 0.4, 'Bieganie': 0.3, 'Technika': 0.2, 'Taktyka': 0.1 },
  'CM': { 'Podawanie': 0.3, 'Bieganie': 0.3, 'Technika': 0.2, 'Obrona': 0.2 },
  'CB': { 'Obrona': 0.4, 'Bieganie': 0.25, 'Technika': 0.2, 'Taktyka': 0.15 },
  'GK': { 'Bramkarskie': 0.5, 'Bieganie': 0.15, 'Reakcja': 0.25, 'Kolaboracja': 0.1 }
};

window.CATEGORY_COLORS = {
  'Strzelanie': { bg: '#ff4d4f', text: '#fff' },
  'Podawanie': { bg: '#1890ff', text: '#fff' },
  'Obrona': { bg: '#52c41a', text: '#fff' },
  'Bieganie': { bg: '#faad14', text: '#000' },
  'Technika': { bg: '#722ed1', text: '#fff' },
  'Taktyka': { bg: '#13c2c2', text: '#fff' },
  'Bramkarskie': { bg: '#faad14', text: '#000' },
  'Reakcja': { bg: '#ff7a45', text: '#fff' },
  'Kolaboracja': { bg: '#f5222d', text: '#fff' }
};