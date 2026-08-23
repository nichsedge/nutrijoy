import { CyclePhase, CyclePhaseInfo, Language } from './types';

export function getCyclePhase(cycleDay: number, language: Language = 'en'): CyclePhaseInfo {
  // Normalize day within a typical cycle (if day > 28, cycle continues in late luteal or wraps)
  const normalizedDay = Math.max(1, Math.round(cycleDay));
  let phase: CyclePhase = 'follicular';

  if (normalizedDay <= 5) {
    phase = 'menstrual';
  } else if (normalizedDay <= 13) {
    phase = 'follicular';
  } else if (normalizedDay <= 16) {
    phase = 'ovulatory';
  } else {
    phase = 'luteal';
  }

  const isId = language === 'id';

  if (phase === 'menstrual') {
    return {
      phase: 'menstrual',
      phaseName: isId ? 'Fase Menstruasi' : 'Menstrual Phase',
      daysRange: 'Days 1–5',
      summary: isId 
        ? 'Energi dan hormon estrogen sedang di titik terendah. Fokus pada pemulihan, makanan hangat bernutrisi, dan gerak santai.'
        : 'Estrogen & progesterone are at their lowest. Focus on deep recovery, warming nutrient-dense meals, and gentle movement.',
      nutritionAdvice: isId 
        ? ['Makanan kaya zat besi (bayam, daging tanpa lemak, lentil)', 'Sup hangat & kaldu kaya kolagen', 'Teh herbal jahe atau chamomile untuk kram']
        : ['Iron-rich foods (spinach, lentils, lean beef)', 'Warming broths & collagen-rich soups', 'Ginger or chamomile tea to ease cramping'],
      workoutAdvice: isId
        ? ['Jalan kaki santai (20-30 menit)', 'Restorative yoga & peregangan tubuh', 'Istirahat ekstra saat tubuh membutuhkan']
        : ['Gentle outdoor walking (20–30 min)', 'Restorative yoga & light mobility', 'Extra recovery sleep when needed'],
      skinAdvice: isId
        ? 'Kulit cenderung lebih kering dan sensitif. Gunakan pelembap berbahan ceramide dan hindari eksfoliasi keras.'
        : 'Skin is more sensitive & prone to dryness. Prioritize ceramide barrier repair and avoid harsh scrubs.',
      calorieAdjustmentKcal: 0,
    };
  }

  if (phase === 'follicular') {
    return {
      phase: 'follicular',
      phaseName: isId ? 'Fase Folikuler' : 'Follicular Phase',
      daysRange: 'Days 6–13',
      summary: isId
        ? 'Estrogen mulai meningkat, energi dan fokus melonjak! Waktu terbaik untuk latihan beban intens dan makanan segar tinggi serat.'
        : 'Estrogen is steadily rising, boosting your energy and focus. Ideal time for progressive strength and vibrant fresh meals.',
      nutritionAdvice: isId
        ? ['Makanan fermentasi (yogurt, kimchi, tempe)', 'Sayuran hijau segar & kecambah', 'Protein tanpa lemak untuk pembentukan otot']
        : ['Fermented foods (Greek yogurt, kimchi, tempeh)', 'Fresh leafy greens & vibrant salads', 'Lean proteins for muscle toning'],
      workoutAdvice: isId
        ? ['Latihan beban progresif (Strength training)', 'Latihan kardio intensitas tinggi (HIIT)', 'Mencoba kelas olahraga baru']
        : ['Progressive strength training', 'High-Intensity Interval Training (HIIT)', 'Trying new athletic challenges'],
      skinAdvice: isId
        ? 'Kulit berada di kondisi paling elastis dan cerah secara alami. Bagus untuk serum Vitamin C dan eksfoliasi lembut.'
        : 'Skin is naturally glowing and bouncy. Great time for Vitamin C serums and gentle enzyme exfoliants.',
      calorieAdjustmentKcal: 0,
    };
  }

  if (phase === 'ovulatory') {
    return {
      phase: 'ovulatory',
      phaseName: isId ? 'Fase Ovulasi' : 'Ovulatory Phase',
      daysRange: 'Days 14–16',
      summary: isId
        ? 'Puncak energi, rasa percaya diri, dan stamina! Dukung metabolisme hormon dengan makanan kaya antioksidan dan serat tinggi.'
        : 'Peak stamina, confidence, and radiance! Support estrogen metabolism with high-fiber foods and antioxidant power.',
      nutritionAdvice: isId
        ? ['Sayuran silangan (brokoli, kembang kol) untuk metabolisme estrogen', 'Buah beri kaya antioksidan (blackberry, strawberry)', 'Biji chia dan rami (flaxseed)']
        : ['Cruciferous veggies (broccoli, cauliflower) for estrogen clearance', 'Antioxidant-rich berries', 'Flaxseeds & chia seeds'],
      workoutAdvice: isId
        ? ['Target rekor baru latihan beban (PR Lifting)', 'Lari cepat atau bersepeda dinamis', 'Aktivitas olahraga bersama teman/pasangan']
        : ['Peak performance workouts & strength PRs', 'Fast runs or power cycling', 'Social fitness and group workouts'],
      skinAdvice: isId
        ? 'Produksi minyak mulai sedikit naik karena lonjakan hormon. Pastikan cuci muka bersih dan gunakan hidrasi ringan tanpa minyak.'
        : 'Sebum production rises. Keep pores clear with a light foaming cleanse and oil-free hydration.',
      calorieAdjustmentKcal: 50,
    };
  }

  // Luteal Phase
  return {
    phase: 'luteal',
    phaseName: isId ? 'Fase Luteal' : 'Luteal Phase',
    daysRange: 'Days 17–28+',
    summary: isId
      ? 'Progesteron dominan dan metabolisme membakar 100-250 kcal lebih banyak. Kelola nafsu makan dengan karbohidrat kompleks dan magnesium.'
      : 'Progesterone peaks and your metabolism burns 100–250 kcal more per day. Curb PMS cravings with complex carbs & magnesium.',
    nutritionAdvice: isId
      ? ['Karbohidrat kompleks (ubi manis, oat, quinoa)', 'Makanan kaya magnesium (dark chocolate 70%+, biji labu)', 'Kurangi garam berlebih untuk mencegah begah']
      : ['Complex carbs (sweet potatoes, oats, quinoa)', 'Magnesium-rich foods (70%+ dark chocolate, pumpkin seeds)', 'Lower sodium to reduce water retention'],
    workoutAdvice: isId
      ? ['Pilates & penguatan postur', 'Latihan beban beban sedang dengan istirahat cukup', 'Jalan santai dan peregangan sore hari']
      : ['Mat Pilates & posture flows', 'Moderate strength training with ample rest', 'Zone 2 cardio & sunset walks'],
    skinAdvice: isId
      ? 'Hormon dapat memicu jerawat PMS. Gunakan pembersih asam salisilat (BHA) lembut dan jaga asupan gula tetap rendah.'
      : 'Progesterone surge can trigger breakouts. Use gentle BHA/salicylic acid and keep refined sugars low.',
    calorieAdjustmentKcal: 150,
  };
}
