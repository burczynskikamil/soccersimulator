// modules/match/team-selector.js
window.matchTeamSelector = (() => {
  const requiredSlots = ['GK', 'CB', 'CB', 'CM', 'CM', 'ST'];

  function sortByOvrDesc(players) {
    return [...players].sort((a, b) => Number(b.ovr || 0) - Number(a.ovr || 0));
  }

  function buildBestLineup(teamId) {
    const players = sortByOvrDesc(playerState.getAll().filter((p) => p.teamId === teamId));
    const used = new Set();

    const pick = (position) => {
      const candidate = players.find((p) => p.position === position && !used.has(p.id))
        || players.find((p) => !used.has(p.id));
      if (!candidate) return null;
      used.add(candidate.id);
      return candidate;
    };

    const slots = {
      GK: pick('GK'),
      CB: [pick('CB'), pick('CB')].filter(Boolean),
      CM: [pick('CM'), pick('CM')].filter(Boolean),
      ST: pick('ST')
    };

    const starters = [slots.GK, ...slots.CB, ...slots.CM, slots.ST].filter(Boolean);
    const ratingAverage = starters.length
      ? starters.reduce((sum, player) => sum + Number(player.ovr || 0), 0) / starters.length
      : 0;

    starters.forEach((player) => {
      player.teamId = teamId;
    });

    return {
      id: teamId,
      slots,
      starters,
      isComplete: starters.length === requiredSlots.length,
      ratingAverage
    };
  }

  function lineupRow(player, slotLabel) {
    if (!player) return `<div class="lineup-row"><span>${slotLabel}</span><span>Brak zawodnika</span></div>`;
    return `<div class="lineup-row"><span>${slotLabel}</span><span>${player.name} (${player.position}, OVR ${player.ovr})</span></div>`;
  }

  function renderLineupPreview(teamId, containerId) {
    const container = el(containerId);
    const team = teamState.getById(teamId);
    if (!container) return;

    if (!teamId || !team) {
      container.innerHTML = '<p class="muted">Wybierz drużynę, aby zobaczyć skład.</p>';
      return;
    }

    const lineup = buildBestLineup(teamId);
    matchState.setLineup(teamId, lineup);

    container.innerHTML = `
      <div class="lineup-header">
        <img src="${team.logo || 'data:image/svg+xml,<svg></svg>'}" alt="${team.name}" />
        <div>
          <h4>${team.name}</h4>
          <p>Średni OVR: ${lineup.ratingAverage.toFixed(1)}</p>
        </div>
      </div>
      <div class="lineup-list">
        ${lineupRow(lineup.slots.GK, 'GK')}
        ${lineupRow(lineup.slots.CB[0], 'CB')}
        ${lineupRow(lineup.slots.CB[1], 'CB')}
        ${lineupRow(lineup.slots.CM[0], 'CM')}
        ${lineupRow(lineup.slots.CM[1], 'CM')}
        ${lineupRow(lineup.slots.ST, 'ST')}
      </div>
      ${lineup.isComplete ? '' : '<p class="lineup-warning">Uwaga: drużyna nie ma pełnej szóstki zawodników.</p>'}
    `;
  }

  function renderSelectors() {
    const teams = teamState.getAll();
    const teamASelect = el('match-team-a');
    const teamBSelect = el('match-team-b');

    if (!teamASelect || !teamBSelect) return;

    const options = teams.map((team) => `<option value="${team.id}">${team.name}</option>`).join('');
    teamASelect.innerHTML = `<option value="">Wybierz drużynę A</option>${options}`;
    teamBSelect.innerHTML = `<option value="">Wybierz drużynę B</option>${options}`;
  }

  function onSelectionChange() {
    const teamAId = el('match-team-a').value;
    const teamBId = el('match-team-b').value;
    matchState.setTeams(teamAId, teamBId);

    renderLineupPreview(teamAId, 'match-lineup-a');
    renderLineupPreview(teamBId, 'match-lineup-b');

    const startButton = el('start-friendly-match');
    if (startButton) {
      startButton.disabled = !teamAId || !teamBId || teamAId === teamBId;
    }
  }

  function init() {
    renderSelectors();

    const teamASelect = el('match-team-a');
    const teamBSelect = el('match-team-b');

    if (teamASelect && teamBSelect) {
      teamASelect.onchange = onSelectionChange;
      teamBSelect.onchange = onSelectionChange;
    }

    const startButton = el('start-friendly-match');
    if (startButton) {
      startButton.onclick = () => window.startFriendlyMatchSimulation();
      startButton.disabled = true;
    }

    onSelectionChange();
  }

  return {
    init,
    renderSelectors,
    buildBestLineup,
    renderLineupPreview
  };
})();
