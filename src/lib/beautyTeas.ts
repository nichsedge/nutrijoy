import { BeautyTea, CyclePhase, SkinCondition } from './types';

export const BEAUTY_TEAS: BeautyTea[] = [
  {
    id: 'spearmint_lemon',
    name: 'Spearmint & Lemongrass Clarity',
    nameId: 'Spearmint & Serai Kejernihan',
    icon: '🌿',
    tagline: 'Hormonal Jawline Balance & Anti-Androgen',
    taglineId: 'Keseimbangan Hormon & Pereda Jerawat Dagu',
    steepMinutes: 4,
    ingredients: ['Organic Spearmint Leaves', 'Dried Lemongrass', 'Peppermint', 'Lemon Peel'],
    ingredientsId: ['Daun Spearmint Organik', 'Serai Kering', 'Peppermint', 'Kulit Lemon'],
    beautyBenefits: 'Natural anti-androgen compounds gently lower free testosterone in women, significantly reducing hormonal chin breakouts and excess sebum.',
    beautyBenefitsId: 'Senyawa anti-androgen alami menurunkan kelebihan testosteron bebas, secara nyata mengurangi jerawat hormonal di area dagu dan minyak berlebih.',
    targetPhase: 'luteal',
    targetSkinCondition: 'breakout',
    antioxidantMg: 65
  },
  {
    id: 'hibiscus_rosehip',
    name: 'Hibiscus & Rosehip Ruby Elixir',
    nameId: 'Eliksir Rubi Hibiskus & Rosehip',
    icon: '🌺',
    tagline: 'Mega Vitamin C & Collagen Synthesis',
    taglineId: 'Kaya Vitamin C & Sintesis Kolagen',
    steepMinutes: 5,
    ingredients: ['Whole Hibiscus Flowers', 'Wild Rosehip Seeds', 'Dried Raspberry Leaves'],
    ingredientsId: ['Bunga Hibiskus Utuh', 'Biji Rosehip Liar', 'Daun Raspberry Kering'],
    beautyBenefits: 'Packed with natural bioavailable Vitamin C, anthocyanins, and malic acid that directly stimulate fibroblast collagen production and restore inner skin glow.',
    beautyBenefitsId: 'Kaya akan Vitamin C alami, antosianin, dan asam malat yang langsung memicu fibroblas memproduksi kolagen dan mengembalikan kilau alami kulit.',
    targetPhase: 'ovulatory',
    targetSkinCondition: 'radiant',
    antioxidantMg: 120
  },
  {
    id: 'ginger_fennel',
    name: 'Golden Ginger & Fennel De-Puff',
    nameId: 'Jahe Emas & Adas Anti-Sembap',
    icon: '🫚',
    tagline: 'Lymphatic Drainage & Anti-Bloat Soother',
    taglineId: 'Drainase Limfatik & Pereda Perut Kembung',
    steepMinutes: 5,
    ingredients: ['Crushed Ginger Root', 'Sweet Fennel Seeds', 'Cardamom Pods', 'Turmeric'],
    ingredientsId: ['Akar Jahe Segar', 'Biji Adas Manis', 'Kapulaga', 'Kunyit'],
    beautyBenefits: 'Gingerol and anethole stimulate sluggish lymphatic fluid, soothe intestinal spasms, and flush out water retention around the eyes and abdomen.',
    beautyBenefitsId: 'Gingerol dan anetol memperlancar aliran cairan getah bening, meredakan ketegangan usus, dan membuang retensi air di sekitar mata serta perut.',
    targetPhase: 'menstrual',
    targetSkinCondition: 'puffy',
    antioxidantMg: 85
  },
  {
    id: 'chamomile_lavender',
    name: 'Chamomile & Lavender Night Nectar',
    nameId: 'Nektar Malam Chamomile & Lavender',
    icon: '🌼',
    tagline: 'Cortisol Flush & Restorative Beauty Sleep',
    taglineId: 'Pereda Kortisol & Tidur Cantik Nyenyak',
    steepMinutes: 4,
    ingredients: ['German Chamomile Buds', 'French Lavender Flowers', 'Passionflower Herb', 'Lemon Balm'],
    ingredientsId: ['Bunga Chamomile Jerman', 'Bunga Lavender Prancis', 'Passionflower', 'Lemon Balm'],
    beautyBenefits: 'Apigenin flavonoid binds to GABA receptors in the brain to reduce evening cortisol spikes, preventing stress-induced skin barrier breakdown overnight.',
    beautyBenefitsId: 'Flavonoid apigenin menenangkan reseptor GABA di otak untuk meredakan lonjakan kortisol malam hari, melindungi barrier kulit dari kerusakan akibat stres.',
    targetPhase: 'follicular',
    targetSkinCondition: 'dry',
    antioxidantMg: 50
  },
  {
    id: 'white_tea_osmanthus',
    name: 'White Tea & Osmanthus Radiance',
    nameId: 'Teh Putih & Osmanthus Berseri',
    icon: '🫖',
    tagline: 'High-Polyphenol UV & Cellular Shield',
    taglineId: 'Polifenol Tinggi Pelindung Sel & UV',
    steepMinutes: 3,
    ingredients: ['Silver Needle White Tea', 'Golden Osmanthus Blossoms', 'Jasmine Pearls'],
    ingredientsId: ['Teh Putih Jarum Perak', 'Bunga Osmanthus Emas', 'Mutiara Melati'],
    beautyBenefits: 'Minimally oxidized young tea buds contain the highest concentration of EGCG catechins, shielding skin cells against photo-aging and oxidative degradation.',
    beautyBenefitsId: 'Pucuk teh putih muda memiliki konsentrasi katekin EGCG tertinggi, melindungi sel-sel kulit dari penuaan dini akibat paparan sinar UV.',
    targetPhase: 'follicular',
    targetSkinCondition: 'clear',
    antioxidantMg: 110
  }
];

export function getRecommendedTea(phase?: CyclePhase, skinCondition?: SkinCondition): BeautyTea {
  // 1. Check skin condition exact match
  if (skinCondition) {
    const skinMatch = BEAUTY_TEAS.find(t => t.targetSkinCondition === skinCondition);
    if (skinMatch) return skinMatch;
  }

  // 2. Check cycle phase exact match
  if (phase) {
    const phaseMatch = BEAUTY_TEAS.find(t => t.targetPhase === phase);
    if (phaseMatch) return phaseMatch;
  }

  // Default to antioxidant rich Hibiscus Ruby Elixir
  return BEAUTY_TEAS[1];
}
