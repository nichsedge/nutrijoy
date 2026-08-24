import { SkincareProduct, IngredientConflict } from './types';

export const SKINCARE_PRESETS: Omit<SkincareProduct, 'id' | 'openedDate'>[] = [
  {
    name: 'Pure L-Ascorbic Acid 15% Serum',
    category: 'serum',
    activeIngredients: ['vitamin_c'],
    paoMonths: 3,
    icon: '🍊',
  },
  {
    name: 'Encapsulated Retinol 0.2% Night Serum',
    category: 'serum',
    activeIngredients: ['retinol'],
    paoMonths: 6,
    icon: '🌙',
  },
  {
    name: 'AHA 7% Glycolic Clarifying Toner',
    category: 'toner',
    activeIngredients: ['aha_bha'],
    paoMonths: 12,
    icon: '🧪',
  },
  {
    name: 'BHA 2% Salicylic Pore Liquid',
    category: 'toner',
    activeIngredients: ['aha_bha'],
    paoMonths: 12,
    icon: '🌿',
  },
  {
    name: '5-Ceramide & Peptide Barrier Cream',
    category: 'moisturizer',
    activeIngredients: ['ceramides', 'peptides'],
    paoMonths: 12,
    icon: '🧴',
  },
  {
    name: 'Mineral Zinc Oxide SPF 50+ Fluid',
    category: 'sunscreen',
    activeIngredients: ['zinc_oxide'],
    paoMonths: 12,
    icon: '☀️',
  },
  {
    name: 'Niacinamide 5% + Zinc 1% Glow Serum',
    category: 'serum',
    activeIngredients: ['niacinamide'],
    paoMonths: 12,
    icon: '✨',
  },
  {
    name: 'Centella & Panthenol Calming Ampoule',
    category: 'serum',
    activeIngredients: ['centella', 'panthenol'],
    paoMonths: 9,
    icon: '🌱',
  },
];

const CONFLICT_MATRIX: {
  pair: [string, string];
  severity: 'caution' | 'warning' | 'high';
  messageEn: string;
  messageId: string;
}[] = [
  {
    pair: ['retinol', 'aha_bha'],
    severity: 'high',
    messageEn:
      'High risk of barrier damage & peeling when layering Retinoids with direct AHA/BHA acids in the same routine. Alternate nights instead.',
    messageId:
      'Risiko tinggi kerusakan barrier & pengelupasan jika melapiskan Retinol bersamaan dengan AHA/BHA. Gunakan bergantian malam.',
  },
  {
    pair: ['vitamin_c', 'retinol'],
    severity: 'warning',
    messageEn:
      'L-Ascorbic Acid requires acidic pH while Retinol needs neutral pH. Best used separately: Vitamin C in AM, Retinol in PM.',
    messageId:
      'Vitamin C murni butuh pH asam sedangkan Retinol butuh pH netral. Pisahkan penggunaannya: Vitamin C di pagi hari, Retinol di malam hari.',
  },
  {
    pair: ['vitamin_c', 'aha_bha'],
    severity: 'caution',
    messageEn:
      'Layering multiple strong direct acids can over-strip the moisture barrier. Stagger usage across different days.',
    messageId:
      'Melapiskan beberapa asam kuat secara bersamaan dapat mengikis barrier kulit. Gunakan pada hari berbeda.',
  },
  {
    pair: ['benzoyl_peroxide', 'retinol'],
    severity: 'high',
    messageEn:
      'Benzoyl peroxide can oxidize and deactivate retinol molecules. Use Benzoyl Peroxide in AM and Retinol in PM.',
    messageId:
      'Benzoyl peroxide dapat mengoksidasi dan menonaktifkan molekul retinol. Gunakan Benzoyl Peroxide di pagi hari dan Retinol di malam hari.',
  },
];

export function calculatePaoStatus(product: SkincareProduct, now: number = Date.now()) {
  const paoMs = product.paoMonths * 30 * 24 * 60 * 60 * 1000;
  const expiryDate = product.openedDate + paoMs;
  const msRemaining = expiryDate - now;
  const daysRemaining = Math.ceil(msRemaining / (1000 * 60 * 60 * 24));

  const totalDays = product.paoMonths * 30;
  const elapsedDays = totalDays - daysRemaining;
  const percentUsed = Math.min(100, Math.max(0, Math.round((elapsedDays / totalDays) * 100)));

  const isExpired = daysRemaining <= 0;
  const isExpiringSoon = !isExpired && daysRemaining <= 30;

  return {
    expiryDate,
    daysRemaining: Math.max(0, daysRemaining),
    percentUsed,
    isExpired,
    isExpiringSoon,
    statusTextEn: isExpired
      ? 'Expired (PAO Exceeded)'
      : isExpiringSoon
        ? `Expires in ${daysRemaining} days`
        : `${daysRemaining} days fresh`,
    statusTextId: isExpired
      ? 'Kedaluwarsa (Lewat Batas Buka)'
      : isExpiringSoon
        ? `Kedaluwarsa dalam ${daysRemaining} hari`
        : `Segar (${daysRemaining} hari tersisa)`,
  };
}

export function detectIngredientConflicts(products: SkincareProduct[]): IngredientConflict[] {
  const allActives = new Set<string>();
  products.forEach((p) => p.activeIngredients.forEach((act) => allActives.add(act)));

  const detected: IngredientConflict[] = [];

  for (const rule of CONFLICT_MATRIX) {
    const [act1, act2] = rule.pair;
    if (allActives.has(act1) && allActives.has(act2)) {
      detected.push(rule);
    }
  }

  return detected;
}
