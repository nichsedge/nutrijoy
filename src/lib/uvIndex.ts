export type UVRiskLevel = 'low' | 'moderate' | 'high' | 'very_high' | 'extreme';

export interface UVData {
  uvIndex: number;
  risk: UVRisk;
  fetchedAt: number;
}

export interface UVRisk {
  level: UVRiskLevel;
  label: string;
  labelId: string;
  colorClass: string;
  spfRequired: number;
  adviceEn: string;
  adviceId: string;
  icon: string;
}

export function getUVRiskLevel(uvIndex: number): UVRisk {
  if (uvIndex <= 2) {
    return {
      level: 'low',
      label: 'Low UV (0–2)',
      labelId: 'UV Rendah (0–2)',
      colorClass: 'text-green-700 bg-green-50 border-green-200',
      spfRequired: 15,
      icon: '🌤️',
      adviceEn: 'Minimal risk. SPF 15 sufficient, but daily SPF is always the best beauty habit.',
      adviceId: 'Risiko minimal. SPF 15 cukup, namun SPF harian selalu menjadi kebiasaan kecantikan terbaik.',
    };
  } else if (uvIndex <= 5) {
    return {
      level: 'moderate',
      label: 'Moderate UV (3–5)',
      labelId: 'UV Sedang (3–5)',
      colorClass: 'text-yellow-700 bg-yellow-50 border-yellow-200',
      spfRequired: 30,
      icon: '☀️',
      adviceEn: 'Apply SPF 30+ before going out. Reapply every 2 hours when outdoors.',
      adviceId: 'Oleskan SPF 30+ sebelum keluar. Ulangi setiap 2 jam saat berada di luar ruangan.',
    };
  } else if (uvIndex <= 7) {
    return {
      level: 'high',
      label: 'High UV (6–7)',
      labelId: 'UV Tinggi (6–7)',
      colorClass: 'text-orange-700 bg-orange-50 border-orange-200',
      spfRequired: 50,
      icon: '🌞',
      adviceEn: 'SPF 50+ required. Seek shade 10am–4pm. Wear a hat and UV-protective clothing.',
      adviceId: 'SPF 50+ wajib. Cari teduh pukul 10.00–16.00. Gunakan topi dan pakaian pelindung UV.',
    };
  } else if (uvIndex <= 10) {
    return {
      level: 'very_high',
      label: 'Very High UV (8–10)',
      labelId: 'UV Sangat Tinggi (8–10)',
      colorClass: 'text-red-700 bg-red-50 border-red-200',
      spfRequired: 50,
      icon: '🔆',
      adviceEn: 'Stay in shade! SPF 50+ every 90min. UVA penetrates glass — apply indoors too.',
      adviceId:
        'Hindari sinar matahari langsung! SPF 50+ tiap 90 menit. UVA menembus kaca — oleskan pula di dalam ruangan.',
    };
  } else {
    return {
      level: 'extreme',
      label: 'Extreme UV (11+)',
      labelId: 'UV Ekstrem (11+)',
      colorClass: 'text-purple-700 bg-purple-50 border-purple-200',
      spfRequired: 50,
      icon: '☢️',
      adviceEn: 'Extreme UV today! Avoid outdoor exposure. If unavoidable: SPF 50+, wide hat, long sleeves.',
      adviceId:
        'UV ekstrem hari ini! Hindari paparan luar ruangan. Jika terpaksa: SPF 50+, topi lebar, lengan panjang.',
    };
  }
}

export interface UVFetchResult {
  uvIndex: number;
  error?: string;
}

/**
 * Fetches current UV index from the Open-Meteo free API.
 * Returns null on failure — UI should handle gracefully.
 */
export async function fetchCurrentUVIndex(lat: number, lon: number): Promise<UVFetchResult> {
  try {
    const hour = new Date().getHours();
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(4)}&longitude=${lon.toFixed(4)}&hourly=uv_index&forecast_days=1&timezone=auto`;
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    const uvIndex = data?.hourly?.uv_index?.[hour] ?? 0;
    return { uvIndex: Math.round(uvIndex * 10) / 10 };
  } catch (e) {
    return { uvIndex: 3, error: 'Could not fetch UV data' }; // Safe fallback
  }
}

/**
 * Requests browser geolocation. Returns null if denied.
 */
export function requestGeolocation(): Promise<{ lat: number; lon: number } | null> {
  return new Promise((resolve) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => resolve(null),
      { timeout: 8000, maximumAge: 300000 }
    );
  });
}

export const SPF_REAPPLY_INTERVAL_MS = 2 * 60 * 60 * 1000; // 2 hours
export const SPF_WARN_THRESHOLD_MS = 30 * 60 * 1000; // 30 min warning
