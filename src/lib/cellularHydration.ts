import { CellularHydrationItem } from './types';

export const CELLULAR_HYDRATION_PRESETS: CellularHydrationItem[] = [
  {
    id: 'sole_lemon',
    nameEn: 'Himalayan Sole + Lemon Water',
    nameId: 'Air Lemon + Garam Himalaya',
    icon: '🍋',
    waterMl: 250,
    minerals: { sodiumMg: 220, potassiumMg: 140, magnesiumMg: 35 },
    benefitEn: 'Balances intracellular osmolality on waking, jumpstarting adrenal hydration and skin firmness.',
    benefitId: 'Menyeimbangkan osmolalitas seluler saat bangun tidur, menghidrasi kelenjar adrenal dan mengencangkan kulit.'
  },
  {
    id: 'coconut_water',
    nameEn: 'Fresh Young Coconut Water',
    nameId: 'Air Kelapa Murni Alami',
    icon: '🥥',
    waterMl: 300,
    minerals: { sodiumMg: 50, potassiumMg: 620, magnesiumMg: 45 },
    benefitEn: 'High natural bioavailable potassium flushes excess sodium water retention while hydrating dermal collagen.',
    benefitId: 'Kaya kalium alami yang membuang kelebihan natrium penyebab sembap sekaligus menghidrasi kolagen kulit.'
  },
  {
    id: 'electrolyte_pinch',
    nameEn: 'Electrolyte Mineral Pinch',
    nameId: 'Seduhan Mineral Elektrolit',
    icon: '🧂',
    waterMl: 350,
    minerals: { sodiumMg: 320, potassiumMg: 210, magnesiumMg: 60 },
    benefitEn: 'Optimizes aquaporin channel water transport directly into skin cells, preventing afternoon brain fog.',
    benefitId: 'Mengoptimalkan saluran aquaporin untuk menarik air langsung ke sel kulit, mencegah lemas di siang hari.'
  },
  {
    id: 'mineral_broth',
    nameEn: 'Warm Mineral & Collagen Broth',
    nameId: 'Kaldu Hangat Kolagen & Mineral',
    icon: '🍲',
    waterMl: 250,
    minerals: { sodiumMg: 380, potassiumMg: 180, magnesiumMg: 30 },
    benefitEn: 'Supplies proline, glycine, and amino electrolytes to nourish skin structure and calm the gut lining.',
    benefitId: 'Menyediakan prolin, glisin, dan asam amino elektrolit untuk memperkuat struktur kulit dan menenangkan usus.'
  }
];

export function calculateHydrationMultiplier(plainWaterMl: number, electrolyteServingsCount: number) {
  // Base efficiency: 1.0x. Each electrolyte mineral boost adds +0.15x absorption multiplier (up to 1.45x)
  const multiplier = Math.min(1.45, 1.0 + (electrolyteServingsCount * 0.15));
  const effectiveHydrationMl = Math.round(plainWaterMl * multiplier);

  return {
    multiplier: parseFloat(multiplier.toFixed(2)),
    effectiveHydrationMl,
    bonusMl: effectiveHydrationMl - plainWaterMl,
    statusEn: electrolyteServingsCount >= 2
      ? 'Optimal Cellular Osmolality ⚡'
      : electrolyteServingsCount === 1
      ? 'Enhanced Absorption 💧'
      : 'Basic Hydration (Add Minerals)',
    statusId: electrolyteServingsCount >= 2
      ? 'Osmolalitas Seluler Optimal ⚡'
      : electrolyteServingsCount === 1
      ? 'Penyerapan Ditingkatkan 💧'
      : 'Hidrasi Dasar (Perlu Mineral)'
  };
}
