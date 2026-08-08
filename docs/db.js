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
    // Check if players table exists by trying to fetch data
    const { data, error } = await supabaseClient
      .from('players')
      .select('id')
      .limit(1);
    
    if (error && error.code === 'PGRST116') {
      // Table doesn't exist, create it
      console.log('📊 Creating players table...');
      await createPlayersTable();
    } else {
      console.log('✅ Players table exists');
    }
  } catch (err) {
    console.error('Database init error:', err);
  }
}

async function createPlayersTable() {
  try {
    // Using PostgREST to create table via SQL
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      }
    });
    
    // Alternative: Create table using RPC or direct SQL through admin
    // For now, table must exist - user should create via Supabase console
    console.log('⚠️ Please create "players" table in Supabase console or use SQL:');
    console.log(`
CREATE TABLE players (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  position TEXT DEFAULT 'ST',
  country TEXT NOT NULL,
  country_name TEXT NOT NULL,
  country_flag TEXT,
  country_color TEXT,
  height_cm INTEGER DEFAULT 180,
  potential INTEGER,
  real_potential INTEGER,
  hidden_potential_min INTEGER,
  hidden_potential_max INTEGER,
  ovr INTEGER,
  growth_rate DECIMAL(3,2) DEFAULT 0.65,
  skills JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON players
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON players
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON players
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON players
  FOR DELETE USING (true);
    `);
  } catch (err) {
    console.error('Table creation error:', err);
  }
}

async function savePlayers(players) {
  if (!supabaseClient) await initSupabase();
  
  try {
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
          potential: p.potential,
          real_potential: p.realPotential,
          hidden_potential_min: p.hiddenPotentialMin,
          hidden_potential_max: p.hiddenPotentialMax,
          ovr: p.ovr,
          growth_rate: p.growth,
          skills: p.skills
        }))
      );
    
    if (error) throw error;
    console.log('💾 Players saved to database');
  } catch (err) {
    console.error('Save error:', err);
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
      potential: p.potential,
      realPotential: p.real_potential,
      hiddenPotentialMin: p.hidden_potential_min,
      hiddenPotentialMax: p.hidden_potential_max,
      ovr: p.ovr,
      growth: p.growth_rate || 0.65,
      skills: p.skills || {},
      created: p.created_at ? new Date(p.created_at).getTime() : Date.now()
    }));
  } catch (err) {
    console.error('Load error:', err);
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
    console.error('Delete error:', err);
    throw err;
  }
}

// Export for use in app.js
window.db = {
  initSupabase,
  savePlayers,
  loadPlayers,
  deletePlayer
};
