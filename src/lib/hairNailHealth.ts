import { CyclePhase } from './types';

export interface HairNailScore {
  biotinScore: number;    // 0–100
  ironScore: number;      // 0–100 (from food logs approximation)
  zincScore: number;      // 0–100
  omega3Score: number;    // 0–100
  vitaminEScore: number;  // 0–100
  total: number;          // 0–100 weighted
  label: string;
  labelId: string;
  tip: string;
  tipId: string;
  colorClass: string;
}

export interface HairNailAssessment {
  id: string;
  timestamp: number;
  shedding: 'normal' | 'increased' | 'significant';
  nailCondition: 'strong' | 'brittle' | 'ridged';
  scalpCondition: 'healthy' | 'dry' | 'oily' | 'irritated';
  notes?: string;
}

// Daily targets
const TARGETS = {
  biotin: 30,        // mcg
  zinc: 8,           // mg
  omega3: 1100,      // mg
  vitaminE: 15,      // mg
};

export function calculateHairNailScore(
  biotin: number,
  zinc: number,
  omega3: number,
  vitaminE: number,
  iron: number = 0 // approximate — if tracked via food logs in future
): HairNailScore {
  const biotinScore = Math.min(100, (biotin / TARGETS.biotin) * 100);
  const zincScore = Math.min(100, (zinc / TARGETS.zinc) * 100);
  const omega3Score = Math.min(100, (omega3 / TARGETS.omega3) * 100);
  const vitaminEScore = Math.min(100, (vitaminE / TARGETS.vitaminE) * 100);
  // Iron not in current FoodLogEntry, approximate from zinc correlation
  const ironScore = Math.min(100, iron > 0 ? (iron / 18) * 100 : zincScore * 0.7);

  // Weighted average: Biotin 30%, Zinc 20%, Omega-3 20%, Vit E 20%, Iron 10%
  const total = Math.round(
    biotinScore * 0.3 +
    zincScore * 0.2 +
    omega3Score * 0.2 +
    vitaminEScore * 0.2 +
    ironScore * 0.1
  );

  const label = total >= 80
    ? 'Thriving Hair & Nails 💅'
    : total >= 55
    ? 'Good Vitality 🌟'
    : total >= 30
    ? 'Needs Boosting 💊'
    : 'Deficiency Risk ⚠️';

  const labelId = total >= 80
    ? 'Rambut & Kuku Sehat 💅'
    : total >= 55
    ? 'Vitalitas Cukup Baik 🌟'
    : total >= 30
    ? 'Perlu Ditingkatkan 💊'
    : 'Risiko Kekurangan ⚠️';

  const colorClass = total >= 80
    ? 'text-pink-700 bg-pink-50 border-pink-200'
    : total >= 55
    ? 'text-violet-700 bg-violet-50 border-violet-200'
    : total >= 30
    ? 'text-amber-700 bg-amber-50 border-amber-200'
    : 'text-rose-700 bg-rose-50 border-rose-200';

  const { tip, tipId } = getHairNailTip(biotinScore, zincScore, omega3Score, vitaminEScore);

  return {
    biotinScore: Math.round(biotinScore),
    ironScore: Math.round(ironScore),
    zincScore: Math.round(zincScore),
    omega3Score: Math.round(omega3Score),
    vitaminEScore: Math.round(vitaminEScore),
    total,
    label,
    labelId,
    tip,
    tipId,
    colorClass
  };
}

function getHairNailTip(biotin: number, zinc: number, omega3: number, vitE: number) {
  const weakest = Math.min(biotin, zinc, omega3, vitE);
  if (weakest === biotin) {
    return {
      tip: 'Biotin is lowest. Eat eggs, salmon, or sunflower seeds to boost keratin synthesis for thicker hair and stronger nails.',
      tipId: 'Biotin paling rendah. Konsumsi telur, salmon, atau biji bunga matahari untuk meningkatkan sintesis keratin, rambut lebih tebal dan kuku lebih kuat.'
    };
  }
  if (weakest === zinc) {
    return {
      tip: 'Zinc is low. Pumpkin seeds, chickpeas, or beef support follicle repair and prevent hair shedding.',
      tipId: 'Zinc rendah. Biji labu, kacang arab, atau daging sapi mendukung perbaikan folikel dan mencegah kerontokan rambut.'
    };
  }
  if (weakest === omega3) {
    return {
      tip: 'Omega-3 is low. Fatty fish, walnuts, or chia seeds nourish scalp sebaceous glands and add hair shine.',
      tipId: 'Omega-3 rendah. Ikan berlemak, kenari, atau biji chia menutrisi kelenjar sebasea kulit kepala dan menambah kilap rambut.'
    };
  }
  return {
    tip: 'Vitamin E is low. Avocado, almonds, and olive oil boost scalp circulation and protect follicles from oxidative damage.',
    tipId: 'Vitamin E rendah. Alpukat, almond, dan minyak zaitun meningkatkan sirkulasi kulit kepala dan melindungi folikel dari kerusakan oksidatif.'
  };
}

/**
 * Phase-aware hair health tip based on cycle phase
 */
export function getPhaseHairTip(phase: CyclePhase, language: 'en' | 'id' = 'en'): string {
  const tips: Record<CyclePhase, { en: string; id: string }> = {
    menstrual: {
      en: 'Iron loss during menstruation can cause temporary shedding. Boost iron-rich foods (spinach, lentils, red meat) now.',
      id: 'Kehilangan zat besi saat haid bisa menyebabkan kerontokan sementara. Perbanyak makanan kaya zat besi (bayam, lentil, daging merah) sekarang.'
    },
    follicular: {
      en: 'Follicular phase = peak hair growth window! Rising estrogen strengthens hair shafts. This is the best time for scalp massage and nourishing hair masks.',
      id: 'Fase folikular = jendela pertumbuhan rambut terbaik! Estrogen yang meningkat memperkuat batang rambut. Waktu terbaik untuk pijat kulit kepala dan masker rambut bergizi.'
    },
    ovulatory: {
      en: 'Peak estrogen = maximum hair volume and shine today! Your hair is at its most lustrous — protect it with UV shield and silk pillowcase.',
      id: 'Puncak estrogen = volume dan kilap rambut maksimal hari ini! Rambutmu paling berkilau — lindungi dengan perlindungan UV dan sarung bantal sutra.'
    },
    luteal: {
      en: 'Progesterone rise can increase scalp oiliness. Use gentle clarifying shampoo and add zinc-rich foods to balance sebum.',
      id: 'Peningkatan progesteron bisa membuat kulit kepala lebih berminyak. Gunakan sampo gentle clarifying dan tambahkan makanan kaya zinc untuk menyeimbangkan sebum.'
    }
  };
  return language === 'id' ? tips[phase].id : tips[phase].en;
}
