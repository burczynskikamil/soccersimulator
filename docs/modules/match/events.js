// modules/match/events.js
window.matchEvents = (() => {
  const skill = (player, keys, fallback = player.ovr || 40) => {
    if (!player || !player.skills) return fallback;
    for (const key of keys) {
      if (typeof player.skills[key] === 'number') return player.skills[key];
    }
    return fallback;
  };

  const avg = (players, getValue) => {
    if (!players.length) return 0;
    return players.reduce((sum, p) => sum + getValue(p), 0) / players.length;
  };

  const pick = (players) => {
    if (!players || !players.length) return null;
    return players[Math.floor(Math.random() * players.length)];
  };

  const outfield = (lineup) => lineup.starters.filter((p) => p.position !== 'GK');

  function calculatePossessionScore(lineup) {
    const mids = lineup.slots.CM;
    const forwards = [lineup.slots.ST];
    return avg([...mids, ...forwards], (p) => skill(p, ['passing', 'vision', 'dribbling', 'Podanie', 'Wizja', 'Drybling'], p.ovr));
  }

  function generateMinuteEvent({ minute, teamA, teamB, score }) {
    const possessionA = calculatePossessionScore(teamA);
    const possessionB = calculatePossessionScore(teamB);
    const teamInAttack = Math.random() < (possessionA / Math.max(1, possessionA + possessionB)) ? teamA : teamB;
    const teamInDefense = teamInAttack.id === teamA.id ? teamB : teamA;

    const attackers = outfield(teamInAttack);
    const defenders = outfield(teamInDefense);
    const attacker = pick(attackers);
    if (!attacker) return [];

    const support = pick(attackers.filter((p) => p.id !== attacker.id)) || attacker;
    const defender = pick(defenders) || teamInDefense.slots.GK || attacker;
    const keeper = teamInDefense.slots.GK || defender || attacker;

    const events = [];

    const passChance = (skill(attacker, ['passing', 'vision', 'Podanie', 'Wizja']) + teamInAttack.ratingAverage) / 200;
    const accuratePass = Math.random() < passChance;
    events.push({
      minute,
      eventType: 'pass',
      playerId: attacker.id,
      teamId: teamInAttack.id,
      description: accuratePass
        ? `${attacker.name} zagrywa celnie do ${support.name}.`
        : `${attacker.name} notuje niedokładne podanie.`
    });

    if (!accuratePass) {
      events.push({
        minute,
        eventType: 'interception',
        playerId: defender.id,
        teamId: teamInDefense.id,
        description: `${defender.name} przechwytuje piłkę.`
      });
      return events;
    }

    if (Math.random() < 0.35) {
      events.push({
        minute,
        eventType: 'dribble',
        playerId: support.id,
        teamId: teamInAttack.id,
        description: `${support.name} podejmuje drybling pod presją ${defender.name}.`
      });

      if (Math.random() < 0.4) {
        events.push({
          minute,
          eventType: 'tackle',
          playerId: defender.id,
          teamId: teamInDefense.id,
          description: `${defender.name} skutecznie odbiera piłkę ${support.name}.`
        });
      }
    }

    if (Math.random() < 0.18) {
      events.push({
        minute,
        eventType: 'foul',
        playerId: defender.id,
        teamId: teamInDefense.id,
        description: `${defender.name} fauluje ${support.name}.`
      });

      const cardRoll = Math.random();
      if (cardRoll < 0.22) {
        events.push({
          minute,
          eventType: 'yellow_card',
          playerId: defender.id,
          teamId: teamInDefense.id,
          description: `Żółta kartka dla ${defender.name}.`
        });
      } else if (cardRoll < 0.26) {
        events.push({
          minute,
          eventType: 'red_card',
          playerId: defender.id,
          teamId: teamInDefense.id,
          description: `Czerwona kartka! ${defender.name} opuszcza boisko.`
        });
      }
    }

    if (Math.random() < 0.42) {
      const shotPower = (skill(support, ['shots', 'finishing', 'Strzały', 'Precyzja'], support.ovr) + teamInAttack.ratingAverage) / 2;
      const savePower = (skill(keeper, ['shotStopping', 'reflexes', 'Obrona strzałów', 'Refleks'], keeper.ovr) + keeper.ovr) / 2;
      const goalChance = shotPower / Math.max(1, shotPower + savePower);

      if (Math.random() < goalChance) {
        events.push({
          minute,
          eventType: 'goal',
          playerId: support.id,
          teamId: teamInAttack.id,
          description: `GOOOL! ${support.name} pokonuje ${keeper.name}.`
        });
        events.push({
          minute,
          eventType: 'assist',
          playerId: attacker.id,
          teamId: teamInAttack.id,
          description: `Asysta: ${attacker.name}.`
        });
        events.push({
          minute,
          eventType: 'goal_conceded',
          targetPlayerId: keeper.id,
          teamId: teamInDefense.id,
          description: `${keeper.name} traci bramkę.`
        });
        if (teamInAttack.id === teamA.id) score.teamA += 1;
        else score.teamB += 1;
      } else {
        events.push({
          minute,
          eventType: 'save',
          playerId: keeper.id,
          teamId: teamInDefense.id,
          description: `${keeper.name} broni strzał ${support.name}.`
        });
        if (Math.random() < 0.5) {
          events.push({
            minute,
            eventType: 'clearance',
            playerId: defender.id,
            teamId: teamInDefense.id,
            description: `${defender.name} wybija piłkę po interwencji bramkarza.`
          });
        }
      }
    }

    if (Math.random() < 0.25) {
      const runner = pick(attackers);
      events.push({
        minute,
        eventType: 'sprint',
        playerId: runner.id,
        teamId: teamInAttack.id,
        description: `${runner.name} rusza dynamicznym sprintem.`
      });
    }

    if (Math.random() < 0.03) {
      const injured = pick([...attackers, ...defenders]);
      events.push({
        minute,
        eventType: 'injury',
        playerId: injured.id,
        teamId: injured.teamId,
        description: `Kontuzja! ${injured.name} potrzebuje pomocy medycznej.`
      });
    }

    return events;
  }

  return {
    generateMinuteEvent
  };
})();
