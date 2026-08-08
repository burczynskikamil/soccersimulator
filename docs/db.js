// db.js - Supabase Database Integration
const SUPABASE_URL = 'https://yalonumbdvecrxnxtumj.supabase.co';
const SUPABASE_KEY = 'sb_publishable_s8l_Fpx_M1gKapcXjqYnsg_nyssQYpW';

let supabaseClient = null;

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
  } catch (err) {
    console.error('Database init error:', err);
  }
}

// ============ PLAYERS ============

async function savePlayers(players) {
  if (!supabaseClient) await initSupabase();
  
  try {
    // Upsert players (insert or update based on id)
    const { error } = await supabaseClient
      .from('players')
      .upsert(
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
        })),
        { onConflict: 'id' }
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
    // Upsert teams (insert or update based on id)
    const { error } = await supabaseClient
      .from('teams')
      .upsert(
        teams.map(t => ({
          id: t.id,
          name: t.name,
          country: t.country,
          country_name: t.countryName,
          country_flag: t.countryFlag,
          logo: t.logo || null,
          budget: t.budget || 1000000,
          created_at: new Date(t.created).toISOString()
        })),
        { onConflict: 'id' }
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

// Export for use in app.js
window.db = {
  initSupabase,
  savePlayers,
  loadPlayers,
  deletePlayer,
  saveTeams,
  loadTeams,
  deleteTeam
};
