import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, Moon, Play, Pause, RotateCcw, CheckCircle2, ChevronRight, ChevronLeft, Volume2, UserCheck, Utensils, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language } from '@/lib/types';
import { playChime, playSuccessChord, playBreathTone } from '@/lib/soundEffects';
import confetti from 'canvas-confetti';

interface GuidedRitualsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'depuff' | 'breathwork' | 'posture' | 'digest' | 'cryo' | 'drybrush' | 'eye_refresh' | 'guasha';
  language?: Language;
}

export function GuidedRitualsModal({ isOpen, onClose, type, language = 'en' }: GuidedRitualsModalProps) {
  const isId = language === 'id';

  // De-Puff Routine Steps (4 steps x 30s = 120s total)
  const depuffSteps = React.useMemo(() => [
    {
      title: isId ? '1. Buka Saluran Limfatik Leher' : '1. Collarbone & Neck Awakening',
      desc: isId 
        ? 'Gunakan kedua telapak tangan untuk mengusap leher dari bawah telinga turun ke tulang selangka dengan tekanan lembut.'
        : 'Use flat hands to gently glide down the sides of the neck toward collarbones to open primary lymph nodes.',
      duration: 30,
      icon: '🌿'
    },
    {
      title: isId ? '2. Bentuk Garis Rahang (Jawline Contour)' : '2. Jawline Contour Sweep',
      desc: isId 
        ? 'Tekuk jari telunjuk dan tengah membentuk V, usap sepanjang tulang rahang dari dagu ke arah daun telinga.'
        : 'Form a gentle knuckle "V" with fingers and glide firmly along jawline from chin upward to earlobes.',
      duration: 30,
      icon: '✨'
    },
    {
      title: isId ? '3. Angkat Pipi & Redakan Kantung Mata' : '3. Cheek & Under-Eye De-Puff',
      desc: isId 
        ? 'Ketuk lembut dengan jari manis di bawah mata ke arah pelipis, lalu usap tulang pipi ke atas.'
        : 'Lightly feather-tap under eyes with ring finger, sweeping fluid outward and lifting cheekbones.',
      duration: 30,
      icon: '🧊'
    },
    {
      title: isId ? '4. Haluskan Dahi & Pelipis' : '4. Forehead & Brow Smoothing',
      desc: isId 
        ? 'Gunakan ujung jari untuk mengusap dari tengah dahi ke luar menuju pelipis, lalu tarik turun ke leher.'
        : 'Glide fingertips firmly from forehead center outward to temples, then sweep down the neck to complete drainage.',
      duration: 30,
      icon: '🌸'
    }
  ], [isId]);

  // Posture Alignment Steps (3 steps x 20s = 60s total)
  const postureSteps = React.useMemo(() => [
    {
      title: isId ? '1. Chin Tucks & Penyelarasan Leher' : '1. Chin Tucks & Neck Lengthening',
      desc: isId
        ? 'Tarik dagu lurus ke belakang (seperti membuat double chin ringan). Tahan 3 detik lalu lepas, ulangi 5 kali untuk meluruskan leher.'
        : 'Draw chin straight back as if making a subtle double chin. Hold 3s and repeat to eliminate tech neck and align cervical spine.',
      duration: 20,
      icon: '🧘'
    },
    {
      title: isId ? '2. Tarik Belikat & Buka Dada' : '2. Scapular Squeeze & Chest Opener',
      desc: isId
        ? 'Putar bahu ke atas, belakang, dan bawah. Rapatkan kedua tulang belikat kuat-kuat untuk membuka rongga dada.'
        : 'Roll shoulders up, back, and down. Squeeze shoulder blades together firmly to reverse slouching and expand the ribcage.',
      duration: 20,
      icon: '✨'
    },
    {
      title: isId ? '3. Tulang Belakang Tegak & Napas Dalam' : '3. Spine Elongation & Rib Lift',
      desc: isId
        ? 'Duduk tegak, bayangkan puncak kepala ditarik ke atas. Tarik napas diafragma dalam untuk mengaktifkan otot postur.'
        : 'Sit tall on your sit-bones, lift the crown of your head upward, and take two deep diaphragmatic breaths to lock in posture.',
      duration: 20,
      icon: '👑'
    }
  ], [isId]);

  // Cryo & Ice-Roller Sculpting Steps (4 steps x 30s = 120s)
  const cryoSteps = React.useMemo(() => [
    {
      title: isId ? '1. Angkat Dahi & Alis Sejuk' : '1. Forehead & Brow Ice Lift',
      desc: isId
        ? 'Gulingkan ice-roller dari tengah alis ke atas garis rambut untuk mengencangkan kulit dahi dan membuka mata yang mengantuk.'
        : 'Roll cold ice-roller upward from brow line into hairline to tighten forehead fascia and wake up tired morning eyes.',
      duration: 30,
      icon: '🧊'
    },
    {
      title: isId ? '2. Pahatan Tulang Pipi (Cheek Sculpt)' : '2. Cheekbone Ice Sculpting',
      desc: isId
        ? 'Gulingkan dari cuping hidung menyusuri tulang pipi ke arah pelipis dengan tekanan lembut dan ritme stabil.'
        : 'Glide cold roller from side of nose along the cheekbone upward toward temples with gentle lifting pressure.',
      duration: 30,
      icon: '💎'
    },
    {
      title: isId ? '3. Pembentukan Garis Rahang & Leher' : '3. Jawline & Neck Contour Drain',
      desc: isId
        ? 'Tarik dari dagu menyusuri rahang ke bawah telinga, lalu usap ke bawah leher untuk membuang cairan sembap.'
        : 'Sweep from chin along jawline to earlobes, then roll down the neck to flush constricted lymphatic fluid away.',
      duration: 30,
      icon: '❄️'
    },
    {
      title: isId ? '4. Kompres Dingin Bawah Mata' : '4. Under-Eye Cooling Press',
      desc: isId
        ? 'Tempelkan roller dingin dengan sangat lembut di bawah mata selama 5 detik per sisi untuk mengecilkan pembuluh darah sembap.'
        : 'Hold cold roller gently under the orbital bone for 5s intervals to shrink dilated capillaries and banish puffiness.',
      duration: 30,
      icon: '✨'
    }
  ], [isId]);

  // Lymphatic Dry Brushing Steps (4 steps x 30s = 120s)
  const drybrushSteps = React.useMemo(() => [
    {
      title: isId ? '1. Kaki & Betis ke Arah Lutut' : '1. Feet & Calves Upward Sweep',
      desc: isId
        ? 'Gunakan gerakan sapuan lembut dari telapak kaki naik ke pergelangan dan betis menuju bagian belakang lutut.'
        : 'Use gentle, long upward strokes starting at the soles of feet, sweeping up calves toward the lymph nodes behind knees.',
      duration: 30,
      icon: '🪥'
    },
    {
      title: isId ? '2. Paha ke Kelenjar Selangkangan' : '2. Thighs to Inguinal Nodes',
      desc: isId
        ? 'Sikat bagian paha depan dan belakang ke atas menuju lipatan selangkangan untuk memperlancar sirkulasi selulit.'
        : 'Brush thighs in sweeping upward motions directing fluid into the inguinal lymph nodes at the groin fold.',
      duration: 30,
      icon: '🌿'
    },
    {
      title: isId ? '3. Tangan & Lengan ke Ketiak' : '3. Arms to Axillary Underarm Nodes',
      desc: isId
        ? 'Mulai dari telapak tangan, sikat sepanjang lengan bawah dan atas menuju kelenjar getah bening di bawah ketiak.'
        : 'Begin at palms and sweep upward along forearms and biceps directly toward the axillary lymph nodes in armpits.',
      duration: 30,
      icon: '💫'
    },
    {
      title: isId ? '4. Perut & Dada ke Arah Tulang Selangka' : '4. Torso & Decolletage Toward Heart',
      desc: isId
        ? 'Sikat perut searah jarum jam (mengikuti usus), lalu usap dada atas dengan lembut ke arah tulang selangka.'
        : 'Brush abdomen in gentle clockwise circles (following colon motility), then sweep chest upward toward clavicles.',
      duration: 30,
      icon: '💖'
    }
  ], [isId]);

  // Eye Refresh 20-20-20 Steps (3 steps x 20s = 60s)
  const eyeRefreshSteps = React.useMemo(() => [
    {
      title: isId ? '1. Fokus Horizon Jauh (20-20-20)' : '1. 20-20-20 Horizon Focus Shift',
      desc: isId
        ? 'Alihkan pandangan dari layar ke objek sejauh 6 meter (20 kaki). Kedipkan mata perlahan untuk melembapkan kornea.'
        : 'Look away from your screen at an object 20 feet away. Blink slowly and deliberately to lubricate the cornea.',
      duration: 20,
      icon: '👁️'
    },
    {
      title: isId ? '2. Akupresur Pelipis & Alis' : '2. Temple & Brow Acupressure',
      desc: isId
        ? 'Tekan ujung jari di antara alis (Yintang) dan pelipis, buat gerakan melingkar lembut untuk melepas ketegangan dahi.'
        : 'Press fingertips firmly into the space between brows and temples, making slow circular motions to release squint tension.',
      duration: 20,
      icon: '💆‍♀️'
    },
    {
      title: isId ? '3. Palming Hangat & Gelap Total' : '3. Warm Palm Eye Cupping',
      desc: isId
        ? 'Gosok kedua telapak tangan hingga hangat, lalu telungkupkan di atas mata tertutup tanpa menekan bola mata.'
        : 'Rub palms together until warm, then cup them gently over closed eyes, soaking in complete restful darkness.',
      duration: 20,
      icon: '🤲'
    }
  ], [isId]);

  // Facial Gua Sha Sculpting Steps (4 steps x 45s = 180s)
  const guashaSteps = React.useMemo(() => [
    {
      title: isId ? '1. Leher & Tulang Selangka' : '1. Neck & Trapezius Clearing',
      desc: isId
        ? 'Pegang Gua Sha rata dengan sudut 15°. Usap dari bawah telinga menyusuri leher ke tulang selangka untuk membuka jalur drainase getah bening.'
        : 'Hold Gua Sha flat at a 15° angle against skin. Sweep down the neck toward collarbones 5-10 times to open primary lymphatic drainage pathways.',
      duration: 45,
      icon: '💎'
    },
    {
      title: isId ? '2. Garis Rahang & Titik Masseter (ST6)' : '2. Jawline & Masseter Release',
      desc: isId
        ? 'Gunakan lekukan Gua Sha pada rahang dari dagu ke telinga. Tekan lembut pada otot rahang (ST6) untuk melepas ketegangan bruxism / gigi gemeletuk.'
        : 'Glide curved notch along jawline from chin to ear. Pause with gentle vibrating pressure over the masseter muscle (ST6 point) to release clenching.',
      duration: 45,
      icon: '🌸'
    },
    {
      title: isId ? '3. Angkat Tulang Pipi (SI18)' : '3. Cheekbone Sculpt & Lift',
      desc: isId
        ? 'Usap sisi panjang Gua Sha dari cuping hidung menyusuri bawah tulang pipi ke arah pelipis. Angkat dan goyang perlahan di pelipis.'
        : 'Glide long flat edge from nose/smile line under zygomatic bone up toward hairline. Wiggle gently at temples to relieve sinus pressure.',
      duration: 45,
      icon: '✨'
    },
    {
      title: isId ? '4. Dahi & Lengkung Alis (BL2)' : '4. Brow Arch & Forehead Lift',
      desc: isId
        ? 'Tekan lembut di pangkal alis (BL2) untuk segarkan mata, lalu usap ke atas dari alis ke garis rambut di seluruh dahi.'
        : 'Press gently at inner brow arch (BL2 point) to lift hooded eyelids, then sweep flat edge upward from brows into hairline across forehead.',
      duration: 45,
      icon: '👑'
    }
  ], [isId]);

  const isStepRoutine = type !== 'breathwork' && type !== 'digest';

  const activeSteps = React.useMemo(() => {
    switch (type) {
      case 'posture': return postureSteps;
      case 'cryo': return cryoSteps;
      case 'drybrush': return drybrushSteps;
      case 'eye_refresh': return eyeRefreshSteps;
      case 'guasha': return guashaSteps;
      default: return depuffSteps;
    }
  }, [type, postureSteps, cryoSteps, drybrushSteps, eyeRefreshSteps, guashaSteps, depuffSteps]);


  // De-puff timer state
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Breathwork state (4-7-8 method or 4-4-4 pre-meal digest)
  // Phases: 'inhale' (4s), 'hold' (7s / 4s), 'exhale' (8s / 4s)
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathSeconds, setBreathSeconds] = useState(4);
  const [breathCycles, setBreathCycles] = useState(1);
  const totalCycles = type === 'digest' ? 2 : 4;

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setTimeLeft(activeSteps[0].duration);
      setIsRunning(true);
      setIsCompleted(false);

      setBreathPhase('inhale');
      setBreathSeconds(4);
      setBreathCycles(1);
    } else {
      setIsRunning(false);
    }
  }, [isOpen, type, activeSteps]);

  // Step Timer loop (for all step routines: depuff, posture, cryo, drybrush, eye_refresh)
  useEffect(() => {
    if (!isStepRoutine || !isRunning || isCompleted) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (currentStep < activeSteps.length - 1) {
            setCurrentStep(s => s + 1);
            playChime();
            return activeSteps[currentStep + 1].duration;
          } else {
            setIsCompleted(true);
            setIsRunning(false);
            playSuccessChord();
            confetti({
              particleCount: 100,
              spread: 60,
              origin: { y: 0.5 }
            });
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [type, isRunning, currentStep, isCompleted, activeSteps, isStepRoutine]);

  // Breathwork Timer loop (for breathwork and digest)
  useEffect(() => {
    if ((type !== 'breathwork' && type !== 'digest') || !isRunning || isCompleted) return;

    const timer = setInterval(() => {
      setBreathSeconds(prev => {
        if (prev <= 1) {
          if (breathPhase === 'inhale') {
            setBreathPhase('hold');
            playBreathTone(528, 0.6);
            return type === 'digest' ? 4 : 7;
          } else if (breathPhase === 'hold') {
            setBreathPhase('exhale');
            playBreathTone(396, 0.8);
            return type === 'digest' ? 4 : 8;
          } else {
            // Completed 1 cycle
            if (breathCycles < totalCycles) {
              setBreathCycles(c => c + 1);
              setBreathPhase('inhale');
              playBreathTone(432, 0.6);
              return 4;
            } else {
              setIsCompleted(true);
              setIsRunning(false);
              playSuccessChord();
              confetti({
                particleCount: 80,
                spread: 60,
                origin: { y: 0.5 }
              });
              return 0;
            }
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [type, isRunning, breathPhase, breathCycles, isCompleted, totalCycles]);

  const handleReset = () => {
    if (isStepRoutine) {
      setCurrentStep(0);
      setTimeLeft(activeSteps[0].duration);
      setIsCompleted(false);
      setIsRunning(true);
    } else {
      setBreathPhase('inhale');
      setBreathSeconds(4);
      setBreathCycles(1);
      setIsCompleted(false);
      setIsRunning(true);
    }
  };

  const getBreathPhaseText = () => {
    if (breathPhase === 'inhale') return isId ? 'Tarik Napas Perlahan (4s)' : 'Inhale Gently (4s)';
    if (breathPhase === 'hold') return isId ? 'Tahan Napas & Rileks' : 'Hold & Find Stillness';
    return isId ? 'Hembuskan Napas Perlahan' : 'Exhale Smoothly';
  };

  const getModalTitle = () => {
    if (type === 'posture') return isId ? 'Panduan Postur 1 Menit' : '1-Minute Posture Alignment';
    if (type === 'depuff') return isId ? 'Ritual Pijat Limfatik 2 Menit' : '2-Minute Lymphatic De-Puff';
    if (type === 'guasha') return isId ? 'Gua Sha Wajah & Pahatan Rahang (3 Menit)' : '3-Minute Facial Gua Sha Sculpting';
    if (type === 'cryo') return isId ? 'Ritual Cryo & Ice-Roller Wajah' : 'Ice-Roller & Cryo Sculpting';
    if (type === 'drybrush') return isId ? 'Sikat Kering Limfatik Tubuh' : 'Lymphatic Dry Brushing Guide';
    if (type === 'eye_refresh') return isId ? 'Relaksasi Mata 20-20-20 (1 Menit)' : '1-Minute Eye Refresh (20-20-20)';
    if (type === 'digest') return isId ? 'Relaksasi Cerna 30 Detik (Pre-Meal)' : '30s Rest & Digest Reset';
    return isId ? 'Pernapasan Relaksasi Tidur 4-7-8' : '4-7-8 Sleep Breathwork';
  };

  const getModalDesc = () => {
    if (type === 'posture') return isId ? 'Redakan leher tegang, buka rongga dada, dan tegakkan postur tubuh.' : 'Realign cervical spine, reverse slouching, and radiate confident presence.';
    if (type === 'depuff') return isId ? 'Lancarkan sirkulasi, kencangkan wajah, dan redakan sembap pagi.' : 'Stimulate lymphatic drainage, depuff eyelids, and sculpt facial contours.';
    if (type === 'guasha') return isId ? 'Pahat garis rahang, redakan ketegangan otot pengunyah (masseter), dan angkat tulang pipi.' : 'Sculpt jawline, release masseter clenching, and lift zygomatic cheekbones.';
    if (type === 'cryo') return isId ? 'Terapi dingin untuk kecilkan pori, kencangkan kontur, dan segarkan wajah.' : 'Cold therapy to shrink pores, define cheekbones, and eliminate sleep puffiness.';
    if (type === 'drybrush') return isId ? 'Gerakan sikat terarah untuk lancarkan getah bening dan haluskan kulit tubuh.' : 'Directional body brushing to stimulate full-body lymph flow and smooth texture.';
    if (type === 'eye_refresh') return isId ? 'Redakan ketegangan otot mata, lingkar hitam, dan mata lelah akibat layar.' : 'Alleviate digital eye strain, dark circles, and forehead tension lines.';
    if (type === 'digest') return isId ? 'Aktifkan saraf parasimpatik untuk melancarkan pencernaan dan cegah begah.' : 'Stimulate vagus nerve and enter rest-and-digest state before eating.';
    return isId ? 'Turunkan denyut jantung dan lepaskan ketegangan sebelum tidur.' : 'Downregulate the nervous system and calm evening cortisol.';
  };

  const getHeaderIcon = () => {
    if (type === 'depuff') return <Sparkles className="w-6 h-6" />;
    if (type === 'posture') return <UserCheck className="w-6 h-6" />;
    if (type === 'guasha') return <span className="text-2xl">💎</span>;
    if (type === 'cryo') return <span className="text-2xl">🧊</span>;
    if (type === 'drybrush') return <span className="text-2xl">🪥</span>;
    if (type === 'eye_refresh') return <span className="text-2xl">👁️</span>;
    if (type === 'digest') return <Utensils className="w-6 h-6" />;
    return <Moon className="w-6 h-6" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-md rounded-[2.5rem] p-6 border-none shadow-2xl bg-gradient-to-b from-white via-pink-50/20 to-white">
        <DialogHeader className="text-center space-y-1">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-500 mb-1">
            {getHeaderIcon()}
          </div>
          <DialogTitle className="text-xl font-black">
            {getModalTitle()}
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            {getModalDesc()}
          </p>
        </DialogHeader>

        {isCompleted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-emerald-900">
                {isId ? 'Ritual Selesai! ✨' : 'Ritual Complete! ✨'}
              </h3>
              <p className="text-xs text-muted-foreground px-6 leading-relaxed">
                {type === 'guasha'
                  ? (isId ? 'Ketegangan rahangmu terlepas, getah bening terbuang lancar, dan garis wajah terpahat tegas!' : 'Jaw clenching released, stagnant lymph drained, and facial contours sculpted!')
                  : type === 'cryo'
                  ? (isId ? 'Pori-pori kulitmu kini kencang, peradangan mereda, dan kontur wajah terdefinisi segar!' : 'Your pores are tightened, puffiness banished, and facial contours sculpted!')
                  : type === 'drybrush'
                  ? (isId ? 'Sirkulasi getah bening seluruh tubuhmu kini mengalir lancar dan kulit terasa lembut!' : 'Your full-body lymphatic flow is revitalized and skin feels silky smooth!')
                  : type === 'eye_refresh'
                  ? (isId ? 'Otot matamu rileks, sirkulasi periorbital membaik, dan pandangan kembali segar!' : 'Your ocular muscles are relaxed, periorbital circulation refreshed, and gaze clear!')
                  : type === 'digest'
                  ? (isId ? 'Sistem pencernaanmu siap menyerap nutrisi makanan dengan optimal tanpa begah.' : 'Your digestive tract is relaxed and primed for optimal nutrient absorption.')
                  : type === 'posture'
                  ? (isId ? 'Tulang belakang dan lehermu kini lebih tegak, rileks, dan percaya diri.' : 'Your spine is elongated, neck tension eased, and posture beautifully aligned.')
                  : type === 'depuff' 
                  ? (isId ? 'Wajahmu terasa lebih segar, rileks, dan bercahaya alami hari ini.' : 'Your facial circulation is flowing and skin is visibly refreshed.')
                  : (isId ? 'Tubuhmu kini dalam kondisi relaksasi optimal untuk tidur nyenyak.' : 'Your heart rate has slowed and your body is prepared for restorative sleep.')}
              </p>
            </div>
            <div className="flex gap-2 justify-center pt-2">
              <Button onClick={handleReset} variant="outline" className="rounded-full text-xs font-bold">
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                {isId ? 'Ulangi' : 'Repeat'}
              </Button>
              <Button onClick={onClose} className="rounded-full bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold px-6">
                {isId ? 'Selesai' : 'Done'}
              </Button>
            </div>
          </div>
        ) : isStepRoutine ? (
          <div className="space-y-6 py-2">
            {/* Visual Step Card */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white p-5 rounded-2xl border border-pink-500/15 shadow-sm space-y-3 text-center"
              >
                <span className="text-2xl">{activeSteps[currentStep].icon}</span>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-pink-600">{activeSteps[currentStep].title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {activeSteps[currentStep].desc}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2 pt-2">
                  <div className="text-3xl font-black font-headline text-foreground">
                    {timeLeft}s
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Step Progress Dots */}
            <div className="flex justify-center gap-2">
              {activeSteps.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-2 rounded-full transition-all duration-300 ${i === currentStep ? 'w-8 bg-pink-500' : i < currentStep ? 'w-2 bg-pink-300' : 'w-2 bg-pink-100'}`} 
                />
              ))}
            </div>

            {/* Controls */}
            <div className="flex justify-center items-center gap-3">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => {
                  if (currentStep > 0) {
                    setCurrentStep(c => c - 1);
                    setTimeLeft(activeSteps[currentStep - 1].duration);
                  }
                }}
                disabled={currentStep === 0}
                className="rounded-full"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <Button 
                onClick={() => setIsRunning(!isRunning)} 
                className="rounded-full bg-pink-500 hover:bg-pink-600 text-white font-bold px-6 shadow-md shadow-pink-500/20"
              >
                {isRunning ? <Pause className="w-4 h-4 mr-1.5" /> : <Play className="w-4 h-4 mr-1.5" />}
                {isRunning ? (isId ? 'Jeda' : 'Pause') : (isId ? 'Lanjutkan' : 'Resume')}
              </Button>

              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => {
                  if (currentStep < activeSteps.length - 1) {
                    setCurrentStep(c => c + 1);
                    setTimeLeft(activeSteps[currentStep + 1].duration);
                  }
                }}
                disabled={currentStep === activeSteps.length - 1}
                className="rounded-full"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          /* Breathwork Visualizer */
          <div className="space-y-6 py-4 flex flex-col items-center">
            <div className="relative w-48 h-48 flex items-center justify-center">
              {/* Expanding / Contracting Breathing Orb */}
              <motion.div 
                animate={{
                  scale: breathPhase === 'inhale' ? [1, 1.45] : breathPhase === 'hold' ? 1.45 : [1.45, 1],
                  opacity: breathPhase === 'hold' ? 0.9 : 0.7,
                }}
                transition={{
                  duration: breathPhase === 'inhale' ? 4 : breathPhase === 'hold' ? 7 : 8,
                  ease: "easeInOut"
                }}
                className={`absolute inset-4 rounded-full filter blur-md ${
                  breathPhase === 'inhale' 
                    ? 'bg-gradient-to-tr from-indigo-400 to-pink-400' 
                    : breathPhase === 'hold' 
                    ? 'bg-gradient-to-tr from-purple-500 to-indigo-500' 
                    : 'bg-gradient-to-tr from-blue-400 to-teal-400'
                }`}
              />

              <div className="relative z-10 w-28 h-28 rounded-full bg-white shadow-xl flex flex-col items-center justify-center border border-white/80">
                <span className="text-3xl font-black font-headline text-purple-900">{breathSeconds}</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-purple-600 opacity-70">
                  {breathPhase}
                </span>
              </div>
            </div>

            <div className="text-center space-y-1">
              <h4 className="text-sm font-black text-purple-900">{getBreathPhaseText()}</h4>
              <p className="text-xs font-bold text-muted-foreground">
                {isId ? `Siklus ${breathCycles} dari ${totalCycles}` : `Cycle ${breathCycles} of ${totalCycles}`}
              </p>
            </div>

            {/* Controls */}
            <div className="flex gap-2">
              <Button 
                onClick={() => setIsRunning(!isRunning)} 
                className="rounded-full bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 shadow-md shadow-purple-500/20"
              >
                {isRunning ? <Pause className="w-4 h-4 mr-1.5" /> : <Play className="w-4 h-4 mr-1.5" />}
                {isRunning ? (isId ? 'Jeda' : 'Pause') : (isId ? 'Mulai' : 'Start')}
              </Button>
              <Button onClick={handleReset} variant="outline" size="icon" className="rounded-full">
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
