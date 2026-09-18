import {
  TrainingExperienceEngine,
  ActionValidationResult
} from './TrainingExperienceEngine';
import {
  ScenarioDefinition,
  ScenarioSessionState,
  ScenarioStep,
  CompetencyBreakdown
} from '@parishak/shared';

const PRELOADED_SCENARIOS: Record<string, ScenarioDefinition> = {
  // Fire & Explosion Scenario (Module 1)
  '1': {
    scenarioId: 'scen-fire-01',
    moduleId: '1',
    title: {
      en: 'Fire Hazard Recognition & PASS Extinguisher Drill',
      hi: 'अग्नि पहचान एवं PASS अग्निशामक अभ्यास',
      sat: 'ᱥᱮᱸᱜᱮᱞ ᱪᱤᱱᱦᱟᱹᱣ ᱟᱨ PASS ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱟᱵᱷᱭᱟᱥ'
    },
    briefing: {
      en: 'A diesel generator on the main mining plant floor has ignited. Thick black smoke is gathering. Follow the safety response sequence.',
      hi: 'प्लांट में डीजल जनरेटर में आग लग गई है। घना काला धुआं उठ रहा है। सही क्रम में सुरक्षा कार्रवाई करें।',
      sat: 'ᱰᱤᱡᱮᱞ ᱡᱮᱱᱮᱨᱮᱴᱚᱨ ᱨᱮ ᱥᱮᱸᱜᱮᱞ ᱞᱟᱜᱟᱣ ᱮᱱᱟ᱾ ᱥᱟᱹᱦᱤᱡ ᱛᱚᱦᱚᱨ ᱛᱮ ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱢᱮ᱾'
    },
    steps: [
      {
        stepId: 'step_1_identify',
        order: 1,
        title: {
          en: 'Step 1: Identify Fire Class & Immediate Hazard',
          hi: 'चरण 1: आग की श्रेणी और खतरे की पहचान',
          sat: 'ᱛᱷᱚᱠ ᱑: ᱥᱮᱸᱜᱮᱞ ᱦᱟᱹᱴᱤᱧ ᱪᱤᱱᱦᱟᱹᱣ'
        },
        description: {
          en: 'You spot flames leaping from the diesel generator fuel reservoir. What is your immediate hazard evaluation?',
          hi: 'डीजल टैंक से आग की लपटें उठ रही हैं। आपका पहला मूल्यांकन क्या है?',
          sat: 'ᱰᱤᱡᱮᱞ ᱴᱮᱝᱠᱤ ᱠᱷᱚᱱ ᱥᱮᱸᱜᱮᱞ ᱡᱩᱞᱩᱜ ᱠᱟᱱᱟ᱾ ᱪᱮᱫ ᱮᱢ ᱪᱤᱱᱦᱟᱹᱣᱟ?'
        },
        environmentType: 'PLANT_FLOOR',
        availableActions: [
          {
            actionId: 'act_identify_class_b',
            label: {
              en: 'Class B (Flammable Liquid) - Prohibit Water!',
              hi: 'क्लास B (ज्वलनशील तरल) - पानी का प्रयोग वर्जित!',
              sat: 'ᱠᱞᱟᱥ B (ᱥᱩᱱᱩᱢ ᱥᱮᱸᱜᱮᱞ) - ᱫᱟᱜ ᱟᱞᱚᱯᱮ ᱫᱩᱞᱟ!'
            },
            isSafeAction: true,
            feedbackMessage: {
              en: 'Correct! Burning diesel is Class B. Water causes catastrophic boiling expansion and flash explosions.',
              hi: 'बिल्कुल सही! डीजल आग क्लास B है। पानी से तेज विस्फोट होता है।',
              sat: 'ᱥᱟᱹᱨᱤ ᱜᱮᱭᱟ! ᱰᱤᱡᱮᱞ ᱥᱮᱸᱜᱮᱞ ᱨᱮ ᱫᱟᱜ ᱫᱩᱞ ᱢᱟᱱᱟ ᱜᱮᱭᱟ᱾'
            },
            competencyDomain: 'recognition'
          },
          {
            actionId: 'act_throw_water',
            label: {
              en: 'Throw high-pressure water bucket directly onto diesel',
              hi: 'डीजल पर पानी की बाल्टी फेंकें',
              sat: 'ᱥᱩᱱᱩᱢ ᱪᱮᱛᱟᱱ ᱨᱮ ᱫᱟᱜ ᱵᱟᱞᱴᱤ ᱫᱩᱞ'
            },
            isSafeAction: false,
            feedbackMessage: {
              en: 'FATAL ERROR! Water sinks beneath oil, boils violently into steam and launches flaming droplets across the room.',
              hi: 'घातक गलती! तेल पर पानी डालने से भाप का विस्फोट होगा और आग भड़क जाएगी।',
              sat: 'ᱢᱟᱨᱟᱝ ᱵᱷᱩᱞ! ᱫᱟᱜ ᱫᱩᱞ ᱞᱮᱠᱷᱟᱱ ᱵᱤᱥᱯᱷᱚᱴ ᱦᱩᱭᱩᱜ-ᱟ᱾'
            },
            competencyDomain: 'recognition'
          }
        ],
        correctActionId: 'act_identify_class_b'
      },
      {
        stepId: 'step_2_alarm',
        order: 2,
        title: {
          en: 'Step 2: Emergency Warning & Communication',
          hi: 'चरण 2: आपातकालीन चेतावनी एवं अलार्म',
          sat: 'ᱛᱷᱚᱠ ᱒: ᱮᱢᱟᱨᱡᱮᱱᱥᱤ ᱟᱞᱟᱨᱢ ᱞᱤᱱ'
        },
        description: {
          en: 'Before grabbing any equipment, how do you protect other plant personnel?',
          hi: 'उपकरण उठाने से पहले अन्य साथियों की सुरक्षा कैसे सुनिश्चित करेंगे?',
          sat: 'ᱥᱟᱢᱟᱱ ᱥᱟᱵ ᱢᱟᱲᱟᱝ ᱮᱴᱟᱜ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱪᱮᱫ ᱞᱮᱠᱟᱢ ᱪᱮᱛᱟᱣᱱᱤ ᱮᱢᱟ ᱠᱚᱣᱟ?'
        },
        environmentType: 'PLANT_FLOOR',
        availableActions: [
          {
            actionId: 'act_pull_manual_callpoint',
            label: {
              en: 'Trigger Nearest Manual Fire Alarm Call-Point & Shout Code Red',
              hi: 'पास का फायर अलार्म बटन दबाएं और कोड रेड की घोषणा करें',
              sat: 'ᱯᱟᱥ ᱨᱮᱭᱟᱜ ᱟᱞᱟᱨᱢ ᱵᱟᱴᱚᱱ ᱞᱤᱱ ᱠᱟᱛᱮ ᱪᱮᱛᱟᱣᱱᱤ ᱮᱢ ᱢᱮ'
            },
            isSafeAction: true,
            feedbackMessage: {
              en: 'Correct! Initiating facility-wide sirens mobilizes emergency responders and starts safe evacuation.',
              hi: 'उत्कृष्ट! अलार्म से पूरी टीम को निकासी और बचाव के लिए चेतावनी मिलती है।',
              sat: 'ᱟᱹᱰᱤ ᱱᱟᱯᱟᱭ! ᱟᱞᱟᱨᱢ ᱛᱮ ᱡᱚᱛᱚ ᱦᱚᱲ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱰᱟᱦᱟᱨ ᱛᱮ ᱠᱚ ᱩᱰᱩᱠᱚᱜ-ᱟ᱾'
            },
            competencyDomain: 'procedure'
          },
          {
            actionId: 'act_ignore_alarm',
            label: {
              en: 'Stay silent and try to extinguish it alone without alerting control room',
              hi: 'किसी को बताए बिना अकेले बुझाने की कोशिश करें',
              sat: 'ᱪᱮᱫ ᱦᱚᱸ ᱵᱟᱝ ᱢᱮᱱ ᱠᱟᱛᱮ ᱮᱠᱞᱟ ᱤᱬᱤᱡ ᱨᱮ ᱛᱟᱦᱮᱸᱱ ᱢᱮ'
            },
            isSafeAction: false,
            feedbackMessage: {
              en: 'VIOLATION: Failure to sound alarm delays emergency response and traps personnel.',
              hi: 'नियम उल्लंघन: अलार्म न बजाने से अन्य लोगों की जान खतरे में पड़ती है।',
              sat: 'ᱱᱤᱭᱟᱹᱢ ᱵᱟᱹᱲᱤᱡ: ᱟᱞᱟᱨᱢ ᱵᱟᱝ ᱞᱤᱱ ᱞᱮᱠᱷᱟᱱ ᱮᱴᱟᱜ ᱦᱚᱲ ᱠᱚ ᱠᱷᱚᱛᱨᱟ ᱨᱮ ᱠᱚ ᱯᱟᱲᱟᱣᱜ-ᱟ᱾'
            },
            competencyDomain: 'procedure'
          }
        ],
        correctActionId: 'act_pull_manual_callpoint'
      },
      {
        stepId: 'step_3_select_extinguisher',
        order: 3,
        title: {
          en: 'Step 3: Fire Extinguisher Selection',
          hi: 'चरण 3: सही अग्निशामक का चयन',
          sat: 'ᱛᱷᱚᱠ ᱓: ᱥᱟᱹᱦᱤᱡ ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱢᱤᱥᱤᱱ ᱵᱟᱪᱷᱟᱣ'
        },
        description: {
          en: 'You reach the emergency equipment station. Which extinguisher do you retrieve for burning generator fuel?',
          hi: 'उपकरण स्टेशन पर कौन सा एक्सटिंग्विशर चुनेंगे?',
          sat: 'ᱥᱴᱮᱥᱚᱱ ᱨᱮ ᱪᱮᱫ ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱢᱤᱥᱤᱱ ᱮᱢ ᱤᱫᱤᱭᱟ?'
        },
        environmentType: 'PLANT_FLOOR',
        availableActions: [
          {
            actionId: 'act_select_abc_drychem',
            label: {
              en: 'ABC Dry Chemical Powder / CO2 Extinguisher (Blue/Black band)',
              hi: 'ABC ड्राई केमिकल पाउडर / CO2 एक्सटिंग्विशर',
              sat: 'ABC ᱰᱨᱟᱭ ᱯᱟᱣᱰᱟᱨ / CO2 ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱢᱤᱥᱤᱱ'
            },
            isSafeAction: true,
            feedbackMessage: {
              en: 'Correct! Dry powder and CO2 smother oxygen and interrupt the chemical chain reaction of burning fuel.',
              hi: 'सही! ड्राई केमिकल ऑक्सीजन काटकर आग को तुरंत बुझा देता है।',
              sat: 'ᱥᱟᱹᱨᱤ! ᱰᱨᱟᱭ ᱯᱟᱣᱰᱟᱨ ᱛᱮ ᱥᱮᱸᱜᱮᱞ ᱞᱚᱜᱚᱱ ᱤᱬᱤᱡ-ᱟ᱾'
            },
            competencyDomain: 'knowledge'
          },
          {
            actionId: 'act_select_water_extinguisher',
            label: {
              en: 'Pressurized Water Extinguisher (Red band with water droplet)',
              hi: 'पानी वाला एक्सटिंग्विशर',
              sat: 'ᱫᱟᱜ ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱢᱤᱥᱤᱱ'
            },
            isSafeAction: false,
            feedbackMessage: {
              en: 'INCORRECT: Never use water on liquid fuel or energized electrical equipment.',
              hi: 'गलत: तेल या बिजली उपकरण पर पानी एक्सटिंग्विशर कभी न चलाएं।',
              sat: 'ᱮᱲᱮ: ᱥᱩᱱᱩᱢ ᱥᱮᱸᱜᱮᱞ ᱨᱮ ᱫᱟᱜ ᱢᱤᱥᱤᱱ ᱟᱞᱚᱢ ᱵᱮᱵᱷᱟᱨᱟ᱾'
            },
            competencyDomain: 'knowledge'
          }
        ],
        correctActionId: 'act_select_abc_drychem'
      },
      {
        stepId: 'step_4_pass_protocol',
        order: 4,
        title: {
          en: 'Step 4: Execute PASS Technique Operation',
          hi: 'चरण 4: PASS तकनीक का प्रयोग',
          sat: 'ᱛᱷᱚᱠ ᱔: PASS ᱦᱚᱨᱟ ᱛᱮ ᱤᱬᱤᱡ'
        },
        description: {
          en: 'Stand 2 to 3 meters back with your back towards the exit. Execute the 4-step PASS procedure.',
          hi: '2-3 मीटर की दूरी पर खड़े हों और PASS तकनीक अपनाएं।',
          sat: '᱒-᱓ ᱢᱤᱴᱟᱨ ᱥᱟᱺᱜᱤᱧ ᱨᱮ ᱛᱤᱸᱜᱩ ᱠᱟᱛᱮ PASS ᱛᱚᱦᱚᱨ ᱯᱟᱸᱡᱟᱭ ᱢᱮ᱾'
        },
        environmentType: 'PLANT_FLOOR',
        availableActions: [
          {
            actionId: 'act_execute_pass_correct',
            label: {
              en: 'P: Pull Pin → A: Aim at Base → S: Squeeze Lever → S: Sweep Side-to-Side',
              hi: 'P: पिन खींचें → A: जड़ पर निशाना → S: लीवर दबाएं → S: दायें-बायें घुमाएं',
              sat: 'P: ᱯᱤᱱ ᱚᱨ → A: ᱞᱟᱛᱟᱨ ᱱᱤᱥᱟᱱᱟ → S: ᱦᱮᱱᱰᱮᱞ ᱞᱤᱱ → S: ᱞᱮᱸᱜᱟ-ᱡᱚᱡᱚᱢ ᱦᱤᱞᱟᱹᱣ'
            },
            isSafeAction: true,
            feedbackMessage: {
              en: 'EXCELLENT! The discharge blankets the fuel base, eliminating oxygen and extinguishing the blaze in seconds.',
              hi: 'शानदार! आग की जड़ पर सटीक छिड़काव से आग तुरंत बुझ गई।',
              sat: 'ᱟᱹᱰᱤ ᱪᱚᱨᱚᱠ! ᱥᱮᱸᱜᱮᱞ ᱯᱩᱨᱟᱹ ᱤᱬᱤᱡ ᱮᱱᱟ᱾'
            },
            competencyDomain: 'procedure'
          },
          {
            actionId: 'act_aim_at_top_smoke',
            label: {
              en: 'Aim high into the rising smoke and squeeze continuously until empty',
              hi: 'ऊपर उठते धुएं पर छिड़कें',
              sat: 'ᱪᱮᱛᱟᱱ ᱫᱷᱩᱶᱟᱹ ᱨᱮ ᱪᱷᱤᱴᱠᱟᱹᱣ ᱢᱮ'
            },
            isSafeAction: false,
            feedbackMessage: {
              en: 'INCORRECT: Aiming into smoke wastes chemical powder. You must aim directly at the fuel base.',
              hi: 'गलत: धुएं पर छिड़कने से पाउडर व्यर्थ होता है। हमेशा आग की जड़ पर निशाना लगाएं।',
              sat: 'ᱮᱲᱮ: ᱫᱷᱩᱶᱟᱹ ᱨᱮ ᱪᱷᱤᱴᱠᱟᱹᱣ ᱞᱮᱠᱷᱟᱱ ᱯᱟᱣᱰᱟᱨ ᱪᱟᱵᱟᱜ-ᱟ, ᱞᱟᱛᱟᱨ ᱨᱮ ᱱᱤᱥᱟᱱᱟ ᱢᱮ᱾'
            },
            competencyDomain: 'procedure'
          }
        ],
        correctActionId: 'act_execute_pass_correct'
      },
      {
        stepId: 'step_5_evacuate_muster',
        order: 5,
        title: {
          en: 'Step 5: Evacuation to Safe Assembly Zone',
          hi: 'चरण 5: सुरक्षित असेंबली पॉइंट पर निकासी',
          sat: 'ᱛᱷᱚᱠ ᱕: ᱨᱩᱠᱷᱤᱭᱟᱹ ᱡᱟᱣᱨᱟᱜ ᱡᱟᱭᱜᱟ ᱛᱮ ᱥᱮᱱᱚᱜ'
        },
        description: {
          en: 'Flames are knocked down. Smoke is still toxic. Complete the safe evacuation protocol.',
          hi: 'आग बुझ गई है लेकिन धुआं जहरीला है। सुरक्षित बाहर निकलें।',
          sat: 'ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱮᱱᱟ ᱢᱮᱱᱠᱷᱟᱱ ᱫᱷᱩᱶᱟᱹ ᱢᱮᱱᱟᱜ ᱜᱮᱭᱟ᱾ ᱞᱚᱜᱚᱱ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱡᱟᱭᱜᱟ ᱥᱮᱱᱚᱜ ᱢᱮ᱾'
        },
        environmentType: 'PLANT_FLOOR',
        availableActions: [
          {
            actionId: 'act_evacuate_muster_point',
            label: {
              en: 'Back away watching for re-ignition, exit building, report to Muster Supervisor',
              hi: 'आग पर नजर रखते हुए पीछे हटें, बाहर निकलें और असेंबली पॉइंट पर रिपोर्ट करें',
              sat: 'ᱥᱮᱸᱜᱮᱞ ᱠᱚᱭᱚᱜ ᱠᱟᱛᱮ ᱛᱟᱭᱚᱢ ᱥᱮᱱ ᱩᱰᱩᱠ ᱢᱮ ᱟᱨ ᱦᱟᱡᱤᱨᱤ ᱮᱢ ᱢᱮ'
            },
            isSafeAction: true,
            feedbackMessage: {
              en: 'MISSION COMPLETE! You executed flawless emergency fire suppression and safe muster protocol.',
              hi: 'अभ्यास पूर्ण! आपने सफलतापूर्वक आग बुझाई और सुरक्षित निकासी की।',
              sat: 'ᱠᱟᱹᱢᱤ ᱯᱩᱨᱟᱹᱣ ᱮᱱᱟ! ᱟᱢ ᱥᱟᱹᱦᱤᱡ ᱛᱮ ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱠᱟᱛᱮ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱡᱟᱭᱜᱟ ᱮᱢ ᱥᱮᱴᱮᱨ ᱮᱱᱟ᱾'
            },
            competencyDomain: 'safetyCompliance'
          }
        ],
        correctActionId: 'act_evacuate_muster_point'
      }
    ]
  }
};

export class SimulationEngine implements TrainingExperienceEngine {
  private currentScenario: ScenarioDefinition | null = null;
  private state: ScenarioSessionState = {
    sessionId: '',
    scenarioId: '',
    currentStepIndex: 0,
    isCompleted: false,
    actionsHistory: [],
    score: 0,
    competency: {
      knowledge: 100,
      recognition: 100,
      decisionMaking: 100,
      procedure: 100,
      safetyCompliance: 100,
      overall: 100
    },
    startTime: Date.now()
  };

  async loadScenario(moduleId: string): Promise<ScenarioDefinition> {
    const scen = PRELOADED_SCENARIOS[moduleId] || PRELOADED_SCENARIOS['1'];
    this.currentScenario = scen;
    return scen;
  }

  async startScenario(scenarioId: string): Promise<ScenarioSessionState> {
    this.state = {
      sessionId: `sim-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      scenarioId,
      currentStepIndex: 0,
      isCompleted: false,
      actionsHistory: [],
      score: 0,
      competency: {
        knowledge: 100,
        recognition: 100,
        decisionMaking: 100,
        procedure: 100,
        safetyCompliance: 100,
        overall: 100
      },
      startTime: Date.now()
    };
    return this.state;
  }

  async recordAction(
    actionId: string,
    timeSpentSeconds: number
  ): Promise<ActionValidationResult> {
    if (!this.currentScenario) {
      throw new Error('No scenario loaded in SimulationEngine');
    }

    const currentStep = this.currentScenario.steps[this.state.currentStepIndex];
    if (!currentStep) {
      return {
        isSafeAction: false,
        pointsAwarded: 0,
        feedbackMessage: 'Step not found',
        isStepCompleted: true
      };
    }

    const action = currentStep.availableActions.find((a) => a.actionId === actionId);
    const isSafe = action ? action.isSafeAction : false;
    const isCorrect = actionId === currentStep.correctActionId;

    this.state.actionsHistory.push({
      stepId: currentStep.stepId,
      actionId,
      timestamp: Date.now()
    });

    const points = isCorrect ? 20 : isSafe ? 10 : 0;
    this.state.score += points;

    // Adjust competency penalty if unsafe action chosen
    if (!isSafe && action) {
      const domain = action.competencyDomain;
      this.state.competency[domain] = Math.max(20, this.state.competency[domain] - 25);
    }

    // Step progression
    let isStepCompleted = false;
    if (isCorrect || isSafe) {
      isStepCompleted = true;
      if (this.state.currentStepIndex < this.currentScenario.steps.length - 1) {
        this.state.currentStepIndex += 1;
      } else {
        this.state.isCompleted = true;
        this.state.endTime = Date.now();
      }
    }

    const feedback = action
      ? typeof action.feedbackMessage === 'string'
        ? action.feedbackMessage
        : action.feedbackMessage.en
      : 'Action evaluated';

    return {
      isSafeAction: isSafe,
      pointsAwarded: points,
      feedbackMessage: feedback,
      isStepCompleted
    };
  }

  getCurrentStep(): ScenarioStep | null {
    if (!this.currentScenario) return null;
    return this.currentScenario.steps[this.state.currentStepIndex] || null;
  }

  getCurrentState(): ScenarioSessionState {
    return { ...this.state };
  }

  async completeScenario(): Promise<ScenarioSessionState> {
    this.state.isCompleted = true;
    this.state.endTime = Date.now();
    return this.state;
  }

  getScore(): { score: number; competency: CompetencyBreakdown } {
    const comp = this.state.competency;
    const overall = Math.round(
      (comp.knowledge + comp.recognition + comp.decisionMaking + comp.procedure + comp.safetyCompliance) / 5
    );
    return {
      score: this.state.score,
      competency: { ...comp, overall }
    };
  }
}
