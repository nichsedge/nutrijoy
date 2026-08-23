import { RestorativeYogaPose } from './types';

export const RESTORATIVE_YOGA_POSES: RestorativeYogaPose[] = [
  {
    id: 'child_pose',
    name: "Child's Pose",
    nameId: 'Pose Anak (Balasana)',
    sanskrit: 'Balasana',
    durationSec: 180,
    icon: '🧘‍♀️',
    instructionsEn: 'Kneel on the floor with big toes touching, sit on heels, and fold forward resting torso between thighs. Extend arms forward and rest forehead on a pillow or mat.',
    instructionsId: 'Berlutut dengan ibu jari kaki bersentuhan, duduk di tumit, dan bungkukkan badan ke depan. Letakkan kening di atas bantal/matras dan regangkan tangan ke depan.',
    benefitEn: 'Gently decompresses the lumbar spine, relieves sacral tension, and relaxes pelvic floor contraction.',
    benefitId: 'Mengurangi tekanan pada tulang belakang bawah, meredakan ketegangan sakrum, dan merelaksasi panggul.'
  },
  {
    id: 'reclined_butterfly',
    name: 'Reclined Butterfly Pose',
    nameId: 'Pose Kupu-Kupu Berbaring (Supta Baddha Konasana)',
    sanskrit: 'Supta Baddha Konasana',
    durationSec: 240,
    icon: '🦋',
    instructionsEn: 'Lie on your back with knees bent and soles of feet together, letting knees fall open to sides. Place hands or warm heat pack on lower abdomen.',
    instructionsId: 'Berbaring telentang, tekuk lutut dan pertemukan kedua telapak kaki, biarkan lutut terbuka ke samping. Letakkan kompres hangat di perut bawah.',
    benefitEn: 'Opens the groin and stimulates ovarian circulation, easing acute uterine muscle cramps.',
    benefitId: 'Membuka area selangkangan dan melancarkan sirkulasi panggul, meredakan kram rahim akut.'
  },
  {
    id: 'legs_up_wall',
    name: 'Legs-Up-The-Wall Pose',
    nameId: 'Pose Kaki Menempel Dinding (Viparita Karani)',
    sanskrit: 'Viparita Karani',
    durationSec: 300,
    icon: '✨',
    instructionsEn: 'Sit sideways next to a wall and swing legs up against the wall as you lower your back to the floor. Arms rest relaxed at your sides with palms facing up.',
    instructionsId: 'Duduk di samping dinding, ayunkan kaki ke atas menempel dinding sambil merebahkan punggung ke lantai. Rentangkan tangan santai di samping.',
    benefitEn: 'Inverts venous gravity flow, drains pelvic stagnation, and profoundly calms the central nervous system.',
    benefitId: 'Membalikkan gravitasi vena, mengurangi bendungan darah di panggul, dan menenangkan sistem saraf pusat.'
  }
];

export const CRAMP_RELIEF_FOODS = [
  {
    nameEn: '85%+ Dark Chocolate',
    nameId: 'Cokelat Hitam 85%+',
    icon: '🍫',
    descEn: 'Rich in natural magnesium and theobromine to relax uterine smooth muscle spasms.',
    descId: 'Kaya magnesium alami dan theobromine untuk melemaskan otot rahim yang tegang.'
  },
  {
    nameEn: 'Warm Ginger & Cinnamon Tea',
    nameId: 'Seduhan Jahe & Kayu Manis',
    icon: '🫚',
    descEn: 'Natural COX-2 enzyme inhibitor that lowers inflammatory prostaglandins causing cramps.',
    descId: 'Inhibitor enzim COX-2 alami yang menurunkan prostaglandin pemicu kram perut.'
  },
  {
    nameEn: 'Pumpkin Seeds & Walnuts',
    nameId: 'Biji Labu & Kenari',
    icon: '🌰',
    descEn: 'High in zinc and anti-inflammatory Omega-3s to reduce menstrual flow inflammation.',
    descId: 'Tinggi zinc dan Omega-3 anti-inflamasi untuk meredakan peradangan saat haid.'
  }
];
