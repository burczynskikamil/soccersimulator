// modules/match/rating.js
window.matchRating = (() => {
  const deltas = {
    goal: 0.8,
    assist: 0.5,
    accurate_pass: 0.1,
    mistake: -0.1,
    foul: -0.2,
    yellow_card: -0.3,
    red_card: -1.0,
    save: 0.3
  };

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  return {
    deltas,
    apply: (playerStats, eventType) => {
      const delta = deltas[eventType] || 0;
      const current = Number(playerStats.rating ?? 6);
      playerStats.rating = Number(clamp(current + delta, 0, 10).toFixed(2));
    }
  };
})();
