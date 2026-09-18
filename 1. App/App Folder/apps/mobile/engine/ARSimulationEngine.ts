import {
  ARScenarioDefinition,
  ARScenarioStep,
  ARSessionTelemetry,
  ARActionType,
  CompetencyBreakdown,
  INDUSTRIAL_ASSET_CATALOG,
  IndustrialAssetType,
  IndustrialAssetDefinition
} from '@parishak/shared';

export interface ARActionResult {
  isSuccess: boolean;
  feedbackText: { en: string; hi: string; sat: string };
  isStepCompleted: boolean;
  nextStepIndex?: number;
  isScenarioComplete?: boolean;
  scoreDeduction?: number;
  dangerAlert?: boolean;
}

export const PRELOADED_AR_SCENARIOS: Record<string, ARScenarioDefinition> = {
  // Module 1: Fire & Explosion AR Scenario
  '1': {
    scenarioId: 'ar-fire-drill-01',
    moduleId: '1',
    type: 'FIRE_AND_EXPLOSION',
    title: {
      en: 'AR Fire Hazard Recognition & PASS Extinguisher Spatial Drill',
      hi: 'AR अग्नि पहचान एवं PASS अग्निशामक अभ्यास',
      sat: 'AR ᱥᱮᱸᱜᱮᱞ ᱪᱤᱱᱦᱟᱹᱣ ᱟᱨ PASS ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱟᱵᱷᱭᱟᱥ'
    },
    briefing: {
      en: 'A high-voltage diesel generator has caught fire on the plant floor. Thick smoke is rising. Use your camera to scan the floor, anchor the virtual scenario, and execute the correct safety sequence.',
      hi: 'प्लांट में डीजल जनरेटर में भीषण आग लग गई है। कैमरा से जमीन स्कैन करें और सही सुरक्षा क्रम का पालन करें।',
      sat: 'ᱰᱤᱡᱮᱞ ᱡᱮᱱᱮᱨᱮᱴᱚᱨ ᱨᱮ ᱥᱮᱸᱜᱮᱞ ᱞᱟᱜᱟᱣ ᱮᱱᱟ᱾ ᱠᱮᱢᱨᱟ ᱛᱮ ᱡᱟᱭᱜᱟ ᱧᱮᱞ ᱠᱟᱛᱮ ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱢᱮ᱾'
    },
    objects: [
      {
        id: 'obj_generator_fire',
        type: 'HAZARD_SOURCE',
        label: { en: 'Burning Diesel Generator (Class B Fire)', hi: 'जलती हुई डीजल जनरेटर (क्लास B)', sat: 'ᱡᱩᱞᱩᱜ ᱠᱟᱱ ᱰᱤᱡᱮᱞ ᱢᱤᱥᱤᱱ' },
        position: { x: 0, y: 0, z: -2.5 },
        status: 'ACTIVE',
        isInteractive: true
      },
      {
        id: 'obj_emergency_exit',
        type: 'EXIT_SIGN',
        label: { en: 'Emergency Exit Door & Route', hi: 'आपातकालीन निकास द्वार', sat: 'ᱨᱩᱠᱷᱤᱭᱟᱹ ᱩᱰᱩᱠ ᱫᱩᱣᱟᱹᱨ' },
        position: { x: -2.2, y: 0.5, z: -1.8 },
        status: 'ACTIVE',
        isInteractive: true
      },
      {
        id: 'obj_extinguisher_abc',
        type: 'EXTINGUISHER',
        label: { en: 'ABC Dry Chemical Extinguisher', hi: 'ABC ड्राई केमिकल एक्सटिंग्विशर', sat: 'ABC ᱰᱨᱟᱭ ᱯᱟᱣᱰᱟᱨ ᱢᱤᱥᱤᱱ' },
        position: { x: 1.2, y: 0, z: -1.5 },
        status: 'ACTIVE',
        isInteractive: true
      },
      {
        id: 'obj_extinguisher_water',
        type: 'EXTINGUISHER',
        label: { en: 'Pressurized Water Extinguisher', hi: 'पानी वाला एक्सटिंग्विशर (असुरक्षित)', sat: 'ᱫᱟᱜ ᱢᱤᱥᱤᱱ (ᱵᱟᱹᱲᱤᱡ)' },
        position: { x: 2.0, y: 0, z: -1.5 },
        status: 'ACTIVE',
        isInteractive: true
      },
      {
        id: 'obj_exit_route',
        type: 'EVACUATION_ARROW',
        label: { en: 'Emergency Exit Route (North Door)', hi: 'आपातकालीन निकास मार्ग', sat: 'ᱨᱩᱠᱷᱤᱭᱟᱹ ᱩᱰᱩᱠ ᱰᱟᱦᱟᱨ' },
        position: { x: 0, y: -0.2, z: 1.5 },
        status: 'ACTIVE',
        isInteractive: true
      }
    ],
    steps: [
      {
        stepIndex: 0,
        stepKey: 'SURFACE_SCAN',
        title: {
          en: '1. Scan Floor & Anchor AR Fire Scenario',
          hi: '1. फर्श स्कैन करें और AR अग्नि सिमुलेशन स्थापित करें',
          sat: '᱑. ᱚᱛ ᱥᱠᱮᱱ ᱠᱟᱛᱮ AR ᱥᱮᱸᱜᱮᱞ ᱛᱷᱟᱯᱚᱱ ᱢᱮ'
        },
        instruction: {
          en: 'Point your camera at a flat, clear floor surface. Once the floor plane reticle detects the surface, tap to anchor the virtual fire.',
          hi: 'कैमरे को समतल फर्श की ओर करें और सतह मिलने पर टैप करके आग स्थापित करें।',
          sat: 'ᱠᱮᱢᱨᱟ ᱥᱟᱢᱟᱝ ᱨᱮ ᱫᱚᱦᱚ ᱠᱟᱛᱮ ᱪᱤᱱᱦᱟᱹ ᱧᱮᱞ ᱢᱮ ᱟᱨ ᱥᱮᱸᱜᱮᱞ ᱛᱷᱟᱯᱚᱱ ᱢᱮ᱾'
        },
        expectedAction: 'PLACE_SCENARIO',
        timeoutSeconds: 30
      },
      {
        stepIndex: 1,
        stepKey: 'FIND_EMERGENCY_EXIT',
        title: {
          en: '2. Spot Emergency Exit: Confirm Escape Route',
          hi: '2. आपातकालीन निकास खोजें: सुरक्षित मार्ग सुनिश्चित करें',
          sat: '᱒. ᱨᱩᱠᱷᱤᱭᱟᱹ ᱩᱰᱩᱠ ᱫᱩᱣᱟᱹᱨ ᱧᱟᱢ ᱢᱮ'
        },
        instruction: {
          en: 'CRITICAL FIRST ACTION: Always locate and verify your emergency exit route before fighting any fire! Tap the green illuminated Emergency Exit to confirm your retreat path is clear.',
          hi: 'अति महत्वपूर्ण: आग बुझाने से पहले हमेशा अपने पीछे निकास मार्ग सुनिश्चित करें! हरे आपातकालीन निकास पर टैप करके सुरक्षित मार्ग सत्यापित करें।',
          sat: 'ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱢᱟᱬᱟᱝ ᱨᱮ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱩᱰᱩᱠ ᱫᱩᱣᱟᱹᱨ ᱧᱮᱞ ᱢᱮ ᱟᱨ ᱴᱤᱯᱟᱹᱣ ᱢᱮ᱾'
        },
        expectedAction: 'IDENTIFY_EMERGENCY_EXIT',
        availableActionOptions: [
          {
            actionKey: 'VERIFY_EXIT_CLEAR',
            label: {
              en: 'Verify Emergency Exit is Unobstructed & Clear',
              hi: 'आपातकालीन निकास पूरी तरह खुला और सुरक्षित है',
              sat: 'ᱩᱰᱩᱠ ᱫᱩᱣᱟᱹᱨ ᱡᱷᱤᱡ ᱢᱮᱱᱟᱜ-ᱟ'
            },
            isCorrect: true,
            feedback: {
              en: 'Excellent! Escape route verified. Always keep an exit behind you before using an extinguisher.',
              hi: 'उत्कृष्ट! निकास मार्ग सत्यापित। आग बुझाते समय हमेशा निकास मार्ग अपने पीछे रखें।',
              sat: 'ᱟᱹᱰᱤ ᱱᱟᱯᱟᱭ! ᱩᱰᱩᱠ ᱰᱟᱦᱟᱨ ᱴᱷᱤᱠ ᱢᱮᱱᱟᱜ-ᱟ᱾'
            }
          },
          {
            actionKey: 'BLOCK_EXIT',
            label: {
              en: 'Ignore exit, rush directly into corner without escape path',
              hi: 'निकास की अनदेखी करें और बिना सुरक्षित मार्ग के आग की ओर दौड़ें',
              sat: 'ᱫᱩᱣᱟᱹᱨ ᱵᱟᱝ ᱧᱮᱞ ᱠᱟᱛᱮ ᱥᱮᱸᱜᱮᱞ ᱥᱮᱫ ᱫᱟᱹᱲ ᱢᱮ'
            },
            isCorrect: false,
            feedback: {
              en: 'CRITICAL HAZARD: If flames intensify, you will be trapped with no escape route!',
              hi: 'घातक खतरा: यदि आग बढ़ी तो आप फंस जाएंगे और निकास का कोई रास्ता नहीं रहेगा!',
              sat: 'ᱢᱟᱨᱟᱝ ᱵᱷᱩᱞ: ᱥᱮᱸᱜᱮᱞ ᱰᱷᱮᱨ ᱞᱮᱠᱷᱟᱱ ᱟᱢ ᱯᱷᱟᱥᱟᱣ ᱮᱢ ᱛᱟᱦᱮᱸᱱᱟ!'
            }
          }
        ],
        timeoutSeconds: 30
      },
      {
        stepIndex: 2,
        stepKey: 'SELECT_EXTINGUISHER_AGENT',
        title: {
          en: '3. Equipment Station: Select Correct Extinguisher',
          hi: '3. उपकरण चयन: सही अग्निशामक चुनें',
          sat: '᱓. ᱥᱟᱹᱦᱤᱡ ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱢᱤᱥᱤᱱ ᱵᱟᱪᱷᱟᱣ ᱢᱮ'
        },
        instruction: {
          en: 'Select the ABC Dry Chemical Powder Extinguisher from the rack. (Warning: Water is strictly prohibited on Class B liquid fires!)',
          hi: 'रैक से ABC ड्राई केमिकल पाउडर एक्सटिंग्विशर चुनें। (डीजल पर पानी का उपयोग सख्त वर्जित है!)',
          sat: 'ABC ᱰᱨᱟᱭ ᱯᱟᱣᱰᱟᱨ ᱢᱤᱥᱤᱱ ᱵᱟᱪᱷᱟᱣ ᱢᱮ᱾ (ᱰᱤᱡᱮᱞ ᱨᱮ ᱫᱟᱜ ᱟᱞᱚᱢ ᱫᱩᱞᱟ!)'
        },
        expectedAction: 'SELECT_EXTINGUISHER',
        availableActionOptions: [
          {
            actionKey: 'SELECT_ABC_POWDER',
            label: {
              en: 'ABC Dry Chemical Powder (Safe for Liquid & Electrical Fires)',
              hi: 'ABC ड्राई केमिकल पाउडर (तरल और बिजली आग के लिए सुरक्षित)',
              sat: 'ABC ᱰᱨᱟᱭ ᱯᱟᱣᱰᱟᱨ ᱢᱤᱥᱤᱱ'
            },
            isCorrect: true,
            feedback: {
              en: 'Correct! ABC Dry Chemical blankets the fuel and cuts off oxygen supply safely.',
              hi: 'उत्कृष्ट! ABC ड्राई केमिकल ईंधन को ढककर ऑक्सीजन की आपूर्ति सुरक्षित रूप से रोक देता है।',
              sat: 'ᱥᱟᱹᱨᱤ ᱜᱮᱭᱟ! ABC ᱯᱟᱣᱰᱟᱨ ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ-ᱟ᱾'
            }
          },
          {
            actionKey: 'SELECT_WATER',
            label: {
              en: 'Pressurized Water Extinguisher',
              hi: 'पानी वाला एक्सटिंग्विशर',
              sat: 'ᱫᱟᱜ ᱢᱤᱥᱤᱱ'
            },
            isCorrect: false,
            feedback: {
              en: 'FATAL ERROR: Water sinks beneath burning diesel, boils into steam, and causes a violent flash explosion!',
              hi: 'घातक भूल: जलते डीजल पर पानी डालने से भाप का भीषण विस्फोट होगा और आग चारों तरफ फैलेगी!',
              sat: 'ᱢᱟᱨᱟᱝ ᱵᱷᱩᱞ: ᱰᱤᱡᱮᱞ ᱨᱮ ᱫᱟᱜ ᱫᱩᱞ ᱞᱮᱠᱷᱟᱱ ᱵᱤᱥᱯᱷᱚᱴ ᱦᱩᱭᱩᱜ-ᱟ!'
            }
          }
        ],
        timeoutSeconds: 25
      },
      {
        stepIndex: 3,
        stepKey: 'EXECUTE_PASS_PROTOCOL',
        title: {
          en: '4. PASS Technique: Extinguish Fire Base',
          hi: '4. PASS तकनीक: आग को पूरी तरह बुझाएं',
          sat: '᱔. PASS ᱦᱚᱨᱟ: ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱢᱮ'
        },
        instruction: {
          en: 'Execute PASS: Pull Pin -> Aim at Base of Flame -> Squeeze Lever -> Sweep side-to-side across the base of the fire.',
          hi: 'PASS क्रम करें: पिन खींचें -> आग के तल पर निशाना लगाएं -> लीवर दबाएं -> दाएं-बाएं घुमाएं।',
          sat: 'PASS ᱦᱚᱨᱟ: ᱯᱤᱱ ᱚᱨ ᱢᱮ -> ᱞᱟᱛᱟᱨ ᱥᱮᱫ ᱥᱟᱢᱟᱝ ᱢᱮ -> ᱞᱤᱱ ᱢᱮ -> ᱞᱮᱸᱜᱟ-ᱡᱚᱡᱚᱢ ᱤᱬᱤᱡ ᱢᱮ᱾'
        },
        expectedAction: 'PASS_SWEEP_FLAME',
        timeoutSeconds: 45
      },
      {
        stepIndex: 4,
        stepKey: 'EVACUATION_MUSTER',
        title: {
          en: '5. Evacuate: Follow AR Green Arrow to Safe Muster Point',
          hi: '5. सुरक्षित निकास: हरे तीरों का पालन कर असेंबली पॉइंट पर पहुंचें',
          sat: '᱕. ᱩᱰᱩᱠ ᱰᱟᱦᱟᱨ: ᱦᱟᱹᱨᱭᱟᱹᱲ ᱪᱤᱱᱦᱟᱹ ᱛᱮ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱡᱟᱭᱜᱟ ᱪᱟᱞᱟᱜ ᱢᱮ'
        },
        instruction: {
          en: 'Fire is suppressed, but toxic smoke lingers. Follow the AR green emergency chevrons to the external Safe Muster Assembly Point.',
          hi: 'आग बुझ गई है परंतु विषैला धुआं मौजूद है। सुरक्षित असेंबली पॉइंट तक पहुंचने के लिए फर्श पर बने हरे निशानों का पालन करें।',
          sat: 'ᱫᱷᱩᱶᱟᱹ ᱠᱷᱚᱱ ᱥᱟᱦᱟ ᱠᱟᱛᱮ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱚᱰᱚᱠ ᱰᱟᱦᱟᱨ ᱛᱮ ᱪᱟᱞᱟᱜ ᱢᱮ᱾'
        },
        expectedAction: 'REACH_ASSEMBLY_POINT',
        timeoutSeconds: 30
      }
    ]
  },

  // Module 2: Gas Leak & Confined Space AR Scenario
  '2': {
    scenarioId: 'ar-gas-drill-02',
    moduleId: '2',
    type: 'GAS_LEAK_CONFINED_SPACE',
    title: {
      en: 'AR Gas Leak & Confined Space Safety Protocol Drill',
      hi: 'AR गैस रिसाव एवं सीमित स्थान सुरक्षा प्रोटोकॉल',
      sat: 'AR ᱜᱮᱥ ᱞᱤᱠ ᱟᱨ ᱥᱟᱸᱠᱲᱟ ᱡᱟᱭᱜᱟ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱟᱵᱷᱭᱟᱥ'
    },
    briefing: {
      en: 'A toxic sulfur dioxide / methane gas leak is detected near the underground tunnel shaft. Scan the area, check gas readings, activate buddy protocols, and prevent fatal entry.',
      hi: 'सुरंग शाफ्ट के पास जहरीली गैस का रिसाव हो रहा है। गैस रीडिंग जांचें, बडी सिस्टम लागू करें और सुरक्षित निकास सुनिश्चित करें।',
      sat: 'ᱠᱷᱟᱫᱟᱱ ᱥᱩᱨ ᱨᱮ ᱵᱤᱥ ᱜᱮᱥ ᱞᱤᱠ ᱠᱟᱱᱟ᱾ ᱜᱮᱥ ᱢᱤᱴᱟᱨ ᱧᱮᱞ ᱢᱮ ᱟᱨ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱛᱟᱦᱮᱸᱱ ᱢᱮ᱾'
    },
    objects: [
      {
        id: 'obj_pipe_flange_leak',
        type: 'HAZARD_SOURCE',
        label: { en: 'Pressurized Pipe Flange (Toxic Gas Leak)', hi: 'लीक हो रही गैस पाइपलाइन', sat: 'ᱵᱤᱥ ᱜᱮᱥ ᱯᱟᱭᱤᱯ ᱞᱤᱠ' },
        position: { x: 0, y: 0.2, z: -2.2 },
        status: 'ACTIVE',
        isInteractive: true
      },
      {
        id: 'obj_multi_gas_detector',
        type: 'GAS_DETECTOR',
        label: { en: 'Multi-Gas Detector (LEL / H2S / O2 / CO)', hi: 'मल्टी-गैस डिटेक्टर मीटर', sat: 'ᱢᱟᱞᱴᱤ ᱜᱮᱥ ᱰᱤᱴᱮᱠᱴᱚᱨ' },
        position: { x: -0.8, y: -0.2, z: -1.2 },
        status: 'ACTIVE',
        isInteractive: true
      },
      {
        id: 'obj_scba_ppe_rack',
        type: 'PPE_RACK',
        label: { en: 'Self-Contained Breathing Apparatus (SCBA)', hi: 'SCBA श्वास उपकरण एवं सुरक्षा किट', sat: 'SCBA ᱥᱟᱦᱮᱫ ᱥᱟᱢᱟᱱ' },
        position: { x: 1.5, y: 0, z: -1.4 },
        status: 'ACTIVE',
        isInteractive: true
      },
      {
        id: 'obj_buddy_worker',
        type: 'BUDDY_WORKER',
        label: { en: 'Buddy Worker (Safety Standby Observer)', hi: 'सुरक्षा साथी (बडी ऑब्जर्वर)', sat: 'ᱨᱩᱠᱷᱤᱭᱟᱹ ᱜᱟᱛᱮ (ᱵᱟᱰᱤ)' },
        position: { x: -1.5, y: 0, z: -1.0 },
        status: 'ACTIVE',
        isInteractive: true
      },
      {
        id: 'obj_warning_barricade',
        type: 'BARRICADE',
        label: { en: 'High-Hazard Barrier Tape & Flasher', hi: 'खतरा चेतावनी बैरिकेड टेप', sat: 'ᱠᱷᱚᱛᱨᱟ ᱵᱮᱨᱤᱠᱮᱰ' },
        position: { x: 0, y: -0.4, z: -1.2 },
        status: 'ACTIVE',
        isInteractive: true
      }
    ],
    steps: [
      {
        stepIndex: 0,
        stepKey: 'SURFACE_SCAN',
        title: {
          en: '1. Surface Calibration: Scan Environment',
          hi: '1. स्थान कैलिब्रेशन: फर्श स्कैन करें',
          sat: '᱑. ᱡᱟᱭᱜᱟ ᱥᱠᱮᱱ ᱠᱟᱛᱮ ᱛᱷᱟᱯᱚᱱ ᱢᱮ'
        },
        instruction: {
          en: 'Scan the ground surface to anchor the virtual gas pipeline shaft and equipment.',
          hi: 'वर्चुअल गैस पाइपलाइन और सुरक्षा उपकरणों को स्थापित करने के लिए जमीन स्कैन करें।',
          sat: 'ᱵᱤᱥ ᱜᱮᱥ ᱯᱟᱭᱤᱯ ᱛᱷᱟᱯᱚᱱ ᱞᱟᱹᱜᱤᱫ ᱚᱛ ᱥᱠᱮᱱ ᱢᱮ᱾'
        },
        expectedAction: 'PLACE_SCENARIO',
        timeoutSeconds: 30
      },
      {
        stepIndex: 1,
        stepKey: 'INSPECT_GAS_READING',
        title: {
          en: '2. Atmospheric Testing: Read Gas Detector',
          hi: '2. गैस जांच: मल्टी-गैस डिटेक्टर पढ़ें',
          sat: '᱒. ᱜᱮᱥ ᱪᱮᱠ: ᱰᱤᱴᱮᱠᱴᱚᱨ ᱨᱤᱰᱤᱝ ᱧᱮᱞ ᱢᱮ'
        },
        instruction: {
          en: 'Tap the gas detector to read LEL (Lower Explosive Limit) and toxic H2S parts-per-million.',
          hi: 'गैस डिटेक्टर पर टैप करें और LEL तथा जहरीली गैस की मात्रा जांचें।',
          sat: 'ᱜᱮᱥ ᱢᱤᱴᱟᱨ ᱴᱤᱯᱟᱹᱣ ᱠᱟᱛᱮ ᱵᱤᱥ ᱜᱮᱥ ᱨᱤᱰᱤᱝ ᱧᱮᱞ ᱢᱮ᱾'
        },
        expectedAction: 'INSPECT_GAS_DETECTOR',
        timeoutSeconds: 25
      },
      {
        stepIndex: 2,
        stepKey: 'PROHIBIT_ENTRY_SAFETY',
        title: {
          en: '3. Hazard Decision: Prohibit Unsafe Entry',
          hi: '3. सुरक्षा निर्णय: असुरक्षित प्रवेश पर तत्काल रोक लगाएं',
          sat: '᱓. ᱨᱩᱠᱷᱤᱭᱟᱹ ᱯᱷᱟᱹᱭᱥᱟᱞᱟ: ᱵᱚᱞᱚᱱ ᱵᱚᱸᱫᱽ ᱢᱮ'
        },
        instruction: {
          en: 'LEL is at 38% (Dangerous Explosion Risk). What is the authoritative safety command?',
          hi: 'LEL 38% (विस्फोट का भारी खतरा) है। आपका तत्काल सुरक्षा आदेश क्या है?',
          sat: 'LEL ᱓᱘% ᱢᱮᱱᱟᱜ-ᱟ (ᱵᱤᱥᱯᱷᱚᱴ ᱠᱷᱚᱛᱨᱟ)᱾ ᱪᱮᱫ ᱠᱟᱹᱢᱤ ᱦᱩᱭᱩᱜ-ᱟ?'
        },
        expectedAction: 'PROHIBIT_UNSAFE_ENTRY',
        availableActionOptions: [
          {
            actionKey: 'HALT_AND_CORDON',
            label: {
              en: 'Prohibit all entry, shut off ignition sources, and declare Red Zone cordon',
              hi: 'सभी प्रवेश रोकें, बिजली उपकरण बंद करें और रेड जोन घोषित करें',
              sat: 'ᱡᱚᱛᱚ ᱵᱚᱞᱚᱱ ᱵᱚᱸᱫᱽ ᱢᱮ ᱟᱨ ᱨᱮᱰ ᱡᱚᱱ ᱵᱮᱱᱟᱣ ᱢᱮ'
            },
            isCorrect: true,
            feedback: {
              en: 'Correct! Any reading above 10% LEL requires immediate work stoppage and area isolation.',
              hi: 'उत्कृष्ट! 10% LEL से अधिक रीडिंग पर काम रोकना अनिवार्य है।',
              sat: 'ᱟᱹᱰᱤ ᱱᱟᱯᱟᱭ! ᱑᱐% LEL ᱠᱷᱚᱱ ᱵᱟᱹᱲᱛᱤ ᱨᱮ ᱠᱟᱹᱢᱤ ᱵᱚᱸᱫᱽ ᱜᱮᱭᱟ᱾'
            }
          },
          {
            actionKey: 'ENTER_QUICKLY',
            label: {
              en: 'Enter quickly without respirator to fix the valve before gas spreads',
              hi: 'मास्क के बिना जल्दी घुसकर वाल्व बंद करने की कोशिश करें',
              sat: 'ᱵᱤᱱ ᱢᱟᱥᱠ ᱛᱮ ᱞᱚᱜᱚᱱ ᱵᱚᱞᱚ ᱠᱟᱛᱮ ᱵᱷᱟᱞᱵᱽ ᱵᱚᱸᱫᱽ ᱢᱮ'
            },
            isCorrect: false,
            feedback: {
              en: 'FATAL ERROR: Single breath of concentrated toxic gas causes immediate unconsciousness and asphyxiation!',
              hi: 'घातक भूल: जहरीली गैस में सांस लेने से तुरंत बेहोशी और मौत हो सकती है!',
              sat: 'ᱢᱟᱨᱟᱝ ᱵᱷᱩᱞ: ᱵᱤᱥ ᱜᱮᱥ ᱥᱟᱦᱮᱫ ᱞᱮᱠᱷᱟᱱ ᱛᱩᱨᱩᱛ ᱡᱤᱣᱤ ᱪᱟᱞᱟᱜ-ᱟ!'
            }
          }
        ],
        timeoutSeconds: 30
      },
      {
        stepIndex: 3,
        stepKey: 'EQUIP_SCBA_KIT',
        title: {
          en: '4. Protective Gear: Don Positive-Pressure SCBA',
          hi: '4. सुरक्षा उपकरण: SCBA रेस्पिरेटर पहनें',
          sat: '᱔. ᱨᱩᱠᱷᱤᱭᱟᱹ ᱥᱟᱢᱟᱱ: SCBA ᱢᱟᱥᱠ ᱦᱚᱨᱚᱜ ᱢᱮ'
        },
        instruction: {
          en: 'Select and equip the Self-Contained Breathing Apparatus (SCBA) and full body harness from the safety rack.',
          hi: 'रैक से SCBA श्वास उपकरण और सुरक्षा हार्नेस पहनें।',
          sat: 'SCBA ᱥᱟᱦᱮᱫ ᱢᱟᱥᱠ ᱟᱨ ᱦᱟᱨᱱᱮᱥ ᱦᱚᱨᱚᱜ ᱢᱮ᱾'
        },
        expectedAction: 'EQUIP_SCBA_PPE',
        timeoutSeconds: 25
      },
      {
        stepIndex: 4,
        stepKey: 'BUDDY_SYSTEM_LIFELINE',
        title: {
          en: '5. Buddy Protocol: Establish Standby Observer Lifeline',
          hi: '5. बडी सिस्टम: सुरक्षा साथी के साथ लाइफलाइन स्थापित करें',
          sat: '᱕. ᱵᱟᱰᱤ ᱥᱤᱥᱴᱚᱢ: ᱜᱟᱛᱮ ᱥᱟᱶ ᱞᱟᱭᱤᱯᱷᱞᱟᱭᱤᱱ ᱡᱚᱲᱟᱣ ᱢᱮ'
        },
        instruction: {
          en: 'Pair with Standby Buddy Worker outside the hazard zone to maintain continuous line-of-sight and rope signal.',
          hi: 'खतरे के क्षेत्र के बाहर खड़े बडी साथी के साथ निरंतर दृष्टि और सिग्नल संपर्क बनाएं।',
          sat: 'ᱵᱟᱰᱤ ᱜᱟᱛᱮ ᱥᱟᱶ ᱛᱟᱦᱮᱸ ᱠᱟᱛᱮ ᱥᱤᱜᱽᱱᱟᱞ ᱡᱚᱲᱟᱣ ᱫᱚᱦᱚᱭ ᱢᱮ᱾'
        },
        expectedAction: 'ACTIVATE_BUDDY_SYSTEM',
        timeoutSeconds: 25
      },
      {
        stepIndex: 5,
        stepKey: 'DEPLOY_BARRICADE_EVACUATE',
        title: {
          en: '6. Cordon & Retreat: Deploy Barricade & Safe Retreat',
          hi: '6. बैरिकेडिंग एवं सुरक्षित निकास: चेतावनी टेप लगाएं और पीछे हटें',
          sat: '᱖. ᱵᱮᱨᱤᱠᱮᱰ ᱟᱨ ᱩᱰᱩᱠ: ᱠᱷᱚᱛᱨᱟ ᱴᱮᱯ ᱞᱟᱜᱟᱣ ᱠᱟᱛᱮ ᱥᱟᱦᱟᱜ ᱢᱮ'
        },
        instruction: {
          en: 'Deploy high-visibility warning barrier tape and evacuate upwind to the designated safe zone.',
          hi: 'चेतावनी बैरिकेड टेप लगाएं और हवा की विपरीत दिशा में सुरक्षित क्षेत्र की ओर बढ़ें।',
          sat: 'ᱵᱮᱨᱤᱠᱮᱰ ᱴᱮᱯ ᱞᱟᱜᱟᱣ ᱠᱟᱛᱮ ᱦᱚᱭ ᱵᱤᱨᱩᱫᱷ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱡᱟᱭᱜᱟ ᱥᱮᱱᱚᱜ ᱢᱮ᱾'
        },
        expectedAction: 'SAFE_MUSTER_RETREAT',
        timeoutSeconds: 30
      }
    ]
  }
};

export class ARSimulationEngine {
  private scenario: ARScenarioDefinition | null = null;
  private currentStepIndex = 0;
  private isSurfaceScanned = false;
  private startTime = 0;
  private unsafeActionsCount = 0;
  private actionsLog: {
    stepIndex: number;
    actionType: ARActionType;
    isSafe: boolean;
    timestamp: number;
    timeSpentSeconds: number;
  }[] = [];
  private domainScores: Record<
    'knowledge' | 'recognition' | 'decisionMaking' | 'procedure' | 'safetyCompliance',
    { earned: number; total: number }
  > = {
    knowledge: { earned: 100, total: 100 },
    recognition: { earned: 100, total: 100 },
    decisionMaking: { earned: 100, total: 100 },
    procedure: { earned: 100, total: 100 },
    safetyCompliance: { earned: 100, total: 100 }
  };

  public loadScenario(moduleId: string): ARScenarioDefinition {
    const scen = PRELOADED_AR_SCENARIOS[moduleId] || PRELOADED_AR_SCENARIOS['1'];
    this.scenario = scen;
    this.currentStepIndex = 0;
    this.isSurfaceScanned = false;
    this.startTime = Date.now();
    this.unsafeActionsCount = 0;
    this.actionsLog = [];
    return scen;
  }

  public getScenario(): ARScenarioDefinition | null {
    return this.scenario;
  }

  public getCurrentStep(): ARScenarioStep | null {
    if (!this.scenario || this.currentStepIndex >= this.scenario.steps.length) {
      return null;
    }
    return this.scenario.steps[this.currentStepIndex];
  }

  public getCurrentStepIndex(): number {
    return this.currentStepIndex;
  }

  public getTotalSteps(): number {
    return this.scenario ? this.scenario.steps.length : 5;
  }

  public confirmSurfacePlanePlacement(): ARActionResult {
    this.isSurfaceScanned = true;
    this.currentStepIndex = 1;
    this.actionsLog.push({
      stepIndex: 0,
      actionType: 'PLACE_SCENARIO',
      isSafe: true,
      timestamp: Date.now(),
      timeSpentSeconds: Math.round((Date.now() - this.startTime) / 1000)
    });

    return {
      isSuccess: true,
      feedbackText: {
        en: 'Surface plane locked. Industrial hazard scenario positioned in AR.',
        hi: 'सतह लॉक हो गई। AR में औद्योगिक सिमुलेशन सक्रिय है।',
        sat: 'ᱡᱟᱭᱜᱟ ᱞᱚᱠ ᱮᱱᱟ᱾ AR ᱥᱤᱢᱩᱞᱮᱥᱚᱱ ᱮᱦᱚᱵ ᱮᱱᱟ᱾'
      },
      isStepCompleted: true,
      nextStepIndex: 1
    };
  }

  public executeAction(actionType: ARActionType, isSafeChoice = true): ARActionResult {
    const currentStep = this.getCurrentStep();
    if (!currentStep) {
      return {
        isSuccess: false,
        feedbackText: { en: 'Scenario completed.', hi: 'सिमुलेशन पूर्ण।', sat: 'ᱥᱤᱢᱩᱞᱮᱥᱚᱱ ᱢᱩᱪᱟᱹᱫ ᱮᱱᱟ᱾' },
        isStepCompleted: true,
        isScenarioComplete: true
      };
    }

    const timeSpent = Math.round((Date.now() - this.startTime) / 1000);

    if (!isSafeChoice) {
      this.unsafeActionsCount++;
      this.domainScores.safetyCompliance.earned = Math.max(0, this.domainScores.safetyCompliance.earned - 25);
      this.domainScores.procedure.earned = Math.max(0, this.domainScores.procedure.earned - 20);

      this.actionsLog.push({
        stepIndex: this.currentStepIndex,
        actionType,
        isSafe: false,
        timestamp: Date.now(),
        timeSpentSeconds: timeSpent
      });

      return {
        isSuccess: false,
        feedbackText: {
          en: 'CRITICAL SAFETY VIOLATION! Procedure failed. Re-evaluate situation.',
          hi: 'गंभीर सुरक्षा उल्लंघन! प्रक्रिया विफल रही। स्थिति का पुनः मूल्यांकन करें।',
          sat: 'ᱢᱟᱨᱟᱝ ᱵᱷᱩᱞ! ᱱᱤᱭᱟᱹᱢ ᱵᱟᱹᱲᱤᱡ ᱮᱱᱟ᱾ ᱟᱨ ᱢᱤᱫ ᱫᱷᱟᱣ ᱪᱮᱥᱴᱟᱭ ᱢᱮ᱾'
        },
        isStepCompleted: false,
        dangerAlert: true,
        scoreDeduction: 25
      };
    }

    // Safe action executed
    this.actionsLog.push({
      stepIndex: this.currentStepIndex,
      actionType,
      isSafe: true,
      timestamp: Date.now(),
      timeSpentSeconds: timeSpent
    });

    const isLastStep = this.currentStepIndex === this.scenario!.steps.length - 1;
    if (isLastStep) {
      return {
        isSuccess: true,
        feedbackText: {
          en: 'Scenario successfully resolved with 100% compliance! Proceed to official exam.',
          hi: 'सिमुलेशन सफलतापूर्वक पूर्ण! आधिकारिक परीक्षा के लिए आगे बढ़ें।',
          sat: 'ᱥᱤᱢᱩᱞᱮᱥᱚᱱ ᱟᱹᱰᱤ ᱱᱟᱯᱟᱭ ᱛᱮ ᱢᱩᱪᱟᱹᱫ ᱮᱱᱟ! ᱯᱟᱨᱤᱠᱷᱭᱟ ᱞᱟᱹᱜᱤᱫ ᱞᱟᱦᱟᱜ ᱢᱮ᱾'
        },
        isStepCompleted: true,
        isScenarioComplete: true
      };
    }

    this.currentStepIndex++;
    return {
      isSuccess: true,
      feedbackText: {
        en: 'Step verified! Proceeding to next safety procedure.',
        hi: 'चरण सत्यापित! अगली सुरक्षा प्रक्रिया पर बढ़ें।',
        sat: 'ᱛᱷᱚᱠ ᱥᱟᱹᱨᱤ ᱮᱱᱟ! ᱞᱟᱦᱟ ᱥᱮᱫ ᱪᱟᱞᱟᱜ ᱢᱮ᱾'
      },
      isStepCompleted: true,
      nextStepIndex: this.currentStepIndex
    };
  }

  public getTelemetry(workerId: string): ARSessionTelemetry {
    const totalDurationSeconds = Math.round((Date.now() - this.startTime) / 1000);
    const overallScore = Math.max(
      30,
      Math.round(
        (this.domainScores.knowledge.earned +
          this.domainScores.recognition.earned +
          this.domainScores.decisionMaking.earned +
          this.domainScores.procedure.earned +
          this.domainScores.safetyCompliance.earned) /
          5
      )
    );

    const competency: CompetencyBreakdown = {
      knowledge: this.domainScores.knowledge.earned,
      recognition: this.domainScores.recognition.earned,
      decisionMaking: this.domainScores.decisionMaking.earned,
      procedure: this.domainScores.procedure.earned,
      safetyCompliance: this.domainScores.safetyCompliance.earned,
      overall: overallScore
    };

    return {
      sessionId: `ar-session-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      moduleId: this.scenario?.moduleId || '1',
      workerId,
      scenarioType: this.scenario?.type || 'FIRE_AND_EXPLOSION',
      startTime: this.startTime,
      completionTime: Date.now(),
      totalDurationSeconds,
      surfaceScannedSuccessfully: this.isSurfaceScanned,
      stepsCompleted: this.currentStepIndex,
      totalSteps: this.scenario?.steps.length || 5,
      unsafeActionsTriggered: this.unsafeActionsCount,
      actionsLog: this.actionsLog,
      competencyScore: competency,
      isCompletedSuccessfully: this.currentStepIndex >= (this.scenario?.steps.length || 5) - 1 && this.unsafeActionsCount === 0
    };
  }

  public getAssetCatalog(): Record<IndustrialAssetType, IndustrialAssetDefinition> {
    return INDUSTRIAL_ASSET_CATALOG;
  }

  public getAssetDefinition(type: IndustrialAssetType): IndustrialAssetDefinition | undefined {
    return INDUSTRIAL_ASSET_CATALOG[type];
  }
}
