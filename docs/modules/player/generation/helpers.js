// modules/player/generation/helpers.js

// ===== SKILL MODEL (single source of truth) =====
window.FIELD_SKILLS = [
  'shots',        // strzały
  'headers',      // główki
  'tackling',     // odbiór
  'marking',      // krycie
  'speed',        // szybkość
  'dribbling',    // drybling
  'acceleration', // przyspieszenie
  'strength',     // siła
  'vision',       // wizja
  'passing',      // podanie
  'stamina'       // kondycja
];

window.GK_SKILLS = [
  'oneOnOne',     // sam na sam
  'shotStopping', // obrona strzałów
  'handling'      // łapanie
];

// Etykiety PL do UI
window.SKILL_LABELS_PL = {
  shots: 'Strzały',
  headers: 'Główki',
  tackling: 'Odbiór',
  marking: 'Krycie',
  speed: 'Szybkość',
  dribbling: 'Drybling',
  acceleration: 'Przyspieszenie',
  strength: 'Siła',
  vision: 'Wizja',
  passing: 'Podanie',
  stamina: 'Kondycja',
  oneOnOne: 'Sam na sam',
  shotStopping: 'Obrona strzałów',
  handling: 'Łapanie'
};

// ===== GENERATION HELPERS =====
window.clampSkill = (v) => Math.max(1, Math.min(99, Math.round(v)));

window.randFloat = (min, max) => Math.random() * (max - min) + min;

// Lekko zależne od pozycji (różnice ~1-2 pp)
window.getPositionSkillOffsets = (position) => {
  // dodatnie => ciut większa szansa / wyższy wynik, ujemne => ciut niższa
  // bardzo subtelne różnice (ok. 1-2)
  const base = {
    shots: 0,
    headers: 0,
    tackling: 0,
    marking: 0,
    speed: 0,
    dribbling: 0,
    acceleration: 0,
    strength: 0,
    vision: 0,
    passing: 0,
    stamina: 0
  };

  if (position === 'ST') {
    return {
      ...base,
      shots: 2, headers: 1, dribbling: 2, acceleration: 2, speed: 1,
      passing: -1, vision: -1, tackling: -2, marking: -2
    };
  }

  if (position === 'CM') {
    return {
      ...base,
      passing: 2, vision: 2, stamina: 1, dribbling: 1,
      shots: 0, tackling: 0, marking: 0, speed: 0, acceleration: 0, strength: 0, headers: 0
    };
  }

  if (position === 'CB') {
    return {
      ...base,
      tackling: 2, marking: 2, strength: 1, headers: 1,
      shots: -2, dribbling: -1, acceleration: -1, vision: -1, passing: -1
    };
  }

  return base;
};

// bazowy zakres umiejętności (możesz dopasować pod balans)
window.getSkillBaseRange = (ovr = 60) => {
  const min = Math.max(30, ovr - 14);
  const max = Math.min(90, ovr + 14);
  return { min, max };
};

// generuje komplet skilli zależnie od pozycji
window.generateSkillsByPosition = (position, ovr = 60) => {
  // GK ma tylko 3 skille
  if (position === 'GK') {
    const { min, max } = getSkillBaseRange(ovr);
    return {
      oneOnOne: clampSkill(randFloat(min, max)),
      shotStopping: clampSkill(randFloat(min, max)),
      handling: clampSkill(randFloat(min, max))
    };
  }

  // Zawodnicy z pola: pełny zestaw 11 skilli
  const { min, max } = getSkillBaseRange(ovr);
  const offsets = getPositionSkillOffsets(position);

  const out = {};
  FIELD_SKILLS.forEach((k) => {
    const raw = randFloat(min, max) + (offsets[k] || 0);
    out[k] = clampSkill(raw);
  });

  return out;
};

// OVR z nowych skilli (prosty średni model)
window.computeOvrFromSkills = (position, skills) => {
  const keys = position === 'GK' ? GK_SKILLS : FIELD_SKILLS;
  const sum = keys.reduce((acc, k) => acc + (Number(skills[k]) || 0), 0);
  return clampSkill(sum / keys.length);
};
