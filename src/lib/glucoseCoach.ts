import { PlateSequenceCheck } from './types';

export const GLUCOSE_SEQUENCING_STEPS = [
  {
    step: 1,
    icon: '🥗',
    title: '1. Veggies & Fiber First',
    titleId: '1. Sayuran & Serat Terlebih Dahulu',
    desc: 'Fiber creates a viscous protective mesh in the small intestine, slowing down glucose absorption into the bloodstream.',
    descId: 'Serat membentuk lapisan pelindung di usus halus yang memperlambat penyerapan glukosa ke aliran darah.',
  },
  {
    step: 2,
    icon: '🥑',
    title: '2. Proteins & Healthy Fats',
    titleId: '2. Protein & Lemak Sehat',
    desc: 'Proteins and fats trigger satiety hormone CCK and slow down gastric emptying to stabilize post-meal insulin.',
    descId:
      'Protein dan lemak memicu hormon kenyang CCK serta memperlambat pengosongan lambung untuk menstabilkan insulin.',
  },
  {
    step: 3,
    icon: '🍚',
    title: '3. Carbs & Starches Last',
    titleId: '3. Karbohidrat & Gula Terakhir',
    desc: 'Eating carbs last blunts glucose peak by up to 73%, reducing skin glycation (collagen breakdown) and afternoon brain fog.',
    descId:
      'Makan karbohidrat terakhir meredam lonjakan gula darah hingga 73%, mencegah glikasi kolagen dan kantuk berlebih.',
  },
];

export function getGlucoseSequenceScore(check: PlateSequenceCheck) {
  const completedCount = [check.veggiesFirst, check.proteinSecond, check.carbsLast].filter(Boolean).length;

  if (completedCount === 3) {
    return {
      score: 100,
      label: 'Anti-Glycation Master ✨',
      labelId: 'Master Anti-Glikasi ✨',
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      benefit:
        'Maximum collagen protection! Blood sugar curve is smooth, protecting skin fibroblasts from glycation stiffness.',
      benefitId:
        'Proteksi kolagen maksimal! Kurva gula darah sangat stabil, melindungi fibroblas kulit dari penuaan dini.',
    };
  } else if (completedCount === 2) {
    return {
      score: 66,
      label: 'Great Sequencing 👍',
      labelId: 'Urutan Sangat Baik 👍',
      color: 'text-sky-700 bg-sky-50 border-sky-200',
      benefit: 'Solid glucose control. Most glucose spike blunted, preserving steady energy and skin vitality.',
      benefitId:
        'Kontrol gula darah mantap. Sebagian besar lonjakan gula diredam, menjaga energi stabil dan vitalitas kulit.',
    };
  } else if (completedCount === 1) {
    return {
      score: 33,
      label: 'Partial Shield 🛡️',
      labelId: 'Proteksi Sebagian 🛡️',
      color: 'text-amber-700 bg-amber-50 border-amber-200',
      benefit:
        'Some protection. Try eating a small fresh salad or greens before your next meal for deeper metabolic benefits.',
      benefitId:
        'Ada sedikit perlindungan. Coba makan semangkuk sayuran hijau sebelum menu utama untuk manfaat metabolik optimal.',
    };
  } else {
    return {
      score: 0,
      label: 'Standard Meal 🍽️',
      labelId: 'Pola Makan Standar 🍽️',
      color: 'text-slate-700 bg-slate-50 border-slate-200',
      benefit: 'Tip: Starting with fiber first cuts glucose peaks significantly without cutting any food you love.',
      benefitId:
        'Tips: Memulai dengan serat meredam lonjakan gula darah secara drastis tanpa perlu mengurangi makanan favoritmu.',
    };
  }
}
