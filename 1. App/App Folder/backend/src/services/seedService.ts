import bcrypt from 'bcryptjs';
import { Organization } from '../models/Organization';
import { User } from '../models/User';
import { TrainingModule } from '../models/TrainingModule';
import { Lesson } from '../models/Lesson';
import { Assessment } from '../models/Assessment';
import { Notification } from '../models/Notification';
import { Certificate } from '../models/Certificate';
import {
  SECTORS,
  USER_ROLES,
  USER_STATUS,
  MODULE_CATEGORIES,
  DIFFICULTY_LEVELS,
  QUESTION_TYPES,
  NOTIFICATION_TYPES
} from '@parishak/shared';
import { logger } from '../utils/logger';

export const seedDatabase = async () => {
  try {
    logger.info('Starting database seeding...');

    // 1. Seed Organization
    let org = await Organization.findOne({ code: 'BMSC-MIN' });
    if (!org) {
      org = await Organization.create({
        name: 'Bharat Minerals & Steel Heavy Industries',
        code: 'BMSC-MIN',
        sector: SECTORS.MINING,
        contactEmail: 'safety@bmsc-heavy.com',
        activeWorkersCount: 1420,
        complianceTargetPercentage: 98
      });
      logger.info(`Seeded Organization: ${org.name}`);
    }

    // 2. Seed Users (Demo Worker & Demo Admin)
    const passwordHash = await bcrypt.hash('Safety@2026', 10);

    let worker = await User.findOne({ workerId: 'WRK-1001' });
    if (!worker) {
      worker = await User.create({
        workerId: 'WRK-1001',
        fullName: 'Rajesh Kumar Soren',
        phone: '+919876543210',
        email: 'rajesh.soren@worker.parishak.safety',
        passwordHash,
        organizationId: org._id,
        sector: SECTORS.MINING,
        jobRole: 'Underground Heavy Equipment Operator',
        experienceYears: 6,
        preferredLanguage: 'en',
        role: USER_ROLES.WORKER,
        status: USER_STATUS.ACTIVE,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
      });
      logger.info(`Seeded Demo Worker: ${worker.workerId} (${worker.fullName})`);
    }

    let admin = await User.findOne({ workerId: 'ADM-9001' });
    if (!admin) {
      admin = await User.create({
        workerId: 'ADM-9001',
        fullName: 'Dr. Anita Roy',
        phone: '+919811223344',
        email: 'admin@parishak.safety',
        passwordHash,
        organizationId: org._id,
        sector: SECTORS.GENERAL,
        jobRole: 'Director of Occupational Safety & Compliance',
        experienceYears: 14,
        preferredLanguage: 'en',
        role: USER_ROLES.ADMIN,
        status: USER_STATUS.ACTIVE,
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
      });
      logger.info(`Seeded Demo Admin: ${admin.workerId} (${admin.fullName})`);
    }

    // 3. Define 5 Modules with multilingual titles & descriptions
    const modulesData = [
      {
        moduleNumber: 1,
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
        sector: SECTORS.MINING,
        category: MODULE_CATEGORIES.FIRE_SAFETY,
        estimatedDurationMinutes: 30,
        difficulty: DIFFICULTY_LEVELS.BEGINNER,
        iconName: 'flame',
        thumbnailUrl: 'https://images.unsplash.com/photo-1599423300746-b62533397364?w=600',
        passingScore: 75,
        lessonsCount: 3
      },
      {
        moduleNumber: 2,
        title: {
          en: 'Gas Leak & Confined Space Protocol',
          hi: 'गैस रिसाव एवं सीमित स्थान प्रोटोकॉल',
          sat: 'ᱜᱮᱥ ᱞᱤᱠ ᱟᱨ ᱥᱟᱸᱠᱲᱟ ᱡᱟᱭᱜᱟ ᱨᱩᱠᱷᱤᱭᱟᱹ'
        },
        description: {
          en: 'Hazardous gas detection, Lower Explosive Limit (LEL) monitoring, mandatory buddy systems, and abort procedures.',
          hi: 'खतरनाक गैसों की जांच, विस्फोट सीमा निगरानी, बडी सिस्टम और आपातकालीन निकास प्रक्रिया।',
          sat: 'ᱵᱤᱥ ᱜᱮᱥ ᱪᱤᱱᱦᱟᱹᱣ, ᱵᱟᱰᱤ ᱥᱤᱥᱴᱚᱢ ᱟᱨ ᱞᱚᱜᱚᱱ ᱩᱰᱩᱠ ᱱᱤᱭᱟᱹᱢ ᱪᱮᱫ।'
        },
        sector: SECTORS.MINING,
        category: MODULE_CATEGORIES.GAS_SAFETY,
        estimatedDurationMinutes: 35,
        difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
        iconName: 'wind',
        thumbnailUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600',
        passingScore: 80,
        lessonsCount: 3
      },
      {
        moduleNumber: 3,
        title: {
          en: 'Machinery Safety & Lockout/Tagout (LOTO)',
          hi: 'मशीनरी सुरक्षा एवं लॉकआउट/टैगआउट (LOTO)',
          sat: 'ᱢᱤᱥᱤᱱ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱟᱨ ᱞᱚᱠ-ᱟᱣᱩᱴ ᱯᱨᱚᱬᱟᱞᱤ'
        },
        description: {
          en: 'Zero energy isolation, mechanical pinch-point hazard awareness, safe operating clearance, and emergency stop deployment.',
          hi: 'शून्य ऊर्जा स्थिति, खतरनाक घूमने वाले पुर्जों से दूरी, लॉकआउट/टैगआउट और इमरजेंसी स्टॉप का उपयोग।',
          sat: 'ᱢᱤᱥᱤᱱ ᱵᱚᱸᱫᱽ ᱠᱟᱛᱮ ᱪᱟᱹᱵᱷᱤ ᱞᱟᱜᱟᱣ ᱟᱨ ᱮᱢᱟᱨᱡᱮᱱᱥᱤ ᱥᱴᱚᱯ ᱵᱮᱵᱷᱟᱨ।'
        },
        sector: SECTORS.STEEL,
        category: MODULE_CATEGORIES.MACHINERY,
        estimatedDurationMinutes: 25,
        difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
        iconName: 'settings',
        thumbnailUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=600',
        passingScore: 70,
        lessonsCount: 2
      },
      {
        moduleNumber: 4,
        title: {
          en: 'Personal Protective Equipment (PPE)',
          hi: 'व्यक्तिगत सुरक्षा उपकरण (PPE)',
          sat: 'ᱱᱤᱡᱮᱨᱟᱜ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱥᱟᱢᱟᱱ (PPE)'
        },
        description: {
          en: 'Standards and proper fitting for hard hats, steel-toe footwear, respirators, chemical gloves, and high-decibel hearing defense.',
          hi: 'हेलमेट, सुरक्षा जूते, श्वास मास्क, दस्ताने और श्रवण सुरक्षा के सही चयन एवं रख-रखाव के नियम।',
          sat: 'ᱦᱮᱞᱢᱮᱴ, ᱵᱩᱴ, ᱜᱞᱚᱵᱽᱥ ᱟᱨ ᱢᱟᱥᱠ ᱥᱟᱹᱦᱤᱡ ᱦᱚᱨᱚᱜ ᱛᱚᱦᱚᱨ।'
        },
        sector: SECTORS.MICA,
        category: MODULE_CATEGORIES.PPE,
        estimatedDurationMinutes: 20,
        difficulty: DIFFICULTY_LEVELS.BEGINNER,
        iconName: 'hard-hat',
        thumbnailUrl: 'https://images.unsplash.com/photo-1578885136359-16c8bd4d3a8e?w=600',
        passingScore: 70,
        lessonsCount: 2
      },
      {
        moduleNumber: 5,
        title: {
          en: 'Emergency Evacuation & First Response',
          hi: 'आपातकालीन निकासी एवं प्राथमिक प्रतिक्रिया',
          sat: 'ᱮᱢᱟᱨᱡᱮᱱᱥᱤ ᱩᱰᱩᱠ ᱟᱨ ᱯᱩᱭᱞᱩ ᱜᱚᱲᱚ'
        },
        description: {
          en: 'Siren code comprehension, secondary route navigation, casualty triage principles, muster roll accountability, and chain-of-command reporting.',
          hi: 'सायरन कोड, द्वितीयक निकास मार्ग, प्राथमिक उपचार सिद्धांत, असेंबली पॉइंट गणना और घटना रिपोर्टिंग।',
          sat: 'ᱥᱟᱭᱨᱮᱱ ᱟᱧᱡᱚᱢ ᱠᱟᱛᱮ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱡᱟᱭᱜᱟ ᱥᱮᱱᱚᱜ ᱟᱨ ᱜᱚᱲᱚ ᱮᱢ।'
        },
        sector: SECTORS.GENERAL,
        category: MODULE_CATEGORIES.EMERGENCY,
        estimatedDurationMinutes: 30,
        difficulty: DIFFICULTY_LEVELS.ADVANCED,
        iconName: 'alert-triangle',
        thumbnailUrl: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600',
        passingScore: 75,
        lessonsCount: 2
      }
    ];

    for (const modData of modulesData) {
      let mod = await TrainingModule.findOne({ moduleNumber: modData.moduleNumber });
      if (!mod) {
        mod = await TrainingModule.create(modData);
        logger.info(`Seeded Module ${mod.moduleNumber}: ${mod.title.en}`);
      }

      // Seed Lessons for Module 1
      if (mod.moduleNumber === 1) {
        const existingLessons = await Lesson.countDocuments({ moduleId: mod._id });
        if (existingLessons === 0) {
          await Lesson.create([
            {
              moduleId: mod._id,
              order: 1,
              title: {
                en: 'Fire Recognition & Classification (A, B, C, D, K)',
                hi: 'अग्नि पहचान एवं श्रेणियां (A, B, C, D, K)',
                sat: 'ᱥᱮᱸᱜᱮᱞ ᱦᱟᱹᱴᱤᱧ ᱪᱤᱱᱦᱟᱹᱣ'
              },
              description: {
                en: 'Understand what fuels different industrial fires and why applying water to Class B or C fires causes catastrophic explosion.',
                hi: 'जानें कि विभिन्न आग कैसे लगती है और तेल या बिजली की आग पर पानी डालने से भयानक विस्फोट क्यों होता है।',
                sat: 'ᱥᱮᱸᱜᱮᱞ ᱪᱮᱫ ᱛᱮ ᱞᱟᱜᱟᱣᱜ ᱠᱟᱱᱟ ᱟᱨ ᱫᱟᱜ ᱫᱩᱞ ᱨᱮᱭᱟᱜ ᱵᱤᱯᱚᱫᱽ ᱵᱩᱡᱷᱟᱹᱣ।'
              },
              durationMinutes: 10,
              keySafetyPoints: [
                {
                  id: 'kp1',
                  title: {
                    en: 'Class A: Ordinary Combustibles',
                    hi: 'क्लास A: सामान्य ठोस वस्तुएं',
                    sat: 'ᱠᱞᱟᱥ A: ᱥᱟᱫᱷᱟᱨᱚᱱ ᱡᱤᱱᱤᱥ'
                  },
                  description: {
                    en: 'Wood, cloth, paper, rubber, and coal dust. Use Water, Foam, or Multi-purpose Dry Chemical.',
                    hi: 'लकड़ी, कपड़ा, कागज, कोयला। पानी या फोम का उपयोग करें।',
                    sat: 'ᱠᱟᱴ, ᱞᱩᱜᱽᱲᱤ, ᱠᱚᱭᱞᱟ ᱨᱮ ᱥᱮᱸᱜᱮᱞ।'
                  },
                  icon: 'box'
                },
                {
                  id: 'kp2',
                  title: {
                    en: 'Class B: Flammable Liquids & Gases',
                    hi: 'क्लास B: ज्वलनशील तरल एवं गैस',
                    sat: 'ᱠᱞᱟᱥ B: ᱥᱩᱱᱩᱢ ᱟᱨ ᱜᱮᱥ'
                  },
                  description: {
                    en: 'Diesel, solvents, gasoline, propane. NEVER USE WATER! Use CO2 or Dry Chemical.',
                    hi: 'डीजल, पेंट, सॉल्वेंट। कभी पानी न डालें! CO2 या ड्राई केमिकल का प्रयोग करें।',
                    sat: 'ᱰᱤᱡᱮᱞ, ᱯᱮᱴᱨᱚᱞ ᱨᱮ ᱫᱟᱜ ᱟᱞᱚᱯᱮ ᱫᱩᱞᱟ!'
                  },
                  icon: 'droplet'
                },
                {
                  id: 'kp3',
                  title: {
                    en: 'Class C: Energized Electrical Equipment',
                    hi: 'क्लास C: बिजली उपकरण',
                    sat: 'ᱠᱞᱟᱥ C: ᱵᱤᱡᱽᱞᱤ ᱥᱟᱢᱟᱱ'
                  },
                  description: {
                    en: 'Motors, transformers, switchboards. Water conducts electrocution. De-energize and use CO2/Clean Agent.',
                    hi: 'मोटर, पैनल, ट्रांसफार्मर। करंट से बचने के लिए पानी न डालें।',
                    sat: 'ᱠᱟᱨᱮᱱᱴ ᱵᱚᱸᱫᱽ ᱠᱟᱛᱮ CO2 ᱵᱮᱵᱷᱟᱨ ᱢᱮ।'
                  },
                  icon: 'zap'
                }
              ],
              contentBlocks: [
                {
                  type: 'SAFETY_WARNING',
                  title: {
                    en: 'CRITICAL HAZARD: Oil & Electrical Fires',
                    hi: 'गंभीर चेतावनी: तेल और बिजली की आग',
                    sat: 'ᱢᱟᱨᱟᱝ ᱪᱮᱛᱟᱣᱱᱤ: ᱥᱩᱱᱩᱢ ᱟᱨ ᱵᱤᱡᱽᱞᱤ'
                  },
                  body: {
                    en: 'Spraying water on burning fuel causes violent steam explosion, spreading flaming droplets hundreds of feet across the facility.',
                    hi: 'जलते हुए तेल पर पानी फेंकने से भाप का तेज धमाका होता है और जलती आग चारों तरफ फैल जाती है।',
                    sat: 'ᱥᱩᱱᱩᱢ ᱥᱮᱸᱜᱮᱞ ᱨᱮ ᱫᱟᱜ ᱫᱩᱞ ᱞᱮᱠᱷᱟᱱ ᱵᱤᱥᱯᱷᱚᱴ ᱦᱩᱭᱩᱜ-ᱟ ᱟᱨ ᱥᱮᱸᱜᱮᱞ ᱯᱟᱥᱱᱟᱣᱜ-ᱟ।'
                  }
                },
                {
                  type: 'TEXT',
                  title: {
                    en: 'The Fire Triangle & Fire Tetrahedron',
                    hi: 'फायर ट्रायंगल (अग्नि त्रिकोण)',
                    sat: 'ᱥᱮᱸᱜᱮᱞ ᱨᱮᱭᱟᱜ ᱯᱮ ᱠᱳᱬ'
                  },
                  body: {
                    en: 'Fire requires three elements to ignite and sustain: Fuel, Oxygen (min 16%), and Heat (ignition source). In modern industrial safety, the continuous chemical chain reaction represents the 4th element (Tetrahedron). Extinguishing works by removing any one element.',
                    hi: 'आग लगने के लिए तीन चीजें आवश्यक हैं: ईंधन, ऑक्सीजन और ऊष्मा। इनमे से किसी एक को भी हटाने से आग बुझ जाती है।',
                    sat: 'ᱥᱮᱸᱜᱮᱞ ᱞᱟᱹᱜᱤᱫ ᱯᱮᱭᱟ ᱡᱤᱱᱤᱥ ᱞᱟᱹᱠᱛᱤ: ᱡᱩᱞᱩᱜ ᱥᱟᱢᱟᱱ, ᱦᱚᱭ ᱟᱨ ᱞᱚᱞᱚ।'
                  }
                }
              ],
              checklist: [
                'Identify combustible material source',
                'Verify fire class (A, B, C, D, K)',
                'Select designated extinguisher color code',
                'Confirm clear exit path behind you'
              ]
            },
            {
              moduleId: mod._id,
              order: 2,
              title: {
                en: 'The PASS Technique: Step-by-Step Extinguisher Operation',
                hi: 'PASS तकनीक: अग्निशामक चलाने की सही विधि',
                sat: 'PASS ᱛᱚᱦᱚᱨ: ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱢᱤᱥᱤᱱ ᱪᱟᱞᱟᱣ'
              },
              description: {
                en: 'Master the 4-step PASS procedure: Pull pin, Aim nozzle at base, Squeeze lever, Sweep side-to-side.',
                hi: 'चार चरणों वाली PASS विधि सीखें: पिन खींचें, आग की जड़ पर निशाना लगाएं, हैंडल दबाएं, दायें-बायें घुमाएं।',
                sat: 'ᱯᱩᱱᱭᱟ ᱛᱟᱞᱟ ᱨᱮ ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱪᱮᱫ।'
              },
              durationMinutes: 10,
              keySafetyPoints: [
                {
                  id: 'pass_p',
                  title: {
                    en: 'P - Pull the Pin',
                    hi: 'P - सेफ्टी पिन खींचें',
                    sat: 'P - ᱯᱤᱱ ᱚᱨ ᱩᱰᱩᱠ'
                  },
                  description: {
                    en: 'Break the plastic tamper seal and pull the locking pin straight out.',
                    hi: 'प्लास्टिक सील तोड़ें और पिन को बाहर खींचें।',
                    sat: 'ᱥᱤᱞ ᱨᱟᱹᱯᱩᱫ ᱠᱟᱛᱮ ᱯᱤᱱ ᱚᱨ ᱢᱮ।'
                  },
                  icon: 'unlock'
                },
                {
                  id: 'pass_a',
                  title: {
                    en: 'A - Aim at Base of Fire',
                    hi: 'A - आग की जड़ पर निशाना लगाएं',
                    sat: 'A - ᱥᱮᱸᱜᱮᱞ ᱯᱷᱮᱰ ᱨᱮ ᱱᱤᱥᱟᱱᱟ'
                  },
                  description: {
                    en: 'Aim at the source of fuel, NOT into the rising flames or smoke.',
                    hi: 'धुएं पर नहीं, आग के मुख्य आधार पर निशाना लगाएं।',
                    sat: 'ᱪᱮᱛᱟᱱ ᱫᱷᱩᱶᱟᱹ ᱨᱮ ᱵᱟᱝ, ᱞᱟᱛᱟᱨ ᱨᱮ ᱱᱤᱥᱟᱱᱟ ᱢᱮ।'
                  },
                  icon: 'crosshair'
                },
                {
                  id: 'pass_s1',
                  title: {
                    en: 'S - Squeeze the Operating Lever',
                    hi: 'S - हैंडल को धीरे-धीरे दबाएं',
                    sat: 'S - ᱦᱮᱱᱰᱮᱞ ᱞᱤᱱ ᱢᱮ'
                  },
                  description: {
                    en: 'Squeeze smoothly to release the extinguishing agent under pressure.',
                    hi: 'अग्निशामक गैस/पाउडर छोड़ने के लिए लीवर दबाएं।',
                    sat: 'ᱜᱮᱥ ᱩᱰᱩᱠ ᱞᱟᱹᱜᱤᱫ ᱦᱮᱱᱰᱮᱞ ᱞᱤᱱ ᱢᱮ।'
                  },
                  icon: 'hand'
                },
                {
                  id: 'pass_s2',
                  title: {
                    en: 'S - Sweep Side-to-Side',
                    hi: 'S - दायें-बायें घुमाते हुए बुझाएं',
                    sat: 'S - ᱞᱮᱸᱜᱟ-ᱡᱚᱡᱚᱢ ᱦᱤᱞᱟᱹᱣ ᱢᱮ'
                  },
                  description: {
                    en: 'Sweep 6-8 feet away from the base until flames are completely suffocated.',
                    hi: '6 से 8 फीट दूर रहकर आग पूरी तरह बुझने तक दायें-बायें छिड़काव करें।',
                    sat: '᱖-᱘ ᱯᱷᱩᱴ ᱥᱟᱺᱜᱤᱧ ᱠᱷᱚᱱ ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱢᱮ।'
                  },
                  icon: 'move'
                }
              ],
              contentBlocks: [
                {
                  type: 'STEP',
                  title: {
                    en: 'PASS Protocol Breakdown',
                    hi: 'PASS प्रक्रिया का विवरण',
                    sat: 'PASS ᱯᱨᱚᱬᱟᱞᱤ ᱵᱤᱵᱚᱨᱚᱬ'
                  },
                  body: {
                    en: 'Maintain a minimum safe distance of 2 to 3 meters (6-10 feet). If the fire grows larger than a standard waste bin, ABORT extinguishing immediately, close the fire door, and evacuate.',
                    hi: 'हमेशा 2 से 3 मीटर की सुरक्षित दूरी बनाए रखें। यदि आग बड़ी हो जाए तो तुरंत बुझाना बंद कर बाहर निकलें।',
                    sat: '᱒-᱓ ᱢᱤᱴᱟᱨ ᱥᱟᱺᱜᱤᱧ ᱨᱮ ᱛᱟᱦᱮᱸᱱ ᱢᱮ᱾ ᱥᱮᱸᱜᱮᱞ ᱢᱟᱨᱟᱝ ᱞᱮᱱᱠᱷᱟᱱ ᱞᱚᱜᱚᱱ ᱩᱰᱩᱠ ᱢᱮ᱾'
                  }
                }
              ],
              checklist: [
                'Inspect pressure gauge (needle in green zone)',
                'Stand with back towards designated emergency exit',
                'Perform PASS sequence in exact order',
                'Watch for re-ignition after flame dies out'
              ]
            },
            {
              moduleId: mod._id,
              order: 3,
              title: {
                en: 'Emergency Evacuation & Muster Point Protocol',
                hi: 'आपातकालीन निकासी एवं असेंबली पॉइंट प्रक्रिया',
                sat: 'ᱩᱰᱩᱠ ᱰᱟᱦᱟᱨ ᱟᱨ ᱡᱟᱣᱨᱟᱜ ᱡᱟᱭᱜᱟ ᱱᱤᱭᱟᱹᱢ'
              },
              description: {
                en: 'Navigate illuminated exit routes during power cuts, follow acoustic beacon alarms, and check into the safe muster assembly zone.',
                hi: 'लाइट बंद होने पर आपातकालीन लाइटों के सहारे चलें, अलार्म सुनें और असेंबली पॉइंट पर जाकर अपनी हाजिरी दर्ज कराएं।',
                sat: 'ᱵᱤᱡᱽᱞᱤ ᱵᱚᱸᱫᱽ ᱨᱮ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱩᱰᱩᱠ ᱰᱟᱦᱟᱨ ᱛᱮ ᱥᱮᱱ ᱠᱟᱛᱮ ᱦᱟᱡᱤᱨᱤ ᱮᱢ ᱢᱮ।'
              },
              durationMinutes: 10,
              keySafetyPoints: [
                {
                  id: 'evac_alarm',
                  title: {
                    en: 'Continuous Siren: Immediate Evac',
                    hi: 'लगातार सायरन: तुरंत निकासी',
                    sat: 'ᱞᱮᱛᱟᱲ ᱥᱟᱭᱨᱮᱱ: ᱞᱚᱜᱚᱱ ᱩᱰᱩᱠ'
                  },
                  description: {
                    en: 'Stop machinery, drop heavy tools, do not use elevators, follow green running man exit signs.',
                    hi: 'मशीन तुरंत बंद करें, लिफ्ट का उपयोग न करें, हरे निकासी चिन्हों का पालन करें।',
                    sat: 'ᱢᱤᱥᱤᱱ ᱵᱚᱸᱫᱽ ᱢᱮ, ᱞᱤᱯᱷᱴ ᱟᱞᱚᱢ ᱵᱮᱵᱷᱟᱨᱟ, ᱨᱩᱠᱷᱤᱭᱟᱹ ᱰᱟᱦᱟᱨ ᱯᱟᱸᱡᱟᱭ ᱢᱮ।'
                  },
                  icon: 'bell'
                },
                {
                  id: 'evac_muster',
                  title: {
                    en: 'Assembly Muster Roll Call',
                    hi: 'असेंबली पॉइंट पर हाजिरी',
                    sat: 'ᱡᱟᱣᱨᱟᱜ ᱡᱟᱭᱜᱟ ᱨᱮ ᱦᱟᱡᱤᱨᱤ'
                  },
                  description: {
                    en: 'Never leave the assembly area without safety supervisor authorization to prevent false search and rescue deployments.',
                    hi: 'सुपरवाइजर की अनुमति के बिना असेंबली पॉइंट से कहीं न जाएं।',
                    sat: 'ᱥᱩᱯᱚᱨᱵᱷᱟᱭᱡᱚᱨ ᱵᱟᱝ ᱠᱩᱞᱤ ᱠᱟᱛᱮ ᱚᱸᱰᱮ ᱠᱷᱚᱱ ᱟᱞᱚᱢ ᱥᱮᱱᱚᱜ-ᱟ।'
                  },
                  icon: 'users'
                }
              ],
              contentBlocks: [
                {
                  type: 'CALLOUT',
                  title: {
                    en: 'Crawl Low Under Smoke',
                    hi: 'धुएं के नीचे झुककर चलें',
                    sat: 'ᱫᱷᱩᱶᱟᱹ ᱞᱟᱛᱟᱨ ᱛᱮ ᱛᱟᱲᱟᱢ ᱢᱮ'
                  },
                  body: {
                    en: 'Toxic carbon monoxide and heated supergases rise to the ceiling. The cleanest breathable air layer is 1 to 2 feet above the floor.',
                    hi: 'जहरीला धुआं छत की ओर जाता है। सबसे साफ हवा फर्श से 1-2 फीट ऊपर होती है, इसलिए झुककर चलें।',
                    sat: 'ᱵᱤᱥ ᱫᱷᱩᱶᱟᱹ ᱪᱮᱛᱟᱱ ᱨᱟᱠᱟᱵ-ᱟ, ᱞᱟᱛᱟᱨ ᱨᱮ ᱥᱟᱯᱷᱟ ᱦᱚᱭ ᱛᱟᱦᱮᱸᱱᱟ ᱚᱱᱟᱛᱮ ᱜᱩᱰᱩ ᱞᱮᱠᱟ ᱩᱰᱩᱠ ᱢᱮ।'
                  }
                }
              ],
              checklist: [
                'Listen for alarm tone patterns',
                'Keep hands against walls in low visibility',
                'Close fire doors behind you to starve oxygen',
                'Report missing co-workers to safety commander'
              ]
            }
          ]);
          logger.info(`Seeded 3 Lessons for Module 1`);
        }

        // Seed Assessment for Module 1
        let assess = await Assessment.findOne({ moduleId: mod._id });
        if (!assess) {
          assess = await Assessment.create({
            moduleId: mod._id,
            title: {
              en: 'Fire Safety & Extinguisher Mastery Exam',
              hi: 'अग्नि सुरक्षा एवं अग्निशामक दक्षता परीक्षा',
              sat: 'ᱥᱮᱸᱜᱮᱞ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱵᱤᱰᱟᱹᱣ'
            },
            passingScore: 75,
            attemptLimit: 3,
            timeLimitMinutes: 15,
            questions: [
              {
                questionId: 'q1_pass_seq',
                type: QUESTION_TYPES.PROCEDURE_ORDERING,
                question: {
                  en: 'What is the correct sequential order of the PASS fire extinguisher technique?',
                  hi: 'PASS अग्निशामक तकनीक का सही क्रम क्या है?',
                  sat: 'PASS ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱨᱮᱭᱟᱜ ᱥᱟᱹᱦᱤᱡ ᱛᱚᱦᱚᱨ ᱪᱮᱫ ᱠᱟᱱᱟ?'
                },
                options: [
                  {
                    id: 'opt_p',
                    text: {
                      en: 'Pull safety pin',
                      hi: 'पिन खींचें',
                      sat: 'ᱯᱤᱱ ᱚᱨ ᱩᱰᱩᱠ'
                    }
                  },
                  {
                    id: 'opt_a',
                    text: {
                      en: 'Aim nozzle at base of fire',
                      hi: 'आग की जड़ पर निशाना लगाएं',
                      sat: 'ᱞᱟᱛᱟᱨ ᱨᱮ ᱱᱤᱥᱟᱱᱟ'
                    }
                  },
                  {
                    id: 'opt_s1',
                    text: {
                      en: 'Squeeze operating handle',
                      hi: 'लीवर दबाएं',
                      sat: 'ᱦᱮᱱᱰᱮᱞ ᱞᱤᱱ ᱢᱮ'
                    }
                  },
                  {
                    id: 'opt_s2',
                    text: {
                      en: 'Sweep side-to-side',
                      hi: 'दायें-बायें छिड़कें',
                      sat: 'ᱞᱮᱸᱜᱟ-ᱡᱚᱡᱚᱢ ᱦᱤᱞᱟᱹᱣ ᱢᱮ'
                    }
                  }
                ],
                correctAnswer: ['opt_p', 'opt_a', 'opt_s1', 'opt_s2'],
                explanation: {
                  en: 'The universally standardized sequence is Pull the pin, Aim at base, Squeeze handle, Sweep side-to-side.',
                  hi: 'मानक प्रक्रिया है: पिन खींचें (P), निशाना लगाएं (A), दबाएं (S), घुमाएं (S)।',
                  sat: 'ᱥᱟᱹᱦᱤᱡ ᱛᱚᱦᱚᱨ ᱫᱚ: Pull, Aim, Squeeze, Sweep ᱠᱟᱱᱟ।'
                },
                difficulty: DIFFICULTY_LEVELS.BEGINNER,
                competencyDomain: 'procedure',
                weight: 25,
                timeLimitSeconds: 60
              },
              {
                questionId: 'q2_class_b',
                type: QUESTION_TYPES.MCQ,
                question: {
                  en: 'A diesel generator catches fire on the mining conveyor floor. Which action is strictly FORBIDDEN?',
                  hi: 'कन्वेयर बेल्ट पर डीजल जनरेटर में आग लग जाती है। कौन सा कार्य करना सख्त मना है?',
                  sat: 'ᱰᱤᱡᱮᱞ ᱡᱮᱱᱮᱨᱮᱴᱚᱨ ᱨᱮ ᱥᱮᱸᱜᱮᱞ ᱞᱟᱜᱟᱣ ᱮᱱᱟ᱾ ᱪᱮᱫ ᱠᱟᱹᱢᱤ ᱮᱠᱟᱞ ᱵᱟᱝ ᱠᱚᱨᱟᱣ ᱞᱟᱹᱠᱛᱤ?'
                },
                options: [
                  {
                    id: 'opt_water',
                    text: {
                      en: 'Throwing high-pressure water bucket / hose on burning diesel',
                      hi: 'जलते डीजल पर पानी की बाल्टी या पाइप से पानी डालना',
                      sat: 'ᱡᱩᱞᱩᱜ ᱰᱤᱡᱮᱞ ᱪᱮᱛᱟᱱ ᱨᱮ ᱫᱟᱜ ᱫᱩᱞ'
                    }
                  },
                  {
                    id: 'opt_co2',
                    text: {
                      en: 'Discharging a CO2 / Dry Chemical Extinguisher',
                      hi: 'CO2 या ड्राई केमिकल एक्सटिंग्विशर चलाना',
                      sat: 'CO2 ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱵᱮᱵᱷᱟᱨ'
                    }
                  },
                  {
                    id: 'opt_alarm',
                    text: {
                      en: 'Activating the nearest emergency pull station alarm',
                      hi: 'पास का इमरजेंसी अलार्म बजाना',
                      sat: 'ᱮᱢᱟᱨᱡᱮᱱᱥᱤ ᱟᱞᱟᱨᱢ ᱞᱤᱱ ᱢᱮ'
                    }
                  },
                  {
                    id: 'opt_evac',
                    text: {
                      en: 'Evacuating towards the illuminated assembly exit route',
                      hi: 'सुरक्षित निकास मार्ग की ओर निकलना',
                      sat: 'ᱨᱩᱠᱷᱤᱭᱟᱹ ᱰᱟᱦᱟᱨ ᱛᱮ ᱩᱰᱩᱠ'
                    }
                  }
                ],
                correctAnswer: 'opt_water',
                explanation: {
                  en: 'Water applied to burning diesel causes violent steam vaporization, splashing burning liquid and causing flash fires.',
                  hi: 'डीजल पर पानी डालने से भाप का विस्फोट होगा और जलता हुआ ईंधन चारों ओर छिटक जाएगा।',
                  sat: 'ᱰᱤᱡᱮᱞ ᱨᱮ ᱫᱟᱜ ᱫᱩᱞ ᱞᱮᱠᱷᱟᱱ ᱵᱤᱥᱯᱷᱚᱴ ᱦᱩᱭᱩᱜ-ᱟ ᱟᱨ ᱥᱮᱸᱜᱮᱞ ᱯᱟᱥᱱᱟᱣᱜ-ᱟ।'
                },
                difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
                competencyDomain: 'decisionMaking',
                weight: 25,
                timeLimitSeconds: 45
              },
              {
                questionId: 'q3_smoke_nav',
                type: QUESTION_TYPES.TRUE_FALSE,
                question: {
                  en: 'When navigating through dense toxic smoke, you should stand upright at full height to run faster.',
                  hi: 'घने जहरीले धुएं से निकलते समय तेजी से भागने के लिए पूरी ऊंचाई पर सीधा खड़े होकर चलना चाहिए।',
                  sat: 'ᱫᱷᱩᱶᱟᱹ ᱛᱟᱞᱟ ᱨᱮ ᱩᱰᱩᱠᱚᱜ ᱚᱠᱛᱚ ᱥᱚᱡᱷᱮ ᱛᱤᱸᱜᱩ ᱠᱟᱛᱮ ᱫᱟᱹᱲ ᱞᱟᱹᱠᱛᱤ ᱠᱟᱱᱟ?'
                },
                options: [
                  {
                    id: 'opt_true',
                    text: { en: 'True', hi: 'सही', sat: 'ᱥᱟᱹᱨᱤ' }
                  },
                  {
                    id: 'opt_false',
                    text: { en: 'False (Crawl low near the ground)', hi: 'गलत (जमीन के पास झुककर चलें)', sat: 'ᱮᱲᱮ (ᱞᱟᱛᱟᱨ ᱛᱮ ᱛᱟᱲᱟᱢ ᱢᱮ)' }
                  }
                ],
                correctAnswer: 'opt_false',
                explanation: {
                  en: 'Toxic gases and extreme heat rise. The safest breathable air layer is 1-2 feet from the ground.',
                  hi: 'जहरीली गैसें ऊपर उठती हैं। फर्श से 1-2 फीट ऊपर सबसे स्वच्छ हवा होती है।',
                  sat: 'ᱵᱤᱥ ᱫᱷᱩᱶᱟᱹ ᱪᱮᱛᱟᱱ ᱨᱟᱠᱟᱵ-ᱟ, ᱚᱱᱟᱛᱮ ᱞᱟᱛᱟᱨ ᱛᱮ ᱛᱟᱲᱟᱢ ᱞᱟᱹᱠᱛᱤ ᱠᱟᱱᱟ।'
                },
                difficulty: DIFFICULTY_LEVELS.BEGINNER,
                competencyDomain: 'knowledge',
                weight: 25,
                timeLimitSeconds: 30
              },
              {
                questionId: 'q4_muster_action',
                type: QUESTION_TYPES.SCENARIO_DECISION,
                question: {
                  en: 'You have reached the outdoor assembly point after an evacuation. Your friend says his mobile phone is left in the locker room. What must you do?',
                  hi: 'आप सुरक्षित असेंबली पॉइंट पर पहुंच गए हैं। आपका साथी कहता है कि उसका फोन लॉकर में छूट गया है। आप क्या करेंगे?',
                  sat: 'ᱟᱢ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱡᱟᱭᱜᱟ ᱮᱢ ᱥᱮᱴᱮᱨ ᱮᱱᱟ᱾ ᱜᱟᱛᱮᱭ ᱢᱮᱱᱮᱫ-ᱟ ᱯᱷᱚᱱ ᱵᱟᱹᱜᱤ ᱟᱠᱟᱱᱟ᱾ ᱟᱢ ᱪᱮᱫ ᱮᱢ ᱢᱮᱛᱟᱭᱟ?'
                },
                options: [
                  {
                    id: 'opt_refuse_stay',
                    text: {
                      en: 'Strictly prohibit him from re-entering and ensure he stays for headcount verification',
                      hi: 'उसे अंदर जाने से रोकें और सुनिश्चित करें कि वह हाजिरी के लिए असेंबली पॉइंट पर ही रहे',
                      sat: 'ᱵᱷᱤᱛᱨᱤ ᱵᱚᱞᱚ ᱢᱟᱱᱟ ᱠᱟᱛᱮ ᱦᱟᱡᱤᱨᱤ ᱡᱟᱭᱜᱟ ᱨᱮ ᱛᱟᱦᱮᱸᱱ ᱞᱟᱹᱜᱤᱫ ᱢᱮᱛᱟᱭ ᱢᱮ'
                    }
                  },
                  {
                    id: 'opt_go_together',
                    text: {
                      en: 'Quickly accompany him inside before firefighters arrive',
                      hi: 'फायर ब्रिगेड आने से पहले जल्दी से उसके साथ अंदर जाएं',
                      sat: 'ᱞᱚᱜᱚᱱ ᱩᱱᱤ ᱥᱟᱶ ᱵᱷᱤᱛᱨᱤ ᱥᱮᱱᱚᱜ'
                    }
                  },
                  {
                    id: 'opt_leave_home',
                    text: {
                      en: 'Walk away home since evacuation is done',
                      hi: 'घर चले जाएं क्योंकि आप बाहर आ चुके हैं',
                      sat: 'ᱚᱲᱟᱜ ᱪᱟᱞᱟᱣ ᱜᱚᱫᱚᱜ'
                    }
                  }
                ],
                correctAnswer: 'opt_refuse_stay',
                explanation: {
                  en: 'Never re-enter a burning facility under any circumstance. Missing persons trigger hazardous search-and-rescue operations.',
                  hi: 'किसी भी वस्तु के लिए जलती इमारत में दोबारा न जाएं। लापता होने से बचाव दल का जीवन खतरे में पड़ता है।',
                  sat: 'ᱪᱮᱫ ᱡᱤᱱᱤᱥ ᱞᱟᱹᱜᱤᱫ ᱦᱚᱸ ᱥᱮᱸᱜᱮᱞ ᱵᱷᱤᱛᱨᱤ ᱟᱞᱚᱢ ᱵᱚᱞᱚᱱᱟ᱾'
                },
                difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
                competencyDomain: 'safetyCompliance',
                weight: 25,
                timeLimitSeconds: 45
              }
            ]
          });
          logger.info(`Seeded Assessment for Module 1`);
        }
      }

      // Seed Lessons and Assessment for Module 2, 3, 4, 5
      if (mod.moduleNumber === 2) {
        const existingLessons = await Lesson.countDocuments({ moduleId: mod._id });
        if (existingLessons === 0) {
          await Lesson.create([
            {
              moduleId: mod._id,
              order: 1,
              title: {
                en: 'Atmospheric Hazards & Multi-Gas Detection',
                hi: 'वायुमंडलीय खतरे एवं मल्टी-गैस डिटेक्टर',
                sat: 'ᱦᱚᱭ ᱨᱮ ᱵᱤᱥ ᱜᱮᱥ ᱟᱨ ᱰᱤᱴᱮᱠᱴᱚᱨ ᱵᱮᱵᱷᱟᱨ'
              },
              description: {
                en: 'Detect Methane (CH4), Carbon Monoxide (CO), Hydrogen Sulfide (H2S), and Oxygen deficiency.',
                hi: 'मीथेन, कार्बन मोनोऑक्साइड, हाइड्रोजन सल्फाइड और ऑक्सीजन की कमी की जांच।',
                sat: 'ᱵᱤᱥ ᱜᱮᱥ ᱟᱨ ᱚᱠᱥᱤᱡᱮᱱ ᱠᱚᱢ ᱪᱤᱱᱦᱟᱹᱣ᱾'
              },
              durationMinutes: 15,
              keySafetyPoints: [
                {
                  id: 'g1',
                  title: { en: 'Oxygen Level (19.5% - 23.5%)', hi: 'ऑक्सीजन स्तर', sat: 'ᱚᱠᱥᱤᱡᱮᱱ ᱞᱮᱵᱷᱮᱞ' },
                  description: { en: 'Below 19.5% causes asphyxiation. Above 23.5% causes extreme flammability.', hi: '19.5% से कम होने पर दम घुटता है।', sat: '᱑᱙.᱕% ᱠᱷᱚᱱ ᱠᱚᱢ ᱞᱮᱱᱠᱷᱟᱱ ᱥᱟᱦᱮᱫ ᱠᱚᱥᱴᱚᱜ-ᱟ᱾' },
                  icon: 'activity'
                }
              ],
              contentBlocks: [
                {
                  type: 'SAFETY_WARNING',
                  title: { en: 'H2S Olfactory Fatigue', hi: 'H2S गैस का सूंघने का धोखा', sat: 'H2S ᱜᱮᱥ ᱥᱚ' },
                  body: { en: 'Hydrogen Sulfide smells like rotten eggs at low concentrations but completely paralyzes your sense of smell within seconds at lethal levels. Never trust your nose—trust calibrated digital detectors.', hi: 'H2S सड़े अंडे जैसी महकती है लेकिन खतरनाक मात्रा में सूंघने की शक्ति को तुरंत सुन्न कर देती है। हमेशा डिटेक्टर पर भरोसा करें।', sat: 'ᱱᱟᱥᱮ ᱥᱚ ᱠᱟᱛᱮ ᱦᱚᱲᱢᱚ ᱵᱮᱦᱚᱥ ᱫᱟᱲᱮᱭᱟᱜ-ᱟ, ᱰᱤᱴᱮᱠᱴᱚᱨ ᱵᱮᱵᱷᱟᱨ ᱢᱮ᱾' }
                }
              ],
              checklist: ['Bump test 4-gas detector before entry', 'Test top, middle, and bottom of space', 'Wear continuous monitor at breathing zone']
            },
            {
              moduleId: mod._id,
              order: 2,
              title: {
                en: 'Mandatory Confined Space Entry Permit & Buddy System',
                hi: 'सीमित स्थान प्रवेश परमिट एवं बडी सिस्टम',
                sat: 'ᱥᱟᱸᱠᱲᱟ ᱡᱟᱭᱜᱟ ᱨᱮ ᱵᱚᱞᱚᱱ ᱱᱤᱭᱟᱹᱢ'
              },
              description: {
                en: 'Authorized entrant, standby attendant duties, forced air ventilation, and non-entry rescue retrieval systems.',
                hi: 'परमिट टू वर्क, बाहर खड़े अटेंडेंट की जिम्मेदारी और हार्नेस बचाव प्रणाली।',
                sat: 'ᱵᱟᱦᱨᱮ ᱨᱮ ᱜᱟᱛᱮ ᱛᱟᱦᱮᱸᱱ ᱟᱨ ᱫᱟᱹᱲ ᱱᱤᱭᱟᱹᱢ᱾'
              },
              durationMinutes: 12,
              keySafetyPoints: [
                {
                  id: 'g2',
                  title: { en: 'Standby Attendant Duty', hi: 'अटेंडेंट की जिम्मेदारी', sat: 'ᱵᱟᱦᱨᱮ ᱜᱟᱛᱮ ᱠᱟᱹᱢᱤ' },
                  description: { en: 'The standby attendant must NEVER enter the space during an emergency. 60% of confined space fatalities are would-be rescuers.', hi: 'बचाव के लिए बिना सुरक्षा उपकरण कभी अंदर न कूदें। 60% मौतें बचाने वालों की होती हैं।', sat: 'ᱵᱟᱧᱪᱟᱣ ᱞᱟᱹᱜᱤᱫ ᱵᱤᱱᱟ ᱥᱟᱢᱟᱱ ᱛᱮ ᱟᱞᱚᱢ ᱵᱚᱞᱚᱱᱟ᱾' },
                  icon: 'shield'
                }
              ],
              contentBlocks: [
                {
                  type: 'CALLOUT',
                  title: { en: 'Tripod & Winch Rescue System', hi: 'ट्राइपॉड और विंच रेस्क्यू', sat: 'ᱴᱨᱟᱭᱯᱚᱰ ᱟᱨ ᱫᱟᱹᱲ ᱥᱟᱢᱟᱱ' },
                  body: { en: 'Full body harness with chest D-ring must be connected to mechanical retrieval winch prior to descending into silos, manholes, or underground vaults.', hi: 'खदान या गड्ढे में उतरने से पहले हार्नेस को रेस्क्यू विंच से जोड़ें।', sat: 'ᱠᱷᱟᱫᱟᱱ ᱵᱚᱞᱚᱱ ᱢᱟᱲᱟᱝ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱥᱟᱢᱟᱱ ᱡᱚᱲᱟᱣ ᱢᱮ᱾' }
                }
              ],
              checklist: ['Verify signed Entry Permit', 'Confirm ventilation blower is running', 'Establish two-way radio check']
            },
            {
              moduleId: mod._id,
              order: 3,
              title: {
                en: 'Non-Entry Mechanical Retrieval & Gas Leak Emergency Abort',
                hi: 'मैकेनिकल बचाव प्रणाली एवं गैस रिसाव आपातकालीन निकासी',
                sat: 'ᱢᱤᱥᱤᱱ ᱜᱚᱲᱚ ᱛᱮ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱟᱨ ᱜᱮᱥ ᱞᱤᱠ ᱩᱰᱩᱠ'
              },
              description: {
                en: 'Tripod mechanical winch extraction, SCBA emergency escape breathing packs, cross-wind evacuation, and isolation valve shutoff.',
                hi: 'ट्राइपॉड विंच द्वारा बाहर खींचना, आपातकालीन श्वास उपकरण, हवा की विपरीत दिशा में निकासी और आइसोलेशन वाल्व बंद करना।',
                sat: 'ᱴᱨᱟᱭᱯᱚᱰ ᱛᱮ ᱚᱨ ᱩᱰᱩᱠ, ᱚᱠᱥᱤᱡᱮᱱ ᱥᱟᱢᱟᱱ ᱟᱨ ᱜᱮᱥ ᱵᱷᱟᱞᱵᱽ ᱵᱚᱸᱫᱽ ᱱᱤᱭᱟᱹᱢ᱾'
              },
              durationMinutes: 15,
              keySafetyPoints: [
                {
                  id: 'g3_tripod',
                  title: { en: 'Mechanical Retrieval Lifeline', hi: 'मैकेनिकल रेस्क्यू लाइफलाइन', sat: 'ᱨᱩᱠᱷᱤᱭᱟᱹ ᱫᱟᱹᱲ ᱫᱟᱹᱣᱲᱤ' },
                  description: { en: 'Entrant must remain anchored to the external tripod winch cable so the attendant can hoist them up without entering.', hi: 'श्रमिक हमेशा बाहर के विंच केबल से बंधा होना चाहिए ताकि अटेंडेंट बिना अंदर जाए खींच सके।', sat: 'ᱵᱟᱦᱨᱮ ᱠᱷᱚᱱ ᱚᱨ ᱩᱰᱩᱠ ᱞᱟᱹᱜᱤᱫ ᱠᱮᱵᱚᱞ ᱞᱟᱜᱟᱣ ᱛᱟᱦᱮᱸᱱ ᱞᱟᱹᱠᱛᱤ᱾' },
                  icon: 'life-buoy'
                },
                {
                  id: 'g3_wind',
                  title: { en: 'Cross-Wind Egress Direction', hi: 'हवा की दिशा के लंबवत निकास', sat: 'ᱦᱚᱭ ᱩᱞᱴᱟᱹ ᱰᱟᱦᱟᱨ ᱛᱮ ᱩᱰᱩᱠ' },
                  description: { en: 'Always evacuate perpendicular (cross-wind) and upwind of leaking gases to avoid the toxic plume.', hi: 'गैस रिसाव के समय हमेशा हवा की दिशा देखकर सुरक्षित ऊपर की ओर निकलें।', sat: 'ᱜᱮᱥ ᱯᱟᱥᱱᱟᱣ ᱚᱠᱛᱚ ᱦᱚᱭ ᱰᱟᱦᱟᱨ ᱧᱮᱞ ᱠᱟᱛᱮ ᱩᱰᱩᱠᱚᱜ ᱢᱮ᱾' },
                  icon: 'compass'
                }
              ],
              contentBlocks: [
                {
                  type: 'SAFETY_WARNING',
                  title: { en: 'NEVER Enter to Rescue Without SCBA', hi: 'बिना SCBA के कभी बचाव के लिए न कूदें', sat: 'ᱵᱤᱱᱟ SCBA ᱛᱮ ᱵᱟᱧᱪᱟᱣ ᱟᱞᱚᱢ ᱵᱚᱞᱚᱱᱟ' },
                  body: { en: 'Unassisted entry into toxic atmosphere causes immediate loss of consciousness in under 30 seconds. Activate the automated tripod winch immediately.', hi: 'जहरीली गैस वाले गड्ढे में कूदने पर 30 सेकंड में बेहोशी आ जाती है। केवल ट्राइपॉड विंच से श्रमिक को बाहर खींचें।', sat: 'ᱵᱤᱥ ᱜᱮᱥ ᱨᱮ ᱓᱐ ᱥᱮᱠᱮᱱᱰ ᱨᱮ ᱦᱚᱲᱢᱚ ᱞᱤᱵᱷᱤ ᱟᱰᱩᱜ-ᱟ᱾ ᱵᱟᱦᱨᱮ ᱠᱷᱚᱱ ᱜᱮ ᱚᱨ ᱩᱰᱩᱠ ᱢᱮ᱾' }
                },
                {
                  type: 'STEP',
                  title: { en: 'Gas Leak Emergency Sequence', hi: 'गैस रिसाव आपातकालीन क्रम', sat: 'ᱜᱮᱥ ᱞᱤᱠ ᱮᱢᱟᱨᱡᱮᱱᱥᱤ ᱛᱚᱦᱚᱨ' },
                  body: { en: '1. Sound audible gas siren. 2. Crank mechanical winch to hoist entrant. 3. Isolate main quarter-turn gas valves. 4. Evacuate to the upwind muster station.', hi: '1. सायरन बजाएं। 2. विंच चलाकर श्रमिक को बाहर खींचें। 3. मुख्य गैस वाल्व बंद करें। 4. हवा की विपरीत दिशा में असेंबली पॉइंट जाएं।', sat: '᱑. ᱥᱟᱭᱨᱮᱱ ᱚᱨ ᱢᱮ᱾ ᱒. ᱣᱤᱧᱪ ᱛᱮ ᱜᱟᱛᱮ ᱚᱨ ᱩᱰᱩᱠ ᱢᱮ᱾ ᱓. ᱜᱮᱥ ᱵᱷᱟᱞᱵᱽ ᱵᱚᱸᱫᱽ ᱢᱮ᱾ ᱔. ᱨᱩᱠᱷᱤᱭᱟᱹ ᱡᱟᱭᱜᱟ ᱪᱟᱞᱟᱣ ᱢᱮ᱾' }
                }
              ],
              checklist: ['Lockout isolation valve if safe to reach', 'Check windsock direction for upwind route', 'Assemble and verify headcount at Gate 3']
            }
          ]);
          logger.info(`Seeded 3 Lessons for Module 2`);
        }

        let assess2 = await Assessment.findOne({ moduleId: mod._id });
        if (!assess2) {
          await Assessment.create({
            moduleId: mod._id,
            title: {
              en: 'Gas Safety & Confined Space Protocol Assessment',
              hi: 'गैस सुरक्षा एवं सीमित स्थान मूल्यांकन',
              sat: 'ᱜᱮᱥ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱵᱤᱰᱟᱹᱣ'
            },
            passingScore: 80,
            attemptLimit: 3,
            timeLimitMinutes: 15,
            questions: [
              {
                questionId: 'q2_1_ox',
                type: QUESTION_TYPES.MCQ,
                question: {
                  en: 'What is the safe atmospheric oxygen concentration range for confined space entry without airline respirator?',
                  hi: 'सीमित स्थान में बिना एयरलाइन रेस्पिरेटर प्रवेश के लिए सुरक्षित ऑक्सीजन स्तर क्या है?',
                  sat: 'ᱥᱟᱸᱠᱲᱟ ᱡᱟᱭᱜᱟ ᱨᱮ ᱵᱚᱞᱚᱱ ᱞᱟᱹᱜᱤᱫ ᱥᱟᱹᱦᱤᱡ ᱚᱠᱥᱤᱡᱮᱱ ᱞᱮᱵᱷᱮᱞ ᱛᱤᱱᱟᱹᱜ ᱠᱟᱱᱟ?'
                },
                options: [
                  { id: 'o1', text: { en: '19.5% to 23.5%', hi: '19.5% से 23.5%', sat: '᱑᱙.᱕% ᱠᱷᱚᱱ ᱒᱓.᱕%' } },
                  { id: 'o2', text: { en: '10.0% to 15.0%', hi: '10.0% से 15.0%', sat: '᱑᱐.᱐% ᱠᱷᱚᱱ ᱑᱕.᱐%' } },
                  { id: 'o3', text: { en: '25.0% to 30.0%', hi: '25.0% से 30.0%', sat: '᱒᱕.᱐% ᱠᱷᱚᱱ ᱓᱐.᱐%' } }
                ],
                correctAnswer: 'o1',
                explanation: { en: '19.5% is minimum safe oxygen. Above 23.5% poses serious hyperoxic fire acceleration hazard.', hi: '19.5% न्यूनतम और 23.5% अधिकतम सुरक्षित स्तर है।', sat: '᱑᱙.᱕% ᱠᱷᱚᱱ ᱒᱓.᱕% ᱫᱚ ᱥᱟᱹᱦᱤᱡ ᱞᱮᱵᱷᱮᱞ ᱠᱟᱱᱟ᱾' },
                difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
                competencyDomain: 'knowledge',
                weight: 50,
                timeLimitSeconds: 45
              },
              {
                questionId: 'q2_2_attendant',
                type: QUESTION_TYPES.SCENARIO_DECISION,
                question: {
                  en: 'You are the designated Standby Attendant outside a mica mine hopper. Your colleague inside collapses. What is your primary directive?',
                  hi: 'आप हॉपर के बाहर स्टैंडबाय अटेंडेंट हैं। अंदर आपका साथी बेहोश हो जाता है। आपका पहला कर्तव्य क्या है?',
                  sat: 'ᱟᱢ ᱵᱟᱦᱨᱮ ᱨᱮ ᱢᱮᱱᱟᱢᱟ ᱟᱨ ᱵᱷᱤᱛᱨᱤ ᱨᱮ ᱜᱟᱛᱮ ᱵᱮᱦᱚᱥ ᱮᱱᱟ᱾ ᱟᱢ ᱯᱩᱭᱞᱩ ᱪᱮᱫ ᱮᱢ ᱠᱟᱹᱢᱤᱭᱟ?'
                },
                options: [
                  { id: 'act_call_help', text: { en: 'Sound emergency alarm, call Mine Rescue Team, initiate mechanical winch retrieval from outside', hi: 'इमरजेंसी अलार्म बजाएं, बचाव टीम को बुलाएं और बाहर से विंच चलाकर निकालें', sat: 'ᱟᱞᱟᱨᱢ ᱞᱤᱱ ᱢᱮ, ᱨᱮᱥᱠᱤᱭᱩ ᱴᱤᱢ ᱦᱚᱦᱚ ᱟᱨ ᱵᱟᱦᱨᱮ ᱠᱷᱚᱱ ᱚᱨ ᱩᱰᱩᱠ ᱢᱮ' } },
                  { id: 'act_jump_in', text: { en: 'Immediately jump inside without breathing apparatus to lift him', hi: 'बिना मास्क के तुरंत अंदर कूद जाएं', sat: 'ᱵᱤᱱᱟ ᱢᱟᱥᱠ ᱛᱮ ᱞᱚᱜᱚᱱ ᱵᱷᱤᱛᱨᱤ ᱫᱚᱱ ᱢᱮ' } }
                ],
                correctAnswer: 'act_call_help',
                explanation: { en: 'Never enter a toxic atmosphere without specialized SCBA gear. Non-entry mechanical rescue saves both lives.', hi: 'बिना SCBA उपकरण अंदर न जाएं। बाहर से रेस्क्यू विंच का प्रयोग करें।', sat: 'ᱵᱟᱦᱨᱮ ᱠᱷᱚᱱ ᱜᱮ ᱵᱤᱧᱪ ᱛᱮ ᱚᱨ ᱩᱰᱩᱠ ᱢᱮ᱾' },
                difficulty: DIFFICULTY_LEVELS.ADVANCED,
                competencyDomain: 'decisionMaking',
                weight: 50,
                timeLimitSeconds: 45
              }
            ]
          });
        }
      }

      // Seed for Module 3 (Machinery Safety & LOTO)
      if (mod.moduleNumber === 3) {
        const count = await Lesson.countDocuments({ moduleId: mod._id });
        if (count === 0) {
          await Lesson.create([
            {
              moduleId: mod._id,
              order: 1,
              title: { en: 'Lockout / Tagout (LOTO) 6-Step Protocol', hi: 'LOTO के 6 चरण', sat: 'LOTO ᱨᱮᱭᱟᱜ ᱖ ᱛᱚᱦᱚᱨ' },
              description: { en: 'Preparation, Shutdown, Isolation, Lock/Tag application, Stored energy dissipation, Verification of Zero Energy.', hi: 'तैयारी, शटडाउन, आइसोलेशन, ताला और टैग लगाना, बची ऊर्जा निकालना और जांच।', sat: 'ᱢᱤᱥᱤᱱ ᱵᱚᱸᱫᱽ ᱠᱟᱛᱮ ᱪᱟᱹᱵᱷᱤ ᱞᱟᱜᱟᱣ ᱟᱨ ᱴᱮᱥᱴ᱾' },
              durationMinutes: 15,
              keySafetyPoints: [
                {
                  id: 'loto_1',
                  title: { en: 'One Person, One Lock, One Key', hi: 'एक व्यक्ति, एक ताला, एक चाबी', sat: 'ᱢᱤᱫ ᱦᱚᱲ, ᱢᱤᱫ ᱛᱟᱞᱟ, ᱢᱤᱫ ᱪᱟᱹᱵᱷᱤ' },
                  description: { en: 'Never let another worker place or remove your personal safety lock.', hi: 'अपना सेफ्टी ताला कभी किसी दूसरे को न लगाने या हटाने दें।', sat: 'ᱟᱢᱟᱜ ᱛᱟᱞᱟ ᱮᱴᱟᱜ ᱦᱚᱲ ᱟᱞᱚᱢ ᱠᱷᱩᱞᱟᱹᱣ ᱚᱪᱚᱭᱟ᱾' },
                  icon: 'lock'
                }
              ],
              contentBlocks: [
                {
                  type: 'STEP',
                  title: { en: 'Zero Energy Verification (Try Step)', hi: 'शून्य ऊर्जा सत्यापन', sat: 'ᱡᱤᱨᱚ ᱮᱱᱟᱨᱡᱤ ᱴᱮᱥᱴ' },
                  body: { en: 'After padlocking the breaker, attempt to press the local START button to physically confirm the machine cannot energize, then press STOP.', hi: 'ताला लगाने के बाद मशीन का स्टार्ट बटन दबाकर देखें कि वह चालू तो नहीं हो रही।', sat: 'ᱛᱟᱞᱟ ᱞᱟᱜᱟᱣ ᱛᱟᱭᱚᱢ ᱥᱴᱟᱨᱴ ᱵᱟᱴᱚᱱ ᱞᱤᱱ ᱠᱟᱛᱮ ᱴᱮᱥᱴ ᱢᱮ᱾' }
                }
              ],
              checklist: ['Identify all energy sources (electrical, pneumatic, hydraulic, kinetic)', 'Apply personal padlock and danger tag', 'Bleed hydraulic pressure and block gravity rams']
            }
          ]);
        }

        let assess3 = await Assessment.findOne({ moduleId: mod._id });
        if (!assess3) {
          await Assessment.create({
            moduleId: mod._id,
            title: { en: 'Machinery Safety & LOTO Certification Test', hi: 'मशीनरी सुरक्षा एवं LOTO परीक्षा', sat: 'ᱢᱤᱥᱤᱱ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱵᱤᱰᱟᱹᱣ' },
            passingScore: 70,
            attemptLimit: 3,
            timeLimitMinutes: 10,
            questions: [
              {
                questionId: 'q3_1_try',
                type: QUESTION_TYPES.MCQ,
                question: {
                  en: 'What is the critical final step before placing your hands inside a locked-out rock crusher?',
                  hi: 'क्रशर मशीन के अंदर हाथ डालने से पहले अंतिम महत्वपूर्ण कदम क्या है?',
                  sat: 'ᱢᱤᱥᱤᱱ ᱵᱷᱤᱛᱨᱤ ᱛᱤ ᱵᱚᱞᱚ ᱢᱟᱲᱟᱝ ᱢᱩᱪᱟᱹᱫ ᱴᱮᱥᱴ ᱪᱮᱫ?'
                },
                options: [
                  { id: 'o_verify', text: { en: 'Attempt to start the machine (Verify Zero Energy State)', hi: 'मशीन चालू करके शून्य ऊर्जा की पुष्टि करें', sat: 'ᱥᱴᱟᱨᱴ ᱞᱤᱱ ᱠᱟᱛᱮ ᱡᱤᱨᱚ ᱮᱱᱟᱨᱡᱤ ᱴᱮᱥᱴ' } },
                  { id: 'o_trust', text: { en: 'Assume power is cut because breaker switch is down', hi: 'मान लें कि बिजली बंद है', sat: 'ᱢᱚᱱᱮ ᱢᱮ ᱠᱟᱨᱮᱱᱴ ᱵᱚᱸᱫᱽ ᱜᱮᱭᱟ' } }
                ],
                correctAnswer: 'o_verify',
                explanation: { en: 'Verification guarantees that auxiliary feeds or stored capacitors are completely dead.', hi: 'सत्यापन सुनिश्चित करता है कि मशीन में कोई अवशिष्ट ऊर्जा नहीं बची है।', sat: 'ᱴᱮᱥᱴ ᱞᱮᱠᱷᱟᱱ ᱵᱟᱰᱟᱭᱚᱜ-ᱟ ᱢᱤᱥᱤᱱ ᱯᱩᱨᱟᱹ ᱵᱚᱸᱫᱽ ᱜᱮᱭᱟ᱾' },
                difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
                competencyDomain: 'procedure',
                weight: 100,
                timeLimitSeconds: 45
              }
            ]
          });
        }
      }

      // Seed for Module 4 (PPE)
      if (mod.moduleNumber === 4) {
        const count = await Lesson.countDocuments({ moduleId: mod._id });
        if (count === 0) {
          await Lesson.create([
            {
              moduleId: mod._id,
              order: 1,
              title: { en: 'Head, Foot & Respiratory Defense Selection', hi: 'सिर, पैर एवं श्वास सुरक्षा उपकरण', sat: 'ᱦᱮᱞᱢᱮᱴ, ᱵᱩᱴ ᱟᱨ ᱢᱟᱥᱠ' },
              description: { en: 'ANSI Type II helmets, Steel toe puncture-resistant soles, N95 vs P100 silica dust filtration.', hi: 'हेलमेट, स्टील-टो जूते, सिलिका डस्ट के लिए P100 मास्क का चयन।', sat: 'ᱥᱟᱹᱦᱤᱡ ᱦᱮᱞᱢᱮᱴ ᱟᱨ ᱵᱩᱴ ᱦᱚᱨᱚᱜ᱾' },
              durationMinutes: 10,
              keySafetyPoints: [
                {
                  id: 'ppe_1',
                  title: { en: 'Silica Dust P100 Respirators', hi: 'सिलिका डस्ट P100 मास्क', sat: 'P100 ᱢᱟᱥᱠ' },
                  description: { en: 'In mica and quartz crushing, simple cloth masks are ineffective against microscopically sharp silica crystals.', hi: 'माइका और पत्थर खदानों में कपड़ा मास्क सिलिका धूल से नहीं बचा पाता। P100 फिल्टर अनिवार्य है।', sat: 'ᱢᱟᱭᱠᱟ ᱠᱷᱟᱫᱟᱱ ᱨᱮ ᱠᱷᱟᱹᱞᱤ ᱞᱩᱜᱽᱲᱤ ᱵᱟᱝ, P100 ᱢᱟᱥᱠ ᱦᱚᱨᱚᱜ ᱢᱮ᱾' },
                  icon: 'shield'
                }
              ],
              contentBlocks: [
                {
                  type: 'TEXT',
                  title: { en: 'PPE Inspection Cycle', hi: 'PPE जांच नियम', sat: 'PPE ᱪᱮᱠ ᱛᱚᱦᱚᱨ' },
                  body: { en: 'Inspect safety helmet shells for micro-cracks, sun fading, or expired harness webbing. Discard any helmet that has sustained an impact.', hi: 'दरार वाले या पुराने हेलमेट तुरंत बदलें।', sat: 'ᱨᱟᱹᱯᱩᱫ ᱦᱮᱞᱢᱮᱴ ᱞᱚᱜᱚᱱ ᱵᱚᱫᱚᱞ ᱢᱮ᱾' }
                }
              ],
              checklist: ['Check helmet expiration date', 'Seal check respirator with both palms', 'Ensure steel-toe boots are laced to top']
            }
          ]);
        }

        let assess4 = await Assessment.findOne({ moduleId: mod._id });
        if (!assess4) {
          await Assessment.create({
            moduleId: mod._id,
            title: { en: 'PPE Inspection & Compliance Exam', hi: 'PPE सुरक्षा एवं मानक परीक्षा', sat: 'PPE ᱵᱤᱰᱟᱹᱣ' },
            passingScore: 70,
            attemptLimit: 3,
            timeLimitMinutes: 10,
            questions: [
              {
                questionId: 'q4_1_silica',
                type: QUESTION_TYPES.MCQ,
                question: {
                  en: 'Which respiratory protection is required when operating dry mica rock crushing machines?',
                  hi: 'सूखे अभ्रक (माइका) पत्थर की पिसाई करते समय कौन सा मास्क अनिवार्य है?',
                  sat: 'ᱢᱟᱭᱠᱟ ᱨᱟᱹᱯᱩᱫ ᱚᱠᱛᱚ ᱪᱮᱫ ᱢᱟᱥᱠ ᱦᱚᱨᱚᱜ ᱞᱟᱹᱠᱛᱤ?'
                },
                options: [
                  { id: 'o_p100', text: { en: 'Tight-fitting Half-Face Respirator with P100 HEPA Filters', hi: 'P100 HEPA फिल्टर वाला टाइट रेस्पिरेटर', sat: 'P100 ᱯᱷᱤᱞᱴᱟᱨ ᱥᱟᱶ ᱴᱟᱭᱤᱴ ᱢᱟᱥᱠ' } },
                  { id: 'o_cloth', text: { en: 'Loose cotton bandana or standard cloth scarf', hi: 'सूती रुमाल या गमछा', sat: 'ᱥᱩᱛᱟᱹᱢ ᱜᱟᱢᱪᱷᱟ' } }
                ],
                correctAnswer: 'o_p100',
                explanation: { en: 'Silica dust causes irreversible silicosis lung damage. Only certified P100 filters block fine particulate.', hi: 'सिलिका फेफड़ों को हमेशा के लिए खराब कर देती है। केवल P100 फिल्टर ही इसे रोकते हैं।', sat: 'P100 ᱯᱷᱤᱞᱴᱟᱨ ᱜᱮ ᱵᱤᱥ ᱫᱷᱩᱲᱤ ᱠᱷᱚᱱ ᱵᱟᱧᱪᱟᱣ ᱮᱢᱟᱭ᱾' },
                difficulty: DIFFICULTY_LEVELS.BEGINNER,
                competencyDomain: 'knowledge',
                weight: 100,
                timeLimitSeconds: 40
              }
            ]
          });
        }
      }

      // Seed for Module 5 (Emergency Evacuation)
      if (mod.moduleNumber === 5) {
        const count = await Lesson.countDocuments({ moduleId: mod._id });
        if (count === 0) {
          await Lesson.create([
            {
              moduleId: mod._id,
              order: 1,
              title: { en: 'Triage & First Aid Emergency Chain', hi: 'प्राथमिक उपचार एवं आपातकालीन श्रृंखला', sat: 'ᱯᱩᱭᱞᱩ ᱜᱚᱲᱚ ᱟᱨ ᱦᱚᱦᱚ ᱱᱤᱭᱟᱹᱢ' },
              description: { en: 'Severe bleeding control with tourniquets, CPR compressions, and casualty positioning.', hi: 'तेज खून बहना रोकना, CPR देना और घायल को सुरक्षित रखना।', sat: 'ᱢᱟᱭᱟᱢ ᱵᱚᱸᱫᱽ ᱟᱨ CPR ᱮᱢ ᱪᱮᱫ᱾' },
              durationMinutes: 15,
              keySafetyPoints: [
                {
                  id: 'fa_1',
                  title: { en: 'Direct Pressure on Severe Bleed', hi: 'खून बहने पर दबाव डालें', sat: 'ᱢᱟᱭᱟᱢ ᱡᱚᱨᱚ ᱨᱮ ᱞᱤᱱ ᱢᱮ' },
                  description: { en: 'Apply firm direct pressure with clean dressing. Do not remove dressing if soaked; apply additional layer on top.', hi: 'घाव पर साफ पट्टी से तेज दबाव डालें।', sat: 'ᱜᱷᱟᱣ ᱨᱮ ᱥᱟᱯᱷᱟ ᱞᱩᱜᱽᱲᱤ ᱛᱮ ᱞᱤᱱ ᱢᱮ᱾' },
                  icon: 'heart'
                }
              ],
              contentBlocks: [
                {
                  type: 'STEP',
                  title: { en: 'Compressions Only CPR', hi: 'हार्ट अटैक में CPR विधि', sat: 'CPR ᱦᱚᱨᱟ' },
                  body: { en: 'Push hard and fast in the center of the chest at 100-120 beats per minute until medical assistance arrives.', hi: 'छाती के बीच में 100-120 बार प्रति मिनट की दर से तेज और गहरा दबाव दें।', sat: 'ᱠᱚᱲᱟᱢ ᱛᱟᱞᱟ ᱨᱮ ᱑᱐᱐-᱑᱒᱐ ᱫᱷᱟᱣ ᱞᱤᱱ ᱢᱮ ᱰᱟᱠᱛᱚᱨ ᱦᱤᱡᱩᱜ ᱫᱷᱟᱹᱵᱤᱡ᱾' }
                }
              ],
              checklist: ['Check scene safety first', 'Call Emergency Medical Responder (EMR)', 'Check breathing and responsiveness']
            }
          ]);
        }

        let assess5 = await Assessment.findOne({ moduleId: mod._id });
        if (!assess5) {
          await Assessment.create({
            moduleId: mod._id,
            title: { en: 'First Response & Evacuation Certification', hi: 'आपातकालीन निकासी एवं प्राथमिक उपचार परीक्षा', sat: 'ᱮᱢᱟᱨᱡᱮᱱᱥᱤ ᱜᱚᱲᱚ ᱵᱤᱰᱟᱹᱣ' },
            passingScore: 75,
            attemptLimit: 3,
            timeLimitMinutes: 10,
            questions: [
              {
                questionId: 'q5_1_cpr',
                type: QUESTION_TYPES.MCQ,
                question: {
                  en: 'What is the recommended chest compression rate for adult CPR in an industrial emergency?',
                  hi: 'वयस्क को CPR देते समय छाती दबाने की सही गति क्या है?',
                  sat: 'ᱦᱚᱲ ᱮ CPR ᱮᱢ ᱚᱠᱛᱚ ᱠᱚᱲᱟᱢ ᱞᱤᱱ ᱨᱮᱭᱟᱜ ᱜᱚᱛᱤ ᱛᱤᱱᱟᱹᱜ ᱞᱟᱹᱠᱛᱤ?'
                },
                options: [
                  { id: 'o_100_120', text: { en: '100 to 120 compressions per minute', hi: '100 से 120 बार प्रति मिनट', sat: '᱑᱐᱐ ᱠᱷᱚᱱ ᱑᱒᱐ ᱫᱷᱟᱣ ᱢᱤᱫ ᱢᱤᱱᱤᱴ ᱨᱮ' } },
                  { id: 'o_40_50', text: { en: '40 to 50 compressions per minute', hi: '40 से 50 बार प्रति मिनट', sat: '᱔᱐ ᱠᱷᱚᱱ ᱕᱐ ᱫᱷᱟᱣ ᱢᱤᱫ ᱢᱤᱱᱤᱴ ᱨᱮ' } }
                ],
                correctAnswer: 'o_100_120',
                explanation: { en: '100-120 beats per minute maintains vital oxygen perfusion to the brain.', hi: '100-120 की गति दिमाग और दिल में रक्त प्रवाह बनाए रखती है।', sat: '᱑᱐᱐-᱑᱒᱐ ᱜᱚᱛᱤ ᱫᱚ ᱵᱚᱦᱚᱜ ᱨᱮ ᱢᱟᱭᱟᱢ ᱪᱟᱞᱟᱣ ᱞᱟᱹᱜᱤᱫ ᱞᱟᱹᱠᱛᱤ ᱠᱟᱱᱟ᱾' },
                difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
                competencyDomain: 'procedure',
                weight: 100,
                timeLimitSeconds: 40
              }
            ]
          });
        }
      }
    }

    // 4. Create sample initial notification
    const existingNotif = await Notification.findOne({ userId: worker._id });
    if (!existingNotif) {
      await Notification.create({
        userId: worker._id,
        title: 'Welcome to PARISHAK Industrial Safety Platform',
        message: 'Your account is active. Complete your mandatory Fire & Explosion Response training to earn your first certified safety badge.',
        type: NOTIFICATION_TYPES.TRAINING_REMINDER,
        isRead: false
      });
      logger.info('Seeded Initial Notification for demo worker');
    }

    logger.info('Database seeding completed successfully.');
  } catch (error) {
    logger.error('Error during database seed', error);
    throw error;
  }
};
