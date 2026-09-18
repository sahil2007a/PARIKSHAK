import { useState, useEffect } from 'react';
import en from './en.json';
import hi from './hi.json';
import sat from './sat.json';
import { SupportedLanguage, LocalizedString } from '@parishak/shared';
import { offlineStorage } from '../services/offlineStorage';

const dictionaries: Record<SupportedLanguage, any> = {
  en,
  hi,
  sat
};

// Common strings translation map for legacy strings and standalone labels
export const COMMON_PHRASE_TRANSLATIONS: Record<string, Record<SupportedLanguage, string>> = {
  // Modules
  'Fire & Explosion Response': {
    en: 'Fire & Explosion Response',
    hi: 'अग्नि एवं विस्फोट सुरक्षा और प्रतिक्रिया',
    sat: 'ᱥᱮᱸᱜᱮᱞ ᱟᱨ ᱵᱤᱥᱯᱷᱚᱴ ᱨᱩᱠᱷᱤᱭᱟᱹ'
  },
  'Gas Leak & Confined Space Protocol': {
    en: 'Gas Leak & Confined Space Protocol',
    hi: 'गैस रिसाव एवं सीमित स्थान प्रोटोकॉल',
    sat: 'ᱜᱮᱥ ᱞᱤᱠ ᱟᱨ ᱥᱟᱸᱠᱲᱟ ᱡᱟᱭᱜᱟ ᱨᱩᱠᱷᱤᱭᱟᱹ'
  },
  'Gas Leak & Toxic Atmosphere': {
    en: 'Gas Leak & Toxic Atmosphere',
    hi: 'गैस रिसाव एवं विषैला वातावरण सुरक्षा',
    sat: 'ᱜᱮᱥ ᱞᱤᱠ ᱟᱨ ᱵᱤᱥ ᱦᱚᱭ-ᱦᱤᱥᱤᱫ'
  },
  'Machinery Safety & Lockout/Tagout (LOTO)': {
    en: 'Machinery Safety & Lockout/Tagout (LOTO)',
    hi: 'मशीनरी सुरक्षा एवं लॉकआउट/टैगआउट (LOTO)',
    sat: 'ᱢᱤᱥᱤᱱ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱟᱨ ᱞᱚᱠ-ᱟᱣᱩᱴ ᱯᱨᱚᱬᱟᱞᱤ'
  },
  'Heavy Machinery & Pinch Points': {
    en: 'Heavy Machinery & Pinch Points',
    hi: 'भारी मशीनरी एवं पिंच पॉइंट्स सुरक्षा',
    sat: 'ᱦᱟᱢᱟᱞ ᱢᱤᱥᱤᱱ ᱟᱨ ᱵᱤᱯᱚᱫᱽ ᱡᱟᱭᱜᱟ'
  },
  'Personal Protective Equipment (PPE)': {
    en: 'Personal Protective Equipment (PPE)',
    hi: 'व्यक्तिगत सुरक्षा उपकरण (PPE)',
    sat: 'ᱱᱤᱡᱮᱨᱟᱜ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱥᱟᱢᱟᱱ (PPE)'
  },
  'PPE & Fall Protection': {
    en: 'PPE & Fall Protection',
    hi: 'व्यक्तिगत सुरक्षा उपकरण (PPE) एवं ऊंचाई से सुरक्षा',
    sat: 'PPE ᱥᱟᱢᱟᱱ ᱟᱨ ᱪᱮᱛᱟᱱ ᱠᱷᱚᱱ ᱨᱩᱠᱷᱤᱭᱟᱹ'
  },
  'Emergency Evacuation & First Response': {
    en: 'Emergency Evacuation & First Response',
    hi: 'आपातकालीन निकासी एवं प्राथमिक प्रतिक्रिया',
    sat: 'ᱮᱢᱟᱨᱡᱮᱱᱥᱤ ᱩᱰᱩᱠ ᱟᱨ ᱯᱩᱭᱞᱩ ᱜᱚᱲᱚ'
  },
  'Emergency Evacuation & First Aid': {
    en: 'Emergency Evacuation & First Aid',
    hi: 'आपातकालीन निकासी एवं प्राथमिक चिकित्सा',
    sat: 'ᱮᱢᱟᱨᱡᱮᱱᱥᱤ ᱩᱰᱩᱠ ᱟᱨ ᱯᱩᱭᱞᱩ ᱨᱟᱱ'
  },

  // Fire Chapters
  'Hazard Identification': {
    en: 'Hazard Identification',
    hi: 'खतरे की पहचान',
    sat: 'ᱵᱤᱯᱚᱫᱽ ᱪᱤᱱᱦᱟᱹᱣ'
  },
  'Fire Classification & Extinguisher Selection': {
    en: 'Fire Classification & Extinguisher Selection',
    hi: 'अग्नि वर्गीकरण एवं अग्निशामक चयन',
    sat: 'ᱥᱮᱸᱜᱮᱞ ᱛᱷᱚᱠ ᱟᱨ ᱤᱬᱤᱡ ᱥᱟᱢᱟᱱ ᱵᱟᱪᱷᱟᱣ'
  },
  'Real Equipment Training': {
    en: 'Real Equipment Training',
    hi: 'वास्तविक उपकरण प्रशिक्षण',
    sat: 'ᱥᱟᱹᱨᱤ ᱥᱟᱢᱟᱱ ᱴᱨᱮᱱᱤᱝ'
  },
  'Industrial Fire Emergency Simulation': {
    en: 'Industrial Fire Emergency Simulation',
    hi: 'औद्योगिक अग्नि आपातकालीन सिमुलेशन',
    sat: 'ᱠᱟᱹᱨᱠᱷᱟᱱᱟ ᱥᱮᱸᱜᱮᱞ ᱮᱢᱟᱨᱡᱮᱱᱥᱤ ᱥᱤᱢᱩᱞᱮᱥᱚᱱ'
  },
  'Emergency Evacuation & AR Navigation': {
    en: 'Emergency Evacuation & AR Navigation',
    hi: 'आपातकालीन निकासी एवं AR नेविगेशन',
    sat: 'ᱮᱢᱟᱨᱡᱮᱱᱥᱤ ᱩᱰᱩᱠ ᱟᱨ AR ᱫᱤᱥᱟᱹ ᱩᱫᱩᱜ'
  },

  // Gas Chapters
  'Gas Hazard Identification': {
    en: 'Gas Hazard Identification',
    hi: 'गैस खतरे की पहचान',
    sat: 'ᱜᱮᱥ ᱵᱤᱯᱚᱫᱽ ᱪᱤᱱᱦᱟᱹᱣ'
  },
  'Gas Detection & PPE': {
    en: 'Gas Detection & PPE',
    hi: 'गैस पहचान एवं व्यक्तिगत सुरक्षा उपकरण (PPE)',
    sat: 'ᱜᱮᱥ ᱰᱤᱴᱮᱠᱥᱚᱱ ᱟᱨ PPE ᱥᱟᱢᱟᱱ'
  },
  'Gas Leak Response': {
    en: 'Gas Leak Response',
    hi: 'गैस रिसाव प्रतिक्रिया',
    sat: 'ᱜᱮᱥ ᱞᱤᱠ ᱠᱟᱹᱢᱤᱦᱚᱨᱟ'
  },
  'Confined Space Safety': {
    en: 'Confined Space Safety',
    hi: 'सीमित स्थान सुरक्षा',
    sat: 'ᱥᱟᱸᱠᱲᱟ ᱡᱟᱭᱜᱟ ᱨᱩᱠᱷᱤᱭᱟᱹ'
  },
  'Emergency Evacuation & Rescue Awareness': {
    en: 'Emergency Evacuation & Rescue Awareness',
    hi: 'आपातकालीन निकासी एवं बचाव जागरूकता',
    sat: 'ᱮᱢᱟᱨᱡᱮᱱᱥᱤ ᱩᱰᱩᱠ ᱟᱨ ᱵᱟᱧᱪᱟᱣ ᱦᱩᱥᱤᱭᱟᱹᱨ'
  },

  // Sectors
  'MINING': { en: 'Mining', hi: 'खनन', sat: 'ᱠᱷᱟᱫᱟᱱ' },
  'MANUFACTURING': { en: 'Manufacturing', hi: 'विनिर्माण', sat: 'ᱵᱮᱱᱟᱣ ᱠᱟᱹᱨᱜᱟᱲ' },
  'CONSTRUCTION': { en: 'Construction', hi: 'निर्माण', sat: 'ᱵᱮᱱᱟᱣ ᱠᱟᱹᱢᱤ' },
  'CHEMICAL': { en: 'Chemical', hi: 'रसायन', sat: 'ᱨᱟᱥᱟᱭᱚᱱ' },
  'STEEL': { en: 'Steel', hi: 'इस्पात', sat: 'ᱤᱥᱯᱟᱛ' },
  'MICA': { en: 'Mica', hi: 'अभ्रक', sat: 'ᱢᱟᱭᱠᱟ' },
  'GENERAL': { en: 'General', hi: 'सामान्य', sat: 'ᱥᱟᱫᱷᱟᱨᱚᱱ' },

  // Categories
  'FIRE_SAFETY': { en: 'Fire Safety', hi: 'अग्नि सुरक्षा', sat: 'ᱥᱮᱸᱜᱮᱞ ᱨᱩᱠᱷᱤᱭᱟᱹ' },
  'GAS_SAFETY': { en: 'Gas Safety', hi: 'गैस सुरक्षा', sat: 'ᱜᱮᱥ ᱨᱩᱠᱷᱤᱭᱟᱹ' },
  'MACHINERY': { en: 'Machinery', hi: 'मशीनरी', sat: 'ᱢᱤᱥᱤᱱ ᱨᱩᱠᱷᱤᱭᱟᱹ' },
  'PPE': { en: 'PPE', hi: 'पीपीई', sat: 'PPE ᱥᱟᱢᱟᱱ' },
  'EMERGENCY': { en: 'Emergency', hi: 'आपातकालीन', sat: 'ᱮᱢᱟᱨᱡᱮᱱᱥᱤ' },

  // Difficulty
  'BEGINNER': { en: 'BEGINNER', hi: 'शुरुआती', sat: 'ᱮᱛᱚᱦᱚᱵ' },
  'INTERMEDIATE': { en: 'INTERMEDIATE', hi: 'मध्यम', sat: 'ᱛᱟᱞᱟᱢᱟᱞᱟ' },
  'ADVANCED': { en: 'ADVANCED', hi: 'उन्नत', sat: 'ᱞᱟᱦᱟᱱᱛᱤ' },

  // Statuses & Badges
  'PRIORITY': { en: 'PRIORITY', hi: 'प्राथमिकता', sat: 'ᱢᱟᱲᱟᱝ ᱠᱟᱹᱢᱤ' },
  'COMPLETED': { en: 'COMPLETED', hi: 'पूर्ण', sat: 'ᱯᱩᱨᱟᱹᱣ' },
  'IN PROGRESS': { en: 'IN PROGRESS', hi: 'प्रगति पर', sat: 'ᱪᱟᱞᱟᱜ ᱠᱟᱱᱟ' },
  'NOT STARTED': { en: 'NOT STARTED', hi: 'शुरू नहीं हुआ', sat: 'ᱵᱟᱝ ᱮᱦᱚᱵ' },
  'UNLOCKED': { en: 'UNLOCKED', hi: 'अनलॉक', sat: 'ᱡᱷᱤᱡ' },
  'LOCKED': { en: 'LOCKED', hi: 'लॉक', sat: 'ᱛᱟᱞᱟ' },
  'READY': { en: 'READY', hi: 'तैयार', sat: 'ᱥᱟᱯᱲᱟᱣ' },
  'ON TRACK': { en: 'ON TRACK', hi: 'प्रगति पर', sat: 'ᱴᱷᱤᱠ ᱰᱟᱦᱟᱨ' },
  '✓ COMPLETED': { en: '✓ COMPLETED', hi: '✓ पूर्ण', sat: '✓ ᱯᱩᱨᱟᱹᱣ' },
  '✓ Completed': { en: '✓ Completed', hi: '✓ पूर्ण', sat: '✓ ᱯᱩᱨᱟᱹᱣ' },
  '○ NOT STARTED': { en: '○ NOT STARTED', hi: '○ शुरू नहीं हुआ', sat: '○ ᱵᱟᱝ ᱮᱦᱚᱵ' },
  'In Progress': { en: 'In Progress', hi: 'प्रगति पर', sat: 'ᱪᱟᱞᱟᱜ ᱠᱟᱱᱟ' },
  'Not Started': { en: 'Not Started', hi: 'शुरू नहीं हुआ', sat: 'ᱵᱟᱝ ᱮᱦᱚᱵ' },
  '✓ ISSUED': { en: '✓ ISSUED', hi: '✓ जारी', sat: '✓ ᱮᱢ ᱟᱠᱟᱱ' },
  'Active Certified': { en: 'Active Certified', hi: 'सक्रिय प्रमाणित', sat: 'ᱥᱟᱹᱵᱤᱛ ᱠᱟᱹᱢᱤᱭᱟᱹ' },
  'Level 2 Safety Clearance': { en: 'Level 2 Safety Clearance', hi: 'लेवल 2 सुरक्षा मंजूरी', sat: 'ᱞᱮᱵᱷᱮᱞ ᱒ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱪᱷᱟᱹᱲ' },
  'Worker Profile': { en: 'Worker Profile', hi: 'श्रमिक प्रोफ़ाइल', sat: 'ᱠᱟᱹᱢᱤᱭᱟᱹ ᱯᱨᱚᱯᱷᱟᱭᱤᱞ' },
  'Safety Trainee': { en: 'Safety Trainee', hi: 'सुरक्षा प्रशिक्षु', sat: 'ᱨᱩᱠᱷᱤᱭᱟᱹ ᱪᱮᱪᱮᱫᱤᱭᱟᱹ' },
  'Industrial Plant': { en: 'Industrial Plant', hi: 'औद्योगिक संयंत्र', sat: 'ᱤᱱᱰᱟᱥᱴᱨᱤᱭᱟᱞ ᱯᱞᱟᱱᱴ' },
  'CAMERA AR': { en: 'CAMERA AR', hi: 'कैमरा AR', sat: 'ᱠᱮᱢᱮᱨᱟ AR' },
  'UPCOMING MODULE': { en: 'UPCOMING MODULE', hi: 'आगामी मॉड्यूल', sat: 'ᱦᱤᱡᱩᱜ ᱠᱟᱱ ᱢᱚᱰᱩᱞ' },
  'Coming Soon': { en: 'Coming Soon', hi: 'शीघ्र उपलब्ध', sat: 'ᱞᱚᱜᱚᱱ ᱦᱤᱡᱩᱜ ᱠᱟᱱᱟ' }
};

let currentLanguage: SupportedLanguage = 'en';
const listeners: Array<(lang: SupportedLanguage) => void> = [];

// Initialize language from offline storage asynchronously
offlineStorage.getLanguage().then((saved) => {
  if (saved && (saved === 'en' || saved === 'hi' || saved === 'sat')) {
    currentLanguage = saved as SupportedLanguage;
    listeners.forEach((fn) => fn(currentLanguage));
  }
});

export const setAppLanguage = (lang: SupportedLanguage) => {
  if (dictionaries[lang]) {
    currentLanguage = lang;
    offlineStorage.saveLanguage(lang);
    listeners.forEach((fn) => fn(lang));
  }
};

export const getAppLanguage = (): SupportedLanguage => currentLanguage;
export const getCurrentLanguage = (): SupportedLanguage => currentLanguage;

export const subscribeLanguageChange = (callback: (lang: SupportedLanguage) => void) => {
  listeners.push(callback);
  return () => {
    const idx = listeners.indexOf(callback);
    if (idx !== -1) listeners.splice(idx, 1);
  };
};

export const useLanguage = () => {
  const [lang, setLang] = useState<SupportedLanguage>(getCurrentLanguage());

  useEffect(() => {
    return subscribeLanguageChange((newLang) => setLang(newLang));
  }, []);

  return {
    lang,
    currentLanguage: lang,
    t: (path: string, fallback?: string, params?: Record<string, string | number>) =>
      t(path, fallback, params),
    resolveLocalizedText: (text: any) => resolveLocalizedText(text),
    setAppLanguage
  };
};

export const t = (
  path: string,
  fallback?: string,
  params?: Record<string, string | number>
): string => {
  const keys = path.split('.');
  let obj = dictionaries[currentLanguage];

  for (const k of keys) {
    if (obj && typeof obj === 'object' && k in obj) {
      obj = obj[k];
    } else {
      // Fallback to English
      let fallbackObj = dictionaries.en;
      for (const fk of keys) {
        if (fallbackObj && typeof fallbackObj === 'object' && fk in fallbackObj) {
          fallbackObj = fallbackObj[fk];
        } else {
          obj = fallback || path;
          break;
        }
      }
      if (typeof fallbackObj === 'string') {
        obj = fallbackObj;
      }
      break;
    }
  }

  let result = typeof obj === 'string' ? obj : fallback || path;

  // Parameter interpolation e.g. {videos}, {chapters}
  if (params && typeof result === 'string') {
    Object.entries(params).forEach(([paramKey, paramVal]) => {
      result = result.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
    });
  }

  return result;
};

export const resolveLocalizedText = (
  text: string | LocalizedString | undefined
): string => {
  if (!text) return '';
  if (typeof text === 'string') {
    const trimmed = text.trim();
    const match = COMMON_PHRASE_TRANSLATIONS[trimmed];
    if (match) {
      return match[currentLanguage] || match.en || text;
    }
    return text;
  }
  return text[currentLanguage] || text.en || '';
};
