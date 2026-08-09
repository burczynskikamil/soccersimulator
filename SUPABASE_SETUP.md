# 🚀 SoccerSimulator - Integracja Supabase

## Co się zmieniło?

Aplikacja została przemigrowana z `localStorage` na bazę danych **Supabase PostgreSQL**. Wszystkie dane zawodników są teraz przechowywane w chmurze i synchronizowane automatycznie.

## ⚙️ Konfiguracja Supabase

### Krok 1: Utwórz tabelę `players`

Wejdź do [Supabase Dashboard](https://supabase.com/dashboard) → Twój projekt → SQL Editor

**Uruchom to SQL:**

```sql
CREATE TABLE players (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  country TEXT NOT NULL,
  country_name TEXT NOT NULL,
  country_flag TEXT,
  country_color TEXT,
  is_gk BOOLEAN DEFAULT FALSE,
  potential INTEGER,
  ovr INTEGER,
  skills JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Włącz Row Level Security
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- Polityki dostępu - publiczny dostęp do odczytu i zapisu
CREATE POLICY "Enable read access for all users" ON players
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON players
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON players
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON players
  FOR DELETE USING (true);

-- Indeksy dla wydajności
CREATE INDEX idx_players_created_at ON players(created_at DESC);
CREATE INDEX idx_players_country ON players(country);
```

### Krok 2: Zweryfikuj klucze API

W Supabase Dashboard → Settings → API powinieneś mieć:
- ✅ **Project URL**: `https://yalonumbdvecrxnxtumj.supabase.co`
- ✅ **Publishable Key (anon)**: `sb_publishable_s8l_Fpx_M1gKapcXjqYnsg_nyssQYpW`

Klucze są już skonfigurowane w `docs/db.js`

## 🎮 Jak to działa?

### Operacje dostępne:

1. **Wczytywanie zawodników** - Automatyczne przy starcie
2. **Generowanie zawodnika** - Zapisuje do bazy
3. **Usuwanie zawodnika** - Usuwana z bazy
4. **Eksport JSON** - Pobierz jako plik (bez zapisu do bazy)
5. **Import JSON** - Wczytaj i zapisz do bazy

### Wskaźnik statusu bazy:
- `⏳ Inicjalizacja bazy danych...` - Łączenie
- `✅ Baza danych połączona` - OK
- `✅ Zawodnicy zapisani` - Zapis udany
- `⚠️ Błąd bazy danych` - Problem z połączeniem

## 🔒 Bezpieczeństwo

- Klucz **publishable** jest bezpieczny do publicznego kodu (GitHub Pages)
- Tabela ma włączone **RLS** (Row Level Security)
- Polityki umożliwiają **publiczny dostęp** - zmień je jeśli potrzebna autentykacja

## 📱 Użycie

Aplikacja jest dostępna na GitHub Pages:
- https://burczynskikamil.github.io/soccersimulator/docs/

## 🐛 Jeśli coś nie działa

1. Sprawdź konsolę przeglądarki (F12 → Console)
2. Zweryfikuj czy tabela `players` została utworzona w Supabase
3. Sprawdź czy RLS polityki są włączone
4. Zweryfikuj czy klucze API są poprawne w `docs/db.js`

## 📊 Struktura bazy danych

```
players
├── id (TEXT) - Unikalny identyfikator
├── name (TEXT) - Imię i nazwisko
├── age (INTEGER) - Wiek
├── country (TEXT) - Kod kraju (PL, GB, ES, itd.)
├── country_name (TEXT) - Nazwa kraju
├── country_flag (TEXT) - URL flagi
├── country_color (TEXT) - Kolor w hex
├── is_gk (BOOLEAN) - Czy bramkarz?
├── potential (INTEGER) - Potencjał (1-99)
├── ovr (INTEGER) - Overall rating (1-99)
├── skills (JSONB) - JSON z umiejętnościami
├── created_at (TIMESTAMP) - Data utworzenia
└── updated_at (TIMESTAMP) - Data aktualizacji
```

---

**✅ Setup gotowy! Aplikacja automatycznie się połączy z bazą danych.**

## 🆕 SQL dla systemu meczów towarzyskich

Uruchom dodatkowo poniższy SQL w Supabase SQL Editor:

```sql
CREATE TABLE IF NOT EXISTS matches (
  id TEXT PRIMARY KEY,
  team_a_id TEXT NOT NULL,
  team_b_id TEXT NOT NULL,
  team_a_score INTEGER DEFAULT 0,
  team_b_score INTEGER DEFAULT 0,
  status TEXT DEFAULT 'finished',
  started_at TIMESTAMP,
  finished_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS match_events (
  id TEXT PRIMARY KEY,
  match_id TEXT NOT NULL REFERENCES matches(id),
  minute INTEGER,
  player_id TEXT,
  team_id TEXT,
  event_type TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS player_match_stats (
  id TEXT PRIMARY KEY,
  match_id TEXT NOT NULL REFERENCES matches(id),
  player_id TEXT NOT NULL,
  minutes_played INTEGER,
  goals INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  passes_total INTEGER DEFAULT 0,
  passes_accurate INTEGER DEFAULT 0,
  tackles INTEGER DEFAULT 0,
  interceptions INTEGER DEFAULT 0,
  fouls INTEGER DEFAULT 0,
  yellow_cards INTEGER DEFAULT 0,
  red_cards INTEGER DEFAULT 0,
  dribbles INTEGER DEFAULT 0,
  saves INTEGER DEFAULT 0,
  rating DECIMAL(3,2),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS player_career_stats (
  id TEXT PRIMARY KEY,
  player_id TEXT NOT NULL UNIQUE REFERENCES players(id),
  matches_played INTEGER DEFAULT 0,
  goals INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS team_stats (
  id TEXT PRIMARY KEY,
  team_id TEXT NOT NULL UNIQUE REFERENCES teams(id),
  matches_played INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  draws INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  goals_for INTEGER DEFAULT 0,
  goals_against INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```
