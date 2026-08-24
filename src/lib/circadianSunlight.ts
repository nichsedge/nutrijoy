export function getSunlightRecommendedMinutes(isOvercast: boolean = false): number {
  return isOvercast ? 20 : 10;
}

export function getCircadianPhaseBenefits(minutesCompleted: number, targetMinutes: number) {
  const percent = Math.min(100, Math.round((minutesCompleted / targetMinutes) * 100));

  if (percent >= 100) {
    return {
      statusEn: 'Master Clock Synchronized ✨',
      statusId: 'Jam Biologis Tersinkronisasi ✨',
      descEn:
        'Suprachiasmatic nucleus anchored! Daytime dopamine is elevated, and natural melatonin timer is primed for deep beauty sleep tonight.',
      descId:
        'Nukleus suprakiasmatik terkunci sempurna! Dopamin pagi meningkat dan timer melatonin malam telah diaktifkan untuk tidur nyenyak.',
      colorClass: 'text-amber-800 bg-amber-50 border-amber-300',
    };
  } else if (percent >= 50) {
    return {
      statusEn: 'Photons Absorbing ☀️',
      statusId: 'Foton Terserap Sebagian ☀️',
      descEn:
        'Halfway there! Keep facing toward the open sky (no sunglasses, through open air not windows) to saturate retinal receptors.',
      descId:
        'Setengah jalan! Tetap hadap ke arah langit terbuka (tanpa kacamata hitam, langsung bukan lewat jendela) untuk hasil maksimal.',
      colorClass: 'text-yellow-800 bg-yellow-50 border-yellow-200',
    };
  } else {
    return {
      statusEn: 'Awakening Phase 🌅',
      statusId: 'Fase Bangun Pagi 🌅',
      descEn:
        'Step outside within 30–60 minutes of waking. Natural outdoor lux (10,000+ lux) is 50x brighter than indoor room lighting.',
      descId:
        'Keluarlah dalam 30–60 menit setelah bangun. Cahaya alami luar ruangan (10.000+ lux) 50x lebih terang dari lampu ruangan.',
      colorClass: 'text-orange-800 bg-orange-50 border-orange-200',
    };
  }
}
