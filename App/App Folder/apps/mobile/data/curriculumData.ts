import { LocalizedString } from '@parishak/shared';

export interface CurriculumVideo {
  id: string;
  moduleId: string;
  chapterId: number;
  title: LocalizedString;
  description: LocalizedString;
  duration: string;
  thumbnail: string;
  videoUrl: string;
  embedUrl?: string;
}

export interface CurriculumChapter {
  id: number;
  moduleId: string;
  title: LocalizedString;
  subtitle: LocalizedString;
  description: LocalizedString;
  image: string;
  color: string;
  keyTakeaways?: LocalizedString[];
  regulationRef?: LocalizedString;
}

export interface CurriculumARDrill {
  chapterId: number;
  moduleId: string;
  title: LocalizedString;
  chapterTitle: LocalizedString;
  drillObjective: LocalizedString;
  virtualEquipment: LocalizedString;
  interactionType: LocalizedString;
  color: string;
  safetyTip?: LocalizedString;
}

export interface CurriculumAssessmentQuestion {
  id: string;
  prompt: LocalizedString;
  options: Array<{ id: string; text: LocalizedString }>;
  correctAnswer: string;
  explanation: LocalizedString;
}

export interface CurriculumChapterAssessment {
  chapterId: number;
  moduleId: string;
  title: LocalizedString;
  subtitle: LocalizedString;
  questionsCount: number;
  passingPercentage: number;
  color: string;
  questions: CurriculumAssessmentQuestion[];
}

export interface ModuleCurriculum {
  moduleId: string;
  isComingSoon?: boolean;
  title: LocalizedString;
  description: LocalizedString;
  chapters: CurriculumChapter[];
  videos: CurriculumVideo[];
  arDrills: CurriculumARDrill[];
  assessments: CurriculumChapterAssessment[];
  syllabusHighlights?: LocalizedString[];
  comingSoonDetails?: {
    badge: LocalizedString;
    heading: LocalizedString;
    subheading: LocalizedString;
    syllabusHighlights: LocalizedString[];
  };
}

export type VideoData = CurriculumVideo;
export type ChapterData = CurriculumChapter;
export type ARDrillData = CurriculumARDrill;

const YOUTUBE_EMBED_URL = 'https://www.youtube.com/embed/Vc7ZqtGNmTY?si=C9FEV1LviOPd4gw9';

export const CURRICULUM_DATA: Record<string, ModuleCurriculum> = {
  '1': {
    moduleId: '1',
    isComingSoon: false,
    title: {
      en: 'Fire & Explosion Response',
      hi: 'अग्नि एवं विस्फोट सुरक्षा और प्रतिक्रिया',
      sat: 'ᱥᱮᱸᱜᱮᱞ ᱟᱨ ᱵᱤᱥᱯᱷᱚᱴ ᱨᱩᱠᱷᱤᱭᱟᱹ'
    },
    description: {
      en: 'Recognize industrial fire classes, master the PASS extinguisher procedure, alarm protocols, and emergency evacuation sequencing.',
      hi: 'औद्योगिक आग की श्रेणियों की पहचान करें, PASS बुझाने की तकनीक सीखें, आपातकालीन अलार्म और सुरक्षित निकासी का अभ्यास करें।',
      sat: 'ᱤᱱᱰᱟᱥᱴᱨᱤ ᱨᱮ ᱥᱮᱸᱜᱮᱞ ᱪᱤᱱᱦᱟᱹᱣ, PASS ᱛᱚᱦᱚᱨ ᱪᱮᱫ, ᱟᱨ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱩᱰᱩᱠ ᱵᱮᱵᱚᱥᱛᱷᱟ ᱯᱟᱲᱦᱟᱣ।'
    },
    chapters: [
      {
        id: 1,
        moduleId: '1',
        title: {
          en: 'Hazard Identification',
          hi: 'खतरे की पहचान',
          sat: 'ᱵᱤᱯᱚᱫᱽ ᱪᱤᱱᱦᱟᱹᱣ'
        },
        subtitle: {
          en: 'Chemical, Electrical & Thermal Risks',
          hi: 'रासायनिक, विद्युत और तापीय जोखिम',
          sat: 'ᱨᱟᱥᱟᱭᱚᱱ, ᱵᱤᱡᱽᱞᱤ ᱟᱨ ᱞᱚᱞᱚ ᱵᱤᱯᱚᱫᱽ'
        },
        description: {
          en: 'Learn to identify fire hazards, unsafe conditions, ignition sources, and workplace risks before an incident occurs.',
          hi: 'घटना घटने से पहले कार्यस्थल पर आग के खतरों, असुरक्षित स्थितियों और इग्निशन स्रोतों की पहचान करना सीखें।',
          sat: 'ᱜᱷᱚᱴᱚᱱ ᱦᱩᱭᱩᱜ ᱢᱟᱲᱟᱝ ᱠᱟᱹᱢᱤ ᱡᱟᱭᱜᱟ ᱨᱮ ᱥᱮᱸᱜᱮᱞ ᱵᱤᱯᱚᱫᱽ ᱟᱨ ᱡᱩᱞᱩᱜ ᱥᱟᱢᱟᱱ ᱪᱤᱱᱦᱟᱹᱣ ᱪᱮᱫ ᱢᱮ᱾'
        },
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
        color: '#FF5722'
      },
      {
        id: 2,
        moduleId: '1',
        title: {
          en: 'Fire Classification & Extinguisher Selection',
          hi: 'अग्नि वर्गीकरण एवं अग्निशामक चयन',
          sat: 'ᱥᱮᱸᱜᱮᱞ ᱛᱷᱚᱠ ᱟᱨ ᱤᱬᱤᱡ ᱥᱟᱢᱟᱱ ᱵᱟᱪᱷᱟᱣ'
        },
        subtitle: {
          en: 'NFPA Classes A-K & Extinguisher Matching',
          hi: 'NFPA श्रेणियां A-K और अग्निशामक मिलान',
          sat: 'NFPA ᱠᱞᱟᱥ A-K ᱟᱨ ᱥᱟᱹᱦᱤᱡ ᱥᱟᱢᱟᱱ'
        },
        description: {
          en: 'Learn fire classes and how to select the correct extinguisher for different types of industrial fires.',
          hi: 'आग की श्रेणियों को समझें और विभिन्न औद्योगिक आग के लिए सही अग्निशामक चुनना सीखें।',
          sat: 'ᱥᱮᱸᱜᱮᱞ ᱨᱮᱭᱟᱜ ᱦᱟᱹᱴᱤᱧ ᱵᱟᱰᱟᱭ ᱠᱟᱛᱮ ᱥᱟᱹᱦᱤᱡ ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱢᱤᱥᱤᱱ ᱵᱟᱪᱷᱟᱣ ᱪᱮᱫ ᱢᱮ᱾'
        },
        image: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?w=600&auto=format&fit=crop&q=80',
        color: '#0891B2'
      },
      {
        id: 3,
        moduleId: '1',
        title: {
          en: 'Real Equipment Training',
          hi: 'वास्तविक उपकरण प्रशिक्षण',
          sat: 'ᱥᱟᱹᱨᱤ ᱥᱟᱢᱟᱱ ᱴᱨᱮᱱᱤᱝ'
        },
        subtitle: {
          en: 'Detection Systems & Alarm Panels',
          hi: 'डिटेक्शन सिस्टम और अलार्म पैनल',
          sat: 'ᱥᱮᱸᱜᱮᱞ ᱰᱤᱴᱮᱠᱴᱚᱨ ᱟᱨ ᱟᱞᱟᱨᱢ ᱯᱮᱱᱮᱞ'
        },
        description: {
          en: 'Learn the correct handling and operation of emergency fire equipment through guided practical training.',
          hi: 'व्यावहारिक मार्गदर्शन के माध्यम से आपातकालीन अग्नि उपकरणों के सही संचालन और रखरखाव का अभ्यास करें।',
          sat: 'ᱮᱢᱟᱨᱡᱮᱱᱥᱤ ᱥᱮᱸᱜᱮᱞ ᱥᱟᱢᱟᱱ ᱥᱟᱹᱦᱤᱡ ᱪᱟᱞᱟᱣ ᱟᱨ ᱵᱮᱵᱷᱟᱨ ᱨᱮᱭᱟᱜ ᱦᱩᱱᱟᱹᱨ ᱪᱮᱫ ᱢᱮ᱾'
        },
        image: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=600&auto=format&fit=crop&q=80',
        color: '#D97706'
      },
      {
        id: 4,
        moduleId: '1',
        title: {
          en: 'Industrial Fire Emergency Simulation',
          hi: 'औद्योगिक अग्नि आपातकालीन सिमुलेशन',
          sat: 'ᱠᱟᱹᱨᱠᱷᱟᱱᱟ ᱥᱮᱸᱜᱮᱞ ᱮᱢᱟᱨᱡᱮᱱᱥᱤ ᱥᱤᱢᱩᱞᱮᱥᱚᱱ'
        },
        subtitle: {
          en: 'P.A.S.S. Technique & Emergency Drills',
          hi: 'P.A.S.S. तकनीक और आपातकालीन ड्रिल',
          sat: 'P.A.S.S. ᱛᱚᱦᱚᱨ ᱟᱨ ᱮᱢᱟᱨᱡᱮᱱᱥᱤ ᱰᱨᱤᱞ'
        },
        description: {
          en: 'Practice responding to an industrial fire emergency through an interactive scenario with safety decisions and actions.',
          hi: 'सुरक्षा निर्णयों और त्वरित कार्रवाइयों के साथ सिमुलेटेड आपातकालीन अग्नि परिदृश्य में अभ्यास करें।',
          sat: 'ᱥᱟᱹᱨᱤ ᱥᱮᱸᱜᱮᱞ ᱮᱢᱟᱨᱡᱮᱱᱥᱤ ᱨᱮ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱯᱷᱟᱹᱭᱥᱟᱞᱟ ᱟᱨ ᱞᱚᱜᱚᱱ ᱠᱟᱹᱢᱤ ᱨᱮᱭᱟᱜ ᱥᱤᱢᱩᱞᱮᱥᱚᱱ ᱠᱚᱨᱟᱣ ᱢᱮ᱾'
        },
        image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80',
        color: '#10B981'
      },
      {
        id: 5,
        moduleId: '1',
        title: {
          en: 'Emergency Evacuation & AR Navigation',
          hi: 'आपातकालीन निकासी एवं AR नेविगेशन',
          sat: 'ᱮᱢᱟᱨᱡᱮᱱᱥᱤ ᱩᱰᱩᱠ ᱟᱨ AR ᱫᱤᱥᱟᱹ ᱩᱫᱩᱜ'
        },
        subtitle: {
          en: 'Muster Points & Spatial Navigation',
          hi: 'असेंबली पॉइंट और स्थानिक नेविगेशन',
          sat: 'ᱡᱟᱣᱨᱟᱜ ᱡᱟᱭᱜᱟ ᱟᱨ AR ᱰᱟᱦᱟᱨ'
        },
        description: {
          en: 'Practice safe evacuation procedures and follow AR-guided navigation to reach a designated safe area.',
          hi: 'सुरक्षित निकास प्रक्रियाओं का अभ्यास करें और AR-निर्देशित नेविगेशन का पालन करते हुए सुरक्षित असेंबली क्षेत्र तक पहुंचें।',
          sat: 'ᱨᱩᱠᱷᱤᱭᱟᱹ ᱩᱰᱩᱠ ᱰᱟᱦᱟᱨ ᱯᱟᱸᱡᱟᱭ ᱢᱮ ᱟᱨ AR ᱫᱤᱥᱟᱹ ᱛᱮ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱡᱟᱣᱨᱟᱜ ᱡᱟᱭᱜᱟ ᱥᱮᱴᱮᱨᱚᱜ ᱪᱮᱫ ᱢᱮ᱾'
        },
        image: 'https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?w=600&auto=format&fit=crop&q=80',
        color: '#6366F1'
      }
    ],
    videos: [
      {
        id: 'vid-f1',
        moduleId: '1',
        chapterId: 1,
        title: {
          en: '1. Fire Chemistry & The Tetrahedron',
          hi: '1. अग्नि रसायन और टेट्राहेड्रोन',
          sat: '᱑. ᱥᱮᱸᱜᱮᱞ ᱨᱟᱥᱟᱭᱚᱱ ᱟᱨ ᱯᱩᱱ ᱠᱳᱬ'
        },
        description: {
          en: 'Understand fuel, heat, oxygen, and uninhibited chemical chain reactions in industrial plants.',
          hi: 'औद्योगिक संयंत्रों में ईंधन, ताप, ऑक्सीजन और रासायनिक श्रृंखला प्रतिक्रियाओं को समझें।',
          sat: 'ᱠᱟᱹᱨᱜᱟᱲ ᱨᱮ ᱥᱮᱸᱜᱮᱞ ᱡᱩᱞᱩᱜ ᱨᱮᱭᱟᱜ ᱯᱩᱱᱭᱟ ᱢᱩᱬᱩᱛ ᱡᱤᱱᱤᱥ ᱵᱩᱡᱷᱟᱹᱣ ᱢᱮ᱾'
        },
        duration: '06:15',
        thumbnail: 'https://images.unsplash.com/photo-1599423300746-b62533397364?w=400',
        videoUrl: YOUTUBE_EMBED_URL
      },
      {
        id: 'vid-f2',
        moduleId: '1',
        chapterId: 2,
        title: {
          en: '2. Industrial Fire Classifications (A-K)',
          hi: '2. औद्योगिक आग वर्गीकरण (A-K)',
          sat: '᱒. ᱥᱮᱸᱜᱮᱞ ᱦᱟᱹᱴᱤᱧ ᱛᱷᱚᱠ (A-K)'
        },
        description: {
          en: 'Identify combustible solids, flammable fuels, electrical panels, and metal fire dynamics.',
          hi: 'ठोस दहनशील पदार्थ, ज्वलनशील तरल, विद्युत पैनल और धातु की आग के अंतर को पहचानें।',
          sat: 'ᱠᱟᱴ, ᱥᱩᱱᱩᱢ, ᱵᱤᱡᱽᱞᱤ ᱟᱨ ᱢᱮᱬᱦᱮᱫ ᱥᱮᱸᱜᱮᱞ ᱨᱮᱭᱟᱜ ᱯᱷᱟᱨᱟᱠ ᱪᱤᱱᱦᱟᱹᱣ ᱢᱮ᱾'
        },
        duration: '05:40',
        thumbnail: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400',
        videoUrl: YOUTUBE_EMBED_URL
      },
      {
        id: 'vid-f3',
        moduleId: '1',
        chapterId: 2,
        title: {
          en: '3. The P.A.S.S. Extinguisher Protocol',
          hi: '3. P.A.S.S. अग्निशामक उपयोग तकनीक',
          sat: '᱓. P.A.S.S. ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱛᱚᱦᱚᱨ'
        },
        description: {
          en: 'Master Pull pin, Aim low at the base, Squeeze trigger smoothly, and Sweep side-to-side.',
          hi: 'पिन खींचें (P), जड़ पर निशाना लगाएं (A), ट्रिगर दबाएं (S), और दायें-बायें घुमाएं (S)।',
          sat: 'ᱯᱤᱱ ᱚᱨ (P), ᱞᱟᱛᱟᱨ ᱱᱤᱥᱟᱱᱟ (A), ᱞᱤᱱ (S), ᱦᱤᱞᱟᱹᱣ (S) ᱛᱚᱦᱚᱨ ᱪᱮᱫ ᱢᱮ᱾'
        },
        duration: '07:22',
        thumbnail: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400',
        videoUrl: YOUTUBE_EMBED_URL
      },
      {
        id: 'vid-f4',
        moduleId: '1',
        chapterId: 3,
        title: {
          en: '4. Preventing Liquid Fuel Boiling Explosions',
          hi: '4. तरल ईंधन विस्फोट एवं उबलने से बचाव',
          sat: '᱔. ᱥᱩᱱᱩᱢ ᱥᱮᱸᱜᱮᱞ ᱵᱤᱥᱯᱷᱚᱴ ᱠᱷᱚᱱ ᱨᱩᱠᱷᱤᱭᱟᱹ'
        },
        description: {
          en: 'Why water on burning diesel causes catastrophic steam expansion and fatal splash fires.',
          hi: 'जलते डीजल पर पानी डालने से भाप का तेज धमाका और खतरनाक छिटकाव क्यों होता है।',
          sat: 'ᱡᱩᱞᱩᱜ ᱰᱤᱡᱮᱞ ᱨᱮ ᱫᱟᱜ ᱫᱩᱞ ᱞᱮᱠᱷᱟᱱ ᱵᱤᱥᱯᱷᱚᱴ ᱦᱩᱭᱩᱜ ᱨᱮᱭᱟᱜ ᱵᱤᱯᱚᱫᱽ ᱵᱩᱡᱷᱟᱹᱣ ᱢᱮ᱾'
        },
        duration: '04:50',
        thumbnail: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=400',
        videoUrl: YOUTUBE_EMBED_URL
      },
      {
        id: 'vid-f5',
        moduleId: '1',
        chapterId: 3,
        title: {
          en: '5. Flame & Smoke Detector Calibration',
          hi: '5. लौ एवं धुआं डिटेक्टर अंशांकन',
          sat: '᱕. ᱥᱮᱸᱜᱮᱞ ᱟᱨ ᱫᱷᱩᱶᱟᱹ ᱰᱤᱴᱮᱠᱴᱚᱨ ᱡᱟᱸᱪ'
        },
        description: {
          en: 'Industrial optical flame sensors, beam smoke sensors, and manual pull station wiring.',
          hi: 'ऑप्टिकल फ्लेम सेंसर, बीम स्मोक सेंसर और मैनुअल अलार्म स्टेशन की कार्यप्रणाली।',
          sat: 'ᱠᱟᱹᱨᱜᱟᱲ ᱨᱮ ᱥᱮᱸᱜᱮᱞ ᱟᱨ ᱫᱷᱩᱶᱟᱹ ᱪᱤᱱᱦᱟᱹᱣ ᱥᱟᱢᱟᱱ ᱨᱮᱭᱟᱜ ᱵᱮᱵᱷᱟᱨ ᱪᱮᱫ ᱢᱮ᱾'
        },
        duration: '05:35',
        thumbnail: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400',
        videoUrl: YOUTUBE_EMBED_URL
      },
      {
        id: 'vid-f6',
        moduleId: '1',
        chapterId: 4,
        title: {
          en: '6. Water Deluge & Foam Suppression Systems',
          hi: '6. वाटर डेल्यूज एवं फोम दमन प्रणाली',
          sat: '᱖. ᱫᱟᱜ ᱟᱨ ᱯᱷᱳᱢ ᱛᱮ ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱥᱤᱥᱴᱚᱢ'
        },
        description: {
          en: 'Fixed piping networks, gas turbine CO2 flooding, and automatic riser isolation valves.',
          hi: 'पाइपिंग नेटवर्क, गैस टरबाइन CO2 सिस्टम और ऑटोमैटिक आइसोलेशन वाल्व संचालन।',
          sat: 'ᱯᱟᱭᱤᱯ ᱛᱮ ᱫᱟᱜ ᱟᱨ CO2 ᱜᱮᱥ ᱪᱷᱤᱴᱠᱟᱹᱣ ᱠᱟᱛᱮ ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱵᱮᱵᱚᱥᱛᱷᱟ᱾'
        },
        duration: '06:48',
        thumbnail: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400',
        videoUrl: YOUTUBE_EMBED_URL
      },
      {
        id: 'vid-f7',
        moduleId: '1',
        chapterId: 4,
        title: {
          en: '7. Fire Resistant PPE & Escape Breathing Sets',
          hi: '7. अग्निरोधी PPE एवं आपातकालीन श्वास उपकरण',
          sat: '᱗. ᱥᱮᱸᱜᱮᱞ ᱨᱩᱠᱷᱤᱭᱟᱹ PPE ᱟᱨ ᱥᱟᱦᱮᱫ ᱢᱟᱥᱠ'
        },
        description: {
          en: 'Nomex protective gear, emergency escape breathing apparatus (EEBA), and thermal shields.',
          hi: 'नोमेक्स सुरक्षा पोशाक, आपातकालीन श्वसन उपकरण (EEBA) और थर्मल शील्ड का उपयोग।',
          sat: 'ᱥᱮᱸᱜᱮᱞ ᱵᱟᱝ ᱞᱟᱜᱟᱣᱜ PPE ᱞᱩᱜᱽᱲᱤ ᱟᱨ ᱫᱷᱩᱶᱟᱹ ᱨᱮ ᱥᱟᱦᱮᱫ ᱦᱟᱛᱟᱣ ᱥᱟᱢᱟᱱ᱾'
        },
        duration: '05:10',
        thumbnail: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=400',
        videoUrl: YOUTUBE_EMBED_URL
      },
      {
        id: 'vid-f8',
        moduleId: '1',
        chapterId: 5,
        title: {
          en: '8. Evacuation Signaling & Assembly Muster',
          hi: '8. निकास संकेत एवं सुरक्षित असेंबली गणना',
          sat: '᱘. ᱩᱰᱩᱠ ᱥᱟᱭᱨᱮᱱ ᱟᱨ ᱡᱟᱣᱨᱟᱜ ᱡᱟᱭᱜᱟ ᱦᱟᱡᱤᱨᱤ'
        },
        description: {
          en: 'Stairwell pressurization, emergency exit path illumination, and DGMS head-count verification.',
          hi: 'सीढ़ियों का दबाव नियंत्रण, निकास मार्ग प्रकाश और असेंबली पॉइंट पर हेडकाउंट सत्यापन।',
          sat: 'ᱨᱩᱠᱷᱤᱭᱟᱹ ᱰᱟᱦᱟᱨ ᱨᱮ ᱵᱟᱹᱛᱤ ᱧᱮᱞ ᱠᱟᱛᱮ ᱩᱰᱩᱠ ᱟᱨ ᱡᱟᱣᱨᱟᱜ ᱡᱟᱭᱜᱟ ᱨᱮ ᱦᱟᱡᱤᱨᱤ ᱮᱢ᱾'
        },
        duration: '07:05',
        thumbnail: 'https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?w=400',
        videoUrl: YOUTUBE_EMBED_URL
      }
    ],
    arDrills: [
      {
        chapterId: 1,
        moduleId: '1',
        title: {
          en: 'Hazard Identification',
          hi: 'खतरे की पहचान',
          sat: 'ᱵᱤᱯᱚᱫᱽ ᱪᱤᱱᱦᱟᱹᱣ'
        },
        chapterTitle: {
          en: 'Hazard Identification',
          hi: 'खतरे की पहचान',
          sat: 'ᱵᱤᱯᱚᱫᱽ ᱪᱤᱱᱦᱟᱹᱣ'
        },
        drillObjective: {
          en: 'Scan plant floor surfaces to detect combustible fuel leaks, unventilated methane build-up, and localized heat sources.',
          hi: 'ज्वलनशील ईंधन रिसाव और तापीय स्रोतों की पहचान करने के लिए संयंत्र फर्श को स्कैन करें।',
          sat: 'ᱡᱩᱞᱩᱜ ᱥᱩᱱᱩᱢ ᱞᱤᱠ ᱟᱨ ᱞᱚᱞᱚ ᱡᱟᱭᱜᱟ ᱪᱤᱱᱦᱟᱹᱣ ᱞᱟᱹᱜᱤᱫ ᱚᱛ ᱥᱠᱮᱱ ᱢᱮ᱾'
        },
        virtualEquipment: {
          en: 'Thermal FLIR Scanner & Multi-Gas Ambient Probe',
          hi: 'थर्मल एफएलआईआर स्कैनर और गैस जांच प्रोब',
          sat: 'ᱛᱷᱟᱨᱢᱟᱞ ᱥᱠᱮᱱᱟᱨ ᱟᱨ ᱜᱮᱥ ᱯᱨᱳᱵᱽ'
        },
        interactionType: {
          en: 'Spatial Surface Anchor & Heat Signature Spotting',
          hi: 'सतह एंकर और तापीय हस्ताक्षर पहचान',
          sat: 'ᱚᱛ ᱨᱮ AR ᱟᱠᱳᱨ ᱟᱨ ᱞᱚᱞᱚ ᱪᱤᱱᱦᱟᱹᱣ'
        },
        color: '#FF5722'
      },
      {
        chapterId: 2,
        moduleId: '1',
        title: {
          en: 'Fire Classification & Extinguisher Selection',
          hi: 'अग्नि वर्गीकरण एवं अग्निशामक चयन',
          sat: 'ᱥᱮᱸᱜᱮᱞ ᱛᱷᱚᱠ ᱟᱨ ᱤᱬᱤᱡ ᱥᱟᱢᱟᱱ ᱵᱟᱪᱷᱟᱣ'
        },
        chapterTitle: {
          en: 'Fire Classification & Extinguisher Selection',
          hi: 'अग्नि वर्गीकरण एवं अग्निशामक चयन',
          sat: 'ᱥᱮᱸᱜᱮᱞ ᱛᱷᱚᱠ ᱟᱨ ᱤᱬᱤᱡ ᱥᱟᱢᱟᱱ ᱵᱟᱪᱷᱟᱣ'
        },
        drillObjective: {
          en: 'Locate flammable line isolation valves on virtual piping infrastructure and apply Lockout/Tagout (LOTO) security clamps.',
          hi: 'ज्वलनशील पाइपलाइन पर वाल्व खोजें और LOTO सुरक्षा क्लैंप लगाएं।',
          sat: 'ᱡᱩᱞᱩᱜ ᱯᱟᱭᱤᱯ ᱨᱮ ᱵᱷᱟᱞᱵᱽ ᱧᱟᱢ ᱠᱟᱛᱮ LOTO ᱛᱟᱞᱟ ᱞᱟᱜᱟᱣ ᱢᱮ᱾'
        },
        virtualEquipment: {
          en: 'Virtual Quarter-Turn Ball Valve & LOTO Security Padlock',
          hi: 'वर्चुअल बॉल वाल्व और LOTO पैडलॉक',
          sat: 'ᱵᱚᱞ ᱵᱷᱟᱞᱵᱽ ᱟᱨ LOTO ᱪᱟᱹᱵᱷᱤ'
        },
        interactionType: {
          en: 'Rotational Gesture & Valve Seal Verification',
          hi: 'घुमाव जेस्चर और वाल्व सील सत्यापन',
          sat: 'ᱦᱮᱱᱰᱮᱞ ᱟᱹᱪᱩᱨ ᱟᱨ ᱵᱷᱟᱞᱵᱽ ᱵᱚᱸᱫᱽ ᱡᱟᱸᱪ'
        },
        color: '#0891B2'
      },
      {
        chapterId: 3,
        moduleId: '1',
        title: {
          en: 'Real Equipment Training',
          hi: 'वास्तविक उपकरण प्रशिक्षण',
          sat: 'ᱥᱟᱹᱨᱤ ᱥᱟᱢᱟᱱ ᱴᱨᱮᱱᱤᱝ'
        },
        chapterTitle: {
          en: 'Real Equipment Training',
          hi: 'वास्तविक उपकरण प्रशिक्षण',
          sat: 'ᱥᱟᱹᱨᱤ ᱥᱟᱢᱟᱱ ᱴᱨᱮᱱᱤᱝ'
        },
        drillObjective: {
          en: 'Inspect ceiling-mounted optical smoke sensors, verify line-of-sight beam transmitters, and test manual pull station trigger circuit.',
          hi: 'धुआं सेंसरों की जांच करें और आपातकालीन मैनुअल अलार्म स्टेशन का परीक्षण करें।',
          sat: 'ᱪᱮᱛᱟᱱ ᱨᱮ ᱞᱟᱜᱟᱣ ᱟᱠᱟᱱ ᱫᱷᱩᱶᱟᱹ ᱥᱮᱱᱥᱚᱨ ᱟᱨ ᱟᱞᱟᱨᱢ ᱴᱮᱥᱴ ᱢᱮ᱾'
        },
        virtualEquipment: {
          en: 'Optical Smoke Tester & Manual Pull Station Box',
          hi: 'ऑप्टिकल स्मोक टेस्टर और मैनुअल पुल स्टेशन',
          sat: 'ᱫᱷᱩᱶᱟᱹ ᱴᱮᱥᱴᱚᱨ ᱟᱨ ᱟᱞᱟᱨᱢ ᱵᱟᱠᱥᱟ'
        },
        interactionType: {
          en: 'Proximity Targeting & Alarm Pulse Triggering',
          hi: 'समीप लक्ष्य निर्धारण और अलार्म परीक्षण',
          sat: 'ᱥᱩᱨ ᱥᱮᱱ ᱠᱟᱛᱮ ᱟᱞᱟᱨᱢ ᱞᱤᱱ'
        },
        color: '#D97706'
      },
      {
        chapterId: 4,
        moduleId: '1',
        title: {
          en: 'Industrial Fire Emergency Simulation',
          hi: 'औद्योगिक अग्नि आपातकालीन सिमुलेशन',
          sat: 'ᱠᱟᱹᱨᱠᱷᱟᱱᱟ ᱥᱮᱸᱜᱮᱞ ᱮᱢᱟᱨᱡᱮᱱᱥᱤ ᱥᱤᱢᱩᱞᱮᱥᱚᱱ'
        },
        chapterTitle: {
          en: 'Industrial Fire Emergency Simulation',
          hi: 'औद्योगिक अग्नि आपातकालीन सिमुलेशन',
          sat: 'ᱠᱟᱹᱨᱠᱷᱟᱱᱟ ᱥᱮᱸᱜᱮᱞ ᱮᱢᱟᱨᱡᱮᱱᱥᱤ ᱥᱤᱢᱩᱞᱮᱥᱚᱱ'
        },
        drillObjective: {
          en: 'Operate simulated ABC Dry Chemical cylinder using standardized P.A.S.S. actions: Pull pin, Aim nozzle low at base, Squeeze trigger, and Sweep.',
          hi: 'मानक P.A.S.S. चरणों का पालन करते हुए ABC ड्राई केमिकल सिलेंडर संचालित करें।',
          sat: 'P.A.S.S. ᱛᱚᱦᱚᱨ ᱛᱮ ABC ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱢᱤᱥᱤᱱ ᱪᱟᱞᱟᱣ ᱢᱮ᱾'
        },
        virtualEquipment: {
          en: 'Virtual ABC Dry Chemical 6kg Extinguisher',
          hi: 'वर्चुअल ABC ड्राई केमिकल 6kg एक्सटिंग्विशर',
          sat: 'ABC ᱯᱟᱣᱰᱟᱨ ᱖ ᱠᱮᱡᱤ ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱢᱤᱥᱤᱱ'
        },
        interactionType: {
          en: 'P.A.S.S. Step Sequence & Discharge Arc Sweeping',
          hi: 'PASS चरण अनुक्रम और छिड़काव स्वीप',
          sat: 'PASS ᱛᱚᱦᱚᱨ ᱟᱨ ᱯᱟᱣᱰᱟᱨ ᱪᱷᱤᱴᱠᱟᱹᱣ'
        },
        color: '#10B981'
      },
      {
        chapterId: 5,
        moduleId: '1',
        title: {
          en: 'Emergency Evacuation & AR Navigation',
          hi: 'आपातकालीन निकासी एवं AR नेविगेशन',
          sat: 'ᱮᱢᱟᱨᱡᱮᱱᱥᱤ ᱩᱰᱩᱠ ᱟᱨ AR ᱫᱤᱥᱟᱹ ᱩᱫᱩᱜ'
        },
        chapterTitle: {
          en: 'Emergency Evacuation & AR Navigation',
          hi: 'आपातकालीन निकासी एवं AR नेविगेशन',
          sat: 'ᱮᱢᱟᱨᱡᱮᱱᱥᱤ ᱩᱰᱩᱠ ᱟᱨ AR ᱫᱤᱥᱟᱹ ᱩᱫᱩᱜ'
        },
        drillObjective: {
          en: 'Navigate through low-visibility smoke corridors following floor wayfinding emergency glow arrows toward designated plant assembly muster points.',
          hi: 'कम दृश्यता वाले धुएं में चमकते तीरों का पालन करते हुए सुरक्षित असेंबली पॉइंट तक पहुंचें।',
          sat: 'ᱫᱷᱩᱶᱟᱹ ᱛᱟᱞᱟ ᱛᱮ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱡᱟᱣᱨᱟᱜ ᱡᱟᱭᱜᱟ ᱨᱮ AR ᱰᱟᱦᱟᱨ ᱛᱮ ᱥᱮᱱᱚᱜ ᱢᱮ᱾'
        },
        virtualEquipment: {
          en: 'Augmented Spatial Waypoints & Low-Level Exit Signs',
          hi: 'स्थानिक वेपॉइंट्स और निम्न-स्तरीय निकास संकेत',
          sat: 'AR ᱰᱟᱦᱟᱨ ᱪᱤᱱᱦᱟᱹ ᱟᱨ ᱩᱰᱩᱠ ᱵᱳᱨᱰ'
        },
        interactionType: {
          en: 'Path Following & Doorway Thermal Boundary Check',
          hi: 'मार्ग अनुगमन और थर्मल सीमा जांच',
          sat: 'ᱰᱟᱦᱟᱨ ᱯᱟᱸᱡᱟ ᱟᱨ ᱫᱩᱣᱟᱹᱨ ᱞᱚᱞᱚ ᱡᱟᱸᱪ'
        },
        color: '#6366F1'
      }
    ],
    assessments: []
  },
  '2': {
    moduleId: '2',
    isComingSoon: false,
    title: {
      en: 'Gas Leak & Confined Space Protocol',
      hi: 'गैस रिसाव एवं सीमित स्थान प्रोटोकॉल',
      sat: 'ᱜᱮᱥ ᱞᱤᱠ ᱟᱨ ᱥᱟᱸᱠᱲᱟ ᱡᱟᱭᱜᱟ ᱨᱩᱠᱷᱤᱭᱟᱹ'
    },
    description: {
      en: 'Hazardous gas detection, Lower Explosive Limit (LEL) monitoring, mandatory buddy systems, and emergency abort procedures.',
      hi: 'खतरनाक गैसों की जांच, विस्फोट सीमा (LEL) निगरानी, बडी सिस्टम और आपातकालीन निकास प्रक्रिया।',
      sat: 'ᱵᱤᱥ ᱜᱮᱥ ᱪᱤᱱᱦᱟᱹᱣ, ᱞᱚᱣᱟᱨ ᱮᱠᱥᱯᱞᱚᱥᱤᱵᱷ ᱞᱤᱢᱤᱴ (LEL), ᱜᱟᱛᱮ ᱵᱮᱵᱚᱥᱛᱷᱟ ᱟᱨ ᱞᱚᱜᱚᱱ ᱩᱰᱩᱠ ᱱᱤᱭᱟᱹᱢ ᱪᱮᱫ᱾'
    },
    chapters: [
      {
        id: 1,
        moduleId: '2',
        title: {
          en: 'Gas Hazard Identification',
          hi: 'गैस खतरे की पहचान',
          sat: 'ᱜᱮᱥ ᱵᱤᱯᱚᱫᱽ ᱪᱤᱱᱦᱟᱹᱣ'
        },
        subtitle: {
          en: 'Toxic, Flammable & Asphyxiant Gases',
          hi: 'विषाक्त, ज्वलनशील और श्वासरोधी गैसें',
          sat: 'ᱵᱤᱥ, ᱡᱩᱞᱩᱜ ᱟᱨ ᱥᱟᱦᱮᱫ ᱟᱴᱠᱟᱣ ᱜᱮᱥ'
        },
        description: {
          en: 'Learn to identify hazardous gases, warning signs, unsafe areas, and conditions that may create serious workplace risks.',
          hi: 'खतरनाक गैसों, चेतावनी संकेतों, असुरक्षित क्षेत्रों और कार्यस्थल के गंभीर जोखिमों की पहचान करना सीखें।',
          sat: 'ᱵᱤᱥ ᱜᱮᱥ, ᱦᱩᱥᱤᱭᱟᱹᱨ ᱪᱤᱱᱦᱟᱹ, ᱵᱤᱯᱚᱫᱽ ᱡᱟᱭᱜᱟ ᱟᱨ ᱠᱟᱹᱢᱤ ᱨᱮᱭᱟᱜ ᱵᱤᱯᱚᱫᱽ ᱪᱤᱱᱦᱟᱹᱣ ᱪᱮᱫ ᱢᱮ᱾'
        },
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
        color: '#0284C7'
      },
      {
        id: 2,
        moduleId: '2',
        title: {
          en: 'Gas Detection & PPE',
          hi: 'गैस पहचान एवं व्यक्तिगत सुरक्षा उपकरण (PPE)',
          sat: 'ᱜᱮᱥ ᱰᱤᱴᱮᱠᱥᱚᱱ ᱟᱨ PPE ᱥᱟᱢᱟᱱ'
        },
        subtitle: {
          en: 'Multi-Gas Monitors & SCBA Equipment',
          hi: 'मल्टी-गैस मॉनिटर और SCBA श्वसन उपकरण',
          sat: 'ᱢᱟᱞᱴᱤ-ᱜᱮᱥ ᱢᱚᱱᱤᱴᱚᱨ ᱟᱨ SCBA ᱢᱟᱥᱠ'
        },
        description: {
          en: 'Learn how gas detection equipment and appropriate personal protective equipment help workers identify and control hazardous conditions.',
          hi: 'जानें कि गैस डिटेक्शन उपकरण और उपयुक्त सुरक्षा उपकरण (PPE) श्रमिकों को खतरनाक परिस्थितियों की पहचान और नियंत्रण में कैसे मदद करते हैं।',
          sat: 'ᱜᱮᱥ ᱪᱤᱱᱦᱟᱹᱣ ᱥᱟᱢᱟᱱ ᱟᱨ ᱥᱟᱹᱦᱤᱡ PPE ᱦᱚᱨᱚᱜ ᱠᱟᱛᱮ ᱵᱤᱯᱚᱫᱽ ᱠᱷᱚᱱ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱛᱟᱦᱮᱸᱱ ᱪᱮᱫ ᱢᱮ᱾'
        },
        image: 'https://images.unsplash.com/photo-1578885136359-16c8bd4d3a8e?w=600&auto=format&fit=crop&q=80',
        color: '#0D9488'
      },
      {
        id: 3,
        moduleId: '2',
        title: {
          en: 'Gas Leak Response',
          hi: 'गैस रिसाव प्रतिक्रिया',
          sat: 'ᱜᱮᱥ ᱞᱤᱠ ᱠᱟᱹᱢᱤᱦᱚᱨᱟ'
        },
        subtitle: {
          en: 'Alarm, Isolation & Withdrawal',
          hi: 'अलार्म, वाल्व अलगाव और सुरक्षित वापसी',
          sat: 'ᱟᱞᱟᱨᱢ, ᱵᱷᱟᱞᱵᱽ ᱵᱚᱸᱫᱽ ᱟᱨ ᱩᱰᱩᱠ'
        },
        description: {
          en: 'Practice the correct response to a gas leak, including warning others, communication, isolation awareness, and safe withdrawal.',
          hi: 'गैस रिसाव पर सही प्रतिक्रिया का अभ्यास करें, जिसमें दूसरों को चेतावनी देना, संचार, अलगाव जागरूकता और सुरक्षित निकास शामिल है।',
          sat: 'ᱜᱮᱥ ᱞᱤᱠ ᱚᱠᱛᱚ ᱮᱴᱟᱜ ᱦᱚᱲ ᱪᱮᱛᱟᱣᱱᱤ ᱮᱢ, ᱵᱷᱟᱞᱵᱽ ᱵᱚᱸᱫᱽ ᱟᱨ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱩᱰᱩᱠ ᱨᱮᱭᱟᱜ ᱦᱩᱱᱟᱹᱨ ᱪᱮᱫ ᱢᱮ᱾'
        },
        image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=600&auto=format&fit=crop&q=80',
        color: '#EAB308'
      },
      {
        id: 4,
        moduleId: '2',
        title: {
          en: 'Confined Space Safety',
          hi: 'सीमित स्थान सुरक्षा',
          sat: 'ᱥᱟᱸᱠᱲᱟ ᱡᱟᱭᱜᱟ ᱨᱩᱠᱷᱤᱭᱟᱹ'
        },
        subtitle: {
          en: 'Permits, Testing & Standby Buddy System',
          hi: 'परमिट, वायुमंडलीय परीक्षण और बडी सिस्टम',
          sat: 'ᱯᱟᱨᱢᱤᱴ, ᱦᱚᱭ ᱡᱟᱸᱪ ᱟᱨ ᱜᱟᱛᱮ ᱥᱤᱥᱴᱚᱢ'
        },
        description: {
          en: 'Learn essential confined-space precautions, atmospheric testing, entry controls, communication, and buddy-system awareness.',
          hi: 'सीमित स्थान की आवश्यक सावधानियां, वायुमंडलीय परीक्षण, प्रवेश नियंत्रण, संचार और बडी-सिस्टम जागरूकता सीखें।',
          sat: 'ᱥᱟᱸᱠᱲᱟ ᱡᱟᱭᱜᱟ ᱨᱮ ᱵᱚᱞᱚᱱ ᱱᱤᱭᱟᱹᱢ, ᱦᱚᱭ ᱡᱟᱸᱪ, ᱫᱩᱣᱟᱹᱨ ᱠᱚᱱᱴᱨᱚᱞ ᱟᱨ ᱜᱟᱛᱮ ᱥᱤᱥᱴᱚᱢ ᱵᱟᱰᱟᱭ ᱢᱮ᱾'
        },
        image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80',
        color: '#F97316'
      },
      {
        id: 5,
        moduleId: '2',
        title: {
          en: 'Emergency Evacuation & Rescue Awareness',
          hi: 'आपातकालीन निकासी एवं बचाव जागरूकता',
          sat: 'ᱮᱢᱟᱨᱡᱮᱱᱥᱤ ᱩᱰᱩᱠ ᱟᱨ ᱵᱟᱧᱪᱟᱣ ᱦᱩᱥᱤᱭᱟᱹᱨ'
        },
        subtitle: {
          en: 'Cross-Wind Escape & Mechanical Winch Rescue',
          hi: 'हवा की विपरीत दिशा में निकास एवं विंच बचाव',
          sat: 'ᱦᱚᱭ ᱩᱞᱴᱟᱹ ᱫᱟᱹᱲ ᱟᱨ ᱴᱨᱟᱭᱯᱚᱰ ᱵᱟᱧᱪᱟᱣ'
        },
        description: {
          en: 'Learn how to respond safely to gas-related emergencies, evacuate hazardous areas, and understand basic rescue awareness.',
          hi: 'गैस से संबंधित आपात स्थितियों में सुरक्षित प्रतिक्रिया देना, खतरनाक क्षेत्रों से बाहर निकलना और बुनियादी बचाव जागरूकता सीखें।',
          sat: 'ᱜᱮᱥ ᱮᱢᱟᱨᱡᱮᱱᱥᱤ ᱨᱮ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱩᱰᱩᱠ, ᱵᱤᱯᱚᱫᱽ ᱡᱟᱭᱜᱟ ᱵᱟᱹᱜᱤ ᱟᱨ ᱦᱚᱲ ᱵᱟᱧᱪᱟᱣ ᱦᱩᱱᱟᱹᱨ ᱪᱮᱫ ᱢᱮ᱾'
        },
        image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop&q=80',
        color: '#8B5CF6'
      }
    ],
    videos: [
      {
        id: 'vid-g1',
        moduleId: '2',
        chapterId: 1,
        title: {
          en: '1. Gas Hazard Chemistry & Explosive Limits (LEL/UEL)',
          hi: '1. गैस खतरा रसायन एवं विस्फोट सीमाएं (LEL/UEL)',
          sat: '᱑. ᱵᱤᱥ ᱜᱮᱥ ᱨᱟᱥᱟᱭᱚᱱ ᱟᱨ ᱵᱤᱥᱯᱷᱚᱴ ᱥᱤᱢᱟᱹ (LEL/UEL)'
        },
        description: {
          en: 'Understanding Lower Explosive Limit (LEL), Upper Explosive Limit (UEL), and vapor density in mine tunnels.',
          hi: 'खदान सुरंगों में निचली विस्फोट सीमा (LEL), ऊपरी विस्फोट सीमा (UEL) और वाष्प घनत्व को समझें।',
          sat: 'ᱠᱷᱟᱫᱟᱱ ᱵᱷᱤᱛᱨᱤ ᱨᱮ LEL ᱟᱨ UEL ᱵᱤᱥᱯᱷᱚᱴ ᱥᱤᱢᱟᱹ ᱟᱨ ᱜᱮᱥ ᱨᱮᱭᱟᱜ ᱦᱟᱢᱟᱞ ᱵᱩᱡᱷᱟᱹᱣ ᱢᱮ᱾'
        },
        duration: '06:30',
        thumbnail: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400',
        videoUrl: YOUTUBE_EMBED_URL
      },
      {
        id: 'vid-g2',
        moduleId: '2',
        chapterId: 1,
        title: {
          en: '2. Toxic Gases in Industrial Mines (H2S, CO, CH4 & O2)',
          hi: '2. औद्योगिक खदानों में विषाक्त गैसें (H2S, CO, CH4 और ऑक्सीजन)',
          sat: '᱒. ᱠᱷᱟᱫᱟᱱ ᱨᱮ ᱵᱤᱥ ᱜᱮᱥ (H2S, CO, CH4 ᱟᱨ ᱚᱠᱥᱤᱡᱮᱱ)'
        },
        description: {
          en: 'Identifying deadly Hydrogen Sulfide olfactory fatigue, odorless Carbon Monoxide, Methane pockets, and Oxygen deficiency.',
          hi: 'हाइड्रोजन सल्फाइड (सड़े अंडे जैसी महक), कार्बन मोनोऑक्साइड, मीथेन और ऑक्सीजन की कमी की पहचान।',
          sat: 'H2S ᱜᱮᱥ ᱥᱚ, CO ᱜᱮᱥ, ᱢᱤᱛᱷᱮᱱ ᱟᱨ ᱚᱠᱥᱤᱡᱮᱱ ᱠᱚᱢ ᱨᱮᱭᱟᱜ ᱵᱤᱯᱚᱫᱽ ᱪᱤᱱᱦᱟᱹᱣ ᱢᱮ᱾'
        },
        duration: '05:45',
        thumbnail: 'https://images.unsplash.com/photo-1578885136359-16c8bd4d3a8e?w=400',
        videoUrl: YOUTUBE_EMBED_URL
      },
      {
        id: 'vid-g3',
        moduleId: '2',
        chapterId: 2,
        title: {
          en: '3. Multi-Gas Detector Operation & Bump Testing',
          hi: '3. मल्टी-गैस डिटेक्टर संचालन एवं बम्प टेस्ट',
          sat: '᱓. ᱢᱟᱞᱴᱤ-ᱜᱮᱥ ᱰᱤᱴᱮᱠᱴᱚᱨ ᱪᱟᱞᱟᱣ ᱟᱨ ᱵᱟᱢᱯ ᱴᱮᱥᱴ'
        },
        description: {
          en: 'Pre-shift digital 4-gas monitor calibration, bump test verification, and fresh-air zeroing protocols.',
          hi: 'कार्य से पूर्व 4-गैस डिटेक्टर अंशांकन, बम्प टेस्ट सत्यापन और शुद्ध हवा में जीरो सेट करने के नियम।',
          sat: 'ᱠᱟᱹᱢᱤ ᱢᱟᱲᱟᱝ ᱔-ᱜᱮᱥ ᱰᱤᱴᱮᱠᱴᱚᱨ ᱡᱟᱸᱪ, ᱵᱟᱢᱯ ᱴᱮᱥᱴ ᱟᱨ ᱥᱟᱯᱷᱟ ᱦᱚᱭ ᱨᱮ ᱡᱤᱨᱳ ᱥᱮᱴᱤᱝ᱾'
        },
        duration: '07:10',
        thumbnail: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400',
        videoUrl: YOUTUBE_EMBED_URL
      },
      {
        id: 'vid-g4',
        moduleId: '2',
        chapterId: 2,
        title: {
          en: '4. Respiratory Protection: SCBA & Escape Breathing Sets',
          hi: '4. श्वसन सुरक्षा: SCBA एवं आपातकालीन एस्केप सेट (EEBA)',
          sat: '᱔. ᱥᱟᱦᱮᱫ ᱨᱩᱠᱷᱤᱭᱟᱹ: SCBA ᱟᱨ ᱮᱥᱠᱮᱯ ᱢᱟᱥᱠ (EEBA)'
        },
        description: {
          en: 'Self-Contained Breathing Apparatus donning procedure, positive pressure face seals, and 15-minute escape cylinders.',
          hi: 'SCBA पहनना, चेहरे की सील जांचना और 15-मिनट वाले आपातकालीन एस्केप सिलेंडरों का सुरक्षित उपयोग।',
          sat: 'SCBA ᱥᱟᱦᱮᱫ ᱥᱟᱢᱟᱱ ᱦᱚᱨᱚᱜ ᱛᱚᱦᱚᱨ ᱟᱨ ᱑᱕ ᱴᱤᱯᱤᱲ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱥᱤᱞᱤᱱᱰᱟᱨ ᱵᱮᱵᱷᱟᱨ᱾'
        },
        duration: '06:05',
        thumbnail: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=400',
        videoUrl: YOUTUBE_EMBED_URL
      },
      {
        id: 'vid-g5',
        moduleId: '2',
        chapterId: 3,
        title: {
          en: '5. Gas Leak Response & Communication Protocols',
          hi: '5. गैस रिसाव प्रतिक्रिया एवं संचार प्रोटोकॉल',
          sat: '᱕. ᱜᱮᱥ ᱞᱤᱠ ᱠᱟᱹᱢᱤ ᱟᱨ ᱠᱷᱚᱵᱚᱨ ᱮᱢ ᱱᱤᱭᱟᱹᱢ'
        },
        description: {
          en: 'Immediate siren actuation, emergency radio broadcasts, hazard boundary cordoning, and control room notification.',
          hi: 'सायरन बजाना, दोतरफा रेडियो संचार, खतरनाक क्षेत्र की घेराबंदी और मुख्य नियंत्रण कक्ष को तत्काल सूचना।',
          sat: 'ᱥᱟᱭᱨᱮᱱ ᱚᱨ, ᱨᱮᱰᱤᱭᱳ ᱛᱮ ᱠᱷᱚᱵᱚᱨ ᱮᱢ, ᱵᱤᱯᱚᱫᱽ ᱡᱟᱭᱜᱟ ᱜᱷᱮᱨᱟᱣ ᱟᱨ ᱠᱚᱱᱴᱨᱚᱞ ᱨᱩᱢ ᱡᱟᱬᱟᱣ᱾'
        },
        duration: '05:20',
        thumbnail: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=400',
        videoUrl: YOUTUBE_EMBED_URL
      },
      {
        id: 'vid-g6',
        moduleId: '2',
        chapterId: 3,
        title: {
          en: '6. Gas Pipeline Isolation & Emergency Shutoff Valves',
          hi: '6. गैस पाइपलाइन अलगाव एवं आपातकालीन शटऑफ वाल्व',
          sat: '᱖. ᱜᱮᱥ ᱯᱟᱭᱤᱯ ᱵᱷᱟᱞᱵᱽ ᱵᱚᱸᱫᱽ ᱟᱨ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱛᱟᱞᱟ'
        },
        description: {
          en: 'Identifying block valves, executing emergency quarter-turn shutoffs, and applying Lockout/Tagout (LOTO).',
          hi: 'गैस ब्लॉक वाल्व की पहचान, इमरजेंसी शटऑफ और लॉकआउट/टैगआउट (LOTO) पैडलॉक लगाना।',
          sat: 'ᱜᱮᱥ ᱵᱷᱟᱞᱵᱽ ᱪᱤᱱᱦᱟᱹᱣ, ᱞᱚᱜᱚᱱ ᱵᱚᱸᱫᱽ ᱟᱨ LOTO ᱛᱟᱞᱟ ᱞᱟᱜᱟᱣ ᱱᱤᱭᱟᱹᱢ᱾'
        },
        duration: '06:50',
        thumbnail: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=400',
        videoUrl: YOUTUBE_EMBED_URL
      },
      {
        id: 'vid-g7',
        moduleId: '2',
        chapterId: 4,
        title: {
          en: '7. Confined Space Entry Permits & Testing Protocol',
          hi: '7. सीमित स्थान प्रवेश परमिट एवं बहु-स्तरीय परीक्षण',
          sat: '᱗. ᱥᱟᱸᱠᱲᱟ ᱡᱟᱭᱜᱟ ᱯᱟᱨᱢᱤᱴ ᱟᱨ ᱦᱚᱭ ᱡᱟᱸᱪ'
        },
        description: {
          en: 'Permit-to-work requirements, forced air ventilation blowers, top-middle-bottom stratified gas testing, and buddy attendance.',
          hi: 'परमिट टू वर्क, वेंटिलेशन ब्लोअर का उपयोग, शीर्ष-मध्य-निचले स्तर पर गैस परीक्षण और बडी सिस्टम।',
          sat: 'ᱯᱟᱨᱢᱤᱴ ᱦᱟᱛᱟᱣ, ᱦᱚᱭ ᱯᱟᱠᱷᱟ ᱪᱟᱞᱟᱣ, ᱪᱮᱛᱟᱱ-ᱛᱟᱞᱟ-ᱞᱟᱛᱟᱨ ᱦᱚᱭ ᱡᱟᱸᱪ ᱟᱨ ᱵᱟᱦᱨᱮ ᱜᱟᱛᱮ ᱛᱟᱦᱮᱸᱱ᱾'
        },
        duration: '07:35',
        thumbnail: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400',
        videoUrl: YOUTUBE_EMBED_URL
      },
      {
        id: 'vid-g8',
        moduleId: '2',
        chapterId: 5,
        title: {
          en: '8. Cross-Wind Evacuation & Mechanical Winch Rescue',
          hi: '8. हवा की विपरीत दिशा में निकास एवं मैकेनिकल विंच बचाव',
          sat: '᱘. ᱦᱚᱭ ᱩᱞᱴᱟᱹ ᱩᱰᱩᱠ ᱟᱨ ᱴᱨᱟᱭᱯᱚᱰ ᱛᱮ ᱦᱚᱲ ᱚᱨ ᱩᱰᱩᱠ'
        },
        description: {
          en: 'Reading industrial windsocks, moving cross-wind to high ground, and tripod mechanical retrieval without entering toxic spaces.',
          hi: 'विंडसॉक देखकर हवा की विपरीत दिशा में निकलना, और बिना अंदर कूदे ट्राइपॉड विंच द्वारा साथी को बाहर खींचना।',
          sat: 'ᱦᱚᱭ ᱫᱤᱥᱟᱹ ᱧᱮᱞ ᱠᱟᱛᱮ ᱩᱞᱴᱟᱹ ᱥᱮᱱᱚᱜ ᱟᱨ ᱵᱤᱱ ᱵᱚᱞᱚ ᱠᱟᱛᱮ ᱴᱨᱟᱭᱯᱚᱰ ᱛᱮ ᱜᱟᱛᱮ ᱵᱟᱦᱨᱮ ᱚᱨ ᱩᱰᱩᱠ᱾'
        },
        duration: '07:15',
        thumbnail: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400',
        videoUrl: YOUTUBE_EMBED_URL
      }
    ],
    arDrills: [
      {
        chapterId: 1,
        moduleId: '2',
        title: {
          en: 'Gas Hazard Identification',
          hi: 'गैस खतरे की पहचान',
          sat: 'ᱜᱮᱥ ᱵᱤᱯᱚᱫᱽ ᱪᱤᱱᱦᱟᱹᱣ'
        },
        chapterTitle: {
          en: 'Gas Hazard Identification',
          hi: 'गैस खतरे की पहचान',
          sat: 'ᱜᱮᱥ ᱵᱤᱯᱚᱫᱽ ᱪᱤᱱᱦᱟᱹᱣ'
        },
        drillObjective: {
          en: 'Scan low-lying drainage pits and overhead pipes to detect invisible toxic and flammable vapor plumes.',
          hi: 'अदृश्य जहरीली और ज्वलनशील गैस बादलों का पता लगाने के लिए गड्ढों और ऊपरी पाइपों को स्कैन करें।',
          sat: 'ᱵᱤᱱ ᱧᱮᱞᱚᱜ ᱵᱤᱥ ᱜᱮᱥ ᱪᱤᱱᱦᱟᱹᱣ ᱞᱟᱹᱜᱤᱫ ᱠᱷᱟᱫᱟᱱ ᱞᱟᱛᱟᱨ ᱟᱨ ᱪᱮᱛᱟᱱ ᱯᱟᱭᱤᱯ ᱥᱠᱮᱱ ᱢᱮ᱾'
        },
        virtualEquipment: {
          en: 'Augmented Optical Gas Imager (OGI) & Sniffer Wand',
          hi: 'ऑप्टिकल गैस इमेजर और गैस स्निफर वैंड',
          sat: 'ᱚᱯᱴᱤᱠᱟᱞ ᱜᱮᱥ ᱥᱠᱮᱱᱟᱨ ᱟᱨ ᱥᱱᱤᱯᱷᱟᱨ ᱰᱟᱝ'
        },
        interactionType: {
          en: 'Spatial Gas Cloud Density Mapping & Warning Pinning',
          hi: 'गैस बादल घनत्व मानचित्रण और चेतावनी मार्किंग',
          sat: 'ᱜᱮᱥ ᱫᱷᱩᱶᱟᱹ ᱢᱮᱯᱤᱝ ᱟᱨ ᱦᱩᱥᱤᱭᱟᱹᱨ ᱪᱤᱱᱦᱟᱹ ᱞᱟᱜᱟᱣ'
        },
        color: '#0284C7'
      },
      {
        chapterId: 2,
        moduleId: '2',
        title: {
          en: 'Gas Detection & PPE',
          hi: 'गैस पहचान एवं व्यक्तिगत सुरक्षा उपकरण (PPE)',
          sat: 'ᱜᱮᱥ ᱰᱤᱴᱮᱠᱥᱚᱱ ᱟᱨ PPE ᱥᱟᱢᱟᱱ'
        },
        chapterTitle: {
          en: 'Gas Detection & PPE',
          hi: 'गैस पहचान एवं व्यक्तिगत सुरक्षा उपकरण (PPE)',
          sat: 'ᱜᱮᱥ ᱰᱤᱴᱮᱠᱥᱚᱱ ᱟᱨ PPE ᱥᱟᱢᱟᱱ'
        },
        drillObjective: {
          en: 'Perform bump test on 4-gas monitor, verify zero reading in fresh air, and don positive-pressure SCBA mask.',
          hi: '4-गैस डिटेक्टर पर बम्प टेस्ट करें और SCBA फेस मास्क को सही ढंग से पहनकर सील की जांच करें।',
          sat: '᱔-ᱜᱮᱥ ᱰᱤᱴᱮᱠᱴᱚᱨ ᱴᱮᱥᱴ ᱢᱮ ᱟᱨ SCBA ᱢᱟᱥᱠ ᱥᱟᱹᱦᱤᱡ ᱦᱚᱨᱚᱜ ᱠᱟᱛᱮ ᱦᱚᱭ ᱡᱟᱸᱪ ᱢᱮ᱾'
        },
        virtualEquipment: {
          en: 'Virtual 4-Gas Monitor (O2, LEL, CO, H2S) & SCBA Pack',
          hi: 'वर्चुअल 4-गैस मॉनिटर और SCBA रेस्पिरेटर किट',
          sat: '᱔-ᱜᱮᱥ ᱢᱚᱱᱤᱴᱚᱨ ᱟᱨ SCBA ᱥᱟᱦᱮᱫ ᱥᱤᱞᱤᱱᱰᱟᱨ'
        },
        interactionType: {
          en: 'Sensor Probe Positioning & Mask Face-Seal Check',
          hi: 'सेंसर प्रोब पोजिशनिंग और मास्क सील जांच',
          sat: 'ᱥᱮᱱᱥᱚᱨ ᱥᱟᱢᱟᱝ ᱟᱨ ᱢᱟᱥᱠ ᱥᱤᱞ ᱡᱟᱸᱪ'
        },
        color: '#0D9488'
      },
      {
        chapterId: 3,
        moduleId: '2',
        title: {
          en: 'Gas Leak Response',
          hi: 'गैस रिसाव प्रतिक्रिया',
          sat: 'ᱜᱮᱥ ᱞᱤᱠ ᱠᱟᱹᱢᱤᱦᱚᱨᱟ'
        },
        chapterTitle: {
          en: 'Gas Leak Response',
          hi: 'गैस रिसाव प्रतिक्रिया',
          sat: 'ᱜᱮᱥ ᱞᱤᱠ ᱠᱟᱹᱢᱤᱦᱚᱨᱟ'
        },
        drillObjective: {
          en: 'Identify the active leaking flange, isolate upstream manual ball valve, and affix LOTO safety tags.',
          hi: 'लीक हो रही पाइपलाइन के मुख्य वाल्व को बंद करें और LOTO सुरक्षा टैग लगाएं।',
          sat: 'ᱞᱤᱠᱚᱜ ᱠᱟᱱ ᱯᱟᱭᱤᱯ ᱨᱮᱭᱟᱜ ᱵᱷᱟᱞᱵᱽ ᱵᱚᱸᱫᱽ ᱢᱮ ᱟᱨ LOTO ᱪᱟᱹᱵᱷᱤ ᱞᱟᱜᱟᱣ ᱢᱮ᱾'
        },
        virtualEquipment: {
          en: 'Flange Seal Spreader & Emergency Isolation Valve',
          hi: 'इमरजेंसी आइसोलेशन वाल्व और LOTO टैगआउट लॉक',
          sat: 'ᱮᱢᱟᱨᱡᱮᱱᱥᱤ ᱵᱷᱟᱞᱵᱽ ᱟᱨ LOTO ᱛᱟᱞᱟ'
        },
        interactionType: {
          en: 'Quarter-Turn Valve Rotation & Lockout Placement',
          hi: 'वाल्व घुमाव और सुरक्षा लॉक लगाना',
          sat: 'ᱵᱷᱟᱞᱵᱽ ᱟᱹᱪᱩᱨ ᱵᱚᱸᱫᱽ ᱟᱨ ᱛᱟᱞᱟ ᱞᱟᱜᱟᱣ'
        },
        color: '#EAB308'
      },
      {
        chapterId: 4,
        moduleId: '2',
        title: {
          en: 'Confined Space Safety',
          hi: 'सीमित स्थान सुरक्षा',
          sat: 'ᱥᱟᱸᱠᱲᱟ ᱡᱟᱭᱜᱟ ᱨᱩᱠᱷᱤᱭᱟᱹ'
        },
        chapterTitle: {
          en: 'Confined Space Safety',
          hi: 'सीमित स्थान सुरक्षा',
          sat: 'ᱥᱟᱸᱠᱲᱟ ᱡᱟᱭᱜᱟ ᱨᱩᱠᱷᱤᱭᱟᱹ'
        },
        drillObjective: {
          en: 'Rig aluminum tripod over manhole, calibrate ventilation ducting, and verify signed entry permit with the standby attendant.',
          hi: 'मैनहोल के ऊपर ट्राइपॉड स्थापित करें, वेंटिलेशन डक्ट लगाएं और अटेंडेंट के साथ परमिट सत्यापित करें।',
          sat: 'ᱠᱷᱟᱫᱟᱱ ᱢᱚᱪᱟ ᱨᱮ ᱴᱨᱟᱭᱯᱚᱰ ᱵᱤᱫ ᱢᱮ, ᱦᱚᱭ ᱯᱟᱭᱤᱯ ᱞᱟᱜᱟᱣ ᱢᱮ ᱟᱨ ᱯᱟᱨᱢᱤᱴ ᱡᱟᱸᱪ ᱢᱮ᱾'
        },
        virtualEquipment: {
          en: 'Confined Space Rescue Tripod, Winch & Ventilation Blower',
          hi: 'रेस्क्यू ट्राइपॉड, विंच और वेंटिलेशन ब्लोअर',
          sat: 'ᱨᱮᱥᱠᱤᱣ ᱴᱨᱟᱭᱯᱚᱰ, ᱣᱤᱧᱪ ᱟᱨ ᱦᱚᱭ ᱵᱽᱞᱳᱣᱟᱨ'
        },
        interactionType: {
          en: 'Tripod Placement & Harness D-Ring Mechanical Latching',
          hi: 'ट्राइपॉड संरेखण और हार्नेस डी-रिंग लॉकिंग',
          sat: 'ᱴᱨᱟᱭᱯᱚᱰ ᱵᱤᱫ ᱟᱨ ᱦᱟᱨᱱᱮᱥ ᱡᱚᱲᱟᱣ'
        },
        color: '#F97316'
      },
      {
        chapterId: 5,
        moduleId: '2',
        title: {
          en: 'Emergency Evacuation & Rescue Awareness',
          hi: 'आपातकालीन निकासी एवं बचाव जागरूकता',
          sat: 'ᱮᱢᱟᱨᱡᱮᱱᱥᱤ ᱩᱰᱩᱠ ᱟᱨ ᱵᱟᱧᱪᱟᱣ ᱦᱩᱥᱤᱭᱟᱹᱨ'
        },
        chapterTitle: {
          en: 'Emergency Evacuation & Rescue Awareness',
          hi: 'आपातकालीन निकासी एवं बचाव जागरूकता',
          sat: 'ᱮᱢᱟᱨᱡᱮᱱᱥᱤ ᱩᱰᱩᱠ ᱟᱨ ᱵᱟᱧᱪᱟᱣ ᱦᱩᱥᱤᱭᱟᱹᱨ'
        },
        drillObjective: {
          en: 'Check virtual plant windsock, evacuate cross-wind up-slope away from heavy gas dispersion, and muster at safe assembly area.',
          hi: 'विंडसॉक देखकर हवा की विपरीत दिशा में सुरक्षित असेंबली पॉइंट तक नेविगेट करें।',
          sat: 'ᱦᱚᱭ ᱫᱤᱥᱟᱹ ᱧᱮᱞ ᱠᱟᱛᱮ ᱩᱞᱴᱟᱹ ᱫᱟᱹᱲ ᱢᱮ ᱟᱨ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱡᱟᱣᱨᱟᱜ ᱡᱟᱭᱜᱟ ᱨᱮ ᱥᱮᱴᱮᱨᱚᱜ ᱢᱮ᱾'
        },
        virtualEquipment: {
          en: 'Plant Windsock Beacon & Spatial AR Muster Waypoints',
          hi: 'विंडसॉक बीकन और स्थानिक AR निकास वेपॉइंट्स',
          sat: 'ᱣᱤᱱᱰᱥᱚᱠ ᱵᱤᱠᱚᱱ ᱟᱨ AR ᱩᱰᱩᱠ ᱰᱟᱦᱟᱨ'
        },
        interactionType: {
          en: 'Cross-Wind Vector Tracking & Muster Check-In',
          hi: 'विंड वेक्टर ट्रैकिंग और असेंबली चेक-इन',
          sat: 'ᱦᱚᱭ ᱩᱞᱴᱟᱹ ᱫᱟᱹᱲ ᱟᱨ ᱦᱟᱡᱤᱨᱤ ᱮᱢ'
        },
        color: '#8B5CF6'
      }
    ],
    assessments: []
  },
  '3': {
    moduleId: '3',
    isComingSoon: true,
    title: {
      en: 'Machinery Safety & Lockout/Tagout (LOTO)',
      hi: 'मशीनरी सुरक्षा एवं लॉकआउट/टैगआउट (LOTO)',
      sat: 'ᱢᱤᱥᱤᱱ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱟᱨ ᱞᱚᱠ-ᱟᱣᱩᱴ ᱯᱨᱚᱬᱟᱞᱤ'
    },
    description: {
      en: 'Zero energy isolation, mechanical pinch-point hazard awareness, safe operating clearance, and emergency stop deployment.',
      hi: 'शून्य ऊर्जा स्थिति, खतरनाक घूमने वाले पुर्जों से दूरी, लॉकआउट/टैगआउट और इमरजेंसी स्टॉप का उपयोग।',
      sat: 'ᱢᱤᱥᱤᱱ ᱵᱚᱸᱫᱽ ᱠᱟᱛᱮ ᱪᱟᱹᱵᱷᱤ ᱞᱟᱜᱟᱣ, ᱯᱤᱧᱪ ᱯᱚᱭᱮᱱᱴ ᱠᱷᱚᱱ ᱥᱟᱦᱟ, ᱟᱨ ᱮᱢᱟᱨᱡᱮᱱᱥᱤ ᱥᱴᱚᱯ ᱵᱮᱵᱷᱟᱨ᱾'
    },
    chapters: [],
    videos: [],
    arDrills: [],
    assessments: [],
    comingSoonDetails: {
      badge: {
        en: 'UPCOMING MODULE',
        hi: 'आगामी मॉड्यूल',
        sat: 'ᱦᱤᱡᱩᱜ ᱠᱟᱱ ᱢᱚᱰᱩᱞ'
      },
      heading: {
        en: 'Heavy Machinery & LOTO Curriculum In Development',
        hi: 'भारी मशीनरी एवं LOTO पाठ्यक्रम निर्माणाधीन है',
        sat: 'ᱦᱟᱢᱟᱞ ᱢᱤᱥᱤᱱ ᱟᱨ LOTO ᱯᱟᱲᱦᱟᱣ ᱵᱮᱱᱟᱣᱜ ᱠᱟᱱᱟ'
      },
      subheading: {
        en: 'This specialized vocational training module is being designed by certified mechanical safety experts and DGMS inspectors.',
        hi: 'यह विशेष व्यावसायिक प्रशिक्षण मॉड्यूल प्रमाणित यांत्रिक सुरक्षा विशेषज्ञों और डीजीएमएस निरीक्षकों द्वारा तैयार किया जा रहा है।',
        sat: 'ᱱᱚᱣᱟ ᱴᱨᱮᱱᱤᱝ ᱫᱚ ᱢᱤᱥᱤᱱ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱜᱟᱹᱠᱷᱩᱲᱤᱭᱟᱹ ᱟᱨ DGMS ᱤᱱᱥᱯᱮᱠᱴᱚᱨ ᱠᱚ ᱦᱚᱛᱮᱛᱮ ᱵᱮᱱᱟᱣᱜ ᱠᱟᱱᱟ᱾'
      },
      syllabusHighlights: [
        {
          en: 'Hazardous mechanical motion (nip points, shear pins & flywheels)',
          hi: 'खतरनाक यांत्रिक गति (निप पॉइंट, शियर पिन और फ्लाईव्हील)',
          sat: 'ᱢᱤᱥᱤᱱ ᱨᱮᱭᱟᱜ ᱵᱤᱯᱚᱫᱽ ᱟᱹᱪᱩᱨᱚᱜ ᱡᱟᱭᱜᱟ ᱠᱷᱚᱱ ᱥᱟᱦᱟ'
        },
        {
          en: 'Standardized OSHA 1910.147 Zero Energy State verification',
          hi: 'मानक OSHA 1910.147 शून्य ऊर्जा स्थिति सत्यापन',
          sat: 'OSHA ᱱᱤᱭᱟᱹᱢ ᱛᱮ ᱢᱤᱥᱤᱱ ᱨᱮ ᱠᱟᱨᱮᱱᱴ ᱵᱚᱸᱫᱽ ᱡᱟᱸᱪ'
        },
        {
          en: 'Color-coded padlock isolation, group lockout hasps & safety tags',
          hi: 'रंग-कोडित सुरक्षा पैडलॉक, ग्रुप लॉकआउट और टैगआउट प्रक्रिया',
          sat: 'ᱨᱚᱝ ᱪᱤᱱᱦᱟᱹ ᱛᱟᱞᱟ ᱟᱨ LOTO ᱴᱮᱜᱽ ᱞᱟᱜᱟᱣ ᱱᱤᱭᱟᱹᱢ'
        },
        {
          en: 'Emergency pull cords, light curtains & rapid dead-man switches',
          hi: 'आपातकालीन पुल कॉर्ड, लाइट कर्टन और डेड-मैन स्विच संचालन',
          sat: 'ᱮᱢᱟᱨᱡᱮᱱᱥᱤ ᱨᱟᱹᱥᱤ ᱚᱨ ᱟᱨ ᱞᱚᱜᱚᱱ ᱢᱤᱥᱤᱱ ᱵᱚᱸᱫᱽ ᱥᱩᱭᱤᱪ'
        }
      ]
    }
  },
  '4': {
    moduleId: '4',
    isComingSoon: true,
    title: {
      en: 'Personal Protective Equipment (PPE)',
      hi: 'व्यक्तिगत सुरक्षा उपकरण (PPE)',
      sat: 'ᱱᱤᱡᱮᱨᱟᱜ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱥᱟᱢᱟᱱ (PPE)'
    },
    description: {
      en: 'Standards and proper fitting for hard hats, steel-toe footwear, respirators, chemical gloves, and high-decibel hearing defense.',
      hi: 'हेलमेट, सुरक्षा जूते, श्वास मास्क, दस्ताने और श्रवण सुरक्षा के सही चयन एवं रख-रखाव के नियम।',
      sat: 'ᱦᱮᱞᱢᱮᱴ, ᱵᱩᱴ, ᱜᱞᱚᱵᱽᱥ ᱟᱨ ᱢᱟᱥᱠ ᱥᱟᱹᱦᱤᱡ ᱦᱚᱨᱚᱜ ᱛᱚᱦᱚᱨ᱾'
    },
    chapters: [],
    videos: [],
    arDrills: [],
    assessments: [],
    comingSoonDetails: {
      badge: {
        en: 'UPCOMING MODULE',
        hi: 'आगामी मॉड्यूल',
        sat: 'ᱦᱤᱡᱩᱜ ᱠᱟᱱ ᱢᱚᱰᱩᱞ'
      },
      heading: {
        en: 'Industrial PPE & Fall Protection Curriculum In Development',
        hi: 'औद्योगिक PPE एवं ऊंचाई सुरक्षा पाठ्यक्रम निर्माणाधीन है',
        sat: 'ᱠᱟᱹᱨᱜᱟᱲ PPE ᱟᱨ ᱪᱮᱛᱟᱱ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱯᱟᱲᱦᱟᱣ ᱵᱮᱱᱟᱣᱜ ᱠᱟᱱᱟ'
      },
      subheading: {
        en: 'Hands-on training curriculum for full-body harnesses, shock-absorbing lanyards, and industrial PPE standards.',
        hi: 'फुल-बॉडी हार्नेस, शॉक-एब्जॉर्बिंग लैनयार्ड और औद्योगिक पीपीई मानकों के लिए व्यावहारिक प्रशिक्षण तैयार किया जा रहा है।',
        sat: 'ᱯᱩᱨᱟᱹ ᱦᱚᱲᱢᱚ ᱦᱟᱨᱱᱮᱥ, ᱫᱟᱹᱲ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱫᱟᱣᱲᱟ ᱟᱨ PPE ᱱᱤᱭᱟᱹᱢ ᱪᱮᱫᱚᱜ ᱞᱟᱹᱜᱤᱫ ᱵᱮᱱᱟᱣᱜ ᱠᱟᱱᱟ᱾'
      },
      syllabusHighlights: [
        {
          en: 'Type 1 Class E dielectric hard hat inspections and suspension adjustment',
          hi: 'डाइइलेक्ट्रिक हेलमेट की जांच और आंतरिक सस्पेंशन समायोजन',
          sat: 'ᱵᱤᱡᱽᱞᱤ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱦᱮᱞᱢᱮᱴ ᱡᱟᱸᱪ ᱟᱨ ᱥᱟᱹᱦᱤᱡ ᱥᱮᱴᱤᱝ'
        },
        {
          en: 'ANSI Z87.1 high-velocity impact eye shields & chemical splash goggles',
          hi: 'ANSI Z87.1 इम्पैक्ट सुरक्षा चश्मे और रासायनिक चश्मे',
          sat: 'ᱢᱮᱫ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱪᱚᱥᱢᱟ ᱟᱨ ᱠᱮᱢᱤᱠᱟᱞ ᱜᱚᱜᱚᱞᱥ ᱦᱚᱨᱚᱜ'
        },
        {
          en: 'Full-body 5-point harness donning, chest strap height & dorsal D-ring alignment',
          hi: '5-पॉइंट फुल-बॉडी हार्नेस पहनना और पृष्ठीय डी-रिंग संरेखण',
          sat: '᱕-ᱯᱚᱭᱮᱱᱴ ᱦᱟᱨᱱᱮᱥ ᱦᱚᱨᱚᱜ ᱟᱨ ᱰᱤ-ᱨᱤᱝ ᱥᱟᱹᱦᱤᱡ ᱥᱮᱴᱤᱝ'
        },
        {
          en: '100% tie-off dual lanyards, self-retracting lifelines (SRL) & swing fall clearance',
          hi: '100% टाई-ऑफ डुअल लैनयार्ड और सेल्फ-रिट्रैक्टिंग लाइफलाइन',
          sat: 'ᱪᱮᱛᱟᱱ ᱠᱟᱹᱢᱤ ᱨᱮ ᱵᱟᱨᱭᱟ ᱫᱟᱣᱲᱟ ᱛᱚᱞ ᱟᱨ ᱡᱤᱣᱤ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱫᱟᱹᱲᱤ'
        }
      ]
    }
  },
  '5': {
    moduleId: '5',
    isComingSoon: true,
    title: {
      en: 'Emergency Evacuation & First Response',
      hi: 'आपातकालीन निकासी एवं प्राथमिक प्रतिक्रिया',
      sat: 'ᱮᱢᱟᱨᱡᱮᱱᱥᱤ ᱩᱰᱩᱠ ᱟᱨ ᱯᱩᱭᱞᱩ ᱜᱚᱲᱚ'
    },
    description: {
      en: 'Siren code comprehension, secondary route navigation, casualty triage principles, muster roll accountability, and chain-of-command reporting.',
      hi: 'सायरन कोड, द्वितीयक निकास मार्ग, प्राथमिक उपचार सिद्धांत, असेंबली पॉइंट गणना और घटना रिपोर्टिंग।',
      sat: 'ᱥᱟᱭᱨᱮᱱ ᱟᱧᱡᱚᱢ ᱠᱟᱛᱮ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱡᱟᱭᱜᱟ ᱥᱮᱱᱚᱜ, ᱯᱩᱭᱞᱩ ᱨᱟᱱ ᱮᱢ ᱟᱨ ᱦᱟᱡᱤᱨᱤ ᱮᱢ ᱪᱮᱫ᱾'
    },
    chapters: [],
    videos: [],
    arDrills: [],
    assessments: [],
    comingSoonDetails: {
      badge: {
        en: 'UPCOMING MODULE',
        hi: 'आगामी मॉड्यूल',
        sat: 'ᱦᱤᱡᱩᱜ ᱠᱟᱱ ᱢᱚᱰᱩᱞ'
      },
      heading: {
        en: 'Plant Evacuation & First Aid Curriculum In Development',
        hi: 'संयंत्र निकासी एवं प्राथमिक उपचार पाठ्यक्रम निर्माणाधीन है',
        sat: 'ᱠᱟᱹᱨᱜᱟᱲ ᱩᱰᱩᱠ ᱟᱨ ᱯᱩᱭᱞᱩ ᱨᱟᱱ ᱯᱟᱲᱦᱟᱣ ᱵᱮᱱᱟᱣᱜ ᱠᱟᱱᱟ'
      },
      subheading: {
        en: 'Comprehensive crisis command, triage protocol, and emergency medical response under industrial disaster conditions.',
        hi: 'औद्योगिक आपदा स्थितियों के तहत संकट कमान, ट्राइएज प्रोटोकॉल और आपातकालीन चिकित्सा प्रतिक्रिया।',
        sat: 'ᱟᱱᱟᱴ ᱚᱠᱛᱚ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱩᱰᱩᱠ, ᱜᱷᱟᱹᱞ ᱦᱚᱲ ᱨᱟᱱ ᱮᱢ ᱟᱨ ᱦᱟᱥᱯᱟᱛᱟᱞ ᱤᱫᱤ ᱱᱤᱭᱟᱹᱢ ᱵᱮᱱᱟᱣᱜ ᱠᱟᱱᱟ᱾'
      },
      syllabusHighlights: [
        {
          en: 'Industrial siren frequency decoding (alert, shelter-in-place & all-clear)',
          hi: 'औद्योगिक सायरन कोड डिकोडिंग (अलर्ट, सुरक्षित आश्रय और ऑल-क्लियर)',
          sat: 'ᱠᱟᱹᱨᱜᱟᱲ ᱥᱟᱭᱨᱮᱱ ᱟᱧᱡᱚᱢ ᱠᱟᱛᱮ ᱵᱤᱯᱚᱫᱽ ᱨᱮᱭᱟᱜ ᱦᱟᱹᱴᱤᱧ ᱵᱟᱰᱟᱭ'
        },
        {
          en: 'START triage system (Immediate Red, Delayed Yellow, Minor Green, Deceased Black)',
          hi: 'START ट्राइएज प्रणाली (प्राथमिकता के आधार पर घायलों का वर्गीकरण)',
          sat: 'ᱜᱷᱟᱹᱞ ᱦᱚᱲ ᱠᱚ ᱞᱟᱹᱠᱛᱤ ᱞᱮᱠᱟᱛᱮ ᱦᱟᱹᱴᱤᱧ ᱠᱟᱛᱮ ᱨᱟᱱ ᱮᱢ'
        },
        {
          en: 'Severe bleeding control: CAT tourniquet application & wound packing',
          hi: 'अत्यधिक रक्तस्राव नियंत्रण: टूर्निकेट लगाना और घाव की पट्टी',
          sat: 'ᱢᱟᱭᱟᱢ ᱡᱚᱨᱚ ᱵᱚᱸᱫᱽ ᱞᱟᱹᱜᱤᱫ ᱴᱩᱨᱱᱤᱠᱮᱴ ᱟᱨ ᱵᱮᱱᱰᱮᱡ ᱛᱚᱞ'
        },
        {
          en: 'Automated External Defibrillator (AED) & Hands-Only CPR in high-hazard zones',
          hi: 'AED शॉक मशीन और सीपीआर (CPR) जीवनरक्षक तकनीक',
          sat: 'AED ᱢᱤᱥᱤᱱ ᱵᱮᱵᱷᱟᱨ ᱟᱨ ᱠᱚᱲᱟᱢ ᱞᱤᱱ (CPR) ᱛᱮ ᱦᱚᱲ ᱵᱟᱧᱪᱟᱣ'
        }
      ]
    }
  }
};


export const normalizeModuleId = (idOrObject: any): string => {
  if (!idOrObject) return '1';
  if (typeof idOrObject === 'object') {
    if (idOrObject.moduleNumber) return String(idOrObject.moduleNumber);
    if (idOrObject.category === 'FIRE_SAFETY') return '1';
    if (idOrObject.category === 'GAS_SAFETY') return '2';
    if (idOrObject.category === 'MACHINERY') return '3';
    if (idOrObject.category === 'PPE') return '4';
    if (idOrObject.category === 'EMERGENCY') return '5';
    idOrObject = idOrObject.id || idOrObject._id || '1';
  }
  const str = String(idOrObject).trim();
  if (str === '1' || str === '2' || str === '3' || str === '4' || str === '5') {
    return str;
  }
  if (str === '6a9853c6b2fbf166c48ee678' || str.toLowerCase().includes('fire')) return '1';
  if (str === '6a9853c6b2fbf166c48ee699' || str.toLowerCase().includes('gas')) return '2';
  if (str === '6a9853c7b2fbf166c48ee6ac' || str.toLowerCase().includes('machinery') || str.toLowerCase().includes('loto')) return '3';
  if (str === '6a9853c7b2fbf166c48ee6b7' || str.toLowerCase().includes('ppe')) return '4';
  if (str === '6a9853c7b2fbf166c48ee6c2' || str.toLowerCase().includes('evacuation') || str.toLowerCase().includes('emergency')) return '5';
  return str;
};


CURRICULUM_DATA['6a9853c6b2fbf166c48ee678'] = CURRICULUM_DATA['1'];
CURRICULUM_DATA['6a9853c6b2fbf166c48ee699'] = CURRICULUM_DATA['2'];
CURRICULUM_DATA['6a9853c7b2fbf166c48ee6ac'] = CURRICULUM_DATA['3'];
CURRICULUM_DATA['6a9853c7b2fbf166c48ee6b7'] = CURRICULUM_DATA['4'];
CURRICULUM_DATA['6a9853c7b2fbf166c48ee6c2'] = CURRICULUM_DATA['5'];

export const getModuleCurriculum = (moduleId: string): ModuleCurriculum => {
  const normId = normalizeModuleId(moduleId);
  if (CURRICULUM_DATA[normId]) {
    return CURRICULUM_DATA[normId];
  }
  if (CURRICULUM_DATA[moduleId]) {
    return CURRICULUM_DATA[moduleId];
  }
  return {
    moduleId,
    isComingSoon: true,
    title: {
      en: 'Industrial Safety Module',
      hi: 'औद्योगिक सुरक्षा मॉड्यूल',
      sat: 'ᱤᱱᱰᱟᱥᱴᱨᱤ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱢᱚᱰᱩᱞ'
    },
    description: {
      en: 'This specialized vocational safety module is in development.',
      hi: 'यह विशेष व्यावसायिक सुरक्षा मॉड्यूल निर्माणाधीन है।',
      sat: 'ᱱᱚᱣᱟ ᱴᱨᱮᱱᱤᱝ ᱢᱚᱰᱩᱞ ᱫᱚ ᱵᱮᱱᱟᱣᱜ ᱠᱟᱱᱟ᱾'
    },
    chapters: [],
    videos: [],
    arDrills: [],
    assessments: [],
    comingSoonDetails: {
      badge: {
        en: 'UPCOMING MODULE',
        hi: 'आगामी मॉड्यूल',
        sat: 'ᱦᱤᱡᱩᱜ ᱠᱟᱱ ᱢᱚᱰᱩᱞ'
      },
      heading: {
        en: 'Module In Active Development',
        hi: 'मॉड्यूल निर्माणाधीन है',
        sat: 'ᱢᱚᱰᱩᱞ ᱵᱮᱱᱟᱣᱜ ᱠᱟᱱᱟ'
      },
      subheading: {
        en: 'Authoring in progress by certified safety compliance experts.',
        hi: 'सुरक्षा विशेषज्ञों द्वारा निर्माण प्रगति पर है।',
        sat: 'ᱨᱩᱠᱷᱤᱭᱟᱹ ᱜᱟᱹᱠᱷᱩᱲᱤᱭᱟᱹ ᱠᱚ ᱦᱚᱛᱮᱛᱮ ᱵᱮᱱᱟᱣ ᱪᱟᱞᱟᱜ ᱠᱟᱱᱟ᱾'
      },
      syllabusHighlights: []
    }
  };
};
