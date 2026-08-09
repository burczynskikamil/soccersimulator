// modules/match/events.js
window.matchEvents = (() => {
  const clampChance = (value) => Math.max(0.01, Math.min(0.95, Number(value || 0)));

  const skill = (player, keys, fallback = player?.ovr || 40) => {
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

  const roundChance = (value) => Number(Number(value || 0).toFixed(4));

  const toModifier = (label, value) => ({
    label,
    value: roundChance(value)
  });

  function buildProbabilityDetails(label, base, modifiers) {
    const final = clampChance(Number(base || 0) + (modifiers || []).reduce((sum, modifier) => sum + Number(modifier.value || 0), 0));
    return {
      label,
      base: roundChance(base),
      modifiers,
      final: roundChance(final)
    };
  }

  function invertProbabilityDetails(label, probabilityDetails) {
    return {
      label,
      base: roundChance(1 - Number(probabilityDetails.base || 0)),
      modifiers: (probabilityDetails.modifiers || []).map((modifier) => ({
        label: modifier.label,
        value: roundChance(-Number(modifier.value || 0))
      })),
      final: roundChance(clampChance(1 - Number(probabilityDetails.final || 0)))
    };
  }

  function calculatePossessionScore(lineup) {
    const mids = lineup.slots.CM;
    const forwards = [lineup.slots.ST];
    return avg([...mids, ...forwards], (player) => skill(player, ['passing', 'vision', 'dribbling', 'Podanie', 'Wizja', 'Drybling'], player.ovr));
  }

  function calculateScorePressure(teamInAttack, teamA, score) {
    const ownScore = teamInAttack.id === teamA.id ? score.teamA : score.teamB;
    const rivalScore = teamInAttack.id === teamA.id ? score.teamB : score.teamA;
    if (ownScore < rivalScore) return 0.04;
    if (ownScore > rivalScore) return -0.03;
    return 0;
  }

  function calculateTimePressure(elapsedSeconds) {
    if (elapsedSeconds >= 3300) return 0.03;
    if (elapsedSeconds >= 2700) return 0.02;
    if (elapsedSeconds >= 1800) return 0.01;
    return 0;
  }

  function createEvent(second, minute, eventType, playerId, teamId, description, probabilityDetails, extra = {}) {
    return {
      second,
      minute,
      eventType,
      playerId,
      teamId,
      description,
      probabilityDetails,
      ...extra
    };
  }

  function rollProbability(probabilityDetails) {
    return Math.random() < probabilityDetails.final;
  }

  function generateTimeSliceEvents({
    elapsedSeconds,
    sliceSeconds,
    teamA,
    teamB,
    score
  }) {
    const minute = Math.max(1, Math.ceil(elapsedSeconds / 60));
    const sliceFactor = Math.max(1 / 6, (sliceSeconds || 60) / 60);

    const possessionA = calculatePossessionScore(teamA);
    const possessionB = calculatePossessionScore(teamB);
    const teamInAttack = Math.random() < (possessionA / Math.max(1, possessionA + possessionB)) ? teamA : teamB;
    const teamInDefense = teamInAttack.id === teamA.id ? teamB : teamA;

    const attackers = outfield(teamInAttack);
    const defenders = outfield(teamInDefense);
    const attacker = pick(attackers);
    if (!attacker) return [];

    const support = pick(attackers.filter((player) => player.id !== attacker.id)) || attacker;
    const defender = pick(defenders) || teamInDefense.slots.GK || attacker;
    const keeper = teamInDefense.slots.GK || defender || attacker;
    const defenseLineStrength = avg(defenders.length ? defenders : [keeper], (player) => skill(player, ['tackling', 'interceptions', 'Odbiór', 'Przechwyty'], player.ovr));
    const attackSupport = (Number(teamInAttack.ratingAverage || 50) - Number(teamInDefense.ratingAverage || 50)) / 400;
    const scorePressure = calculateScorePressure(teamInAttack, teamA, score);
    const timePressure = calculateTimePressure(elapsedSeconds);

    const events = [];

    const passBreakdown = buildProbabilityDetails('Celne podanie', 0.55, [
      toModifier(`Jakość rozegrania ${attacker.name}`, (skill(attacker, ['passing', 'vision', 'Podanie', 'Wizja'], attacker.ovr) - 55) / 200),
      toModifier(`Wsparcie drużyny ${teamInAttack.name}`, (Number(teamInAttack.ratingAverage || 55) - 55) / 220),
      toModifier(`Pressing ${teamInDefense.name}`, -(defenseLineStrength - 50) / 260)
    ]);
    const accuratePass = rollProbability(passBreakdown);
    events.push(createEvent(
      elapsedSeconds,
      minute,
      'pass',
      attacker.id,
      teamInAttack.id,
      accuratePass
        ? `${attacker.name} zagrywa celnie do ${support.name}.`
        : `${attacker.name} notuje niedokładne podanie.`,
      passBreakdown,
      { accurate: accuratePass }
    ));

    if (!accuratePass) {
      events.push(createEvent(
        elapsedSeconds,
        minute,
        'interception',
        defender.id,
        teamInDefense.id,
        `${defender.name} przechwytuje piłkę.`,
        invertProbabilityDetails('Przechwyt po niecelnym podaniu', passBreakdown)
      ));
      return events;
    }

    const dribbleBreakdown = buildProbabilityDetails('Wejście w drybling', 0.28 * sliceFactor, [
      toModifier(`Technika ${support.name}`, ((skill(support, ['dribbling', 'Drybling'], support.ovr) - 55) / 500) * sliceFactor),
      toModifier(`Ustawienie obrony ${teamInDefense.name}`, -((defenseLineStrength - 55) / 650) * sliceFactor),
      toModifier('Presja wyniku', scorePressure * sliceFactor)
    ]);

    if (rollProbability(dribbleBreakdown)) {
      events.push(createEvent(
        elapsedSeconds,
        minute,
        'dribble',
        support.id,
        teamInAttack.id,
        `${support.name} podejmuje drybling pod presją ${defender.name}.`,
        dribbleBreakdown
      ));

      const tackleBreakdown = buildProbabilityDetails('Skuteczny odbiór po dryblingu', 0.32, [
        toModifier(`Timing ${defender.name}`, (skill(defender, ['tackling', 'interceptions', 'Odbiór', 'Przechwyty'], defender.ovr) - 55) / 230),
        toModifier(`Kontrola piłki ${support.name}`, -(skill(support, ['dribbling', 'Drybling'], support.ovr) - 55) / 260)
      ]);

      if (rollProbability(tackleBreakdown)) {
        events.push(createEvent(
          elapsedSeconds,
          minute,
          'tackle',
          defender.id,
          teamInDefense.id,
          `${defender.name} skutecznie odbiera piłkę ${support.name}.`,
          tackleBreakdown
        ));
      }
    }

    const foulBreakdown = buildProbabilityDetails('Faul w tej akcji', 0.12 * sliceFactor, [
      toModifier(`Agresywny pressing ${teamInDefense.name}`, ((defenseLineStrength - 55) / 700) * sliceFactor),
      toModifier('Szybkie tempo akcji', (timePressure / 2) * sliceFactor),
      toModifier('Presja wyniku', (scorePressure / 2) * sliceFactor)
    ]);

    if (rollProbability(foulBreakdown)) {
      events.push(createEvent(
        elapsedSeconds,
        minute,
        'foul',
        defender.id,
        teamInDefense.id,
        `${defender.name} fauluje ${support.name}.`,
        foulBreakdown
      ));

      const yellowBreakdown = buildProbabilityDetails('Żółta kartka po faulu', 0.18, [
        toModifier('Późna faza meczu', timePressure / 2),
        toModifier(`Spóźniona reakcja ${defender.name}`, (55 - Number(defender.ovr || 55)) / 600)
      ]);
      if (rollProbability(yellowBreakdown)) {
        events.push(createEvent(
          elapsedSeconds,
          minute,
          'yellow_card',
          defender.id,
          teamInDefense.id,
          `Żółta kartka dla ${defender.name}.`,
          yellowBreakdown
        ));
      } else {
        const redBreakdown = buildProbabilityDetails('Czerwona kartka po faulu', 0.03, [
          toModifier('Bardzo ryzykowna interwencja', timePressure / 3),
          toModifier('Presja wyniku', Math.max(0, scorePressure) / 2)
        ]);
        if (rollProbability(redBreakdown)) {
          events.push(createEvent(
            elapsedSeconds,
            minute,
            'red_card',
            defender.id,
            teamInDefense.id,
            `Czerwona kartka! ${defender.name} opuszcza boisko.`,
            redBreakdown
          ));
        }
      }
    }

    const shotBreakdown = buildProbabilityDetails('Dojście do strzału', 0.3 * sliceFactor, [
      toModifier(`Instynkt napastnika ${support.name}`, ((skill(support, ['shots', 'finishing', 'Strzały', 'Precyzja'], support.ovr) - 55) / 480) * sliceFactor),
      toModifier(`Przewaga atak-obrona ${teamInAttack.name}`, attackSupport * sliceFactor),
      toModifier('Presja wyniku', scorePressure * sliceFactor)
    ]);

    if (rollProbability(shotBreakdown)) {
      const shotPower = (skill(support, ['shots', 'finishing', 'Strzały', 'Precyzja'], support.ovr) + Number(teamInAttack.ratingAverage || support.ovr)) / 2;
      const savePower = (skill(keeper, ['shotStopping', 'reflexes', 'Obrona strzałów', 'Refleks'], keeper.ovr) + Number(keeper.ovr || 50)) / 2;
      const goalBreakdown = buildProbabilityDetails('Zamiana strzału na gola', 0.24, [
        toModifier(`Wykończenie ${support.name}`, (shotPower - 55) / 210),
        toModifier(`Refleks ${keeper.name}`, -((savePower - 55) / 210)),
        toModifier(`Przewaga jakości ${teamInAttack.name}`, attackSupport / 2)
      ]);

      if (rollProbability(goalBreakdown)) {
        events.push(createEvent(
          elapsedSeconds,
          minute,
          'goal',
          support.id,
          teamInAttack.id,
          `GOOOL! ${support.name} pokonuje ${keeper.name}.`,
          goalBreakdown
        ));
        if (attacker.id !== support.id) {
          events.push(createEvent(
            elapsedSeconds,
            minute,
            'assist',
            attacker.id,
            teamInAttack.id,
            `Asysta: ${attacker.name}.`,
            goalBreakdown
          ));
        }
        events.push(createEvent(
          elapsedSeconds,
          minute,
          'goal_conceded',
          null,
          teamInDefense.id,
          `${keeper.name} traci bramkę.`,
          invertProbabilityDetails('Szansa obrony tej sytuacji', goalBreakdown),
          { targetPlayerId: keeper.id }
        ));
        if (teamInAttack.id === teamA.id) score.teamA += 1;
        else score.teamB += 1;
      } else {
        events.push(createEvent(
          elapsedSeconds,
          minute,
          'save',
          keeper.id,
          teamInDefense.id,
          `${keeper.name} broni strzał ${support.name}.`,
          invertProbabilityDetails('Udana obrona bramkarza', goalBreakdown)
        ));

        const clearanceBreakdown = buildProbabilityDetails('Wybicie po obronie', 0.45, [
          toModifier(`Ustawienie ${defender.name}`, (skill(defender, ['interceptions', 'tackling', 'Przechwyty', 'Odbiór'], defender.ovr) - 55) / 280),
          toModifier('Chaos po strzale', timePressure / 4)
        ]);

        if (rollProbability(clearanceBreakdown)) {
          events.push(createEvent(
            elapsedSeconds,
            minute,
            'clearance',
            defender.id,
            teamInDefense.id,
            `${defender.name} wybija piłkę po interwencji bramkarza.`,
            clearanceBreakdown
          ));
        }
      }
    }

    const sprintBreakdown = buildProbabilityDetails('Dynamiczny sprint', 0.18 * sliceFactor, [
      toModifier(`Motoryka ${support.name}`, ((skill(support, ['dribbling', 'Drybling'], support.ovr) - 55) / 700) * sliceFactor),
      toModifier('Otwartość meczu', (Math.abs(score.teamA - score.teamB) <= 1 ? 0.02 : -0.01) * sliceFactor)
    ]);

    if (rollProbability(sprintBreakdown)) {
      const runner = pick(attackers);
      if (runner) {
        events.push(createEvent(
          elapsedSeconds,
          minute,
          'sprint',
          runner.id,
          teamInAttack.id,
          `${runner.name} rusza dynamicznym sprintem.`,
          sprintBreakdown
        ));
      }
    }

    const injuryBreakdown = buildProbabilityDetails('Ryzyko urazu w tej akcji', 0.012 * sliceFactor, [
      toModifier('Późna faza meczu', timePressure * sliceFactor),
      toModifier('Intensywność pojedynków', Math.max(0, foulBreakdown.final - 0.02) / 5)
    ]);

    if (rollProbability(injuryBreakdown)) {
      const injured = pick([...attackers, ...defenders]);
      if (injured) {
        events.push(createEvent(
          elapsedSeconds,
          minute,
          'injury',
          injured.id,
          injured.teamId,
          `Kontuzja! ${injured.name} potrzebuje pomocy medycznej.`,
          injuryBreakdown
        ));
      }
    }

    return events;
  }

  function generateMinuteEvent({ minute, teamA, teamB, score }) {
    return generateTimeSliceEvents({
      elapsedSeconds: minute * 60,
      sliceSeconds: 60,
      teamA,
      teamB,
      score
    });
  }

  return {
    generateMinuteEvent,
    generateTimeSliceEvents
  };
})();
