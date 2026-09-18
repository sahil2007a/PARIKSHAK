const fs = require('fs');
const path = require('path');

const rootDir = 'c:/Users/Sahil Ramteke/Desktop/PARIKSHAK';
const enPath = path.join(rootDir, 'apps/mobile/localization/en.json');
const hiPath = path.join(rootDir, 'apps/mobile/localization/hi.json');
const satPath = path.join(rootDir, 'apps/mobile/localization/sat.json');

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const hi = JSON.parse(fs.readFileSync(hiPath, 'utf8'));
const sat = JSON.parse(fs.readFileSync(satPath, 'utf8'));

function setDeep(obj, pathStr, value) {
  const parts = pathStr.split('.');
  let curr = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!curr[parts[i]] || typeof curr[parts[i]] !== 'object') {
      curr[parts[i]] = {};
    }
    curr = curr[parts[i]];
  }
  curr[parts[parts.length - 1]] = value;
}

const entries = [
  // AR additions
  {
    key: 'ar.criticalSafetyWarning',
    en: 'CRITICAL SAFETY WARNING',
    hi: 'गंभीर सुरक्षा चेतावनी',
    sat: 'ᱟᱹᱰᱤ ᱢᱟᱨᱟᱝ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱦᱩᱥᱤᱭᱟᱹᱨ'
  },
  {
    key: 'ar.drillCompletedDesc',
    en: 'You have successfully demonstrated spatial hazard recognition, emergency protocols, and procedural mastery in augmented reality.',
    hi: 'आपने संवर्धित वास्तविकता में स्थानिक खतरे की पहचान, आपातकालीन प्रोटोकॉल और प्रक्रियात्मक महारत का सफलतापूर्वक प्रदर्शन किया है।',
    sat: 'ᱟᱢ AR ᱛᱮ ᱵᱤᱯᱚᱫᱽ ᱪᱤᱱᱦᱟᱹᱣ, ᱮᱢᱟᱨᱡᱮᱱᱥᱤ ᱱᱤᱭᱟᱹᱢ ᱟᱨ ᱠᱟᱹᱢᱤ ᱦᱚᱨᱟ ᱱᱟᱯᱟᱭ ᱛᱮ ᱯᱩᱨᱟᱹᱣ ᱠᱮᱫ-ᱟᱢ᱾'
  },
  {
    key: 'ar.viewCertificate',
    en: 'View Verified Safety Certificate',
    hi: 'सत्यापित सुरक्षा प्रमाणपत्र देखें',
    sat: 'ᱯᱩᱨᱟᱹᱣ ᱟᱠᱟᱱ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱧᱮᱞ ᱢᱮ'
  },
  {
    key: 'ar.takeExam',
    en: 'Take Official Certification Exam',
    hi: 'आधिकारिक प्रमाणन परीक्षा दें',
    sat: 'ᱥᱚᱨᱠᱟᱨᱤ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱵᱤᱰᱟᱹᱣ ᱮᱢ ᱢᱮ'
  },
  {
    key: 'ar.grantCamera',
    en: 'Grant Live Camera Feed',
    hi: 'लाइव कैमरा अनुमति दें',
    sat: 'ᱠᱮᱢᱮᱨᱟ ᱪᱟᱹᱞᱩ ᱮᱢ ᱢᱮ'
  },
  {
    key: 'ar.enableCamera',
    en: 'Enable Live Camera Feed',
    hi: 'लाइव कैमरा चालू करें',
    sat: 'ᱠᱮᱢᱮᱨᱟ ᱪᱟᱹᱞᱩ ᱢᱮ'
  },
  {
    key: 'ar.confidence',
    en: 'CONFIDENCE',
    hi: 'विश्वास',
    sat: 'ᱯᱟᱹᱛᱭᱟᱹᱣ'
  },
  {
    key: 'ar.distance',
    en: 'DISTANCE',
    hi: 'दूरी',
    sat: 'ᱥᱟᱺᱜᱤᱧ'
  },
  {
    key: 'ar.surfaceNormal',
    en: 'SURFACE NORMAL',
    hi: 'सतह लंब',
    sat: 'ᱚᱛ ᱥᱚᱢᱟᱱ'
  },

  // Auth additions
  {
    key: 'auth.enterWorkerId',
    en: 'Please enter your Worker ID or registered Email',
    hi: 'कृपया अपनी श्रमिक आईडी या पंजीकृत ईमेल दर्ज करें',
    sat: 'ᱟᱢᱟᱜ ᱠᱟᱹᱢᱤᱭᱟᱹ ID ᱥᱮ ᱤᱢᱮᱞ ᱚᱞ ᱢᱮ'
  },
  {
    key: 'auth.enterPassword',
    en: 'Please enter your password',
    hi: 'कृपया अपना पासवर्ड दर्ज करें',
    sat: 'ᱟᱢᱟᱜ ᱯᱟᱥᱣᱟᱨᱰ ᱚᱞ ᱢᱮ'
  },
  {
    key: 'auth.enterpriseSSO',
    en: 'Enterprise SSO',
    hi: 'एंटरप्राइज एसएसओ',
    sat: 'ᱠᱟᱹᱨᱜᱟᱲ SSO'
  },
  {
    key: 'auth.ssoNotice',
    en: 'Sign in with Enterprise Industrial Single Sign-On is managed by plant admin.',
    hi: 'एंटरप्राइज इंडस्ट्रियल सिंगल साइन-ऑन के साथ साइन इन प्लांट व्यवस्थापक द्वारा प्रबंधित किया जाता है।',
    sat: 'ᱠᱟᱹᱨᱜᱟᱲ SSO ᱛᱮ ᱵᱚᱞᱚᱱ ᱫᱚ ᱯᱞᱟᱱᱴ ᱮᱰᱢᱤᱱ ᱦᱚᱛᱮᱛᱮ ᱪᱟᱞᱟᱣᱚᱜ-ᱟ᱾'
  },
  {
    key: 'auth.awaitingApprovalDesc',
    en: 'Your account ({id}) was registered successfully but requires safety administrator approval before you can access training modules.',
    hi: 'आपका खाता ({id}) सफलतापूर्वक पंजीकृत किया गया था, लेकिन प्रशिक्षण मॉड्यूल तक पहुंचने से पहले सुरक्षा व्यवस्थापक की स्वीकृति की आवश्यकता होती है।',
    sat: 'ᱟᱢᱟᱜ ᱠᱷᱟᱛᱟ ({id}) ᱥᱟᱨᱦᱟᱣ ᱛᱮ ᱵᱮᱱᱟᱣ ᱮᱱᱟ, ᱢᱮᱱᱠᱷᱟᱱ ᱴᱨᱮᱱᱤᱝ ᱮᱛᱚᱦᱚᱵ ᱢᱟᱲᱟᱝ ᱮᱰᱢᱤᱱ ᱴᱷᱮᱱ ᱠᱷᱚᱱ ᱪᱷᱟᱹᱲ ᱞᱟᱹᱠᱛᱤᱭᱟ᱾'
  },
  {
    key: 'auth.askSupervisorApproval',
    en: 'Please ask your safety supervisor or plant administrator to approve your registration in the Admin Dashboard.',
    hi: 'कृपया अपने सुरक्षा पर्यवेक्षक या प्लांट व्यवस्थापक से व्यवस्थापक डैशबोर्ड में आपके पंजीकरण को स्वीकृत करने का अनुरोध करें।',
    sat: 'ᱟᱢᱟᱜ ᱥᱩᱯᱚᱨᱵᱷᱟᱭᱡᱚᱨ ᱥᱮ ᱯᱞᱟᱱᱴ ᱮᱰᱢᱤᱱ ᱫᱚ ᱰᱮᱥᱵᱳᱨᱰ ᱠᱷᱚᱱ ᱟᱢᱟᱜ ᱠᱷᱟᱛᱟ ᱪᱷᱟᱹᱲ ᱮᱢ ᱞᱟᱹᱭᱟᱭ ᱢᱮ᱾'
  },
  {
    key: 'auth.workerIdPlaceholder',
    en: 'e.g. WRK-1002 or email@domain.com',
    hi: 'उदा. WRK-1002 या email@domain.com',
    sat: 'ᱡᱮᱞᱮᱠᱟ WRK-1002 ᱥᱮ email@domain.com'
  },
  {
    key: 'auth.enterPasswordPlaceholder',
    en: 'Enter your password',
    hi: 'अपना पासवर्ड दर्ज करें',
    sat: 'ᱟᱢᱟᱜ ᱯᱟᱥᱣᱟᱨᱰ ᱚᱞ ᱢᱮ'
  },
  {
    key: 'auth.autoFillDemo',
    en: '💡 Tap to Auto-fill WRK-1001 / Safety@2026',
    hi: '💡 WRK-1001 / Safety@2026 स्वतः भरने के लिए टैप करें',
    sat: '💡 WRK-1001 / Safety@2026 ᱟᱯᱱᱟᱨ ᱛᱮ ᱯᱮᱨᱮᱡ ᱞᱟᱹᱜᱤᱫ ᱚᱛᱟᱭ ᱢᱮ'
  },
  {
    key: 'auth.mandatoryFieldsError',
    en: 'Please fill in all mandatory worker profile fields (*)',
    hi: 'कृपया सभी अनिवार्य श्रमिक प्रोफ़ाइल फ़ील्ड भरें (*)',
    sat: 'ᱫᱟᱭᱟ ᱠᱟᱛᱮ ᱡᱚᱛᱚ ᱞᱟᱹᱠᱛᱤᱭᱟᱱ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱵᱤᱵᱚᱨᱚᱬ ᱯᱮᱨᱮᱡ ᱢᱮ (*)'
  },
  {
    key: 'auth.successSubtitle',
    en: 'Your worker account has been created in the Safety Database.',
    hi: 'आपका श्रमिक खाता सुरक्षा डेटाबेस में बना दिया गया है।',
    sat: 'ᱟᱢᱟᱜ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱠᱷᱟᱛᱟ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱰᱟᱴᱟᱵᱮᱥ ᱨᱮ ᱵᱮᱱᱟᱣ ᱮᱱᱟ᱾'
  },
  {
    key: 'auth.mandatoryApprovalDetail',
    en: 'Before you can log in and access safety drills, your Plant Safety Administrator must verify and approve your registration from the Admin Portal.',
    hi: 'लॉग इन करने और सुरक्षा ड्रिल तक पहुंचने से पहले, आपके प्लांट सुरक्षा व्यवस्थापक को एडमिन पोर्टल से आपके पंजीकरण को सत्यापित और स्वीकृत करना होगा।',
    sat: 'ᱵᱚᱞᱚᱱ ᱟᱨ AR ᱰᱨᱤᱞ ᱠᱟᱹᱢᱤ ᱢᱟᱲᱟᱝ, ᱯᱞᱟᱱᱴ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱮᱰᱢᱤᱱ ᱫᱚ ᱯᱳᱨᱴᱟᱞ ᱠᱷᱚᱱ ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ ᱪᱷᱟᱹᱲ ᱮᱢ ᱦᱩᱭᱩᱜ-ᱟ᱾'
  },
  {
    key: 'auth.returnToLogin',
    en: 'Return to Login Screen',
    hi: 'लॉगिन स्क्रीन पर वापस जाएं',
    sat: 'ᱞᱚᱜᱤᱱ ᱥᱠᱨᱤᱱ ᱛᱮ ᱨᱩᱣᱟᱹᱲ ᱢᱮ'
  },
  {
    key: 'auth.fullNamePlaceholder',
    en: 'e.g. Vikram Singh Munda',
    hi: 'उदा. विक्रम सिंह मुंडा',
    sat: 'ᱡᱮᱞᱮᱠᱟ ᱵᱤᱠᱨᱚᱢ ᱥᱤᱝ ᱢᱩᱱᱰᱟ'
  },
  {
    key: 'auth.workerIdTagPlaceholder',
    en: 'e.g. WRK-2099',
    hi: 'उदा. WRK-2099',
    sat: 'ᱡᱮᱞᱮᱠᱟ WRK-2099'
  },
  {
    key: 'auth.phonePlaceholder',
    en: 'e.g. +91 98765 43210',
    hi: 'उदा. +91 98765 43210',
    sat: 'ᱡᱮᱞᱮᱠᱟ +91 98765 43210'
  },
  {
    key: 'auth.emailPlaceholder',
    en: 'e.g. vikram@safety.plant',
    hi: 'उदा. vikram@safety.plant',
    sat: 'ᱡᱮᱞᱮᱠᱟ vikram@safety.plant'
  },
  {
    key: 'auth.passwordPlaceholder',
    en: 'Minimum 8 characters',
    hi: 'न्यूनतम 8 वर्ण',
    sat: 'ᱠᱚᱢ ᱠᱷᱚᱱ ᱠᱚᱢ ᱘ ᱪᱤᱠᱤ'
  },
  {
    key: 'auth.companyPlaceholder',
    en: 'e.g. Bharat Minerals & Steel',
    hi: 'उदा. भारत मिनरल्स एंड स्टील',
    sat: 'ᱡᱮᱞᱮᱠᱟ ᱵᱷᱟᱨᱚᱛ ᱢᱤᱱᱟᱨᱟᱞᱥ ᱟᱨ ᱤᱥᱯᱟᱛ'
  },
  {
    key: 'auth.rolePlaceholder',
    en: 'e.g. Haul Truck Operator, Miner',
    hi: 'उदा. हॉल ट्रक ऑपरेटर, खनिक',
    sat: 'ᱡᱮᱞᱮᱠᱟ ᱴᱨᱟᱠ ᱪᱟᱞᱟᱣᱤᱡ, ᱠᱷᱟᱫᱟᱱ ᱠᱟᱹᱢᱤᱭᱟᱹ'
  },
  {
    key: 'auth.expPlaceholder',
    en: 'e.g. 4',
    hi: 'उदा. 4',
    sat: 'ᱡᱮᱞᱮᱠᱟ ᱔'
  },
  {
    key: 'auth.workerIdTagLabel',
    en: 'Worker ID (Plant / Mine Tag) *',
    hi: 'श्रमिक आईडी (प्लांट / खदान टैग) *',
    sat: 'ᱠᱟᱹᱢᱤᱭᱟᱹ ID (ᱯᱞᱟᱱᱴ / ᱠᱷᱟᱫᱟᱱ ᱴᱮᱜᱽ) *'
  },
  {
    key: 'auth.companyLabel',
    en: 'Plant / Enterprise Name *',
    hi: 'प्लांट / उद्यम का नाम *',
    sat: 'ᱯᱞᱟᱱᱴ / ᱠᱟᱹᱨᱜᱟᱲ ᱧᱩᱛᱩᱢ *'
  },
  {
    key: 'auth.jobRoleLabel',
    en: 'Designated Job Role *',
    hi: 'नामित कार्य भूमिका *',
    sat: 'ᱠᱟᱹᱢᱤ ᱯᱚᱫᱽ *'
  },
  {
    key: 'auth.experienceYearsLabel',
    en: 'Industry Experience (Years)',
    hi: 'उद्योग का अनुभव (वर्ष)',
    sat: 'ᱠᱟᱹᱢᱤ ᱦᱩᱱᱟᱹᱨ (ᱥᱮᱨᱢᱟ)'
  },
  {
    key: 'auth.submitRegistration',
    en: 'Submit Registration for Safety Approval',
    hi: 'सुरक्षा स्वीकृति के लिए पंजीकरण जमा करें',
    sat: 'ᱨᱩᱠᱷᱤᱭᱟᱹ ᱪᱷᱟᱹᱲ ᱞᱟᱹᱜᱤᱫ ᱧᱩᱛᱩᱢ ᱡᱚᱢᱟᱭ ᱢᱮ'
  },
  {
    key: 'auth.alreadyHaveAccountPrompt',
    en: 'Already have an approved account? ',
    hi: 'क्या आपके पास पहले से स्वीकृत खाता है? ',
    sat: 'ᱪᱮᱫ ᱟᱢᱟᱜ ᱢᱟᱲᱟᱝ ᱠᱷᱚᱱ ᱯᱟᱥ ᱟᱠᱟᱱ ᱠᱷᱟᱛᱟ ᱢᱮᱱᱟᱜ-ᱟ? '
  },
  {
    key: 'auth.forgotSubtitle',
    en: 'Enter your Worker ID or registered phone to receive verification code',
    hi: 'सत्यापन कोड प्राप्त करने के लिए अपनी श्रमिक आईडी या पंजीकृत फोन दर्ज करें',
    sat: 'ᱳᱴᱤᱯᱤ ᱧᱟᱢ ᱞᱟᱹᱜᱤᱫ ᱟᱢᱟᱜ ᱠᱟᱹᱢᱤᱭᱟᱹ ID ᱥᱮ ᱯᱷᱳᱱ ᱱᱚᱢᱵᱚᱨ ᱚᱞ ᱢᱮ'
  },
  {
    key: 'auth.otpDispatched',
    en: 'A 6-digit OTP verification code has been dispatched to the registered mobile associated with {id}.',
    hi: '{id} से जुड़े पंजीकृत मोबाइल पर 6 अंकों का ओटीपी सत्यापन कोड भेजा गया है।',
    sat: '{id} ᱥᱟᱶ ᱡᱚᱲᱟᱣ ᱟᱠᱟᱱ ᱯᱷᱳᱱ ᱨᱮ ᱖ ᱮᱞ ᱨᱮᱱᱟᱜ OTP ᱠᱩᱞ ᱦᱩᱭ ᱮᱱᱟ᱾'
  },
  {
    key: 'auth.workerIdOrPhone',
    en: 'Worker ID or Phone Number',
    hi: 'श्रमिक आईडी या फोन नंबर',
    sat: 'ᱠᱟᱹᱢᱤᱭᱟᱹ ID ᱥᱮ ᱯᱷᱳᱱ ᱱᱚᱢᱵᱚᱨ'
  },
  {
    key: 'auth.sendOtp',
    en: 'Send Verification OTP',
    hi: 'सत्यापन ओटीपी भेजें',
    sat: 'ᱡᱟᱸᱪ OTP ᱠᱩᱞ ᱢᱮ'
  },

  // Common additions
  {
    key: 'common.edit',
    en: 'Edit',
    hi: 'संपादित करें',
    sat: 'ᱥᱟᱯᱲᱟᱣ'
  },
  {
    key: 'common.remove',
    en: 'Remove',
    hi: 'हटाएं',
    sat: 'ᱚᱪᱚᱜ'
  },
  {
    key: 'common.syncQueue',
    en: 'Sync Queue',
    hi: 'सिंक कतार',
    sat: 'ᱥᱤᱝᱠ ᱛᱷᱟᱨ'
  },
  {
    key: 'common.notice',
    en: 'Notice',
    hi: 'सूचना',
    sat: 'ᱞᱟᱹᱭ'
  },
  {
    key: 'common.clear',
    en: 'Clear',
    hi: 'साफ़ करें',
    sat: 'ᱯᱷᱟᱨᱪᱟ'
  },

  // Certificate additions
  {
    key: 'certificate.loadingCredential',
    en: 'Loading Safety Credential...',
    hi: 'सुरक्षा प्रमाणपत्र लोड हो रहा है...',
    sat: 'ᱨᱩᱠᱷᱤᱭᱟᱹ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱞᱳᱰᱚᱜ ᱠᱟᱱᱟ...'
  },
  {
    key: 'certificate.verifyingSeal',
    en: 'Verifying digital safety seal on PARIKSHAK ledger...',
    hi: 'परीक्षक लेजर पर डिजिटल सुरक्षा मुहर का सत्यापन किया जा रहा है...',
    sat: 'ᱯᱚᱨᱤᱠᱷᱭᱟᱹᱠ ᱞᱮᱡᱟᱨ ᱨᱮ ᱰᱤᱡᱤᱴᱟᱞ ᱥᱤᱞ ᱡᱟᱸᱪᱚᱜ ᱠᱟᱱᱟ...'
  },
  {
    key: 'certificate.safetyCredential',
    en: 'Safety Credential',
    hi: 'सुरक्षा प्रमाणपत्र',
    sat: 'ᱨᱩᱠᱷᱤᱭᱟᱹ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ'
  },

  // Help additions
  {
    key: 'help.title',
    en: 'Safety Directory & Help',
    hi: 'सुरक्षा निर्देशिका और सहायता',
    sat: 'ᱨᱩᱠᱷᱤᱭᱟᱹ ᱫᱤᱥᱟᱹ ᱟᱨ ᱜᱚᱲᱚ'
  },
  {
    key: 'help.emergencyProtocol',
    en: 'EMERGENCY PROTOCOL',
    hi: 'आपातकालीन प्रोटोकॉल',
    sat: 'ᱮᱢᱟᱨᱡᱮᱱᱥᱤ ᱱᱤᱭᱟᱹᱢ'
  },
  {
    key: 'help.emergencyContacts',
    en: 'Emergency Contacts',
    hi: 'आपातकालीन संपर्क',
    sat: 'ᱮᱢᱟᱨᱡᱮᱱᱥᱤ ᱡᱚᱯᱚᱲᱟᱣ'
  },
  {
    key: 'help.safetyGuidelines',
    en: 'Statutory Safety Guidelines',
    hi: 'वैधानिक सुरक्षा दिशानिर्देश',
    sat: 'ᱥᱚᱨᱠᱟᱨᱤ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱫᱤᱥᱟᱹ'
  },

  // Lesson additions
  {
    key: 'lesson.safetyRule',
    en: 'Industrial Safety Rule',
    hi: 'औद्योगिक सुरक्षा नियम',
    sat: 'ᱠᱟᱹᱨᱜᱟᱲ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱱᱤᱭᱟᱹᱢ'
  },
  {
    key: 'lesson.executionStandards',
    en: 'Procedural Execution Standards',
    hi: 'प्रक्रियात्मक निष्पादन मानक',
    sat: 'ᱠᱟᱹᱢᱤ ᱦᱚᱨᱟ ᱨᱮᱱᱟᱜ ᱢᱟᱱ'
  },
  {
    key: 'lesson.takeQuiz',
    en: 'Take Certification Quiz Assessment →',
    hi: 'प्रमाणीकरण प्रश्नोत्तरी आकलन दें →',
    sat: 'ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱠᱩᱠᱞᱤ ᱵᱤᱰᱟᱹᱣ ᱮᱢ ᱢᱮ →'
  },
  {
    key: 'lesson.verifiedCurriculumGuide',
    en: 'Verified Curriculum Guide',
    hi: 'सत्यापित पाठ्यक्रम गाइड',
    sat: 'ᱥᱟᱹᱨᱤ ᱠᱟᱹᱢᱤ ᱯᱟᱲᱦᱟᱣ ᱫᱤᱥᱟᱹ'
  },

  // Notifications additions
  {
    key: 'notifications.title',
    en: 'Safety Notices & Alerts',
    hi: 'सुरक्षा नोटिस और अलर्ट',
    sat: 'ᱨᱩᱠᱷᱤᱭᱟᱹ ᱱᱳᱴᱤᱥ ᱟᱨ ᱦᱩᱥᱤᱭᱟᱹᱨ'
  },
  {
    key: 'notifications.markRead',
    en: 'Mark Read',
    hi: 'पढ़ा हुआ चिह्नित करें',
    sat: 'ᱯᱟᱲᱦᱟᱣ ᱟᱠᱟᱱ ᱪᱤᱱᱦᱟᱹ'
  },
  {
    key: 'notifications.allCaughtUp',
    en: 'All Caught Up!',
    hi: 'सब कुछ देख लिया गया!',
    sat: 'ᱡᱚᱛᱚ ᱧᱮᱞ ᱯᱩᱨᱟᱹᱣ ᱮᱱᱟ!'
  },
  {
    key: 'notifications.openAction',
    en: 'Open Action',
    hi: 'कार्रवाई खोलें',
    sat: 'ᱠᱟᱹᱢᱤ ᱡᱷᱤᱡ ᱢᱮ'
  },

  // QR Scanner additions
  {
    key: 'verify.fieldVerifier',
    en: 'Field QR Verifier',
    hi: 'फील्ड क्यूआर सत्यापनकर्ता',
    sat: 'ᱴᱚᱴᱷᱟ QR ᱡᱟᱸᱪᱤᱡ'
  },
  {
    key: 'verify.scanAgain',
    en: 'Scan Again',
    hi: 'पुनः स्कैन करें',
    sat: 'ᱟᱨᱦᱚᱸ ᱥᱠᱮᱱ ᱢᱮ'
  },
  {
    key: 'verify.permissionRequired',
    en: 'Camera Permission Required',
    hi: 'कैमरा अनुमति आवश्यक है',
    sat: 'ᱠᱮᱢᱮᱨᱟ ᱪᱷᱟᱹᱲ ᱞᱟᱹᱠᱛᱤ'
  },
  {
    key: 'verify.orEnterManually',
    en: 'Or Enter Certificate ID Manually',
    hi: 'या प्रमाणपत्र आईडी मैन्युअल रूप से दर्ज करें',
    sat: 'ᱥᱮ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ID ᱛᱤ ᱛᱮ ᱚᱞ ᱢᱮ'
  },
  {
    key: 'verify.manualVerification',
    en: 'Manual Credential Verification',
    hi: 'मैन्युअल क्रेडेंशियल सत्यापन',
    sat: 'ᱛᱤ ᱛᱮ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱡᱟᱸᱪ'
  },
  {
    key: 'verify.switchToCamera',
    en: 'Switch to Live Camera',
    hi: 'लाइव कैमरे पर जाएं',
    sat: 'ᱞᱟᱭᱤᱵᱷ ᱠᱮᱢᱮᱨᱟ ᱛᱮ ᱥᱮᱱᱚᱜ ᱢᱮ'
  },

  // Scenario additions
  {
    key: 'scenario.initializing',
    en: 'Initializing Simulation Drill...',
    hi: 'सिमुलेशन ड्रिल प्रारंभ हो रही है...',
    sat: 'ᱥᱤᱢᱩᱞᱮᱥᱚᱱ ᱰᱨᱤᱞ ᱮᱦᱚᱵᱚᱜ ᱠᱟᱱᱟ...'
  },
  {
    key: 'scenario.completed',
    en: 'Scenario Simulation Completed!',
    hi: 'परिदृश्य सिमुलेशन पूर्ण हुआ!',
    sat: 'ᱥᱤᱢᱩᱞᱮᱥᱚᱱ ᱰᱨᱤᱞ ᱯᱩᱨᱟᱹᱣ ᱮᱱᱟ!'
  },
  {
    key: 'scenario.drillPoints',
    en: 'Drill Points',
    hi: 'ड्रिल अंक',
    sat: 'ᱰᱨᱤᱞ ᱯᱚᱭᱮᱱᱴ'
  },
  {
    key: 'scenario.procedureScore',
    en: 'Procedure Score',
    hi: 'प्रक्रिया स्कोर',
    sat: 'ᱛᱚᱦᱚᱨ ᱥᱠᱳᱨ'
  },
  {
    key: 'scenario.safetyRating',
    en: 'Safety Rating',
    hi: 'सुरक्षा रेटिंग',
    sat: 'ᱨᱩᱠᱷᱤᱭᱟᱹ ᱫᱚᱨ'
  },
  {
    key: 'scenario.repeatDrill',
    en: 'Repeat Simulation Drill',
    hi: 'सिमुलेशन ड्रिल दोहराएं',
    sat: 'ᱥᱤᱢᱩᱞᱮᱥᱚᱱ ᱰᱨᱤᱞ ᱟᱨᱦᱚᱸ ᱠᱚᱨᱟᱣ ᱢᱮ'
  },
  {
    key: 'scenario.selectAction',
    en: 'Select Next Safety Action',
    hi: 'अगली सुरक्षा कार्रवाई चुनें',
    sat: 'ᱤᱱᱟᱹ ᱛᱟᱭᱚᱢ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱠᱟᱹᱢᱤ ᱵᱟᱪᱷᱟᱣ ᱢᱮ'
  },

  // Settings additions
  {
    key: 'settings.title',
    en: 'Application Settings',
    hi: 'एप्लिकेशन सेटिंग्स',
    sat: 'ᱮᱯ ᱥᱟᱡᱟᱣ'
  },
  {
    key: 'settings.workerAccount',
    en: 'Worker Account & Identity',
    hi: 'श्रमिक खाता और पहचान',
    sat: 'ᱠᱟᱹᱢᱤᱭᱟᱹ ᱠᱷᱟᱛᱟ ᱟᱨ ᱩᱯᱨᱩᱢ'
  },
  {
    key: 'settings.appearance',
    en: 'Appearance & Theme',
    hi: 'दिखावट और थीम',
    sat: 'ᱨᱩᱯ ᱟᱨ ᱛᱷᱤᱢ'
  },
  {
    key: 'settings.preferences',
    en: 'Safety Training Preferences',
    hi: 'सुरक्षा प्रशिक्षण प्राथमिकताएं',
    sat: 'ᱨᱩᱠᱷᱤᱭᱟᱹ ᱴᱨᱮᱱᱤᱝ ᱠᱩᱥᱤ'
  },
  {
    key: 'settings.languageDialect',
    en: 'Language / Dialect',
    hi: 'भाषा / बोली',
    sat: 'ᱯᱟᱹᱨᱥᱤ / ᱨᱚᱲ'
  },
  {
    key: 'settings.notifications',
    en: 'Push & Drill Notifications',
    hi: 'पुश और ड्रिल सूचनाएं',
    sat: 'ᱰᱨᱤᱞ ᱠᱷᱚᱵᱚᱨ ᱟᱨ ᱩᱪᱷᱟᱹᱱ'
  },
  {
    key: 'settings.remindersEnabled',
    en: 'Mandatory refresher reminders enabled',
    hi: 'अनिवार्य पुनश्चर्या अनुस्मारक सक्षम',
    sat: 'ᱞᱟᱹᱠᱛᱤᱭᱟᱱ ᱫᱤᱥᱟᱹ ᱠᱷᱚᱵᱚᱨ ᱪᱟᱹᱞᱩ ᱟᱠᱟᱱᱟ'
  },
  {
    key: 'settings.offlineSync',
    en: 'Offline Mode & Sync',
    hi: 'ऑफ़लाइन मोड और सिंक',
    sat: 'ᱚᱯᱷᱞᱟᱭᱤᱱ ᱢᱳᱰ ᱟᱨ ᱥᱤᱝᱠ'
  },
  {
    key: 'settings.cachingActive',
    en: 'Underground shaft caching active',
    hi: 'भूमिगत शाफ्ट कैशिंग सक्रिय',
    sat: 'ᱠᱷᱟᱫᱟᱱ ᱵᱷᱤᱛᱨᱤ ᱚᱯᱷᱞᱟᱭᱤᱱ ᱥᱟᱧᱪᱟᱣ ᱪᱟᱹᱞᱩ'
  },

  // Progress additions
  {
    key: 'progress.viewBreakdown',
    en: 'View Breakdown',
    hi: 'विवरण देखें',
    sat: 'ᱵᱤᱵᱚᱨᱚᱬ ᱧᱮᱞ ᱢᱮ'
  }
];

for (const entry of entries) {
  setDeep(en, entry.key, entry.en);
  setDeep(hi, entry.key, entry.hi);
  setDeep(sat, entry.key, entry.sat);
}

fs.writeFileSync(enPath, JSON.stringify(en, null, 2) + '\n', 'utf8');
fs.writeFileSync(hiPath, JSON.stringify(hi, null, 2) + '\n', 'utf8');
fs.writeFileSync(satPath, JSON.stringify(sat, null, 2) + '\n', 'utf8');

console.log('Successfully added ' + entries.length + ' keys to en, hi, sat dictionaries.');
