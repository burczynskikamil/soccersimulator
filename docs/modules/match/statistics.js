// modules/match/statistics.js
window.matchStatistics = (() => {
  function createPlayerStats(player, teamId) {
    return {
      id: `pms_${Math.random().toString(36).slice(2, 10)}`,
      playerId: player.id,
      teamId,
      minutes_played: 0,
      goals: 0,
      assists: 0,
      passes_total: 0,
      passes_accurate: 0,
      tackles: 0,
      interceptions: 0,
      fouls: 0,
      yellow_cards: 0,
      red_cards: 0,
      dribbles: 0,
      saves: 0,
      sprints: 0,
      clearances: 0,
      goals_conceded: 0,
      rating: 6.0,
      sentOffAtMinute: null
    };
  }

  function initStats(lineupA, lineupB) {
    const statsByPlayerId = {};
    [...lineupA.starters, ...lineupB.starters].forEach((player) => {
      statsByPlayerId[player.id] = createPlayerStats(player, player.teamId);
    });
    return statsByPlayerId;
  }

  function markMinutePlayed(statsByPlayerId, minute) {
    Object.values(statsByPlayerId).forEach((stats) => {
      if (stats.sentOffAtMinute && minute > stats.sentOffAtMinute) return;
      stats.minutes_played += 1;
    });
  }

  function registerPass(statsByPlayerId, playerId, accurate) {
    const stats = statsByPlayerId[playerId];
    if (!stats) return;
    stats.passes_total += 1;
    if (accurate) {
      stats.passes_accurate += 1;
      matchRating.apply(stats, 'accurate_pass');
    } else {
      matchRating.apply(stats, 'mistake');
    }
  }

  function registerEvent(statsByPlayerId, event) {
    const stats = event.playerId ? statsByPlayerId[event.playerId] : null;
    const target = event.targetPlayerId ? statsByPlayerId[event.targetPlayerId] : null;

    if (event.eventType === 'goal' && stats) {
      stats.goals += 1;
      matchRating.apply(stats, 'goal');
    }

    if (event.eventType === 'assist' && stats) {
      stats.assists += 1;
      matchRating.apply(stats, 'assist');
    }

    if (event.eventType === 'dribble' && stats) {
      stats.dribbles += 1;
    }

    if (event.eventType === 'tackle' && stats) {
      stats.tackles += 1;
    }

    if (event.eventType === 'interception' && stats) {
      stats.interceptions += 1;
    }

    if (event.eventType === 'foul' && stats) {
      stats.fouls += 1;
      matchRating.apply(stats, 'foul');
    }

    if (event.eventType === 'yellow_card' && stats) {
      stats.yellow_cards += 1;
      matchRating.apply(stats, 'yellow_card');
    }

    if (event.eventType === 'red_card' && stats) {
      stats.red_cards += 1;
      stats.sentOffAtMinute = event.minute;
      matchRating.apply(stats, 'red_card');
    }

    if (event.eventType === 'save' && stats) {
      stats.saves += 1;
      matchRating.apply(stats, 'save');
    }

    if (event.eventType === 'clearance' && stats) {
      stats.clearances += 1;
    }

    if (event.eventType === 'sprint' && stats) {
      stats.sprints += 1;
    }

    if (event.eventType === 'goal_conceded' && target) {
      target.goals_conceded += 1;
    }
  }

  function finalizeStats(statsByPlayerId) {
    return Object.values(statsByPlayerId).map((stats) => ({
      ...stats,
      passing_accuracy: stats.passes_total > 0
        ? Number(((stats.passes_accurate / stats.passes_total) * 100).toFixed(1))
        : 0,
      rating: Number((stats.rating || 6).toFixed(2))
    }));
  }

  return {
    initStats,
    markMinutePlayed,
    registerPass,
    registerEvent,
    finalizeStats
  };
})();
