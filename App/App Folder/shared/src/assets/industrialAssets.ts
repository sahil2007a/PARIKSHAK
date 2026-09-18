import { IndustrialAssetDefinition, IndustrialAssetType } from '../types';

export const INDUSTRIAL_ASSET_CATALOG: Record<IndustrialAssetType, IndustrialAssetDefinition> = {
  diesel_generator: {
    id: 'asset_diesel_generator',
    type: 'diesel_generator',
    name: {
      en: 'High-Output Industrial Diesel Generator',
      hi: 'उच्च-उत्पादन औद्योगिक डीजल जनरेटर',
      sat: 'ᱰᱤᱡᱮᱞ ᱡᱮᱱᱮᱨᱮᱴᱚᱨ'
    },
    description: {
      en: '3-Phase industrial standby generator. Potential source of Class B liquid and electrical fire hazards.',
      hi: '3-फेज औद्योगिक बैकअप जनरेटर। क्लास B तरल और विद्युत आग का संभावित स्रोत।',
      sat: '᱓-ᱯᱷᱮᱡᱽ ᱰᱤᱡᱮᱞ ᱡᱮᱱᱮᱨᱮᱴᱚᱨ ᱥᱮᱸᱜᱮᱞ ᱵᱚᱛᱚᱨ ᱴᱷᱟᱶ'
    },
    model: '/assets/industrial/diesel_generator.glb',
    preferredPlane: 'horizontal',
    scale: 1.0,
    interactionEnabled: true,
    hazardTypes: ['fire', 'fuel', 'electrical'],
    trainingModule: 'fire_explosion',
    anchorRules: {
      snapToPlane: true,
      minClearanceRadiusMeters: 2.0,
      defaultElevation: 0.0
    },
    boundingDimensions: {
      width: 1.8,
      height: 1.4,
      depth: 1.2
    },
    yoloClass: 'machinery_generator'
  },
  electrical_panel: {
    id: 'asset_electrical_panel',
    type: 'electrical_panel',
    name: {
      en: 'High-Voltage Distribution Panel (415V)',
      hi: 'उच्च-वोल्टेज वितरण पैनल (415V)',
      sat: 'ᱵᱤᱡᱽᱞᱤ ᱯᱮᱱᱮᱞ (᱔᱑᱕V)'
    },
    description: {
      en: 'Main electrical distribution switchgear requiring Class C/CO2 fire protection and LOTO procedures.',
      hi: 'मुख्य विद्युत वितरण स्विचगियर जिसे क्लास C/CO2 सुरक्षा और LOTO प्रक्रिया की आवश्यकता है।',
      sat: 'ᱵᱤᱡᱽᱞᱤ ᱥᱩᱭᱤᱪᱵᱚᱨᱰ ᱟᱨ ᱥᱮᱸᱜᱮᱞ ᱵᱚᱛᱚᱨ'
    },
    model: '/assets/industrial/electrical_panel.glb',
    preferredPlane: 'vertical',
    scale: 0.9,
    interactionEnabled: true,
    hazardTypes: ['electrical', 'high_voltage', 'fire'],
    trainingModule: 'fire_explosion',
    anchorRules: {
      snapToPlane: true,
      minClearanceRadiusMeters: 1.5,
      defaultElevation: 0.8
    },
    boundingDimensions: {
      width: 1.0,
      height: 1.8,
      depth: 0.4
    },
    yoloClass: 'electrical_cabinet'
  },
  industrial_motor: {
    id: 'asset_industrial_motor',
    type: 'industrial_motor',
    name: {
      en: 'Heavy Duty Induction Motor',
      hi: 'भारी-भरकम इंडक्शन मोटर',
      sat: 'ᱢᱟᱨᱟᱝ ᱤᱱᱰᱟᱠᱥᱚᱱ ᱢᱚᱴᱚᱨ'
    },
    description: {
      en: 'Mining ventilation drive motor. Requires thermal monitoring and lock-out isolation.',
      hi: 'खनन वेंटिलेशन ड्राइव मोटर। थर्मल निगरानी और लॉक-आउट अलगाव की आवश्यकता है।',
      sat: 'ᱠᱷᱟᱫᱟᱱ ᱦᱚᱭ ᱢᱚᱴᱚᱨ ᱥᱩᱨᱩᱠᱷᱤᱭᱟᱹ'
    },
    model: '/assets/industrial/industrial_motor.glb',
    preferredPlane: 'horizontal',
    scale: 0.8,
    interactionEnabled: true,
    hazardTypes: ['electrical', 'pinch_point'],
    trainingModule: 'general',
    anchorRules: {
      snapToPlane: true,
      minClearanceRadiusMeters: 1.2,
      defaultElevation: 0.0
    },
    boundingDimensions: {
      width: 0.9,
      height: 0.8,
      depth: 1.1
    },
    yoloClass: 'machinery_motor'
  },
  conveyor_system: {
    id: 'asset_conveyor_system',
    type: 'conveyor_system',
    name: {
      en: 'Coal Bulk Handling Conveyor',
      hi: 'कोयला थोक हैंडलिंग कन्वेयर',
      sat: 'ᱠᱚᱭᱞᱟ ᱤᱫᱤ ᱠᱚᱱᱵᱷᱮᱭᱟᱨ'
    },
    description: {
      en: 'Continuous bulk material transport with pull-cord emergency trip wire and nip points.',
      hi: 'पुल-कॉर्ड आपातकालीन ट्रिप वायर और निप पॉइंट्स के साथ निरंतर थोक सामग्री परिवहन।',
      sat: 'ᱞᱮᱛᱟᱲ ᱠᱚᱭᱞᱟ ᱤᱫᱤ ᱨᱤᱱ ᱠᱚᱱᱵᱷᱮᱭᱟᱨ'
    },
    model: '/assets/industrial/conveyor_system.glb',
    preferredPlane: 'horizontal',
    scale: 1.2,
    interactionEnabled: true,
    hazardTypes: ['pinch_point', 'electrical'],
    trainingModule: 'general',
    anchorRules: {
      snapToPlane: true,
      minClearanceRadiusMeters: 2.5,
      defaultElevation: 0.2
    },
    boundingDimensions: {
      width: 1.2,
      height: 1.0,
      depth: 3.5
    },
    yoloClass: 'machinery_conveyor'
  },
  gas_cylinder: {
    id: 'asset_gas_cylinder',
    type: 'gas_cylinder',
    name: {
      en: 'Pressurized Methane (CH4) Cylinder Rack',
      hi: 'दबावयुक्त मीथेन (CH4) सिलेंडर रैक',
      sat: 'ᱜᱮᱥ ᱥᱤᱞᱤᱱᱰᱟᱨ ᱨᱮᱠ'
    },
    description: {
      en: 'Compressed flammable hydrocarbon gas. Extreme risk of BLEVE and vapor explosion.',
      hi: 'संपीड़ित ज्वलनशील हाइड्रोकार्बन गैस। BLEVE और वाष्प विस्फोट का अत्यधिक खतरा।',
      sat: 'ᱡᱩᱞᱩᱜ ᱜᱮᱥ ᱥᱤᱞᱤᱱᱰᱟᱨ ᱵᱚᱛᱚᱨ'
    },
    model: '/assets/industrial/gas_cylinder.glb',
    preferredPlane: 'horizontal',
    scale: 0.85,
    interactionEnabled: true,
    hazardTypes: ['flammable_gas', 'pressure', 'fire'],
    trainingModule: 'gas_leak_confined_space',
    anchorRules: {
      snapToPlane: true,
      minClearanceRadiusMeters: 3.0,
      defaultElevation: 0.0
    },
    boundingDimensions: {
      width: 0.8,
      height: 1.5,
      depth: 0.6
    },
    yoloClass: 'pressurized_cylinder'
  },
  oxygen_cylinder: {
    id: 'asset_oxygen_cylinder',
    type: 'oxygen_cylinder',
    name: {
      en: 'High-Pressure Oxygen Storage Unit',
      hi: 'उच्च दबाव ऑक्सीजन भंडारण इकाई',
      sat: 'ᱚᱠᱥᱤᱡᱮᱱ ᱥᱤᱞᱤᱱᱰᱟᱨ ᱴᱷᱟᱶ'
    },
    description: {
      en: 'Oxidizer storage bank. Must be segregated from flammable oils and fuel sources.',
      hi: 'ऑक्सीडाइज़र भंडारण बैंक। ज्वलनशील तेल और ईंधन स्रोतों से अलग रखा जाना चाहिए।',
      sat: 'ᱚᱠᱥᱤᱡᱮᱱ ᱥᱤᱞᱤᱱᱰᱟᱨ ᱥᱩᱨᱩᱠᱷᱤᱭᱟᱹ'
    },
    model: '/assets/industrial/oxygen_cylinder.glb',
    preferredPlane: 'horizontal',
    scale: 0.85,
    interactionEnabled: false,
    hazardTypes: ['pressure'],
    trainingModule: 'gas_leak_confined_space',
    anchorRules: {
      snapToPlane: true,
      minClearanceRadiusMeters: 2.0,
      defaultElevation: 0.0
    },
    boundingDimensions: {
      width: 0.8,
      height: 1.5,
      depth: 0.6
    },
    yoloClass: 'pressurized_cylinder'
  },
  fire_extinguisher_abc: {
    id: 'asset_fire_extinguisher_abc',
    type: 'fire_extinguisher_abc',
    name: {
      en: 'ABC Dry Chemical Powder Extinguisher (6kg)',
      hi: 'ABC सूखा रासायनिक पाउडर अग्निशामक (6kg)',
      sat: 'ABC ᱨᱚᱦᱚᱲ ᱨᱟᱱ ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ (᱖kg)'
    },
    description: {
      en: 'Monoammonium phosphate multipurpose extinguisher. Rated for Class A (solids), Class B (liquids), and Class C (electrical).',
      hi: 'मोनोअमोनियम फॉस्फेट बहुउद्देशीय शामक। क्लास A, B और C के लिए रेटेड।',
      sat: 'ABC ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ ᱥᱟᱢᱟᱱ'
    },
    model: '/assets/industrial/extinguisher_abc.glb',
    preferredPlane: 'any',
    scale: 0.75,
    interactionEnabled: true,
    hazardTypes: [],
    trainingModule: 'fire_explosion',
    anchorRules: {
      snapToPlane: true,
      minClearanceRadiusMeters: 0.8,
      defaultElevation: 0.3
    },
    boundingDimensions: {
      width: 0.3,
      height: 0.65,
      depth: 0.3
    },
    yoloClass: 'fire_extinguisher'
  },
  fire_extinguisher_co2: {
    id: 'asset_fire_extinguisher_co2',
    type: 'fire_extinguisher_co2',
    name: {
      en: 'CO2 Gas Fire Extinguisher (4.5kg)',
      hi: 'CO2 गैस अग्निशामक (4.5kg)',
      sat: 'CO2 ᱜᱮᱥ ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ (᱔.᱕kg)'
    },
    description: {
      en: 'Carbon dioxide discharge with horn. Ideal for energized electrical equipment without residue.',
      hi: 'हॉर्न के साथ कार्बन डाइऑक्साइड डिस्चार्ज। अवशेष के बिना विद्युतीकृत उपकरणों के लिए आदर्श।',
      sat: 'CO2 ᱵᱤᱡᱽᱞᱤ ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ'
    },
    model: '/assets/industrial/extinguisher_co2.glb',
    preferredPlane: 'any',
    scale: 0.75,
    interactionEnabled: true,
    hazardTypes: [],
    trainingModule: 'fire_explosion',
    anchorRules: {
      snapToPlane: true,
      minClearanceRadiusMeters: 0.8,
      defaultElevation: 0.3
    },
    boundingDimensions: {
      width: 0.3,
      height: 0.75,
      depth: 0.35
    },
    yoloClass: 'fire_extinguisher'
  },
  fire_extinguisher_water: {
    id: 'asset_fire_extinguisher_water',
    type: 'fire_extinguisher_water',
    name: {
      en: 'Water-Type Extinguisher (9 Liters)',
      hi: 'जल प्रकार अग्निशामक (9 लीटर)',
      sat: 'ᱫᱟᱜ ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ (᱙ ᱞᱤᱴᱟᱨ)'
    },
    description: {
      en: 'Pressurized water extinguisher. Strictly Class A only. NEVER use on fuel or electrical fires.',
      hi: 'दबावयुक्त पानी शामक। केवल क्लास A। ईंधन या बिजली की आग पर कभी उपयोग न करें।',
      sat: 'ᱫᱟᱜ ᱥᱮᱸᱜᱮᱞ ᱤᱬᱤᱡ (ᱠᱷᱟᱹᱞᱤ ᱠᱟᱴ/ᱥᱟᱠᱟᱢ)'
    },
    model: '/assets/industrial/extinguisher_water.glb',
    preferredPlane: 'any',
    scale: 0.75,
    interactionEnabled: true,
    hazardTypes: [],
    trainingModule: 'fire_explosion',
    anchorRules: {
      snapToPlane: true,
      minClearanceRadiusMeters: 0.8,
      defaultElevation: 0.3
    },
    boundingDimensions: {
      width: 0.35,
      height: 0.7,
      depth: 0.35
    },
    yoloClass: 'fire_extinguisher'
  },
  electrical_cabinet: {
    id: 'asset_electrical_cabinet',
    type: 'electrical_cabinet',
    name: {
      en: 'Motor Control Center (MCC) Cabinet',
      hi: 'मोटर नियंत्रण केंद्र (MCC) कैबिनेट',
      sat: 'ᱢᱚᱴᱚᱨ ᱠᱚᱱᱴᱨᱚᱞ ᱠᱮᱵᱤᱱᱮᱴ'
    },
    description: {
      en: 'Bank of starters, circuit breakers, and metering for underground ventilation fans.',
      hi: 'भूमिगत वेंटिलेशन प्रशंसकों के लिए स्टार्टर्स, सर्किट ब्रेकर्स और मीटरिंग का बैंक।',
      sat: 'ᱠᱷᱟᱫᱟᱱ ᱵᱤᱡᱽᱞᱤ ᱠᱚᱱᱴᱨᱚᱞ ᱠᱮᱵᱤᱱᱮᱴ'
    },
    model: '/assets/industrial/electrical_cabinet.glb',
    preferredPlane: 'vertical',
    scale: 1.0,
    interactionEnabled: false,
    hazardTypes: ['electrical', 'high_voltage'],
    trainingModule: 'general',
    anchorRules: {
      snapToPlane: true,
      minClearanceRadiusMeters: 1.5,
      defaultElevation: 0.0
    },
    boundingDimensions: {
      width: 1.4,
      height: 2.0,
      depth: 0.6
    },
    yoloClass: 'electrical_cabinet'
  },
  workshop_bench: {
    id: 'asset_workshop_bench',
    type: 'workshop_bench',
    name: {
      en: 'Heavy Duty Steel Maintenance Workbench',
      hi: 'भारी-भरकम स्टील रखरखाव कार्यक्षेत्र',
      sat: 'ᱠᱟᱹᱢᱤ ᱢᱮᱬᱦᱮᱫ ᱴᱮᱵᱩᱞ'
    },
    description: {
      en: 'Reinforced industrial surface for maintenance, assembly, and safety equipment testing.',
      hi: 'रखरखाव, संयोजन और सुरक्षा उपकरण परीक्षण के लिए प्रबलित औद्योगिक सतह।',
      sat: 'ᱥᱟᱯᱲᱟᱣ ᱟᱨ ᱪᱮᱠ ᱴᱮᱵᱩᱞ'
    },
    model: '/assets/industrial/workshop_bench.glb',
    preferredPlane: 'horizontal',
    scale: 1.0,
    interactionEnabled: false,
    hazardTypes: [],
    trainingModule: 'general',
    anchorRules: {
      snapToPlane: true,
      minClearanceRadiusMeters: 1.5,
      defaultElevation: 0.0
    },
    boundingDimensions: {
      width: 2.0,
      height: 0.9,
      depth: 1.0
    },
    yoloClass: 'furniture_workbench'
  },
  industrial_machine: {
    id: 'asset_industrial_machine',
    type: 'industrial_machine',
    name: {
      en: 'Continuous Miner Cutting Drum Module',
      hi: 'निरंतर खनिक कटिंग ड्रम मॉड्यूल',
      sat: 'ᱠᱷᱟᱫᱟᱱ ᱠᱟᱹᱴᱤᱝ ᱢᱮᱥᱤᱱ'
    },
    description: {
      en: 'Heavy mechanical cutting machinery with rotating cutter heads and water deluge spray.',
      hi: 'घूमने वाले कटर हेड और पानी के छिड़काव के साथ भारी यांत्रिक कटिंग मशीनरी।',
      sat: 'ᱠᱷᱟᱫᱟᱱ ᱠᱚᱭᱞᱟ ᱠᱟᱹᱴᱤᱝ ᱢᱮᱥᱤᱱ'
    },
    model: '/assets/industrial/industrial_machine.glb',
    preferredPlane: 'horizontal',
    scale: 1.1,
    interactionEnabled: true,
    hazardTypes: ['pinch_point', 'electrical'],
    trainingModule: 'general',
    anchorRules: {
      snapToPlane: true,
      minClearanceRadiusMeters: 3.0,
      defaultElevation: 0.0
    },
    boundingDimensions: {
      width: 2.2,
      height: 1.6,
      depth: 2.5
    },
    yoloClass: 'machinery_heavy'
  },
  pipe_valve: {
    id: 'asset_pipe_valve',
    type: 'pipe_valve',
    name: {
      en: 'High-Pressure Emergency Shutoff Gate Valve',
      hi: 'उच्च-दबाव आपातकालीन शटऑफ गेट वाल्व',
      sat: 'ᱜᱮᱥ ᱵᱚᱸᱫᱽ ᱜᱮᱴ ᱵᱷᱟᱞᱵ'
    },
    description: {
      en: 'Quarter-turn rotary isolation valve for fuel and hazardous gas main pipelines.',
      hi: 'ईंधन और खतरनाक गैस मुख्य पाइपलाइनों के लिए क्वार्टर-टर्न रोटरी अलगाव वाल्व।',
      sat: 'ᱜᱮᱥ ᱯᱟᱭᱤᱯ ᱵᱚᱸᱫᱽ ᱵᱷᱟᱞᱵ'
    },
    model: '/assets/industrial/pipe_valve.glb',
    preferredPlane: 'any',
    scale: 0.8,
    interactionEnabled: true,
    hazardTypes: ['pressure', 'flammable_gas'],
    trainingModule: 'gas_leak_confined_space',
    anchorRules: {
      snapToPlane: false,
      minClearanceRadiusMeters: 1.0,
      defaultElevation: 0.9
    },
    boundingDimensions: {
      width: 0.7,
      height: 0.8,
      depth: 0.5
    },
    yoloClass: 'industrial_valve'
  },
  storage_container: {
    id: 'asset_storage_container',
    type: 'storage_container',
    name: {
      en: 'Explosion-Proof Flammable Storage Locker',
      hi: 'विस्फोट-रोधी ज्वलनशील भंडारण लॉकर',
      sat: 'ᱡᱩᱞᱩᱜ ᱥᱟᱢᱟᱱ ᱵᱟᱠᱥᱟ'
    },
    description: {
      en: 'Dual-walled FM-approved hazardous chemical cabinet with ground wire and flame arrester.',
      hi: 'ग्राउंड वायर और फ्लेम अरेस्टर के साथ दोहरी दीवार वाला FM-अनुमोदित खतरनाक रासायनिक कैबिनेट।',
      sat: 'ᱠᱮᱢᱤᱠᱟᱞ ᱥᱩᱨᱩᱠᱷᱤᱭᱟᱹ ᱵᱟᱠᱥᱟ'
    },
    model: '/assets/industrial/storage_container.glb',
    preferredPlane: 'horizontal',
    scale: 0.9,
    interactionEnabled: false,
    hazardTypes: ['fire', 'fuel'],
    trainingModule: 'fire_explosion',
    anchorRules: {
      snapToPlane: true,
      minClearanceRadiusMeters: 1.5,
      defaultElevation: 0.0
    },
    boundingDimensions: {
      width: 1.1,
      height: 1.6,
      depth: 0.5
    },
    yoloClass: 'storage_cabinet'
  },
  emergency_exit: {
    id: 'asset_emergency_exit',
    type: 'emergency_exit',
    name: {
      en: 'Photoluminescent Emergency Escape Route Door',
      hi: 'फोटो-ल्यूमिनसेंट आपातकालीन निकास द्वार',
      sat: 'ᱵᱟᱧᱪᱟᱣᱜ ᱚᱰᱚᱠ ᱫᱩᱣᱟᱹᱨ'
    },
    description: {
      en: 'Emergency push-bar steel egress door with illuminated running-man signage and clear path.',
      hi: 'रोशन रनिंग-मैन साइनेज और स्पष्ट रास्ते के साथ आपातकालीन पुश-बार स्टील निकास द्वार।',
      sat: 'ᱵᱟᱧᱪᱟᱣᱜ ᱫᱩᱣᱟᱹᱨ ᱟᱨ ᱪᱤᱱᱦᱟᱹ'
    },
    model: '/assets/industrial/emergency_exit.glb',
    preferredPlane: 'vertical',
    scale: 1.0,
    interactionEnabled: true,
    hazardTypes: [],
    trainingModule: 'fire_explosion',
    anchorRules: {
      snapToPlane: true,
      minClearanceRadiusMeters: 2.0,
      defaultElevation: 0.0
    },
    boundingDimensions: {
      width: 1.2,
      height: 2.3,
      depth: 0.3
    },
    yoloClass: 'structural_exit'
  },
  warning_sign: {
    id: 'asset_warning_sign',
    type: 'warning_sign',
    name: {
      en: 'DGMS High Hazard Warning Placard',
      hi: 'DGMS उच्च खतरा चेतावनी तख्ती',
      sat: 'ᱵᱚᱛᱚᱨ ᱦᱩᱥᱤᱭᱟᱹᱨ ᱵᱚᱨᱰ'
    },
    description: {
      en: 'Mandatory statutory safety warning board indicating volatile methane or combustible dust.',
      hi: 'अस्थिर मीथेन या दहनशील धूल का संकेत देने वाला अनिवार्य वैधानिक सुरक्षा चेतावनी बोर्ड।',
      sat: 'ᱵᱚᱛᱚᱨ ᱴᱷᱟᱶ ᱪᱤᱱᱦᱟᱹ'
    },
    model: '/assets/industrial/warning_sign.glb',
    preferredPlane: 'vertical',
    scale: 0.7,
    interactionEnabled: false,
    hazardTypes: [],
    trainingModule: 'general',
    anchorRules: {
      snapToPlane: true,
      minClearanceRadiusMeters: 1.0,
      defaultElevation: 1.5
    },
    boundingDimensions: {
      width: 0.6,
      height: 0.8,
      depth: 0.05
    },
    yoloClass: 'safety_sign'
  },
  hazard_zone: {
    id: 'asset_hazard_zone',
    type: 'hazard_zone',
    name: {
      en: 'Zone-0 Confined Space Restricted Perimeter',
      hi: 'ज़ोन-0 सीमित स्थान प्रतिबंधित परिधि',
      sat: 'ᱵᱚᱛᱚᱨ ᱥᱤᱢᱟᱹ ᱴᱷᱟᱶ'
    },
    description: {
      en: 'High-visibility chevron barrier delineating explosive atmosphere requiring permits and breathing apparatus.',
      hi: 'परमिट और श्वास तंत्र की आवश्यकता वाले विस्फोटक वातावरण को दर्शाने वाला उच्च-दृश्यता शेवरॉन बैरियर।',
      sat: 'ᱵᱚᱛᱚᱨ ᱴᱷᱟᱶ ᱵᱮᱨᱤᱠᱮᱰ'
    },
    model: '/assets/industrial/hazard_zone.glb',
    preferredPlane: 'horizontal',
    scale: 1.2,
    interactionEnabled: true,
    hazardTypes: ['toxic_gas', 'flammable_gas'],
    trainingModule: 'gas_leak_confined_space',
    anchorRules: {
      snapToPlane: true,
      minClearanceRadiusMeters: 2.0,
      defaultElevation: 0.0
    },
    boundingDimensions: {
      width: 2.5,
      height: 0.8,
      depth: 2.5
    },
    yoloClass: 'barrier_perimeter'
  },
  ppe_station: {
    id: 'asset_ppe_station',
    type: 'ppe_station',
    name: {
      en: 'SCBA & Chemical PPE Donning Station',
      hi: 'SCBA और रासायनिक PPE स्टेशन',
      sat: 'ᱥᱩᱨᱩᱠᱷᱤᱭᱟᱹ PPE ᱥᱴᱮᱥᱚᱱ'
    },
    description: {
      en: 'Mandatory safety outpost stocked with positive-pressure SCBA apparatus, flame-retardant overalls, and gas hoods.',
      hi: 'सकारात्मक-दबाव SCBA तंत्र, ज्वाला-मंदक चौग़ा और गैस हुड से सुसज्जित अनिवार्य सुरक्षा चौकी।',
      sat: 'SCBA ᱟᱨ ᱥᱩᱨᱩᱠᱷᱤᱭᱟᱹ ᱞᱩᱜᱽᱲᱤ'
    },
    model: '/assets/industrial/ppe_station.glb',
    preferredPlane: 'vertical',
    scale: 0.9,
    interactionEnabled: true,
    hazardTypes: [],
    trainingModule: 'gas_leak_confined_space',
    anchorRules: {
      snapToPlane: true,
      minClearanceRadiusMeters: 1.5,
      defaultElevation: 0.5
    },
    boundingDimensions: {
      width: 1.3,
      height: 1.8,
      depth: 0.4
    },
    yoloClass: 'safety_equipment'
  },
  gas_monitoring_station: {
    id: 'asset_gas_monitoring_station',
    type: 'gas_monitoring_station',
    name: {
      en: 'Fixed Multi-Gas Telemetry Monitoring Beacon',
      hi: 'फिक्स्ड मल्टी-गैस टेलीमेट्री मॉनिटरिंग बीकन',
      sat: 'ᱜᱮᱥ ᱡᱟᱸᱪ ᱥᱴᱮᱥᱚᱱ'
    },
    description: {
      en: 'Explosion-proof continuous atmospheric analyzer calibrated for O2, CH4, CO, and H2S.',
      hi: 'O2, CH4, CO, और H2S के लिए कैलिब्रेटेड विस्फोट-रोधी निरंतर वायुमंडलीय विश्लेषक।',
      sat: 'ᱦᱚᱭ ᱜᱮᱥ ᱡᱟᱸᱪ ᱡᱚᱱᱛᱨᱚ'
    },
    model: '/assets/industrial/gas_monitoring_station.glb',
    preferredPlane: 'vertical',
    scale: 0.8,
    interactionEnabled: true,
    hazardTypes: ['toxic_gas', 'flammable_gas'],
    trainingModule: 'gas_leak_confined_space',
    anchorRules: {
      snapToPlane: true,
      minClearanceRadiusMeters: 1.2,
      defaultElevation: 1.2
    },
    boundingDimensions: {
      width: 0.5,
      height: 0.7,
      depth: 0.3
    },
    yoloClass: 'safety_monitor'
  }
};
