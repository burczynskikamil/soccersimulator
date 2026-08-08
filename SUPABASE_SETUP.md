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
