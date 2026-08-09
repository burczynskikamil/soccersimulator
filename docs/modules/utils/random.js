// modules/utils/random.js
window.sample = (x) => x[Math.floor(Math.random() * x.length)];

window.randInt = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

window.uid = () => 'p_' + Math.random().toString(36).slice(2, 10);