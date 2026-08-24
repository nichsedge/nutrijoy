import { AffirmationItem, CyclePhase, Language } from './types';

export const AFFIRMATIONS: AffirmationItem[] = [
  {
    id: 'menstrual-1',
    phase: 'menstrual',
    textEn: 'I honor my body’s need for gentle rest and slow, warm nourishment today.',
    textId: 'Aku menghargai kebutuhan tubuhku untuk istirahat tenang dan asupan hangat bergizi hari ini.',
    author: 'NutriJoy Radiance',
  },
  {
    id: 'follicular-1',
    phase: 'follicular',
    textEn: 'My energy and creativity are rising naturally. I radiate fresh strength and clear focus.',
    textId: 'Energi dan kreativitasku meningkat alami. Aku memancarkan kekuatan segar dan fokus jernih.',
    author: 'NutriJoy Radiance',
  },
  {
    id: 'ovulatory-1',
    phase: 'ovulatory',
    textEn: 'I am in my peak natural glow. My skin, heart, and spirit are open and magnetic.',
    textId: 'Aku berada di puncak kilau alamiku. Kulit, hati, dan energiku terpancar begitu memesona.',
    author: 'NutriJoy Radiance',
  },
  {
    id: 'luteal-1',
    phase: 'luteal',
    textEn: 'I nourish myself with patience and grace. Every healthy choice protects my inner peace.',
    textId: 'Aku merawat diriku dengan sabar dan lembut. Setiap pilihan sehatku menjaga ketenangan batinku.',
    author: 'NutriJoy Radiance',
  },
  {
    id: 'general-1',
    textEn: 'My skin regenerates and thrives with every breath, sip of water, and mindful meal.',
    textId: 'Kulitku beregenerasi dan berseri di setiap napas, teguk air, dan makanan bergizi yang kunikmati.',
    author: 'NutriJoy Radiance',
  },
  {
    id: 'general-2',
    textEn: 'I treat my body with kindness and deep respect. Health and beauty flow from within.',
    textId: 'Kuperlakukan tubuhku dengan penuh kasih sayang dan hormat. Sehat dan cantik mengalir dari dalam.',
    author: 'NutriJoy Radiance',
  },
  {
    id: 'general-3',
    textEn: 'I choose vibrant, colorful foods that make my cells celebrate vitality and joy.',
    textId: 'Kupilih makanan segar penuh warna yang membuat setiap sel tubuhku bersukacita dan bertenaga.',
    author: 'NutriJoy Radiance',
  },
];

export function getDailyAffirmation(phase?: CyclePhase, daySeed: number = new Date().getDate()): AffirmationItem {
  const phaseMatches = phase ? AFFIRMATIONS.filter((a) => a.phase === phase) : [];
  if (phaseMatches.length > 0) {
    return phaseMatches[daySeed % phaseMatches.length];
  }

  const generalMatches = AFFIRMATIONS.filter((a) => !a.phase);
  return generalMatches[daySeed % generalMatches.length];
}
