import { normalizeModuleId } from './curriculumData';
import { LocalizedString } from '@parishak/shared';

export interface QuestionOption {
  id: string;
  text: LocalizedString;
}

export interface QuestionItem {
  id: string;
  prompt: LocalizedString;
  options: QuestionOption[];
  correctAnswer: string;
  explanation: LocalizedString;
}

export interface ChapterAssessmentItem {
  chapterId: number;
  moduleId: string;
  title: LocalizedString;
  subtitle: LocalizedString;
  questionsCount: number;
  passingPercentage: number;
  color: string;
  questions: QuestionItem[];
}

// Module 1: Fire & Explosion Chapter Assessments
export const FIRE_CHAPTER_ASSESSMENTS: ChapterAssessmentItem[] = [
  {
    chapterId: 1,
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
    questionsCount: 2,
    passingPercentage: 50,
    color: '#FF5722',
    questions: [
      {
        id: 'c1_q1',
        prompt: {
          en: 'Which four components comprise the industrial fire tetrahedron?',
          hi: 'औद्योगिक अग्नि चतुष्फलक (Fire Tetrahedron) में कौन से चार घटक शामिल हैं?',
          sat: 'ᱥᱮᱸᱜᱮᱞ ᱨᱮᱭᱟᱜ ᱯᱩᱱ ᱠᱳᱬ (Tetrahedron) ᱨᱮ ᱪᱮᱫ ᱯᱩᱱᱭᱟ ᱡᱤᱱᱤᱥ ᱛᱟᱦᱮᱸᱱᱟ?'
        },
        options: [
          {
            id: 'opt_1',
            text: {
              en: 'Fuel, Oxygen, Heat, and Chemical Chain Reaction',
              hi: 'ईंधन, ऑक्सीजन, ऊष्मा और रासायनिक श्रृंखला प्रतिक्रिया',
              sat: 'ᱤᱸᱫᱷᱚᱱ, ᱚᱠᱥᱤᱡᱮᱱ, ᱞᱚᱞᱚ ᱟᱨ ᱨᱟᱥᱟᱭᱚᱱ ᱡᱚᱲᱟᱣ'
            }
          },
          {
            id: 'opt_2',
            text: {
              en: 'Fuel, Nitrogen, Smoke, and Water',
              hi: 'ईंधन, नाइट्रोजन, धुआं और पानी',
              sat: 'ᱤᱸᱫᱷᱚᱱ, ᱱᱟᱭᱴᱨᱳᱡᱮᱱ, ᱫᱷᱩᱶᱟᱹ ᱟᱨ ᱫᱟᱜ'
            }
          },
          {
            id: 'opt_3',
            text: {
              en: 'Carbon dioxide, Heat, Pressure, and Oil',
              hi: 'कार्बन डाइऑक्साइड, ऊष्मा, दबाव और तेल',
              sat: 'ᱠᱟᱨᱵᱚᱱ ᱰᱟᱭᱚᱠᱥᱟᱭᱤᱰ, ᱞᱚᱞᱚ, ᱪᱟᱯ ᱟᱨ ᱥᱩᱱᱩᱢ'
            }
          }
        ],
        correctAnswer: 'opt_1',
        explanation: {
          en: 'The fire tetrahedron consists of Fuel (reducing agent), Oxygen (oxidizing agent), Heat (ignition temperature), and an Uninhibited Chemical Chain Reaction.',
          hi: 'फायर टेट्राहेड्रोन में ईंधन, ऑक्सीजन, ऊष्मा और निर्बाध रासायनिक श्रृंखला प्रतिक्रिया शामिल है।',
          sat: 'ᱥᱮᱸᱜᱮᱞ ᱡᱩᱞᱩᱜ ᱞᱟᱹᱜᱤᱫ ᱤᱸᱫᱷᱚᱱ, ᱚᱠᱥᱤᱡᱮᱱ, ᱞᱚᱞᱚ ᱟᱨ ᱨᱟᱥᱟᱭᱚᱱ ᱡᱚᱲᱟᱣ ᱞᱟᱹᱠᱛᱤ ᱠᱟᱱᱟ᱾'
        }
      },
      {
        id: 'c1_q2',
        prompt: {
          en: 'What class of fire involves energized electrical switchgear cabinets?',
          hi: 'सक्रिय विद्युत स्विचगियर कैबिनेट में किस वर्ग की आग लगती है?',
          sat: 'ᱵᱤᱡᱽᱞᱤ ᱥᱩᱭᱤᱪ ᱵᱳᱨᱰ ᱟᱨ ᱢᱮᱥᱤᱱ ᱨᱮ ᱞᱟᱜᱟᱣ ᱟᱠᱟᱱ ᱥᱮᱸᱜᱮᱞ ᱫᱚ ᱪᱮᱫ ᱠᱞᱟᱥ ᱨᱮᱭᱟᱜ ᱠᱟᱱᱟ?'
        },
        options: [
          {
            id: 'opt_a',
            text: {
              en: 'Class A (Combustible wood/paper)',
              hi: 'वर्ग A (दहनशील लकड़ी/कागज)',
              sat: 'ᱠᱞᱟᱥ A (ᱠᱟᱴ ᱟᱨ ᱠᱟᱜᱚᱡᱽ ᱥᱮᱸᱜᱮᱞ)'
            }
          },
          {
            id: 'opt_c',
            text: {
              en: 'Class C (Energized electrical equipment)',
              hi: 'वर्ग C (सक्रिय विद्युत उपकरण)',
              sat: 'ᱠᱞᱟᱥ C (ᱵᱤᱡᱽᱞᱤ ᱥᱟᱢᱟᱱ ᱥᱮᱸᱜᱮᱞ)'
            }
          },
          {
            id: 'opt_d',
            text: {
              en: 'Class D (Combustible metals)',
              hi: 'वर्ग D (दहनशील धातु)',
              sat: 'ᱠᱞᱟᱥ D (ᱢᱮᱬᱦᱮᱫ ᱥᱮᱸᱜᱮᱞ)'
            }
          }
        ],
        correctAnswer: 'opt_c',
        explanation: {
          en: 'Class C fires involve energized electrical equipment. Non-conductive extinguishing agents like CO2 or clean dry chemicals must be deployed.',
          hi: 'क्लास C की आग में सक्रिय विद्युत उपकरण शामिल होते हैं। केवल अचालक CO2 या ड्राई केमिकल का उपयोग करें।',
          sat: 'ᱠᱞᱟᱥ C ᱫᱚ ᱵᱤᱡᱽᱞᱤ ᱥᱟᱢᱟᱱ ᱥᱮᱸᱜᱮᱞ ᱠᱟᱱᱟ᱾ ᱱᱚᱣᱟ ᱨᱮ CO2 ᱥᱮ ᱰᱨᱟᱭ ᱠᱮᱢᱤᱠᱟᱞ ᱵᱮᱵᱷᱟᱨ ᱢᱮ᱾'
        }
      }
    ]
  },
  {
    chapterId: 2,
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
    questionsCount: 2,
    passingPercentage: 50,
    color: '#0891B2',
    questions: [
      {
        id: 'c2_q1',
        prompt: {
          en: 'Before starting cutting or welding in an underground conveyor belt gallery, what is mandatory?',
          hi: 'भूमिगत कन्वेयर बेल्ट गैलरी में कटिंग या वेल्डिंग शुरू करने से पहले क्या अनिवार्य है?',
          sat: 'ᱠᱷᱟᱫᱟᱱ ᱵᱷᱤᱛᱨᱤ ᱨᱮ ᱜᱮᱫ ᱥᱮ ᱣᱮᱞᱰᱤᱝ ᱠᱟᱹᱢᱤ ᱮᱛᱚᱦᱚᱵ ᱢᱟᱲᱟᱝ ᱪᱮᱫ ᱞᱟᱹᱠᱛᱤᱭᱟᱱᱟ?'
        },
        options: [
          {
            id: 'opt_1',
            text: {
              en: 'Securing an authorized Hot Work Permit and wetting the 10m perimeter radius',
              hi: 'अधिकृत हॉट वर्क परमिट प्राप्त करना और 10 मीटर दायरे को गीला करना',
              sat: 'ᱦᱚᱴ ᱣᱟᱨᱠ ᱯᱟᱨᱢᱤᱴ ᱦᱟᱛᱟᱣ ᱟᱨ ᱑᱐ ᱢᱤᱴᱟᱨ ᱡᱟᱭᱜᱟ ᱨᱮ ᱫᱟᱜ ᱪᱷᱤᱴᱠᱟᱹᱣ'
            }
          },
          {
            id: 'opt_2',
            text: {
              en: 'Only switching off the exhaust fan',
              hi: 'केवल एग्जॉस्ट फैन बंद करना',
              sat: 'ᱠᱷᱟᱹᱞᱤ ᱯᱟᱠᱷᱟ ᱵᱚᱸᱫᱽ'
            }
          },
          {
            id: 'opt_3',
            text: {
              en: 'Wearing standard cotton overalls without fire watchers',
              hi: 'बिना फायर वॉचर के सामान्य सूती कपड़े पहनना',
              sat: 'ᱵᱤᱱ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱛᱮ ᱥᱟᱫᱷᱟᱨᱚᱱ ᱞᱩᱜᱽᱲᱤ ᱦᱚᱨᱚᱜ'
            }
          }
        ],
        correctAnswer: 'opt_1',
        explanation: {
          en: 'OSHA & DGMS require a certified Hot Work Permit, atmospheric gas testing, clearing combustibles within 10 meters, and active fire watchers.',
          hi: 'डीजीएमएस और ओशा के अनुसार प्रमाणित हॉट वर्क परमिट और 10 मीटर का क्षेत्र गीला करना अनिवार्य है।',
          sat: 'DGMS ᱱᱤᱭᱟᱹᱢ ᱞᱮᱠᱟᱛᱮ ᱯᱟᱨᱢᱤᱴ ᱦᱟᱛᱟᱣ ᱟᱨ ᱑᱐ ᱢᱤᱴᱟᱨ ᱡᱟᱭᱜᱟ ᱨᱮ ᱫᱟᱜ ᱫᱩᱞ ᱞᱟᱹᱠᱛᱤ ᱠᱟᱱᱟ᱾'
        }
      },
      {
        id: 'c2_q2',
        prompt: {
          en: 'What is the primary danger of oily rags stored in open trash cans?',
          hi: 'खुले कूड़ेदान में रखे तेल से सने कपड़ों का प्राथमिक खतरा क्या है?',
          sat: 'ᱥᱩᱱᱩᱢ ᱞᱟᱜᱟᱣ ᱟᱠᱟᱱ ᱞᱩᱜᱽᱲᱤ ᱠᱩᱲᱟᱹᱫᱟᱱ ᱨᱮ ᱫᱚᱦᱚ ᱨᱮᱭᱟᱜ ᱵᱤᱯᱚᱫᱽ ᱪᱮᱫ ᱠᱟᱱᱟ?'
        },
        options: [
          {
            id: 'opt_a',
            text: {
              en: 'Spontaneous combustion via exothermic oil oxidation',
              hi: 'ऊष्माक्षेपी तेल ऑक्सीकरण के कारण स्वतः दहन (Spontaneous Combustion)',
              sat: 'ᱞᱚᱞᱚ ᱵᱟᱹᱲᱛᱤ ᱠᱟᱛᱮ ᱟᱯᱱᱟᱨ ᱛᱮᱜᱮ ᱥᱮᱸᱜᱮᱞ ᱡᱩᱞᱩᱜ'
            }
          },
          {
            id: 'opt_b',
            text: {
              en: 'Mild unpleasant odor only',
              hi: 'केवल हल्की अप्रिय गंध',
              sat: 'ᱠᱷᱟᱹᱞᱤ ᱱᱟᱥᱮ ᱥᱚ'
            }
          },
          {
            id: 'opt_c',
            text: {
              en: 'Attracting insects without any fire hazard',
              hi: 'बिना आग के खतरे के कीड़े आकर्षित होना',
              sat: 'ᱥᱮᱸᱜᱮᱞ ᱵᱟᱝ ᱞᱟᱜᱟᱣ ᱠᱟᱛᱮ ᱠᱤᱲᱟᱹ ᱦᱤᱡᱩᱜ'
            }
          }
        ],
        correctAnswer: 'opt_a',
        explanation: {
          en: 'Oils slowly oxidize and produce heat. In a trapped environment, the temperature rises to the ignition point, causing spontaneous combustion.',
          hi: 'तेल धीरे-धीरे ऑक्सीकृत होकर गर्मी पैदा करता है, जिससे आग लग जाती है।',
          sat: 'ᱥᱩᱱᱩᱢ ᱠᱷᱚᱱ ᱟᱯᱱᱟᱨ ᱛᱮ ᱞᱚᱞᱚ ᱦᱩᱭ ᱠᱟᱛᱮ ᱥᱮᱸᱜᱮᱞ ᱡᱩᱞ ᱩᱴᱷᱟᱹᱣᱜ-ᱟ᱾'
        }
      }
    ]
  },
  {
    chapterId: 3,
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
    questionsCount: 2,
    passingPercentage: 50,
    color: '#D97706',
    questions: [
      {
        id: 'c3_q1',
        prompt: {
          en: 'When a plant manual pull station is activated, what happens automatically?',
          hi: 'जब संयंत्र में आपातकालीन मैनुअल पुल स्टेशन चालू किया जाता है, तो स्वचालित रूप से क्या होता है?',
          sat: 'ᱠᱟᱹᱨᱜᱟᱲ ᱨᱮ ᱟᱞᱟᱨᱢ ᱞᱤᱱ ᱞᱮᱠᱷᱟᱱ ᱟᱯᱱᱟᱨ ᱛᱮ ᱪᱮᱫ ᱦᱩᱭᱩᱜ-ᱟ?'
        },
        options: [
          {
            id: 'opt_1',
            text: {
              en: 'Evacuation sirens sound, ventilation interlocks trip, and central control is alerted',
              hi: 'निकासी सायरन बजते हैं, वेंटिलेशन बंद होता है, और नियंत्रण कक्ष को अलर्ट जाता है',
              sat: 'ᱥᱟᱭᱨᱮᱱ ᱥᱟᱰᱮᱜ-ᱟ, ᱦᱚᱭ ᱯᱟᱠᱷᱟ ᱵᱚᱸᱫᱚᱜ-ᱟ ᱟᱨ ᱠᱚᱱᱴᱨᱚᱞ ᱨᱩᱢ ᱠᱷᱚᱵᱚᱨ ᱥᱮᱱᱚᱜ-ᱟ'
            }
          },
          {
            id: 'opt_2',
            text: {
              en: 'Only a local bell rings on that floor',
              hi: 'केवल उस मंजिल पर एक स्थानीय घंटी बजती है',
              sat: 'ᱠᱷᱟᱹᱞᱤ ᱚᱱᱟ ᱛᱟᱞᱟ ᱨᱮ ᱜᱷᱚᱱᱴᱤ ᱵᱟᱡᱟᱣᱜ-ᱟ'
            }
          },
          {
            id: 'opt_3',
            text: {
              en: 'Water is immediately sprayed throughout the entire building',
              hi: 'पूरी इमारत में तुरंत पानी छिड़क दिया जाता है',
              sat: 'ᱜᱚᱴᱟ ᱚᱲᱟᱜ ᱨᱮ ᱫᱟᱜ ᱪᱷᱤᱴᱠᱟᱹᱣᱜ-ᱟ'
            }
          }
        ],
        correctAnswer: 'opt_1',
        explanation: {
          en: 'Modern industrial fire alarm control panels (FACP) instantly notify central monitoring, sound alarm strobes, and interlock smoke damper fans.',
          hi: 'आधुनिक फायर पैनल केंद्रीय नियंत्रण को सूचित करते हैं, सायरन बजाते हैं और वेंटिलेशन बंद करते हैं।',
          sat: 'ᱥᱟᱭᱨᱮᱱ ᱟᱧᱡᱚᱢ ᱠᱟᱛᱮ ᱡᱚᱛᱚ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱵᱟᱦᱨᱮ ᱩᱰᱩᱠ ᱨᱮᱭᱟᱜ ᱱᱤᱭᱟᱹᱢ ᱠᱟᱱᱟ᱾'
        }
      },
      {
        id: 'c3_q2',
        prompt: {
          en: 'Which sensor type is most effective in detecting flaming alcohol or methane gas fires?',
          hi: 'जलती शराब या मीथेन गैस की आग का पता लगाने में कौन सा सेंसर सबसे प्रभावी है?',
          sat: 'ᱢᱤᱛᱷᱮᱱ ᱜᱮᱥ ᱥᱮ ᱥᱩᱱᱩᱢ ᱥᱮᱸᱜᱮᱞ ᱪᱤᱱᱦᱟᱹᱣ ᱞᱟᱹᱜᱤᱫ ᱚᱠᱟ ᱥᱮᱱᱥᱚᱨ ᱡᱚᱛᱚ ᱠᱷᱚᱱ ᱵᱷᱟᱹᱜᱤᱭᱟᱹ?'
        },
        options: [
          {
            id: 'opt_a',
            text: {
              en: 'Optical UV/IR Flame Detector',
              hi: 'ऑप्टिकल UV/IR फ्लेम डिटेक्टर',
              sat: 'ᱚᱯᱴᱤᱠᱟᱞ UV/IR ᱥᱮᱸᱜᱮᱞ ᱰᱤᱴᱮᱠᱴᱚᱨ'
            }
          },
          {
            id: 'opt_b',
            text: {
              en: 'Standard ionization chamber smoke detector',
              hi: 'मानक आयनीकरण धुआं डिटेक्टर',
              sat: 'ᱥᱟᱫᱷᱟᱨᱚᱱ ᱫᱷᱩᱶᱟᱹ ᱰᱤᱴᱮᱠᱴᱚᱨ'
            }
          },
          {
            id: 'opt_c',
            text: {
              en: 'Ambient room thermometer',
              hi: 'कमरे का सामान्य थर्मामीटर',
              sat: 'ᱥᱟᱫᱷᱟᱨᱚᱱ ᱛᱷᱟᱨᱢᱳᱢᱤᱴᱟᱨ'
            }
          }
        ],
        correctAnswer: 'opt_a',
        explanation: {
          en: 'Clean gas and alcohol flames emit ultraviolet and infrared radiation with minimal visible smoke. UV/IR sensors detect these within milliseconds.',
          hi: 'गैस की आग में धुआं बहुत कम होता है, अतः UV/IR सेंसर मिलीसेकंड में लौ को पहचान लेते हैं।',
          sat: 'ᱜᱮᱥ ᱥᱮᱸᱜᱮᱞ ᱨᱮ ᱫᱷᱩᱶᱟᱹ ᱠᱚᱢ ᱛᱟᱦᱮᱸᱱᱟ, ᱚᱱᱟᱛᱮ UV/IR ᱥᱮᱱᱥᱚᱨ ᱞᱚᱜᱚᱱ ᱪᱤᱱᱦᱟᱹᱣ ᱫᱟᱲᱮᱭᱟᱜ-ᱟ᱾'
        }
      }
    ]
  },
  {
    chapterId: 4,
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
    questionsCount: 2,
    passingPercentage: 50,
    color: '#10B981',
    questions: [
      {
        id: 'c4_q1',
        prompt: {
          en: 'What does the acronym P.A.S.S. stand for when operating a portable extinguisher?',
          hi: 'अग्निशामक चलाते समय P.A.S.S. संक्षिप्त नाम का क्या अर्थ है?',
          sat: 'ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱢᱤᱥᱤᱱ ᱪᱟᱞᱟᱣ ᱨᱮ P.A.S.S. ᱨᱮᱭᱟᱜ ᱢᱮᱱᱮᱛ ᱫᱚ ᱪᱮᱫ ᱠᱟᱱᱟ?'
        },
        options: [
          {
            id: 'opt_1',
            text: {
              en: 'Pull pin, Aim at base, Squeeze trigger, Sweep side-to-side',
              hi: 'पिन खींचें (P), जड़ पर निशाना लगाएं (A), लीवर दबाएं (S), दायें-बायें घुमाएं (S)',
              sat: 'ᱯᱤᱱ ᱚᱨ (P), ᱯᱷᱮᱰ ᱨᱮ ᱱᱤᱥᱟᱱᱟ (A), ᱦᱮᱱᱰᱮᱞ ᱞᱤᱱ (S), ᱦᱤᱞᱟᱹᱣ ᱤᱬᱤᱡ (S)'
            }
          },
          {
            id: 'opt_2',
            text: {
              en: 'Push lever, Aim at flames, Spray fast, Stop',
              hi: 'लीवर दबाएं, लपटों पर निशाना, तेज स्प्रे, रुकें',
              sat: 'ᱞᱤᱵᱷᱚᱨ ᱞᱤᱱ, ᱪᱮᱛᱟᱱ ᱱᱤᱥᱟᱱᱟ, ᱫᱟᱹᱲ, ᱛᱤᱸᱜᱩ'
            }
          },
          {
            id: 'opt_3',
            text: {
              en: 'Prepare hose, Alert crew, Stand back, Sweep',
              hi: 'पाइप तैयार करें, सतर्क करें, पीछे हटें, घुमाएं',
              sat: 'ᱯᱟᱭᱤᱯ ᱥᱟᱯᱲᱟᱣ, ᱦᱚᱲ ᱦᱚᱦᱚ, ᱛᱟᱭᱚᱢᱚᱜ, ᱤᱬᱤᱡ'
            }
          }
        ],
        correctAnswer: 'opt_1',
        explanation: {
          en: 'The universally recognized procedure is P.A.S.S.: Pull safety pin, Aim nozzle low at the fuel base, Squeeze handle, Sweep across width of fire.',
          hi: 'मानक प्रक्रिया है: पिन खींचें, आधार पर निशाना साधें, हैंडल दबाएं और दायें-बायें घुमाएं।',
          sat: 'ᱡᱮᱜᱮᱛ ᱨᱮ ᱢᱟᱱᱟᱣ ᱵᱟᱛᱟᱣ ᱛᱚᱦᱚᱨ ᱫᱚ: Pull, Aim, Squeeze, Sweep ᱠᱟᱱᱟ᱾'
        }
      },
      {
        id: 'c4_q2',
        prompt: {
          en: 'Why must high-velocity water jets NEVER be used on flaming transformer oil?',
          hi: 'जलते ट्रांसफार्मर तेल पर कभी भी तेज पानी का उपयोग क्यों नहीं किया जाना चाहिए?',
          sat: 'ᱡᱩᱞᱩᱜ ᱴᱨᱟᱱᱥᱯᱷᱟᱨᱢᱟᱨ ᱥᱩᱱᱩᱢ ᱨᱮ ᱫᱟᱜ ᱫᱩᱞ ᱪᱮᱫᱟᱜ ᱢᱟᱱᱟ ᱜᱮᱭᱟ?'
        },
        options: [
          {
            id: 'opt_a',
            text: {
              en: 'Water violently turns to steam beneath the oil, creating explosive fireballs',
              hi: 'पानी तेल के नीचे तुरंत भाप में बदलकर विस्फोटक आग का गोला बनाता है',
              sat: 'ᱫᱟᱜ ᱞᱚᱞᱚ ᱛᱮ ᱵᱷᱟᱯ ᱵᱮᱱᱟᱣ ᱠᱟᱛᱮ ᱵᱤᱥᱯᱷᱚᱴ ᱦᱩᱭᱩᱜ-ᱟ ᱟᱨ ᱥᱮᱸᱜᱮᱞ ᱯᱟᱥᱱᱟᱣᱜ-ᱟ'
            }
          },
          {
            id: 'opt_b',
            text: {
              en: 'Water cools the oil too quickly',
              hi: 'पानी तेल को बहुत जल्दी ठंडा कर देता है',
              sat: 'ᱫᱟᱜ ᱛᱮ ᱥᱩᱱᱩᱢ ᱞᱚᱜᱚᱱ ᱨᱮᱭᱟᱲᱚᱜ-ᱟ'
            }
          },
          {
            id: 'opt_c',
            text: {
              en: 'Oil dissolves in water and extinguishes immediately',
              hi: 'तेल पानी में घुलकर तुरंत बुझ जाता है',
              sat: 'ᱥᱩᱱᱩᱢ ᱫᱟᱜ ᱨᱮ ᱜᱩᱲᱟᱹᱣ ᱠᱟᱛᱮ ᱤᱬᱤᱡᱚᱜ-ᱟ'
            }
          }
        ],
        correctAnswer: 'opt_a',
        explanation: {
          en: 'Water is denser than oil and boils explosively into steam, spraying flaming liquid oil across workers and adjacent structures (boilover).',
          hi: 'पानी तेल से भारी होता है और भाप बनकर भयानक धमाका करता है, जिससे जलता तेल चारों ओर फैल जाता है।',
          sat: 'ᱥᱩᱱᱩᱢ ᱪᱮᱛᱟᱱ ᱨᱮ ᱫᱟᱜ ᱫᱩᱞ ᱞᱮᱠᱷᱟᱱ ᱵᱷᱟᱯ ᱵᱮᱱᱟᱣ ᱠᱟᱛᱮ ᱥᱮᱸᱜᱮᱞ ᱜᱚᱴᱟ ᱪᱷᱤᱴᱠᱟᱹᱣᱜ-ᱟ᱾'
        }
      }
    ]
  },
  {
    chapterId: 5,
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
    questionsCount: 2,
    passingPercentage: 50,
    color: '#6366F1',
    questions: [
      {
        id: 'c5_q1',
        prompt: {
          en: 'If dense toxic smoke fills your evacuation corridor, what is the safest movement posture?',
          hi: 'यदि निकास मार्ग घने जहरीले धुएं से भर जाता है, तो सबसे सुरक्षित शारीरिक मुद्रा क्या है?',
          sat: 'ᱫᱷᱩᱶᱟᱹ ᱛᱟᱞᱟ ᱛᱮ ᱩᱰᱩᱠᱚᱜ ᱚᱠᱛᱚ ᱦᱚᱲᱢᱚ ᱨᱮᱭᱟᱜ ᱥᱟᱹᱦᱤᱡ ᱛᱤᱸᱜᱩ ᱛᱚᱦᱚᱨ ᱪᱮᱫ ᱠᱟᱱᱟ?'
        },
        options: [
          {
            id: 'opt_1',
            text: {
              en: 'Crawl on hands and knees keeping your head in the cleaner air zone (30-60cm above floor)',
              hi: 'फर्श से 30-60 सेमी ऊपर साफ हवा की परत में हाथों और घुटनों के बल झुककर चलें',
              sat: 'ᱛᱤ ᱟᱨ ᱡᱟᱸᱜᱟ ᱞᱟᱛᱟᱨ ᱠᱟᱛᱮ ᱚᱛ ᱨᱮ ᱜᱩᱰᱩ ᱞᱮᱠᱟ ᱛᱟᱲᱟᱢ ᱢᱮ'
            }
          },
          {
            id: 'opt_2',
            text: {
              en: 'Run upright as quickly as possible through the smoke',
              hi: 'धुएं के बीच से तेजी से सीधा खड़े होकर भागें',
              sat: 'ᱥᱚᱡᱷᱮ ᱛᱤᱸᱜᱩ ᱠᱟᱛᱮ ᱫᱟᱹᱲ ᱢᱮ'
            }
          },
          {
            id: 'opt_3',
            text: {
              en: 'Stand still and wait for someone to find you',
              hi: 'एक जगह खड़े होकर किसी के आने की प्रतीक्षा करें',
              sat: 'ᱛᱤᱸᱜᱩ ᱠᱟᱛᱮ ᱛᱟᱺᱜᱤ ᱢᱮ'
            }
          }
        ],
        correctAnswer: 'opt_1',
        explanation: {
          en: 'Heated toxic gases and carbon monoxide rise toward the ceiling. The cleanest, coolest air with highest oxygen content remains near the floor.',
          hi: 'जहरीली गैसें और कार्बन मोनोऑक्साइड छत की ओर उठते हैं, जबकि फर्श के पास सबसे ठंडी और स्वच्छ हवा होती है।',
          sat: 'ᱵᱤᱥ ᱫᱷᱩᱶᱟᱹ ᱪᱮᱛᱟᱱ ᱨᱟᱠᱟᱵ-ᱟ, ᱚᱛ ᱥᱩᱨ ᱨᱮ ᱥᱟᱯᱷᱟ ᱦᱚᱭ ᱛᱟᱦᱮᱸᱱᱟ ᱚᱱᱟᱛᱮ ᱞᱟᱛᱟᱨ ᱛᱮ ᱛᱟᱲᱟᱢ ᱢᱮ᱾'
        }
      },
      {
        id: 'c5_q2',
        prompt: {
          en: 'After reaching the designated Emergency Assembly Area (Muster Point), what should workers do immediately?',
          hi: 'सुरक्षित असेंबली पॉइंट पर पहुंचने के बाद, श्रमिकों को तुरंत क्या करना चाहिए?',
          sat: 'ᱨᱩᱠᱷᱤᱭᱟᱹ ᱡᱟᱣᱨᱟᱜ ᱡᱟᱭᱜᱟ ᱨᱮ ᱥᱮᱴᱮᱨ ᱠᱟᱛᱮ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱠᱚ ᱞᱚᱜᱚᱱ ᱪᱮᱫ ᱠᱚᱨᱟᱣ ᱞᱟᱹᱠᱛᱤ?'
        },
        options: [
          {
            id: 'opt_a',
            text: {
              en: 'Report to Safety Warden for roll-call headcount verification and remain at point',
              hi: 'हाजिरी सत्यापन के लिए सुरक्षा वार्डन को रिपोर्ट करें और असेंबली पॉइंट पर ही रहें',
              sat: 'ᱥᱩᱯᱚᱨᱵᱷᱟᱭᱡᱚᱨ ᱴᱷᱮᱱ ᱦᱟᱡᱤᱨᱤ ᱮᱢ ᱢᱮ ᱟᱨ ᱚᱸᱰᱮ ᱜᱮ ᱛᱟᱦᱮᱸᱱ ᱢᱮ'
            }
          },
          {
            id: 'opt_b',
            text: {
              en: 'Re-enter the plant to retrieve personal belongings',
              hi: 'अपना सामान लेने के लिए इमारत के अंदर वापस जाएं',
              sat: 'ᱱᱤᱡᱮᱨᱟᱜ ᱥᱟᱢᱟᱱ ᱟᱹᱜᱩ ᱨᱩᱣᱟᱹᱲ ᱵᱚᱞᱚᱱ'
            }
          },
          {
            id: 'opt_c',
            text: {
              en: 'Disperse to employee parking lot without notifying supervisors',
              hi: 'सुपरवाइजर को बताए बिना पार्किंग में चले जाएं',
              sat: 'ᱵᱤᱱ ᱞᱟᱹᱭ ᱛᱮ ᱚᱲᱟᱜ ᱥᱮᱱᱚᱜ'
            }
          }
        ],
        correctAnswer: 'opt_a',
        explanation: {
          en: 'Roll-call at the muster point confirms everyone has safely evacuated. Re-entering a burning structure without specialized SCBA is strictly prohibited.',
          hi: 'असेंबली पॉइंट पर हाजिरी से सभी की सुरक्षा सुनिश्चित होती है। जलती इमारत में दोबारा जाना जानलेवा है।',
          sat: 'ᱡᱟᱣᱨᱟᱜ ᱡᱟᱭᱜᱟ ᱨᱮ ᱦᱟᱡᱤᱨᱤ ᱮᱢ ᱠᱟᱛᱮ ᱛᱟᱦᱮᱸᱱ ᱢᱮ, ᱵᱷᱤᱛᱨᱤ ᱨᱩᱣᱟᱹᱲ ᱵᱚᱞᱚᱱ ᱮᱠᱟᱞ ᱢᱟᱱᱟ ᱜᱮᱭᱟ᱾'
        }
      }
    ]
  }
];

// Module 2: Gas Leak & Confined Space Chapter Assessments
export const GAS_CHAPTER_ASSESSMENTS: ChapterAssessmentItem[] = [
  {
    chapterId: 1,
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
    questionsCount: 2,
    passingPercentage: 50,
    color: '#0284C7',
    questions: [
      {
        id: 'g1_q1',
        prompt: {
          en: 'What is the danger of Hydrogen Sulfide (H2S) gas at dangerous concentration levels?',
          hi: 'खतरनाक सांद्रता स्तर पर हाइड्रोजन सल्फाइड (H2S) गैस का क्या खतरा है?',
          sat: 'ᱵᱤᱯᱚᱫᱽ ᱞᱮᱵᱷᱮᱞ ᱨᱮ H2S ᱜᱮᱥ ᱨᱮᱭᱟᱜ ᱪᱮᱫ ᱵᱤᱯᱚᱫᱽ ᱦᱩᱭᱩᱜ-ᱟ?'
        },
        options: [
          {
            id: 'opt_1',
            text: {
              en: 'It causes olfactory fatigue, paralyzing the sense of smell within seconds',
              hi: 'यह सूंघने की शक्ति को सेकंडों में सुन्न कर देता है (Olfactory Fatigue)',
              sat: 'ᱱᱚᱣᱟ ᱛᱮ ᱥᱚ ᱪᱤᱱᱦᱟᱹᱣ ᱫᱟᱲᱮ ᱞᱚᱜᱚᱱ ᱵᱚᱸᱫᱚᱜ-ᱟ (Olfactory Fatigue)'
            }
          },
          {
            id: 'opt_2',
            text: {
              en: 'It is brightly colored and visible to the naked eye',
              hi: 'यह चमकदार रंग की होती है और आसानी से दिखाई देती है',
              sat: 'ᱱᱚᱣᱟ ᱨᱚᱝ ᱧᱮᱞᱚᱜ-ᱟ'
            }
          },
          {
            id: 'opt_3',
            text: {
              en: 'It only causes minor coughing with zero toxicity',
              hi: 'यह बिना विषाक्तता के केवल हल्की खांसी पैदा करती है',
              sat: 'ᱠᱷᱟᱹᱞᱤ ᱠᱷᱚᱠ ᱦᱤᱡᱩᱜ-ᱟ'
            }
          }
        ],
        correctAnswer: 'opt_1',
        explanation: {
          en: 'H2S smells like rotten eggs at very low levels, but rapidly deadens human olfactory nerves at lethal concentrations. Always rely on calibrated detectors.',
          hi: 'H2S अधिक मात्रा में सूंघने की शक्ति को तुरंत खत्म कर देती है। हमेशा डिजिटल डिटेक्टर पर भरोसा करें।',
          sat: 'H2S ᱜᱮᱥ ᱵᱟᱹᱲᱛᱤ ᱞᱮᱱᱠᱷᱟᱱ ᱥᱚ ᱵᱟᱝ ᱵᱩᱡᱷᱟᱹᱣᱜ-ᱟ ᱟᱨ ᱦᱚᱲᱢᱚ ᱞᱚᱜᱚᱱ ᱵᱮᱦᱚᱥᱚᱜ-ᱟ᱾ ᱰᱤᱴᱮᱠᱴᱚᱨ ᱵᱮᱵᱷᱟᱨ ᱢᱮ᱾'
        }
      },
      {
        id: 'g1_q2',
        prompt: {
          en: 'What is the normal safe breathable atmospheric oxygen concentration range in workplace environments?',
          hi: 'कार्यस्थल के वातावरण में सामान्य सुरक्षित श्वसन योग्य ऑक्सीजन सांद्रता सीमा क्या है?',
          sat: 'ᱠᱟᱹᱢᱤ ᱡᱟᱭᱜᱟ ᱨᱮ ᱥᱟᱦᱮᱫ ᱦᱟᱛᱟᱣ ᱞᱟᱹᱜᱤᱫ ᱚᱠᱥᱤᱡᱮᱱ ᱨᱮᱭᱟᱜ ᱥᱟᱹᱦᱤᱡ ᱥᱤᱢᱟᱹ ᱪᱮᱫ ᱠᱟᱱᱟ?'
        },
        options: [
          {
            id: 'opt_a',
            text: {
              en: '19.5% to 23.5% Oxygen',
              hi: '19.5% से 23.5% ऑक्सीजन',
              sat: '᱑᱙.᱕% ᱠᱷᱚᱱ ᱒᱓.᱕% ᱚᱠᱥᱤᱡᱮᱱ'
            }
          },
          {
            id: 'opt_b',
            text: {
              en: 'Below 14.0% Oxygen',
              hi: '14.0% से कम ऑक्सीजन',
              sat: '᱑᱔% ᱠᱷᱚᱱ ᱠᱚᱢ ᱚᱠᱥᱤᱡᱮᱱ'
            }
          },
          {
            id: 'opt_c',
            text: {
              en: 'Above 35.0% Oxygen',
              hi: '35.0% से अधिक ऑक्सीजन',
              sat: '᱓᱕% ᱠᱷᱚᱱ ᱵᱟᱹᱲᱛᱤ ᱚᱠᱥᱤᱡᱮᱱ'
            }
          }
        ],
        correctAnswer: 'opt_a',
        explanation: {
          en: 'OSHA & DGMS standards define oxygen deficiency below 19.5% (asphyxiation risk) and oxygen enrichment above 23.5% (extreme flammability risk).',
          hi: '19.5% से कम ऑक्सीजन पर दम घुटता है और 23.5% से अधिक होने पर आग लगने का अत्यधिक खतरा होता है।',
          sat: '᱑᱙.᱕% ᱠᱷᱚᱱ ᱠᱚᱢ ᱨᱮ ᱥᱟᱦᱮᱫ ᱟᱴᱠᱟᱣᱜ-ᱟ ᱟᱨ ᱒᱓.᱕% ᱠᱷᱚᱱ ᱵᱟᱹᱲᱛᱤ ᱨᱮ ᱥᱮᱸᱜᱮᱞ ᱡᱩᱞᱩᱜ ᱵᱤᱯᱚᱫᱽ ᱛᱟᱦᱮᱸᱱᱟ᱾'
        }
      }
    ]
  },
  {
    chapterId: 2,
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
    questionsCount: 2,
    passingPercentage: 50,
    color: '#0D9488',
    questions: [
      {
        id: 'g2_q1',
        prompt: {
          en: 'What is a multi-gas monitor bump test?',
          hi: 'मल्टी-गैस मॉनिटर "बम्प टेस्ट" क्या है?',
          sat: 'ᱢᱟᱞᱴᱤ-ᱜᱮᱥ ᱰᱤᱴᱮᱠᱴᱚᱨ "ᱵᱟᱢᱯ ᱴᱮᱥᱴ" ᱨᱮᱭᱟᱜ ᱪᱮᱫ ᱢᱮᱱᱮᱛ ᱠᱟᱱᱟ?'
        },
        options: [
          {
            id: 'opt_1',
            text: {
              en: 'Briefly exposing sensors to known calibration gas to verify alarm and sensor response',
              hi: 'अलार्म और सेंसर की सक्रियता जांचने के लिए ज्ञात गैस का संक्षिप्त परीक्षण',
              sat: 'ᱥᱮᱱᱥᱚᱨ ᱟᱨ ᱟᱞᱟᱨᱢ ᱴᱷᱤᱠ ᱠᱟᱹᱢᱤ ᱠᱟᱱᱟ ᱥᱮ ᱵᱟᱝ ᱧᱮᱞ ᱞᱟᱹᱜᱤᱫ ᱠᱮᱞᱤᱵᱽᱨᱮᱥᱚᱱ ᱜᱮᱥ ᱡᱟᱸᱪ'
            }
          },
          {
            id: 'opt_2',
            text: {
              en: 'Dropping the detector on concrete to check physical durability',
              hi: 'मजबूती जांचने के लिए डिटेक्टर को फर्श पर गिराना',
              sat: 'ᱰᱤᱴᱮᱠᱴᱚᱨ ᱚᱛ ᱨᱮ ᱧᱩᱨ ᱠᱟᱛᱮ ᱧᱮᱞ'
            }
          },
          {
            id: 'opt_3',
            text: {
              en: 'Washing the instrument under tap water',
              hi: 'उपकरण को पानी से धोना',
              sat: 'ᱢᱤᱥᱤᱱ ᱫᱟᱜ ᱛᱮ ᱟᱹᱨᱩᱵ'
            }
          }
        ],
        correctAnswer: 'opt_1',
        explanation: {
          en: 'A bump test challenges the sensors with known gas to confirm audible, visual, and vibrating alarms actuate before entering any dangerous atmosphere.',
          hi: 'बम्प टेस्ट यह सुनिश्चित करता है कि खतरनाक क्षेत्र में जाने से पहले सभी सेंसर और अलार्म ठीक से काम कर रहे हैं।',
          sat: 'ᱠᱟᱹᱢᱤ ᱵᱚᱞᱚᱱ ᱢᱟᱲᱟᱝ ᱵᱟᱢᱯ ᱴᱮᱥᱴ ᱛᱮ ᱵᱟᱰᱟᱭᱚᱜ-ᱟ ᱡᱮ ᱟᱞᱟᱨᱢ ᱟᱨ ᱥᱮᱱᱥᱚᱨ ᱥᱟᱹᱦᱤᱡ ᱠᱟᱹᱢᱤ ᱠᱟᱱᱟ᱾'
        }
      },
      {
        id: 'g2_q2',
        prompt: {
          en: 'When entering an immediately dangerous to life or health (IDLH) gas environment, which PPE is mandatory?',
          hi: 'जीवन या स्वास्थ्य के लिए तत्काल खतरनाक (IDLH) गैस वातावरण में कौन सा PPE अनिवार्य है?',
          sat: 'ᱡᱤᱣᱤ ᱨᱮ ᱟᱹᱰᱤ ᱢᱟᱨᱟᱝ ᱵᱤᱯᱚᱫᱽ (IDLH) ᱜᱮᱥ ᱡᱟᱭᱜᱟ ᱨᱮ ᱪᱮᱫ PPE ᱦᱚᱨᱚᱜ ᱮᱠᱟᱞ ᱞᱟᱹᱠᱛᱤ ᱠᱟᱱᱟ?'
        },
        options: [
          {
            id: 'opt_a',
            text: {
              en: 'Positive-pressure Self-Contained Breathing Apparatus (SCBA)',
              hi: 'पॉजिटिव-प्रेशर सेल्फ-कंटेन्ड ब्रीदिंग अपेरटस (SCBA)',
              sat: 'ᱯᱚᱡᱤᱴᱤᱵᱷ-ᱯᱨᱮᱥᱟᱨ SCBA ᱥᱟᱦᱮᱫ ᱢᱟᱥᱠ ᱥᱤᱞᱤᱱᱰᱟᱨ'
            }
          },
          {
            id: 'opt_b',
            text: {
              en: 'Disposable paper particulate dust mask',
              hi: 'डिस्पोजेबल धूल मास्क',
              sat: 'ᱥᱟᱫᱷᱟᱨᱚᱱ ᱠᱟᱜᱚᱡᱽ ᱢᱟᱥᱠ'
            }
          },
          {
            id: 'opt_c',
            text: {
              en: 'Wet cotton cloth held against the mouth',
              hi: 'मुंह पर गीला सूती कपड़ा रखना',
              sat: 'ᱞᱩᱜᱽᱲᱤ ᱛᱮ ᱢᱚᱪᱟ ᱯᱚᱴᱚᱢ'
            }
          }
        ],
        correctAnswer: 'opt_a',
        explanation: {
          en: 'Dust masks or filter cartridges cannot protect against toxic gas or oxygen-deficient atmospheres. Only an independent positive-pressure air supply (SCBA) provides life protection.',
          hi: 'धूल मास्क जहरीली गैसों से सुरक्षा नहीं दे सकते। केवल SCBA स्वतंत्र शुद्ध वायु आपूर्ति प्रदान करता है।',
          sat: 'ᱵᱤᱥ ᱜᱮᱥ ᱠᱷᱚᱱ ᱵᱟᱧᱪᱟᱣ ᱞᱟᱹᱜᱤᱫ ᱥᱟᱫᱷᱟᱨᱚᱱ ᱢᱟᱥᱠ ᱵᱟᱝ ᱠᱟᱹᱢᱤᱭᱟ, ᱠᱷᱟᱹᱞᱤ SCBA ᱥᱤᱞᱤᱱᱰᱟᱨ ᱜᱮ ᱨᱩᱠᱷᱤᱭᱟᱹᱭ ᱮᱢᱟ᱾'
        }
      }
    ]
  },
  {
    chapterId: 3,
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
    questionsCount: 2,
    passingPercentage: 50,
    color: '#EAB308',
    questions: [
      {
        id: 'g3_q1',
        prompt: {
          en: 'If a high-level toxic gas alarm sounds in an enclosed mining gallery, what is your immediate first action?',
          hi: 'यदि खदान गैलरी में जहरीली गैस का उच्च-स्तरीय अलार्म बजता है, तो आपकी पहली कार्रवाई क्या होनी चाहिए?',
          sat: 'ᱠᱷᱟᱫᱟᱱ ᱵᱷᱤᱛᱨᱤ ᱨᱮ ᱵᱤᱥ ᱜᱮᱥ ᱨᱮᱭᱟᱜ ᱢᱟᱨᱟᱝ ᱟᱞᱟᱨᱢ ᱵᱟᱡᱟᱣ ᱞᱮᱱᱠᱷᱟᱱ ᱯᱩᱭᱞᱩ ᱪᱮᱫ ᱮᱢ ᱠᱚᱨᱟᱣᱟ?'
        },
        options: [
          {
            id: 'opt_1',
            text: {
              en: 'Immediately stop work, alert co-workers, and evacuate cross-wind towards fresh air intake',
              hi: 'तुरंत काम रोकें, साथियों को सचेत करें और ताजी हवा के मार्ग की ओर निकलें',
              sat: 'ᱞᱚᱜᱚᱱ ᱠᱟᱹᱢᱤ ᱵᱚᱸᱫᱽ ᱢᱮ, ᱜᱟᱛᱮ ᱠᱚ ᱦᱚᱦᱚ ᱟᱠᱚ ᱢᱮ ᱟᱨ ᱥᱟᱯᱷᱟ ᱦᱚᱭ ᱰᱟᱦᱟᱨ ᱛᱮ ᱩᱰᱩᱠ ᱢᱮ'
            }
          },
          {
            id: 'opt_2',
            text: {
              en: 'Search for the leak source with an open lighter flame',
              hi: 'माचिस या लाइटर जलाकर रिसाव खोजने का प्रयास करें',
              sat: 'ᱥᱮᱸᱜᱮᱞ ᱡᱩᱞ ᱠᱟᱛᱮ ᱜᱮᱥ ᱞᱤᱠ ᱯᱟᱸᱡᱟ'
            }
          },
          {
            id: 'opt_3',
            text: {
              en: 'Sit down and wait for the alarm to turn off automatically',
              hi: 'बैठकर अलार्म अपने आप बंद होने की प्रतीक्षा करें',
              sat: 'ᱫᱩᱲᱩᱵ ᱠᱟᱛᱮ ᱟᱞᱟᱨᱢ ᱵᱚᱸᱫᱽ ᱛᱟᱺᱜᱤ'
            }
          }
        ],
        correctAnswer: 'opt_1',
        explanation: {
          en: 'Never delay evacuation. Notify colleagues, proceed immediately towards the intake airway or upwind muster station, and notify safety dispatch.',
          hi: 'निकासी में कभी देरी न करें। साथियों को चेतावनी दें और ताजी हवा वाले सुरक्षित मार्ग से बाहर निकलें।',
          sat: 'ᱟᱞᱟᱨᱢ ᱟᱧᱡᱚᱢ ᱥᱟᱶᱛᱮ ᱜᱟᱛᱮ ᱠᱚ ᱞᱟᱹᱭ ᱠᱟᱛᱮ ᱞᱚᱜᱚᱱ ᱥᱟᱯᱷᱟ ᱦᱚᱭ ᱰᱟᱦᱟᱨ ᱛᱮ ᱩᱰᱩᱠ ᱞᱟᱹᱠᱛᱤ ᱠᱟᱱᱟ᱾'
        }
      },
      {
        id: 'g3_q2',
        prompt: {
          en: 'Why is Lockout/Tagout (LOTO) essential when isolating an industrial hazardous gas pipeline?',
          hi: 'औद्योगिक खतरनाक गैस पाइपलाइन को अलग (isolate) करते समय लॉकआउट/टैगआउट (LOTO) क्यों आवश्यक है?',
          sat: 'ᱜᱮᱥ ᱯᱟᱭᱤᱯ ᱨᱮ LOTO ᱪᱟᱹᱵᱷᱤ ᱞᱟᱜᱟᱣ ᱪᱮᱫᱟᱜ ᱞᱟᱹᱠᱛᱤ ᱠᱟᱱᱟ?'
        },
        options: [
          {
            id: 'opt_a',
            text: {
              en: 'To physically prevent anyone from reopening the valve while maintenance or inspection is underway',
              hi: 'यह सुनिश्चित करने के लिए कि मरम्मत के दौरान कोई गलती से वाल्व न खोल सके',
              sat: 'ᱠᱟᱹᱢᱤ ᱚᱠᱛᱚ ᱡᱮᱢᱚᱱ ᱮᱴᱟᱜ ᱦᱚᱲ ᱵᱷᱟᱞᱵᱽ ᱟᱞᱚᱭ ᱠᱷᱩᱞᱟᱹᱣ ᱫᱟᱲᱮᱭᱟᱜ ᱢᱟ'
            }
          },
          {
            id: 'opt_b',
            text: {
              en: 'To make the pipe look newly painted',
              hi: 'ताकि पाइप सुंदर दिखाई दे',
              sat: 'ᱯᱟᱭᱤᱯ ᱪᱮᱦᱨᱟ ᱧᱮᱞᱚᱜ ᱞᱟᱹᱜᱤᱫ'
            }
          },
          {
            id: 'opt_c',
            text: {
              en: 'LOTO is optional and not required by DGMS mining rules',
              hi: 'LOTO केवल वैकल्पिक है और नियमों के तहत अनिवार्य नहीं है',
              sat: 'ᱱᱚᱣᱟ ᱞᱟᱜᱟᱣ ᱵᱟᱝ ᱞᱟᱹᱠᱛᱤᱭᱟ'
            }
          }
        ],
        correctAnswer: 'opt_a',
        explanation: {
          en: 'LOTO places a physical padlock and identification tag on isolation valves to prevent accidental re-pressurization during emergency repairs.',
          hi: 'LOTO वाल्व पर एक भौतिक ताला लगाता है ताकि कोई अन्य व्यक्ति इसे गलती से न खोल सके।',
          sat: 'LOTO ᱛᱟᱞᱟ ᱞᱟᱜᱟᱣ ᱞᱮᱠᱷᱟᱱ ᱵᱤᱱ ᱵᱟᱰᱟᱭ ᱛᱮ ᱚᱠᱚᱭ ᱦᱚᱸ ᱵᱷᱟᱞᱵᱽ ᱵᱟᱠᱚ ᱠᱷᱩᱞᱟᱹᱣ ᱫᱟᱲᱮᱭᱟᱜ-ᱟ᱾'
        }
      }
    ]
  },
  {
    chapterId: 4,
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
    questionsCount: 2,
    passingPercentage: 50,
    color: '#F97316',
    questions: [
      {
        id: 'g4_q1',
        prompt: {
          en: 'Why must confined space atmospheric testing be conducted at the TOP, MIDDLE, and BOTTOM of the space?',
          hi: 'सीमित स्थान में वायुमंडलीय परीक्षण शीर्ष, मध्य और निचले स्तर पर क्यों किया जाना चाहिए?',
          sat: 'ᱥᱟᱸᱠᱲᱟ ᱡᱟᱭᱜᱟ ᱨᱮ ᱪᱮᱛᱟᱱ, ᱛᱟᱞᱟ ᱟᱨ ᱞᱟᱛᱟᱨ ᱯᱮᱭᱟ ᱴᱷᱟᱶ ᱨᱮ ᱦᱚᱭ ᱡᱟᱸᱪ ᱪᱮᱫᱟᱜ ᱞᱟᱹᱠᱛᱤ ᱠᱟᱱᱟ?'
        },
        options: [
          {
            id: 'opt_1',
            text: {
              en: 'Gases have different densities: Methane rises, Carbon Monoxide mixes evenly, and H2S sinks to the bottom',
              hi: 'गैसों का घनत्व अलग होता है: मीथेन ऊपर उठती है, CO बीच में मिलती है, और H2S नीचे बैठती है',
              sat: 'ᱜᱮᱥ ᱨᱮᱭᱟᱜ ᱦᱟᱢᱟᱞ ᱵᱷᱮᱜᱟᱨ ᱜᱮᱭᱟ: ᱢᱤᱛᱷᱮᱱ ᱪᱮᱛᱟᱱ ᱨᱟᱠᱟᱵ-ᱟ ᱟᱨ H2S ᱞᱟᱛᱟᱨ ᱨᱮ ᱛᱟᱦᱮᱸᱱᱟ'
            }
          },
          {
            id: 'opt_2',
            text: {
              en: 'All gases stay strictly in the middle of any tank',
              hi: 'सभी गैसें हमेशा केवल बीच में ही रहती हैं',
              sat: 'ᱡᱚᱛᱚ ᱜᱮᱥ ᱠᱷᱟᱹᱞᱤ ᱛᱟᱞᱟ ᱨᱮ ᱛᱟᱦᱮᱸᱱᱟ'
            }
          },
          {
            id: 'opt_3',
            text: {
              en: 'Only to consume extra testing time for compliance records',
              hi: 'केवल कागजी खानापूर्ति के लिए',
              sat: 'ᱠᱷᱟᱹᱞᱤ ᱚᱠᱛᱚ ᱠᱷᱟᱨᱟᱯ ᱞᱟᱹᱜᱤᱫ'
            }
          }
        ],
        correctAnswer: 'opt_1',
        explanation: {
          en: 'Methane (CH4) is lighter than air and collects at the ceiling. Carbon Monoxide is near air density. H2S is heavier than air and puddles in low sumps.',
          hi: 'मीथेन हवा से हल्की होने के कारण ऊपर होती है, जबकि हाइड्रोजन सल्फाइड भारी होने के कारण तल पर जमा होती है।',
          sat: 'ᱢᱤᱛᱷᱮᱱ ᱪᱮᱛᱟᱱ ᱨᱟᱠᱟᱵ-ᱟ ᱟᱨ H2S ᱦᱟᱢᱟᱞ ᱛᱮ ᱞᱟᱛᱟᱨ ᱨᱮ ᱛᱟᱦᱮᱸᱱᱟ, ᱚᱱᱟᱛᱮ ᱯᱮᱭᱟ ᱴᱷᱟᱶ ᱨᱮ ᱡᱟᱸᱪ ᱞᱟᱹᱠᱛᱤ ᱠᱟᱱᱟ᱾'
        }
      },
      {
        id: 'g4_q2',
        prompt: {
          en: 'What is the absolute golden rule for the designated Standby Attendant outside a confined space during an emergency?',
          hi: 'आपातकाल के दौरान सीमित स्थान के बाहर तैनात स्टैंडबाय अटेंडेंट का परम नियम क्या है?',
          sat: 'ᱥᱟᱸᱠᱲᱟ ᱡᱟᱭᱜᱟ ᱵᱟᱦᱨᱮ ᱨᱮ ᱛᱟᱦᱮᱸᱱ ᱜᱟᱛᱮ ᱞᱟᱹᱜᱤᱫ ᱡᱚᱛᱚ ᱠᱷᱚᱱ ᱢᱟᱨᱟᱝ ᱱᱤᱭᱟᱹᱢ ᱫᱚ ᱪᱮᱫ ᱠᱟᱱᱟ?'
        },
        options: [
          {
            id: 'opt_a',
            text: {
              en: 'NEVER enter the confined space; initiate external rescue summoning and mechanical retrieval winch',
              hi: 'कभी भी अंदर न कूदें; तुरंत बचाव दल को बुलाएं और बाहर से विंच द्वारा साथी को खींचें',
              sat: 'ᱮᱠᱟᱞ ᱵᱷᱤᱛᱨᱤ ᱟᱞᱚᱢ ᱵᱚᱞᱚᱱᱟ; ᱵᱟᱦᱨᱮ ᱠᱷᱚᱱ ᱜᱮ ᱴᱨᱟᱭᱯᱚᱰ ᱣᱤᱧᱪ ᱛᱮ ᱜᱟᱛᱮ ᱚᱨ ᱩᱰᱩᱠ ᱢᱮ'
            }
          },
          {
            id: 'opt_b',
            text: {
              en: 'Jump inside immediately without breathing apparatus to drag the worker out',
              hi: 'बिना श्वसन उपकरण के तुरंत अंदर कूदें',
              sat: 'ᱵᱤᱱ ᱥᱟᱢᱟᱱ ᱛᱮ ᱞᱚᱜᱚᱱ ᱵᱷᱤᱛᱨᱤ ᱵᱚᱞᱚᱱ'
            }
          },
          {
            id: 'opt_c',
            text: {
              en: 'Leave the post to go search for a flashlight in the warehouse',
              hi: 'अपनी पोस्ट छोड़कर टॉर्च खोजने चले जाएं',
              sat: 'ᱡᱟᱭᱜᱟ ᱵᱟᱹᱜᱤ ᱠᱟᱛᱮ ᱥᱮᱱᱚᱜ'
            }
          }
        ],
        correctAnswer: 'opt_a',
        explanation: {
          en: 'Over 60% of confined space fatalities are would-be rescuers entering without equipment. The attendant must initiate non-entry rescue and call emergency teams.',
          hi: '60% से अधिक मौतें बचाने वालों की होती हैं जो बिना उपकरण अंदर कूद जाते हैं। अटेंडेंट को बाहर रहकर ही बचाव करना चाहिए।',
          sat: 'ᱵᱤᱱ ᱥᱟᱢᱟᱱ ᱛᱮ ᱵᱚᱞᱚ ᱞᱮᱱᱠᱷᱟᱱ ᱵᱟᱧᱪᱟᱣᱤᱡ ᱦᱚᱸᱭ ᱵᱮᱦᱚᱥᱚᱜ-ᱟ᱾ ᱵᱟᱦᱨᱮ ᱠᱷᱚᱱ ᱜᱮ ᱣᱤᱧᱪ ᱛᱮ ᱚᱨ ᱩᱰᱩᱠ ᱢᱮ᱾'
        }
      }
    ]
  },
  {
    chapterId: 5,
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
    questionsCount: 2,
    passingPercentage: 50,
    color: '#8B5CF6',
    questions: [
      {
        id: 'g5_q1',
        prompt: {
          en: 'When evacuating from a heavy gas leak (such as chlorine or propane), what is the safest directional movement?',
          hi: 'भारी गैस रिसाव (जैसे प्रोपेन या क्लोरीन) से बाहर निकलते समय सबसे सुरक्षित दिशा कौन सी है?',
          sat: 'ᱦᱟᱢᱟᱞ ᱜᱮᱥ ᱞᱤᱠ ᱚᱠᱛᱚ ᱚᱠᱟ ᱫᱤᱥᱟᱹ ᱛᱮ ᱫᱟᱹᱲ ᱡᱚᱛᱚ ᱠᱷᱚᱱ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱜᱮᱭᱟ?'
        },
        options: [
          {
            id: 'opt_1',
            text: {
              en: 'Move cross-wind and up-slope towards designated higher ground',
              hi: 'हवा के प्रवाह की दिशा के लंबवत (Cross-wind) और ऊंची जमीन की ओर बढ़ें',
              sat: 'ᱦᱚᱭ ᱩᱞᱴᱟᱹ (Cross-wind) ᱟᱨ ᱪᱮᱛᱟᱱ ᱩᱥᱩᱞ ᱡᱟᱭᱜᱟ ᱥᱮᱫ ᱫᱟᱹᱲ ᱢᱮ'
            }
          },
          {
            id: 'opt_2',
            text: {
              en: 'Run downwind in the exact direction the gas plume travels',
              hi: 'हवा की दिशा में नीचे की ओर भागें',
              sat: 'ᱦᱚᱭ ᱥᱮᱱᱚᱜ ᱠᱟᱱ ᱫᱤᱥᱟᱹ ᱛᱮ ᱫᱟᱹᱲ'
            }
          },
          {
            id: 'opt_3',
            text: {
              en: 'Crawl into underground storm drains or basement trenches',
              hi: 'तहखाने या नाले में छुप जाएं',
              sat: 'ᱠᱷᱟᱫᱟᱱ ᱞᱟᱛᱟᱨ ᱜᱟᱰᱟ ᱨᱮ ᱩᱠᱩ'
            }
          }
        ],
        correctAnswer: 'opt_1',
        explanation: {
          en: 'Heavy gases follow the wind and settle in low-lying depressions. Moving cross-wind (perpendicular) and uphill extracts workers from the toxic vapor path quickly.',
          hi: 'भारी गैसें हवा के साथ नीचे गड्ढों में बहती हैं। हमेशा हवा के समकोण (Cross-wind) और ऊंचाई की ओर जाएं।',
          sat: 'ᱦᱟᱢᱟᱞ ᱜᱮᱥ ᱞᱟᱛᱟᱨ ᱡᱟᱭᱜᱟ ᱨᱮ ᱡᱟᱣᱨᱟᱜ-ᱟ, ᱚᱱᱟᱛᱮ ᱦᱚᱭ ᱩᱞᱴᱟᱹ ᱟᱨ ᱩᱥᱩᱞ ᱡᱟᱭᱜᱟ ᱥᱮᱱᱚᱜ ᱞᱟᱹᱠᱛᱤ ᱠᱟᱱᱟ᱾'
        }
      },
      {
        id: 'g5_q2',
        prompt: {
          en: 'In industrial safety, what is the primary purpose of an Emergency Escape Breathing Apparatus (EEBA)?',
          hi: 'औद्योगिक सुरक्षा में आपातकालीन एस्केप ब्रीदिंग उपकरण (EEBA) का मुख्य उद्देश्य क्या है?',
          sat: 'ᱠᱟᱹᱨᱜᱟᱲ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱨᱮ EEBA ᱮᱥᱠᱮᱯ ᱢᱟᱥᱠ ᱨᱮᱭᱟᱜ ᱢᱩᱬᱩᱛ ᱠᱟᱹᱢᱤ ᱪᱮᱫ ᱠᱟᱱᱟ?'
        },
        options: [
          {
            id: 'opt_a',
            text: {
              en: 'Provide 5 to 15 minutes of breathable air exclusively for self-rescue evacuation',
              hi: 'केवल स्वयं को सुरक्षित बाहर निकालने के लिए 5 से 15 मिनट की स्वच्छ हवा प्रदान करना',
              sat: 'ᱵᱤᱯᱚᱫᱽ ᱠᱷᱚᱱ ᱩᱰᱩᱠᱚᱜ ᱞᱟᱹᱜᱤᱫ ᱕ ᱠᱷᱚᱱ ᱑᱕ ᱴᱤᱯᱤᱲ ᱥᱟᱦᱮᱫ ᱦᱟᱛᱟᱣ ᱦᱚᱭ ᱮᱢ'
            }
          },
          {
            id: 'opt_b',
            text: {
              en: 'Perform prolonged 4-hour chemical tank repairs',
              hi: 'टैंक के अंदर 4 घंटे तक काम करना',
              sat: '᱔ ᱴᱟᱲᱟᱝ ᱫᱷᱟᱹᱵᱤᱡ ᱠᱟᱹᱢᱤ ᱞᱟᱹᱜᱤᱫ'
            }
          },
          {
            id: 'opt_c',
            text: {
              en: 'Filter dust while sweeping conveyor belts',
              hi: 'धूल से बचने के लिए सामान्य रूप से पहनना',
              sat: 'ᱥᱟᱫᱷᱟᱨᱚᱱ ᱫᱷᱩᱲᱤ ᱠᱷᱚᱱ ᱵᱟᱧᱪᱟᱣ'
            }
          }
        ],
        correctAnswer: 'opt_a',
        explanation: {
          en: 'EEBA cylinders contain limited air (5-15 minutes). They are strictly escape devices, never to be used for working or conducting rescue operations in hazardous areas.',
          hi: 'EEBA केवल आपातकालीन निकास के लिए 5-15 मिनट की हवा देता है। इसका उपयोग काम करने के लिए कभी नहीं किया जा सकता।',
          sat: 'EEBA ᱫᱚ ᱠᱷᱟᱹᱞᱤ ᱵᱤᱯᱚᱫᱽ ᱠᱷᱚᱱ ᱫᱟᱹᱲ ᱩᱰᱩᱠᱚᱜ ᱞᱟᱹᱜᱤᱫ ᱕-᱑᱕ ᱴᱤᱯᱤᱲ ᱦᱚᱭ ᱮᱢᱟ, ᱠᱟᱹᱢᱤ ᱞᱟᱹᱜᱤᱫ ᱵᱟᱝ ᱠᱟᱱᱟ᱾'
        }
      }
    ]
  }
];

// Helper to get assessments by module
export const getChapterAssessments = (moduleId: string = '1'): ChapterAssessmentItem[] => {
  const normId = normalizeModuleId(moduleId);
  if (normId === '1') {
    return FIRE_CHAPTER_ASSESSMENTS;
  }
  if (normId === '2') {
    return GAS_CHAPTER_ASSESSMENTS;
  }
  return [];
};

// Backwards compatibility export
export const CHAPTER_ASSESSMENTS = FIRE_CHAPTER_ASSESSMENTS;
