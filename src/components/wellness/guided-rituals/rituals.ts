import { Language } from '@/lib/types';

export type RitualType =
  'depuff' | 'breathwork' | 'posture' | 'digest' | 'cryo' | 'drybrush' | 'eye_refresh' | 'guasha';

export interface RitualStep {
  title: string;
  desc: string;
  duration: number;
  icon: string;
}

const pick = (isId: boolean, id: string, en: string) => (isId ? id : en);

export function getDepuffSteps(isId: boolean): RitualStep[] {
  return [
    {
      title: pick(isId, '1. Buka Saluran Limfatik Leher', '1. Collarbone & Neck Awakening'),
      desc: pick(
        isId,
        'Gunakan kedua telapak tangan untuk mengusap leher dari bawah telinga turun ke tulang selangka dengan tekanan lembut.',
        'Use flat hands to gently glide down the sides of the neck toward collarbones to open primary lymph nodes.'
      ),
      duration: 30,
      icon: '🌿',
    },
    {
      title: pick(isId, '2. Bentuk Garis Rahang (Jawline Contour)', '2. Jawline Contour Sweep'),
      desc: pick(
        isId,
        'Tekuk jari telunjuk dan tengah membentuk V, usap sepanjang tulang rahang dari dagu ke arah daun telinga.',
        'Form a gentle knuckle "V" with fingers and glide firmly along jawline from chin upward to earlobes.'
      ),
      duration: 30,
      icon: '✨',
    },
    {
      title: pick(isId, '3. Angkat Pipi & Redakan Kantung Mata', '3. Cheek & Under-Eye De-Puff'),
      desc: pick(
        isId,
        'Ketuk lembut dengan jari manis di bawah mata ke arah pelipis, lalu usap tulang pipi ke atas.',
        'Lightly feather-tap under eyes with ring finger, sweeping fluid outward and lifting cheekbones.'
      ),
      duration: 30,
      icon: '🧊',
    },
    {
      title: pick(isId, '4. Haluskan Dahi & Pelipis', '4. Forehead & Brow Smoothing'),
      desc: pick(
        isId,
        'Gunakan ujung jari untuk mengusap dari tengah dahi ke luar menuju pelipis, lalu tarik turun ke leher.',
        'Glide fingertips firmly from forehead center outward to temples, then sweep down the neck to complete drainage.'
      ),
      duration: 30,
      icon: '🌸',
    },
  ];
}

export function getPostureSteps(isId: boolean): RitualStep[] {
  return [
    {
      title: pick(isId, '1. Chin Tucks & Penyelarasan Leher', '1. Chin Tucks & Neck Lengthening'),
      desc: pick(
        isId,
        'Tarik dagu lurus ke belakang (seperti membuat double chin ringan). Tahan 3 detik lalu lepas, ulangi 5 kali untuk meluruskan leher.',
        'Draw chin straight back as if making a subtle double chin. Hold 3s and repeat to eliminate tech neck and align cervical spine.'
      ),
      duration: 20,
      icon: '🧘',
    },
    {
      title: pick(isId, '2. Tarik Belikat & Buka Dada', '2. Scapular Squeeze & Chest Opener'),
      desc: pick(
        isId,
        'Putar bahu ke atas, belakang, dan bawah. Rapatkan kedua tulang belikat kuat-kuat untuk membuka rongga dada.',
        'Roll shoulders up, back, and down. Squeeze shoulder blades together firmly to reverse slouching and expand the ribcage.'
      ),
      duration: 20,
      icon: '✨',
    },
    {
      title: pick(isId, '3. Tulang Belakang Tegak & Napas Dalam', '3. Spine Elongation & Rib Lift'),
      desc: pick(
        isId,
        'Duduk tegak, bayangkan puncak kepala ditarik ke atas. Tarik napas diafragma dalam untuk mengaktifkan otot postur.',
        'Sit tall on your sit-bones, lift the crown of your head upward, and take two deep diaphragmatic breaths to lock in posture.'
      ),
      duration: 20,
      icon: '👑',
    },
  ];
}

export function getCryoSteps(isId: boolean): RitualStep[] {
  return [
    {
      title: pick(isId, '1. Angkat Dahi & Alis Sejuk', '1. Forehead & Brow Ice Lift'),
      desc: pick(
        isId,
        'Gulingkan ice-roller dari tengah alis ke atas garis rambut untuk mengencangkan kulit dahi dan membuka mata yang mengantuk.',
        'Roll cold ice-roller upward from brow line into hairline to tighten forehead fascia and wake up tired morning eyes.'
      ),
      duration: 30,
      icon: '🧊',
    },
    {
      title: pick(isId, '2. Pahatan Tulang Pipi (Cheek Sculpt)', '2. Cheekbone Ice Sculpting'),
      desc: pick(
        isId,
        'Gulingkan dari cuping hidung menyusuri tulang pipi ke arah pelipis dengan tekanan lembut dan ritme stabil.',
        'Glide cold roller from side of nose along the cheekbone upward toward temples with gentle lifting pressure.'
      ),
      duration: 30,
      icon: '💎',
    },
    {
      title: pick(isId, '3. Pembentukan Garis Rahang & Leher', '3. Jawline & Neck Contour Drain'),
      desc: pick(
        isId,
        'Tarik dari dagu menyusuri rahang ke bawah telinga, lalu usap ke bawah leher untuk membuang cairan sembap.',
        'Sweep from chin along jawline to earlobes, then roll down the neck to flush constricted lymphatic fluid away.'
      ),
      duration: 30,
      icon: '❄️',
    },
    {
      title: pick(isId, '4. Kompres Dingin Bawah Mata', '4. Under-Eye Cooling Press'),
      desc: pick(
        isId,
        'Tempelkan roller dingin dengan sangat lembut di bawah mata selama 5 detik per sisi untuk mengecilkan pembuluh darah sembap.',
        'Hold cold roller gently under the orbital bone for 5s intervals to shrink dilated capillaries and banish puffiness.'
      ),
      duration: 30,
      icon: '✨',
    },
  ];
}

export function getDrybrushSteps(isId: boolean): RitualStep[] {
  return [
    {
      title: pick(isId, '1. Kaki & Betis ke Arah Lutut', '1. Feet & Calves Upward Sweep'),
      desc: pick(
        isId,
        'Gunakan gerakan sapuan lembut dari telapak kaki naik ke pergelangan dan betis menuju bagian belakang lutut.',
        'Use gentle, long upward strokes starting at the soles of feet, sweeping up calves toward the lymph nodes behind knees.'
      ),
      duration: 30,
      icon: '🪥',
    },
    {
      title: pick(isId, '2. Paha ke Kelenjar Selangkangan', '2. Thighs to Inguinal Nodes'),
      desc: pick(
        isId,
        'Sikat bagian paha depan dan belakang ke atas menuju lipatan selangkangan untuk memperlancar sirkulasi selulit.',
        'Brush thighs in sweeping upward motions directing fluid into the inguinal lymph nodes at the groin fold.'
      ),
      duration: 30,
      icon: '🌿',
    },
    {
      title: pick(isId, '3. Tangan & Lengan ke Ketiak', '3. Arms to Axillary Underarm Nodes'),
      desc: pick(
        isId,
        'Mulai dari telapak tangan, sikat sepanjang lengan bawah dan atas menuju kelenjar getah bening di bawah ketiak.',
        'Begin at palms and sweep upward along forearms and biceps directly toward the axillary lymph nodes in armpits.'
      ),
      duration: 30,
      icon: '💫',
    },
    {
      title: pick(isId, '4. Perut & Dada ke Arah Tulang Selangka', '4. Torso & Decolletage Toward Heart'),
      desc: pick(
        isId,
        'Sikat perut searah jarum jam (mengikuti usus), lalu usap dada atas dengan lembut ke arah tulang selangka.',
        'Brush abdomen in gentle clockwise circles (following colon motility), then sweep chest upward toward clavicles.'
      ),
      duration: 30,
      icon: '💖',
    },
  ];
}

export function getEyeRefreshSteps(isId: boolean): RitualStep[] {
  return [
    {
      title: pick(isId, '1. Fokus Horizon Jauh (20-20-20)', '1. 20-20-20 Horizon Focus Shift'),
      desc: pick(
        isId,
        'Alihkan pandangan dari layar ke objek sejauh 6 meter (20 kaki). Kedipkan mata perlahan untuk melembapkan kornea.',
        'Look away from your screen at an object 20 feet away. Blink slowly and deliberately to lubricate the cornea.'
      ),
      duration: 20,
      icon: '👁️',
    },
    {
      title: pick(isId, '2. Akupresur Pelipis & Alis', '2. Temple & Brow Acupressure'),
      desc: pick(
        isId,
        'Tekan ujung jari di antara alis (Yintang) dan pelipis, buat gerakan melingkar lembut untuk melepas ketegangan dahi.',
        'Press fingertips firmly into the space between brows and temples, making slow circular motions to release squint tension.'
      ),
      duration: 20,
      icon: '💆‍♀️',
    },
    {
      title: pick(isId, '3. Palming Hangat & Gelap Total', '3. Warm Palm Eye Cupping'),
      desc: pick(
        isId,
        'Gosok kedua telapak tangan hingga hangat, lalu telungkupkan di atas mata tertutup tanpa menekan bola mata.',
        'Rub palms together until warm, then cup them gently over closed eyes, soaking in complete restful darkness.'
      ),
      duration: 20,
      icon: '🤲',
    },
  ];
}

export function getGuashaSteps(isId: boolean): RitualStep[] {
  return [
    {
      title: pick(isId, '1. Leher & Tulang Selangka', '1. Neck & Trapezius Clearing'),
      desc: pick(
        isId,
        'Pegang Gua Sha rata dengan sudut 15°. Usap dari bawah telinga menyusuri leher ke tulang selangka untuk membuka jalur drainase getah bening.',
        'Hold Gua Sha flat at a 15° angle against skin. Sweep down the neck toward collarbones 5-10 times to open primary lymphatic drainage pathways.'
      ),
      duration: 45,
      icon: '💎',
    },
    {
      title: pick(isId, '2. Garis Rahang & Titik Masseter (ST6)', '2. Jawline & Masseter Release'),
      desc: pick(
        isId,
        'Gunakan lekukan Gua Sha pada rahang dari dagu ke telinga. Tekan lembut pada otot rahang (ST6) untuk melepas ketegangan bruxism / gigi gemeletuk.',
        'Glide curved notch along jawline from chin to ear. Pause with gentle vibrating pressure over the masseter muscle (ST6 point) to release clenching.'
      ),
      duration: 45,
      icon: '🌸',
    },
    {
      title: pick(isId, '3. Angkat Tulang Pipi (SI18)', '3. Cheekbone Sculpt & Lift'),
      desc: pick(
        isId,
        'Usap sisi panjang Gua Sha dari cuping hidung menyusuri bawah tulang pipi ke arah pelipis. Angkat dan goyang perlahan di pelipis.',
        'Glide long flat edge from nose/smile line under zygomatic bone up toward hairline. Wiggle gently at temples to relieve sinus pressure.'
      ),
      duration: 45,
      icon: '✨',
    },
    {
      title: pick(isId, '4. Dahi & Lengkung Alis (BL2)', '4. Brow Arch & Forehead Lift'),
      desc: pick(
        isId,
        'Tekan lembut di pangkal alis (BL2) untuk segarkan mata, lalu usap ke atas dari alis ke garis rambut di seluruh dahi.',
        'Press gently at inner brow arch (BL2 point) to lift hooded eyelids, then sweep flat edge upward from brows into hairline across forehead.'
      ),
      duration: 45,
      icon: '👑',
    },
  ];
}

export function getRitualSteps(type: RitualType, isId: boolean): RitualStep[] {
  switch (type) {
    case 'posture':
      return getPostureSteps(isId);
    case 'cryo':
      return getCryoSteps(isId);
    case 'drybrush':
      return getDrybrushSteps(isId);
    case 'eye_refresh':
      return getEyeRefreshSteps(isId);
    case 'guasha':
      return getGuashaSteps(isId);
    default:
      return getDepuffSteps(isId);
  }
}

export const isStepRoutine = (type: RitualType) => type !== 'breathwork' && type !== 'digest';
export const getTotalCycles = (type: RitualType) => (type === 'digest' ? 2 : 4);

// ── Modal copy ────────────────────────────────────────────────────────────────

export function getModalTitle(type: RitualType, isId: boolean): string {
  if (type === 'posture') return pick(isId, 'Panduan Postur 1 Menit', '1-Minute Posture Alignment');
  if (type === 'depuff') return pick(isId, 'Ritual Pijat Limfatik 2 Menit', '2-Minute Lymphatic De-Puff');
  if (type === 'guasha')
    return pick(isId, 'Gua Sha Wajah & Pahatan Rahang (3 Menit)', '3-Minute Facial Gua Sha Sculpting');
  if (type === 'cryo') return pick(isId, 'Ritual Cryo & Ice-Roller Wajah', 'Ice-Roller & Cryo Sculpting');
  if (type === 'drybrush') return pick(isId, 'Sikat Kering Limfatik Tubuh', 'Lymphatic Dry Brushing Guide');
  if (type === 'eye_refresh') return pick(isId, 'Relaksasi Mata 20-20-20 (1 Menit)', '1-Minute Eye Refresh (20-20-20)');
  if (type === 'digest') return pick(isId, 'Relaksasi Cerna 30 Detik (Pre-Meal)', '30s Rest & Digest Reset');
  return pick(isId, 'Pernapasan Relaksasi Tidur 4-7-8', '4-7-8 Sleep Breathwork');
}

export function getModalDesc(type: RitualType, isId: boolean): string {
  if (type === 'posture')
    return pick(
      isId,
      'Redakan leher tegang, buka rongga dada, dan tegakkan postur tubuh.',
      'Realign cervical spine, reverse slouching, and radiate confident presence.'
    );
  if (type === 'depuff')
    return pick(
      isId,
      'Lancarkan sirkulasi, kencangkan wajah, dan redakan sembap pagi.',
      'Stimulate lymphatic drainage, depuff eyelids, and sculpt facial contours.'
    );
  if (type === 'guasha')
    return pick(
      isId,
      'Pahat garis rahang, redakan ketegangan otot pengunyah (masseter), dan angkat tulang pipi.',
      'Sculpt jawline, release masseter clenching, and lift zygomatic cheekbones.'
    );
  if (type === 'cryo')
    return pick(
      isId,
      'Terapi dingin untuk kecilkan pori, kencangkan kontur, dan segarkan wajah.',
      'Cold therapy to shrink pores, define cheekbones, and eliminate sleep puffiness.'
    );
  if (type === 'drybrush')
    return pick(
      isId,
      'Gerakan sikat terarah untuk lancarkan getah bening dan haluskan kulit tubuh.',
      'Directional body brushing to stimulate full-body lymph flow and smooth texture.'
    );
  if (type === 'eye_refresh')
    return pick(
      isId,
      'Redakan ketegangan otot mata, lingkar hitam, dan mata lelah akibat layar.',
      'Alleviate digital eye strain, dark circles, and forehead tension lines.'
    );
  if (type === 'digest')
    return pick(
      isId,
      'Aktifkan saraf parasimpatik untuk melancarkan pencernaan dan cegah begah.',
      'Stimulate vagus nerve and enter rest-and-digest state before eating.'
    );
  return pick(
    isId,
    'Turunkan denyut jantung dan lepaskan ketegangan sebelum tidur.',
    'Downregulate the nervous system and calm evening cortisol.'
  );
}

export function getCompletionMessage(type: RitualType, isId: boolean): string {
  if (type === 'guasha')
    return pick(
      isId,
      'Ketegangan rahangmu terlepas, getah bening terbuang lancar, dan garis wajah terpahat tegas!',
      'Jaw clenching released, stagnant lymph drained, and facial contours sculpted!'
    );
  if (type === 'cryo')
    return pick(
      isId,
      'Pori-pori kulitmu kini kencang, peradangan mereda, dan kontur wajah terdefinisi segar!',
      'Your pores are tightened, puffiness banished, and facial contours sculpted!'
    );
  if (type === 'drybrush')
    return pick(
      isId,
      'Sirkulasi getah bening seluruh tubuhmu kini mengalir lancar dan kulit terasa lembut!',
      'Your full-body lymphatic flow is revitalized and skin feels silky smooth!'
    );
  if (type === 'eye_refresh')
    return pick(
      isId,
      'Otot matamu rileks, sirkulasi periorbital membaik, dan pandangan kembali segar!',
      'Your ocular muscles are relaxed, periorbital circulation refreshed, and gaze clear!'
    );
  if (type === 'digest')
    return pick(
      isId,
      'Sistem pencernaanmu siap menyerap nutrisi makanan dengan optimal tanpa begah.',
      'Your digestive tract is relaxed and primed for optimal nutrient absorption.'
    );
  if (type === 'posture')
    return pick(
      isId,
      'Tulang belakang dan lehermu kini lebih tegak, rileks, dan percaya diri.',
      'Your spine is elongated, neck tension eased, and posture beautifully aligned.'
    );
  if (type === 'depuff')
    return pick(
      isId,
      'Wajahmu terasa lebih segar, rileks, dan bercahaya alami hari ini.',
      'Your facial circulation is flowing and skin is visibly refreshed.'
    );
  return pick(
    isId,
    'Tubuhmu kini dalam kondisi relaksasi optimal untuk tidur nyenyak.',
    'Your heart rate has slowed and your body is prepared for restorative sleep.'
  );
}
