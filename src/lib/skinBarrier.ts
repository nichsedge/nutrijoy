import { SkinBarrierScore } from './types';

export function calculateSkinBarrierScore(
  omega3Mg: number = 0,
  vitaminEMg: number = 0,
  waterMl: number = 0,
  gentleCleanserUsed: boolean = true,
  acExposureHours: number = 0
): SkinBarrierScore {
  // 1. Lipid nutrition (40 pts max: Omega-3 25pts, Vit E 15pts)
  const omegaScore = Math.min(25, (omega3Mg / 1100) * 25);
  const vitEScore = Math.min(15, (vitaminEMg / 15) * 15);
  const lipidScore = omegaScore + vitEScore;

  // 2. Hydration cushion (35 pts max)
  const hydrationScore = Math.min(35, (waterMl / 2000) * 35);

  // 3. Gentle cleansing habit (+15 pts)
  const cleanserScore = gentleCleanserUsed ? 15 : 5;

  // 4. AC / dry air environmental penalty (up to -15 pts for >8h AC)
  const acPenalty = Math.min(15, Math.max(0, (acExposureHours - 2) * 2.5));

  const rawTotal = lipidScore + hydrationScore + cleanserScore - acPenalty;
  const score = Math.max(0, Math.min(100, Math.round(rawTotal)));

  if (score >= 80) {
    return {
      score,
      status: 'optimal',
      tewlLevel: 'Low (Fortified Lipid Shield)',
      labelEn: 'Fortified Lipid Shield ✨',
      labelId: 'Barrier Kulit Kuat & Terlindungi ✨',
      tipEn: 'Stratum corneum is supple and packed with ceramides. Transepidermal water loss is minimal — skin is glowing and calm.',
      tipId: 'Lapisan stratum korneum sangat kenyal dan kaya ceramide. Penguapan air kulit minimal — wajah tenang, lembap, dan glowing.',
      colorClass: 'text-emerald-700 bg-emerald-50 border-emerald-200'
    };
  } else if (score >= 55) {
    return {
      score,
      status: 'optimal',
      tewlLevel: 'Normal TEWL',
      labelEn: 'Balanced Barrier 🌿',
      labelId: 'Barrier Kulit Cukup Seimbang 🌿',
      tipEn: 'Healthy barrier foundation. Keep boosting avocado, olive oil, and 2000ml water to lock in deep plumpness.',
      tipId: 'Kondisi barrier baik. Pertahankan asupan alpukat, minyak zaitun, dan 2000ml air untuk menjaga kekenyalan kulit.',
      colorClass: 'text-sky-700 bg-sky-50 border-sky-200'
    };
  } else if (score >= 35) {
    return {
      score,
      status: 'vulnerable',
      tewlLevel: 'Elevated TEWL',
      labelEn: 'Dehydrated / Vulnerable 💧',
      labelId: 'Dehidrasi & Rentan Iritasi 💧',
      tipEn: 'Elevated water evaporation. Skin may feel tight after washing. Add ceramide cream and increase healthy omega fats today.',
      tipId: 'Tingkat penguapan air meningkat. Kulit terasa agak kencang/kering setelah cuci muka. Tambahkan krim ceramide dan asupan omega-3.',
      colorClass: 'text-amber-700 bg-amber-50 border-amber-200'
    };
  } else {
    return {
      score,
      status: 'compromised',
      tewlLevel: 'High TEWL (Compromised)',
      labelEn: 'Barrier Compromised ⚠️',
      labelId: 'Barrier Terganggu / Perlu Pemulihan ⚠️',
      tipEn: 'Micro-damage to lipid mantle. Activate "Barrier Rescue Mode": pause harsh acids/retinoids, apply panthenol/ceramides, and slug at night.',
      tipId: 'Lapisan pelindung lipid terganggu. Aktifkan "Mode Pemulihan Barrier": istirahatkan asam/retinol, gunakan panthenol & ceramide tebal.',
      colorClass: 'text-rose-700 bg-rose-50 border-rose-200'
    };
  }
}

export const BARRIER_RESCUE_STEPS = [
  {
    step: 1,
    icon: '⏸️',
    titleEn: '1. Pause Direct Actives',
    titleId: '1. Istirahatkan Bahan Aktif Keras',
    descEn: 'Stop AHA/BHA, retinol, and high % Vitamin C for 48–72 hours to allow skin desmosomes to heal.',
    descId: 'Hentikan AHA/BHA, retinol, dan Vitamin C konsentrasi tinggi selama 48–72 jam untuk memberi waktu pemulihan.'
  },
  {
    step: 2,
    icon: '🧴',
    titleEn: '2. Layer Ceramides & Panthenol',
    titleId: '2. Lapisi Ceramide & Panthenol',
    descEn: 'Apply soothing hyaluronic acid and multi-ceramide barrier balm directly on damp skin.',
    descId: 'Gunakan pelembap kaya ceramide, panthenol, dan centella pada kulit yang masih agak lembap.'
  },
  {
    step: 3,
    icon: '🥑',
    titleEn: '3. Lipid Matrix Nutrition',
    titleId: '3. Asupan Nutrisi Lipid Internal',
    descEn: 'Nourish the cellular bilayer from within: eat avocado, wild salmon, walnuts, and drink mineral water.',
    descId: 'Beri nutrisi lapisan lipid dari dalam: konsumsi alpukat, salmon, kenari, dan cukupi air mineral.'
  }
];
