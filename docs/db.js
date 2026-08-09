// db.js - Supabase Database Integration
const SUPABASE_URL = 'https://yalonumbdvecrxnxtumj.supabase.co';
const SUPABASE_KEY = 'sb_publishable_s8l_Fpx_M1gKapcXjqYnsg_nyssQYpW';

let supabaseClient = null;
let localPlayersCache = []; // Cache to preserve players during saves

async function initSupabase() {
  const { createClient } = window.supabase;
  supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);
  
  console.log('🔌 Supabase initialized');
  
  // Initialize database schema if needed
  await initializeDatabase();
}

async function initializeDatabase() {
  try {
    // Check if players table exists
    const { data, error } = await supabaseClient
      .from('players')
      .select('id')
      .limit(1);
    
    if (error && error.code === 'PGRST116') {
      console.log('📊 Players table needs to be created in Supabase console');
    } else {
      console.log('✅ Players table exists');
    }

    // Check if teams table exists
    const { error: teamsError } = await supabaseClient
      .from('teams')
      .select('id')
      .limit(1);
    
    if (teamsError && teamsError.code === 'PGRST116') {
      console.log('📊 Teams table needs to be created in Supabase console');
    } else {
      console.log('✅ Teams table exists');
    }

    const matchTables = ['matches', 'match_events', 'player_match_stats', 'player_career_stats', 'team_stats'];
    for (const tableName of matchTables) {
      const { error: tableError } = await supabaseClient
        .from(tableName)
        .select('id')
        .limit(1);
      if (tableError && tableError.code === 'PGRST205') {
        console.log(`📊 ${tableName} table needs to be created in Supabase console`);
      }
    }
  } catch (err) {
    console.error('Database init error:', err);
  }
}

// ============ PLAYERS ============

async function savePlayers(players) {
  if (!supabaseClient) await initSupabase();
  
  try {
    // Update local cache
    localPlayersCache = players;
    
    // Delete all existing players
    await supabaseClient.from('players').delete().neq('id', '');
    
    // Insert new players
    const { error } = await supabaseClient
      .from('players')
      .insert(
        players.map(p => ({
          id: p.id,
          name: p.name,
          age: p.age,
          position: p.position,
          country: p.country,
          country_name: p.countryName,
          country_flag: p.countryFlag,
          country_color: p.countryColor,
          height_cm: p.height,
          real_potential: p.realPotential,
          hidden_potential_min: p.hiddenPotentialMin,
          hidden_potential_max: p.hiddenPotentialMax,
          ovr: p.ovr,
          growth_rate: p.growth,
          value: p.value || 0,
          team_id: p.teamId || null,
          skills: p.skills
        }))
      );
    
    if (error) throw error;
    console.log('💾 Players saved to database');
  } catch (err) {
    console.error('Save players error:', err);
    throw err;
  }
}

async function loadPlayers() {
  if (!supabaseClient) await initSupabase();
  
  try {
    const { data, error } = await supabaseClient
      .from('players')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    console.log(`📥 Loaded ${data.length} players from database`);
    
    return (data || []).map(p => ({
      id: p.id,
      name: p.name,
      age: p.age,
      position: p.position || 'ST',
      country: p.country,
      countryName: p.country_name,
      countryFlag: p.country_flag,
      countryColor: p.country_color,
      height: p.height_cm || 180,
      realPotential: p.real_potential,
      hiddenPotentialMin: p.hidden_potential_min,
      hiddenPotentialMax: p.hidden_potential_max,
      ovr: p.ovr,
      growth: p.growth_rate || 0.65,
      value: p.value || 0,
      teamId: p.team_id || null,
      skills: p.skills || {},
      created: p.created_at ? new Date(p.created_at).getTime() : Date.now()
    }));
  } catch (err) {
    console.error('Load players error:', err);
    return [];
  }
}

async function deletePlayer(id) {
  if (!supabaseClient) await initSupabase();
  
  try {
    const { error } = await supabaseClient
      .from('players')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    console.log('🗑️ Player deleted from database');
  } catch (err) {
    console.error('Delete player error:', err);
    throw err;
  }
}

// ============ TEAMS ============

async function saveTeams(teams) {
  if (!supabaseClient) await initSupabase();
  
  try {
    // Delete all existing teams
    await supabaseClient.from('teams').delete().neq('id', '');
    
    // Insert new teams
    const { error } = await supabaseClient
      .from('teams')
      .insert(
        teams.map(t => ({
          id: t.id,
          name: t.name,
          country: t.country,
          country_name: t.countryName,
          country_flag: t.countryFlag,
          logo: t.logo || null,
          budget: t.budget || 1000000,
          created_at: new Date(t.created).toISOString()
        }))
      );
    
    if (error) throw error;
    console.log('💾 Teams saved to database');
  } catch (err) {
    console.error('Save teams error:', err);
    throw err;
  }
}

async function loadTeams() {
  if (!supabaseClient) await initSupabase();
  
  try {
    const { data, error } = await supabaseClient
      .from('teams')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    console.log(`📥 Loaded ${data.length} teams from database`);
    
    return (data || []).map(t => ({
      id: t.id,
      name: t.name,
      country: t.country,
      countryName: t.country_name,
      countryFlag: t.country_flag,
      logo: t.logo || null,
      budget: t.budget || 1000000,
      created: t.created_at ? new Date(t.created_at).getTime() : Date.now()
    }));
  } catch (err) {
    console.error('Load teams error:', err);
    return [];
  }
}

async function deleteTeam(id) {
  if (!supabaseClient) await initSupabase();
  
  try {
    const { error } = await supabaseClient
      .from('teams')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    console.log('🗑️ Team deleted from database');
  } catch (err) {
    console.error('Delete team error:', err);
    throw err;
  }
}



// ============ FRIENDLY MATCHES ============

async function saveMatchSimulation(result) {
  if (!supabaseClient) await initSupabase();

  const nowIso = new Date().toISOString();
  const matchRow = {
    id: result.id,
    team_a_id: result.teamA.id,
    team_b_id: result.teamB.id,
    team_a_score: result.score.teamA,
    team_b_score: result.score.teamB,
    status: result.status || 'finished',
    started_at: result.startedAt || nowIso,
    finished_at: result.finishedAt || nowIso,
    created_at: nowIso
  };

  const { error: matchError } = await supabaseClient.from('matches').insert(matchRow);
  if (matchError) throw matchError;

  if (Array.isArray(result.events) && result.events.length) {
    const eventRows = result.events.map((event) => ({
      id: `evt_${Math.random().toString(36).slice(2, 10)}`,
      match_id: result.id,
      minute: event.minute,
      player_id: event.playerId || null,
      team_id: event.teamId || null,
      event_type: event.eventType,
      description: event.description
    }));
    const { error: eventsError } = await supabaseClient.from('match_events').insert(eventRows);
    if (eventsError) throw eventsError;
  }

  const statRows = (result.playerStats || []).map((stats) => ({
    id: stats.id || `pms_${Math.random().toString(36).slice(2, 10)}`,
    match_id: result.id,
    player_id: stats.playerId,
    minutes_played: stats.minutes_played,
    goals: stats.goals,
    assists: stats.assists,
    passes_total: stats.passes_total,
    passes_accurate: stats.passes_accurate,
    tackles: stats.tackles,
    interceptions: stats.interceptions,
    fouls: stats.fouls,
    yellow_cards: stats.yellow_cards,
    red_cards: stats.red_cards,
    dribbles: stats.dribbles,
    saves: stats.saves,
    rating: stats.rating
  }));

  if (statRows.length) {
    const { error: statsError } = await supabaseClient.from('player_match_stats').insert(statRows);
    if (statsError) throw statsError;
  }

  await Promise.all((result.playerStats || []).map(async (stats) => {
    const { data: currentRows } = await supabaseClient
      .from('player_career_stats')
      .select('*')
      .eq('player_id', stats.playerId)
      .limit(1);

    const current = currentRows && currentRows[0];
    const matchesPlayed = Number(current?.matches_played || 0) + 1;
    const previousAverage = Number(current?.average_rating || 0);
    const previousMatches = Number(current?.matches_played || 0);
    const newAverage = ((previousAverage * previousMatches) + Number(stats.rating || 6)) / matchesPlayed;

    await supabaseClient.from('player_career_stats').upsert({
      id: current?.id || `pcs_${Math.random().toString(36).slice(2, 10)}`,
      player_id: stats.playerId,
      matches_played: matchesPlayed,
      goals: Number(current?.goals || 0) + Number(stats.goals || 0),
      assists: Number(current?.assists || 0) + Number(stats.assists || 0),
      average_rating: Number(newAverage.toFixed(2)),
      updated_at: nowIso
    }, { onConflict: 'player_id' });
  }));

  const teamSummaries = [
    {
      teamId: result.teamA.id,
      goalsFor: result.score.teamA,
      goalsAgainst: result.score.teamB,
      result: result.score.teamA === result.score.teamB ? 'draw' : (result.score.teamA > result.score.teamB ? 'win' : 'loss')
    },
    {
      teamId: result.teamB.id,
      goalsFor: result.score.teamB,
      goalsAgainst: result.score.teamA,
      result: result.score.teamA === result.score.teamB ? 'draw' : (result.score.teamB > result.score.teamA ? 'win' : 'loss')
    }
  ];

  await Promise.all(teamSummaries.map(async (summary) => {
    const { data: currentRows } = await supabaseClient
      .from('team_stats')
      .select('*')
      .eq('team_id', summary.teamId)
      .limit(1);

    const current = currentRows && currentRows[0];
    await supabaseClient.from('team_stats').upsert({
      id: current?.id || `ts_${Math.random().toString(36).slice(2, 10)}`,
      team_id: summary.teamId,
      matches_played: Number(current?.matches_played || 0) + 1,
      wins: Number(current?.wins || 0) + (summary.result === 'win' ? 1 : 0),
      draws: Number(current?.draws || 0) + (summary.result === 'draw' ? 1 : 0),
      losses: Number(current?.losses || 0) + (summary.result === 'loss' ? 1 : 0),
      goals_for: Number(current?.goals_for || 0) + summary.goalsFor,
      goals_against: Number(current?.goals_against || 0) + summary.goalsAgainst,
      updated_at: nowIso
    }, { onConflict: 'team_id' });
  }));
}

async function loadPlayerCareerStats(playerId) {
  if (!supabaseClient) await initSupabase();
  const { data, error } = await supabaseClient
    .from('player_career_stats')
    .select('*')
    .eq('player_id', playerId)
    .limit(1);
  if (error) return null;
  return data && data[0] ? data[0] : null;
}

async function loadPlayerMatchHistory(playerId, limit = 5) {
  if (!supabaseClient) await initSupabase();

  const { data: statRows, error: statsError } = await supabaseClient
    .from('player_match_stats')
    .select('match_id, goals, assists, rating, created_at')
    .eq('player_id', playerId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (statsError || !statRows?.length) return [];

  const matchIds = statRows.map((row) => row.match_id);
  const { data: matches } = await supabaseClient
    .from('matches')
    .select('id, team_a_id, team_b_id, team_a_score, team_b_score, finished_at')
    .in('id', matchIds);

  const player = playerState.getById(playerId);

  return statRows.map((row) => {
    const match = (matches || []).find((item) => item.id === row.match_id);
    if (!match) return null;

    const isTeamA = player?.teamId && match.team_a_id === player.teamId;
    const opponentId = isTeamA ? match.team_b_id : match.team_a_id;
    const opponent = teamState.getById(opponentId);

    return {
      matchId: row.match_id,
      date: match.finished_at || row.created_at,
      opponentName: opponent ? opponent.name : 'Nieznany przeciwnik',
      score: `${match.team_a_score}:${match.team_b_score}`,
      goals: row.goals,
      assists: row.assists,
      rating: row.rating
    };
  }).filter(Boolean);
}

async function loadTeamStats(teamId) {
  if (!supabaseClient) await initSupabase();
  const { data, error } = await supabaseClient
    .from('team_stats')
    .select('*')
    .eq('team_id', teamId)
    .limit(1);
  if (error) return null;
  return data && data[0] ? data[0] : null;
}

async function loadTeamMatchHistory(teamId, limit = 5) {
  if (!supabaseClient) await initSupabase();

  const { data: teamAMatches } = await supabaseClient
    .from('matches')
    .select('*')
    .eq('team_a_id', teamId)
    .order('finished_at', { ascending: false })
    .limit(limit);

  const { data: teamBMatches } = await supabaseClient
    .from('matches')
    .select('*')
    .eq('team_b_id', teamId)
    .order('finished_at', { ascending: false })
    .limit(limit);

  const all = [...(teamAMatches || []), ...(teamBMatches || [])]
    .sort((a, b) => new Date(b.finished_at || b.created_at) - new Date(a.finished_at || a.created_at))
    .slice(0, limit);

  return all.map((match) => {
    const isHome = match.team_a_id === teamId;
    const opponentId = isHome ? match.team_b_id : match.team_a_id;
    const opponent = teamState.getById(opponentId);
    return {
      matchId: match.id,
      date: match.finished_at,
      opponentName: opponent ? opponent.name : 'Nieznany przeciwnik',
      score: `${match.team_a_score}:${match.team_b_score}`,
      outcome: match.team_a_score === match.team_b_score
        ? 'Remis'
        : (isHome ? (match.team_a_score > match.team_b_score ? 'Wygrana' : 'Porażka') : (match.team_b_score > match.team_a_score ? 'Wygrana' : 'Porażka'))
    };
  });
}

// Export for use in app.js
window.db = {
  initSupabase,
  savePlayers,
  loadPlayers,
  deletePlayer,
  saveTeams,
  loadTeams,
  deleteTeam,
  saveMatchSimulation,
  loadPlayerCareerStats,
  loadPlayerMatchHistory,
  loadTeamStats,
  loadTeamMatchHistory
};
