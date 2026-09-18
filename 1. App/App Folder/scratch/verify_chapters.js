const fs = require('fs');

const currText = fs.readFileSync('apps/mobile/data/curriculumData.ts', 'utf8');
const assessText = fs.readFileSync('apps/mobile/data/chapterAssessments.ts', 'utf8');

console.log('=== FIRE CHAPTER AUDIT ===');
const fireTitles = [
  'Hazard Identification',
  'Fire Classification & Extinguisher Selection',
  'Real Equipment Training',
  'Industrial Fire Emergency Simulation',
  'Emergency Evacuation & AR Navigation'
];

for (const title of fireTitles) {
  const inCurriculum = currText.includes(title);
  const inAssessments = assessText.includes(title);
  console.log(`[FIRE] "${title}" -> In Curriculum: ${inCurriculum}, In Assessments: ${inAssessments}`);
}

console.log('\n=== GAS CHAPTER AUDIT ===');
const gasTitles = [
  'Gas Hazard Identification',
  'Gas Detection & PPE',
  'Gas Leak Response',
  'Confined Space Safety',
  'Emergency Evacuation & Rescue Awareness'
];

for (const title of gasTitles) {
  const inCurriculum = currText.includes(title);
  const inAssessments = assessText.includes(title);
  console.log(`[GAS] "${title}" -> In Curriculum: ${inCurriculum}, In Assessments: ${inAssessments}`);
}

console.log('\n=== COMING SOON MODULE AUDIT ===');
console.log('curriculumData has isComingSoon flag for 3+:', currText.includes('isComingSoon: true'));
console.log('chapterAssessments returns empty array for 3+:', assessText.includes('return [];'));

const fundScreen = fs.readFileSync('apps/mobile/app/module/fundamentals/[id].tsx', 'utf8');
const arScreen = fs.readFileSync('apps/mobile/app/module/ar/[id].tsx', 'utf8');
const assessScreen = fs.readFileSync('apps/mobile/app/module/assessment/[id].tsx', 'utf8');

console.log('Fundamentals screen has Coming Soon card for modules 3+:', fundScreen.includes('curriculum.isComingSoon'));
console.log('AR screen has Coming Soon card for modules 3+:', arScreen.includes('curriculum.isComingSoon'));
console.log('Assessment screen has Coming Soon card for modules 3+:', assessScreen.includes('isComingSoon'));

console.log('\n=== TRANSLATION DICTIONARIES AUDIT ===');
const en = JSON.parse(fs.readFileSync('apps/mobile/localization/en.json', 'utf8'));
const hi = JSON.parse(fs.readFileSync('apps/mobile/localization/hi.json', 'utf8'));
const sat = JSON.parse(fs.readFileSync('apps/mobile/localization/sat.json', 'utf8'));

function countKeys(obj) {
  let count = 0;
  for (const k in obj) {
    if (typeof obj[k] === 'object' && obj[k] !== null) {
      count += countKeys(obj[k]);
    } else {
      count++;
    }
  }
  return count;
}

console.log('Total en keys:', countKeys(en));
console.log('Total hi keys:', countKeys(hi));
console.log('Total sat keys:', countKeys(sat));
