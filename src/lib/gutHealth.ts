import { FoodLogEntry, SkinJournalEntry } from './types';

export interface GutHealthScore {
  fiberG: number;
  fiberTarget: number;
  fiberPercent: number;
  probioticServings: number;
  probioticTarget: number;
  total: number; // 0–100
  label: string;
  labelId: string;
  tip: string;
  tipId: string;
  colorClass: string;
}

export interface ProbioticLogEntry {
  id: string;
  timestamp: number;
  foodName: string;
  foodNameId: string;
  icon: string;
  servings: number;
}

export interface ProbioticPreset {
  id: string;
  name: string;
  nameId: string;
  icon: string;
  isPrebiotic: boolean;
  benefit: string;
  benefitId: string;
}

export const PROBIOTIC_PRESETS: ProbioticPreset[] = [
  {
    id: 'yogurt',
    name: 'Greek Yogurt',
    nameId: 'Yogurt Yunani',
    icon: '🥛',
    isPrebiotic: false,
    benefit: 'L. acidophilus for gut lining repair',
    benefitId: 'L. acidophilus untuk pemulihan lapisan usus',
  },
  {
    id: 'kimchi',
    name: 'Kimchi',
    nameId: 'Kimchi',
    icon: '🥬',
    isPrebiotic: false,
    benefit: 'Live cultures reduce skin inflammation',
    benefitId: 'Bakteri hidup untuk mengurangi peradangan kulit',
  },
  {
    id: 'tempeh',
    name: 'Tempeh',
    nameId: 'Tempe',
    icon: '🫘',
    isPrebiotic: false,
    benefit: 'Fermented soy supports estrogen balance',
    benefitId: 'Kedelai fermentasi mendukung keseimbangan estrogen',
  },
  {
    id: 'kombucha',
    name: 'Kombucha',
    nameId: 'Kombucha',
    icon: '🫗',
    isPrebiotic: false,
    benefit: 'SCOBY enzymes aid digestion and glow',
    benefitId: 'Enzim SCOBY membantu pencernaan dan kilau kulit',
  },
  {
    id: 'kefir',
    name: 'Kefir',
    nameId: 'Kefir',
    icon: '🧴',
    isPrebiotic: false,
    benefit: 'Diverse strains improve skin barrier',
    benefitId: 'Berbagai strain memperkuat barrier kulit',
  },
  {
    id: 'oats',
    name: 'Oats / Prebiotic Fiber',
    nameId: 'Oat / Serat Prebiotik',
    icon: '🌾',
    isPrebiotic: true,
    benefit: 'Beta-glucan feeds good gut bacteria',
    benefitId: 'Beta-glukan memberi makan bakteri baik usus',
  },
  {
    id: 'banana',
    name: 'Banana / Resistant Starch',
    nameId: 'Pisang / Pati Resistan',
    icon: '🍌',
    isPrebiotic: true,
    benefit: 'Inulin feeds Bifidobacterium strains',
    benefitId: 'Inulin memberi nutrisi untuk bakteri Bifidobacterium',
  },
];

const FIBER_DAILY_TARGET_G = 25;
const PROBIOTIC_DAILY_TARGET_SERVINGS = 2;

export function calculateGutScore(fiberG: number, probioticServings: number): GutHealthScore {
  const fiberPercent = Math.min((fiberG / FIBER_DAILY_TARGET_G) * 100, 100);
  const probioticPercent = Math.min((probioticServings / PROBIOTIC_DAILY_TARGET_SERVINGS) * 100, 100);

  // 60% weight on fiber, 40% on probiotics
  const total = Math.round(fiberPercent * 0.6 + probioticPercent * 0.4);

  const label =
    total >= 80
      ? 'Thriving Gut Flora 🌿'
      : total >= 55
        ? 'Good Balance 🌱'
        : total >= 30
          ? 'Building Diversity 🌾'
          : 'Gut Needs Support 🆘';

  const labelId =
    total >= 80
      ? 'Flora Usus Sehat 🌿'
      : total >= 55
        ? 'Keseimbangan Cukup 🌱'
        : total >= 30
          ? 'Sedang Membangun Keanekaragaman 🌾'
          : 'Usus Butuh Dukungan 🆘';

  const { tip, tipId } = getGutTip(fiberG, probioticServings);

  const colorClass =
    total >= 80
      ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
      : total >= 55
        ? 'text-green-700 bg-green-50 border-green-200'
        : total >= 30
          ? 'text-amber-700 bg-amber-50 border-amber-200'
          : 'text-rose-700 bg-rose-50 border-rose-200';

  return {
    fiberG,
    fiberTarget: FIBER_DAILY_TARGET_G,
    fiberPercent: Math.round(fiberPercent),
    probioticServings,
    probioticTarget: PROBIOTIC_DAILY_TARGET_SERVINGS,
    total,
    label,
    labelId,
    tip,
    tipId,
    colorClass,
  };
}

function getGutTip(fiberG: number, probioticServings: number): { tip: string; tipId: string } {
  if (fiberG < 10) {
    return {
      tip: 'Very low fiber today. Add oats, legumes, or leafy greens — fiber feeds the good bacteria that reduce skin inflammation.',
      tipId:
        'Serat hari ini sangat rendah. Tambahkan oat, kacang-kacangan, atau sayuran hijau — serat memberi makan bakteri baik yang mengurangi peradangan kulit.',
    };
  }
  if (probioticServings === 0) {
    return {
      tip: 'No probiotics today. A serving of yogurt, kimchi, or tempeh can strengthen your gut-skin axis and reduce breakout frequency.',
      tipId:
        'Belum ada probiotik hari ini. Satu porsi yogurt, kimchi, atau tempe bisa memperkuat koneksi usus-kulit dan mengurangi jerawat.',
    };
  }
  if (fiberG >= FIBER_DAILY_TARGET_G && probioticServings >= PROBIOTIC_DAILY_TARGET_SERVINGS) {
    return {
      tip: 'Excellent gut nutrition! Diverse pre- and probiotics produce short-chain fatty acids that visibly reduce skin redness and puffiness.',
      tipId:
        'Nutrisi usus sempurna! Prebiotik dan probiotik beragam menghasilkan asam lemak rantai pendek yang nyata mengurangi kemerahan dan sembap kulit.',
    };
  }
  return {
    tip: 'Good progress! Aim for 25g fiber and 2 probiotic servings daily to fully protect your gut-skin connection.',
    tipId:
      'Progres bagus! Targetkan 25g serat dan 2 porsi probiotik per hari untuk melindungi koneksi usus-kulitmu sepenuhnya.',
  };
}

/**
 * Returns a gut-skin insight based on weekly skin data and gut score average.
 */
export function getGutSkinInsight(
  avgGutScore: number,
  breakoutDays: number,
  totalDays: number,
  language: 'en' | 'id' = 'en'
): string | null {
  if (totalDays < 5) return null;

  const breakoutRate = breakoutDays / totalDays;

  if (avgGutScore < 40 && breakoutRate > 0.3) {
    return language === 'id'
      ? `Skor usus rendah minggu ini berkorelasi dengan ${breakoutDays} hari jerawat — pola usus-kulit yang nyata.`
      : `Low gut scores this week correlate with ${breakoutDays} breakout days — a visible gut-skin connection.`;
  }
  if (avgGutScore >= 70 && breakoutRate < 0.1) {
    return language === 'id'
      ? 'Dukungan usus yang baik berkontribusi pada kulit yang terus bersih dan bersinar minggu ini.'
      : 'Strong gut support contributed to consistently clear, glowing skin this week.';
  }
  return null;
}

/**
 * Sums total fiber from today's food logs
 */
export function getTodayFiber(foodLogs: FoodLogEntry[], todayStart: number, todayEnd: number): number {
  return foodLogs
    .filter((l) => l.timestamp >= todayStart && l.timestamp < todayEnd)
    .reduce((sum, l) => sum + (l.fiber || 0), 0);
}
