// modules/player/generation/height.js
window.generateHeight = (position) => {
  const range = HEIGHT_RANGES[position];
  const avg = range.avg;
  let u1 = Math.random();
  let u2 = Math.random();
  let z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  let height = Math.round(avg + z * 3);
  return Math.max(range.min, Math.min(range.max, height));
};