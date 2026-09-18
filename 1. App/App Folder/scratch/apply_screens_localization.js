const fs = require('fs');
const path = require('path');

const rootDir = 'c:/Users/Sahil Ramteke/Desktop/PARIKSHAK';

function updateFile(relPath, fn) {
  const fullPath = path.join(rootDir, relPath);
  if (!fs.existsSync(fullPath)) {
    console.error('File not found:', fullPath);
    return;
  }
  let content = fs.readFileSync(fullPath, 'utf8');
  const updated = fn(content);
  if (updated !== content) {
    fs.writeFileSync(fullPath, updated, 'utf8');
    console.log('Updated:', relPath);
  } else {
    console.log('No change for:', relPath);
  }
}

// 1. Login Screen
updateFile('apps/mobile/app/(auth)/login.tsx', (content) => {
  // ensure useLanguage is imported
  content = content.replace(
    "import { getAppLanguage, setAppLanguage, t } from '../../localization/i18n';",
    "import { useLanguage } from '../../localization/i18n';"
  );
  content = content.replace(
    "export default function LoginScreen() {\n  const [identifier, setIdentifier] = useState('');",
    "export default function LoginScreen() {\n  const { t, currentLanguage, setAppLanguage } = useLanguage();\n  const [identifier, setIdentifier] = useState('');"
  );
  content = content.replace("const currentLang = getAppLanguage();", "const currentLang = currentLanguage;");
  content = content.replace("setError('Please enter your Worker ID or registered Email');", "setError(t('auth.enterWorkerId', 'Please enter your Worker ID or registered Email'));");
  content = content.replace("setError('Please enter your password');", "setError(t('auth.enterPassword', 'Please enter your password'));");
  content = content.replace("'Enterprise SSO',\n      'Sign in with Enterprise Industrial Single Sign-On is managed by plant admin.'", "t('auth.enterpriseSSO', 'Enterprise SSO'),\n      t('auth.ssoNotice', 'Sign in with Enterprise Industrial Single Sign-On is managed by plant admin.')");
  content = content.replace(
    "<Text style={styles.pendingTitle}>Awaiting Administrator Approval</Text>",
    "<Text style={styles.pendingTitle}>{t('auth.awaitingApproval', 'Awaiting Administrator Approval')}</Text>"
  );
  content = content.replace(
    "Your account ({identifier.toUpperCase()}) was registered successfully but requires safety administrator approval before you can access training modules.",
    "{t('auth.awaitingApprovalDesc', 'Your account ({id}) was registered successfully but requires safety administrator approval before you can access training modules.', { id: identifier.toUpperCase() })}"
  );
  content = content.replace(
    "Please ask your safety supervisor or plant administrator to approve your registration in the Admin Dashboard.",
    "{t('auth.askSupervisorApproval', 'Please ask your safety supervisor or plant administrator to approve your registration in the Admin Dashboard.')}"
  );
  content = content.replace('placeholder="e.g. WRK-1002 or email@domain.com"', 'placeholder={t(\'auth.workerIdPlaceholder\', \'e.g. WRK-1002 or email@domain.com\')}');
  content = content.replace('placeholder="Enter your password"', 'placeholder={t(\'auth.enterPasswordPlaceholder\', \'Enter your password\')}');
  content = content.replace(
    "💡 Tap to Auto-fill WRK-1001 / Safety@2026",
    "{t('auth.autoFillDemo', '💡 Tap to Auto-fill WRK-1001 / Safety@2026')}"
  );
  return content;
});

// 2. Register Screen
updateFile('apps/mobile/app/(auth)/register.tsx', (content) => {
  content = content.replace(
    "import { t } from '../../localization/i18n';",
    "import { useLanguage } from '../../localization/i18n';"
  );
  content = content.replace(
    "export default function RegisterScreen() {\n  const [fullName, setFullName] = useState('');",
    "export default function RegisterScreen() {\n  const { t } = useLanguage();\n  const [fullName, setFullName] = useState('');"
  );
  content = content.replace("setError('Please fill in all mandatory worker profile fields (*)');", "setError(t('auth.mandatoryFieldsError', 'Please fill in all mandatory worker profile fields (*)'));");
  content = content.replace("<Text style={styles.successTitle}>Registration Submitted!</Text>", "<Text style={styles.successTitle}>{t('auth.registrationSubmitted', 'Registration Submitted!')}</Text>");
  content = content.replace(
    "Your worker account has been created in the Safety Database.",
    "{t('auth.successSubtitle', 'Your worker account has been created in the Safety Database.')}"
  );
  content = content.replace("<Text style={styles.statusLabel}>Worker ID:</Text>", "<Text style={styles.statusLabel}>{t('auth.workerIdLabel', 'Worker ID:')}</Text>");
  content = content.replace("<Text style={styles.statusLabel}>Full Name:</Text>", "<Text style={styles.statusLabel}>{t('auth.fullNameLabel', 'Full Name:')}</Text>");
  content = content.replace("<Text style={styles.statusLabel}>Account Status:</Text>", "<Text style={styles.statusLabel}>{t('auth.accountStatusLabel', 'Account Status:')}</Text>");
  content = content.replace("<Text style={styles.pendingBadgeText}>PENDING APPROVAL</Text>", "<Text style={styles.pendingBadgeText}>{t('auth.pendingApproval', 'PENDING APPROVAL')}</Text>");
  content = content.replace(
    "<Text style={{ fontWeight: '800' }}>Mandatory Admin Approval:</Text> Before you can log in and access safety drills, your Plant Safety Administrator must verify and approve your registration from the Admin Portal.",
    "<Text style={{ fontWeight: '800' }}>{t('auth.mandatoryApproval', 'Mandatory Admin Approval:')}</Text> {t('auth.mandatoryApprovalDetail', 'Before you can log in and access safety drills, your Plant Safety Administrator must verify and approve your registration from the Admin Portal.')}"
  );
  content = content.replace('title="Return to Login Screen"', 'title={t(\'auth.returnToLogin\', \'Return to Login Screen\')}');
  content = content.replace('placeholder="e.g. Vikram Singh Munda"', 'placeholder={t(\'auth.fullNamePlaceholder\', \'e.g. Vikram Singh Munda\')}');
  content = content.replace('label="Worker ID (Plant / Mine Tag) *"', 'label={t(\'auth.workerIdTagLabel\', \'Worker ID (Plant / Mine Tag) *\')}');
  content = content.replace('placeholder="e.g. WRK-2099"', 'placeholder={t(\'auth.workerIdTagPlaceholder\', \'e.g. WRK-2099\')}');
  content = content.replace('placeholder="e.g. +91 98765 43210"', 'placeholder={t(\'auth.phonePlaceholder\', \'e.g. +91 98765 43210\')}');
  content = content.replace('placeholder="e.g. vikram@safety.plant"', 'placeholder={t(\'auth.emailPlaceholder\', \'e.g. vikram@safety.plant\')}');
  content = content.replace('placeholder="Minimum 8 characters"', 'placeholder={t(\'auth.passwordPlaceholder\', \'Minimum 8 characters\')}');
  content = content.replace('label="Plant / Enterprise Name *"', 'label={t(\'auth.companyLabel\', \'Plant / Enterprise Name *\')}');
  content = content.replace('placeholder="e.g. Bharat Minerals & Steel"', 'placeholder={t(\'auth.companyPlaceholder\', \'e.g. Bharat Minerals & Steel\')}');
  content = content.replace('<Text style={styles.fieldLabel}>Industry Sector *</Text>', '<Text style={styles.fieldLabel}>{t(\'auth.industrySectorLabel\', \'Industry Sector *\')}</Text>');
  content = content.replace('label="Designated Job Role *"', 'label={t(\'auth.jobRoleLabel\', \'Designated Job Role *\')}');
  content = content.replace('placeholder="e.g. Haul Truck Operator, Miner"', 'placeholder={t(\'auth.rolePlaceholder\', \'e.g. Haul Truck Operator, Miner\')}');
  content = content.replace('label="Industry Experience (Years)"', 'label={t(\'auth.experienceYearsLabel\', \'Industry Experience (Years)\')}');
  content = content.replace('placeholder="e.g. 4"', 'placeholder={t(\'auth.expPlaceholder\', \'e.g. 4\')}');
  content = content.replace('title="Submit Registration for Safety Approval"', 'title={t(\'auth.submitRegistration\', \'Submit Registration for Safety Approval\')}');
  content = content.replace('<Text style={styles.loginPrompt}>Already have an approved account? </Text>', '<Text style={styles.loginPrompt}>{t(\'auth.alreadyHaveAccountPrompt\', \'Already have an approved account? \')}</Text>');
  return content;
});

// 3. Forgot Password Screen
updateFile('apps/mobile/app/(auth)/forgot-password.tsx', (content) => {
  content = content.replace(
    "import { t } from '../../localization/i18n';",
    "import { useLanguage } from '../../localization/i18n';"
  );
  content = content.replace(
    "export default function ForgotPasswordScreen() {\n  const [identifier, setIdentifier] = useState('WRK-1001');",
    "export default function ForgotPasswordScreen() {\n  const { t } = useLanguage();\n  const [identifier, setIdentifier] = useState('WRK-1001');"
  );
  content = content.replace("<Text style={styles.title}>Password Recovery</Text>", "<Text style={styles.title}>{t('auth.passwordRecovery', 'Password Recovery')}</Text>");
  content = content.replace(
    "Enter your Worker ID or registered phone to receive verification code",
    "{t('auth.forgotSubtitle', 'Enter your Worker ID or registered phone to receive verification code')}"
  );
  content = content.replace("<Text style={styles.successTitle}>Reset Verification Initiated</Text>", "<Text style={styles.successTitle}>{t('auth.resetVerificationInitiated', 'Reset Verification Initiated')}</Text>");
  content = content.replace(
    "A 6-digit OTP verification code has been dispatched to the registered mobile associated with{' '}\n              <Text style={{ fontWeight: '700', color: COLORS.darkText }}>{identifier}</Text>.",
    "{t('auth.otpDispatched', 'A 6-digit OTP verification code has been dispatched to the registered mobile associated with {id}.', { id: identifier })}"
  );
  content = content.replace('label="Worker ID or Phone Number"', 'label={t(\'auth.workerIdOrPhone\', \'Worker ID or Phone Number\')}');
  content = content.replace('placeholder="e.g. WRK-1001"', 'placeholder={t(\'auth.workerIdPlaceholder\', \'e.g. WRK-1001\')}');
  content = content.replace('title="Send Verification OTP"', 'title={t(\'auth.sendOtp\', \'Send Verification OTP\')}');
  content = content.replace('title="Return to Login"', 'title={t(\'auth.returnToLogin\', \'Return to Login Screen\')}');
  return content;
});

// 4. Language selection Screen
updateFile('apps/mobile/app/(auth)/language.tsx', (content) => {
  content = content.replace("<Text style={styles.title}>Select Safety Language</Text>", "<Text style={styles.title}>{t('auth.selectSafetyLanguage', 'Select Safety Language')}</Text>");
  content = content.replace("<Text style={styles.subtitle}>Preferred Industrial Dialect</Text>", "<Text style={styles.subtitle}>{t('auth.preferredDialect', 'Preferred Industrial Dialect')}</Text>");
  return content;
});

// 5. Splash Screen
updateFile('apps/mobile/app/(auth)/splash.tsx', (content) => {
  content = content.replace("<Text style={styles.suiteSubtitle}>INDUSTRIAL SAFETY & VERIFICATION SUITE</Text>", "<Text style={styles.suiteSubtitle}>{t('auth.suiteSubtitle', 'INDUSTRIAL SAFETY & VERIFICATION SUITE')}</Text>");
  return content;
});

// 6. Onboarding Screen
updateFile('apps/mobile/app/(auth)/onboarding.tsx', (content) => {
  content = content.replace("<Text style={styles.skipText}>Skip</Text>", "<Text style={styles.skipText}>{t('common.skip', 'Skip')}</Text>");
  return content;
});

// 7. Profile Screen
updateFile('apps/mobile/app/(tabs)/profile.tsx', (content) => {
  content = content.replace("Alert.alert('Error', 'Failed to pick photo');", "Alert.alert(t('common.error', 'Error'), 'Failed to pick photo');");
  content = content.replace("Alert.alert('Error', 'Failed to take photo');", "Alert.alert(t('common.error', 'Error'), 'Failed to take photo');");
  content = content.replace("<Text style={styles.signOutText}>Sign Out</Text>", "<Text style={styles.signOutText}>{t('profile.signOut', 'Sign Out')}</Text>");
  return content;
});

// 8. Help Screen
updateFile('apps/mobile/app/help.tsx', (content) => {
  content = content.replace(
    "import { t } from '../localization/i18n';",
    "import { useLanguage } from '../localization/i18n';"
  );
  content = content.replace(
    "export default function HelpScreen() {",
    "export default function HelpScreen() {\n  const { t } = useLanguage();"
  );
  content = content.replace("<Text style={styles.topBarTitle}>Safety Directory & Help</Text>", "<Text style={styles.topBarTitle}>{t('help.title', 'Safety Directory & Help')}</Text>");
  content = content.replace("<Text style={styles.protocolBadgeText}>EMERGENCY PROTOCOL</Text>", "<Text style={styles.protocolBadgeText}>{t('help.emergencyProtocol', 'EMERGENCY PROTOCOL')}</Text>");
  content = content.replace("<Text style={styles.sectionHeader}>Emergency Contacts</Text>", "<Text style={styles.sectionHeader}>{t('help.emergencyContacts', 'Emergency Contacts')}</Text>");
  content = content.replace("<Text style={styles.sectionHeader}>Statutory Safety Guidelines</Text>", "<Text style={styles.sectionHeader}>{t('help.safetyGuidelines', 'Statutory Safety Guidelines')}</Text>");
  return content;
});

// 9. Lesson Screen
updateFile('apps/mobile/app/lesson/[id].tsx', (content) => {
  if (!content.includes('useLanguage')) {
    content = content.replace(
      "import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';",
      "import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';\nimport { useLanguage } from '../../localization/i18n';"
    );
    content = content.replace(
      "export default function LessonScreen() {\n  const { id } = useLocalSearchParams<{ id: string }>();",
      "export default function LessonScreen() {\n  const { id } = useLocalSearchParams<{ id: string }>();\n  const { t } = useLanguage();"
    );
  }
  content = content.replace("<Text style={styles.warningTitle}>Industrial Safety Rule</Text>", "<Text style={styles.warningTitle}>{t('lesson.safetyRule', 'Industrial Safety Rule')}</Text>");
  content = content.replace("<Text style={styles.sectionHeader}>Procedural Execution Standards</Text>", "<Text style={styles.sectionHeader}>{t('lesson.executionStandards', 'Procedural Execution Standards')}</Text>");
  content = content.replace("<Text style={styles.quizCtaText}>Take Certification Quiz Assessment →</Text>", "<Text style={styles.quizCtaText}>{t('lesson.takeQuiz', 'Take Certification Quiz Assessment →')}</Text>");
  content = content.replace("mins • Verified Curriculum Guide", "{'mins • ' + t('lesson.verifiedCurriculumGuide', 'Verified Curriculum Guide')}");
  return content;
});

// 10. Notifications Screen
updateFile('apps/mobile/app/notifications.tsx', (content) => {
  if (!content.includes('useLanguage')) {
    content = content.replace(
      "import { t } from '../localization/i18n';",
      "import { useLanguage } from '../localization/i18n';"
    );
    content = content.replace(
      "export default function NotificationsScreen() {",
      "export default function NotificationsScreen() {\n  const { t } = useLanguage();"
    );
  }
  content = content.replace("<Text style={styles.topBarTitle}>Safety Notices & Alerts</Text>", "<Text style={styles.topBarTitle}>{t('notifications.title', 'Safety Notices & Alerts')}</Text>");
  content = content.replace("<Text style={styles.markAllText}>Mark Read</Text>", "<Text style={styles.markAllText}>{t('notifications.markRead', 'Mark Read')}</Text>");
  content = content.replace("<Text style={styles.emptyTitle}>All Caught Up!</Text>", "<Text style={styles.emptyTitle}>{t('notifications.allCaughtUp', 'All Caught Up!')}</Text>");
  content = content.replace("<Text style={styles.actionBtnText}>Open Action</Text>", "<Text style={styles.actionBtnText}>{t('notifications.openAction', 'Open Action')}</Text>");
  return content;
});

// 11. QR Scanner Screen
updateFile('apps/mobile/app/qr-scanner.tsx', (content) => {
  if (!content.includes('useLanguage')) {
    content = content.replace(
      "import { t } from '../localization/i18n';",
      "import { useLanguage } from '../localization/i18n';"
    );
    content = content.replace(
      "export default function QRScannerScreen() {",
      "export default function QRScannerScreen() {\n  const { t } = useLanguage();"
    );
  }
  content = content.replace("<Text style={styles.headerTitle}>Field QR Verifier</Text>", "<Text style={styles.headerTitle}>{t('verify.fieldVerifier', 'Field QR Verifier')}</Text>");
  content = content.replace("<Text style={styles.rescanText}>Scan Again</Text>", "<Text style={styles.rescanText}>{t('verify.scanAgain', 'Scan Again')}</Text>");
  content = content.replace("<Text style={styles.permText}>Camera Permission Required</Text>", "<Text style={styles.permText}>{t('verify.permissionRequired', 'Camera Permission Required')}</Text>");
  content = content.replace("<Text style={styles.switchButtonText}>Or Enter Certificate ID Manually</Text>", "<Text style={styles.switchButtonText}>{t('verify.orEnterManually', 'Or Enter Certificate ID Manually')}</Text>");
  content = content.replace("<Text style={styles.manualTitle}>Manual Credential Verification</Text>", "<Text style={styles.manualTitle}>{t('verify.manualVerification', 'Manual Credential Verification')}</Text>");
  content = content.replace('placeholder="e.g. PRS-CERT-2026-8F42K91"', 'placeholder={t(\'verify.certIdPlaceholder\', \'e.g. PRS-CERT-2026-8F42K91\')}');
  content = content.replace("<Text style={styles.switchButtonText}>Switch to Live Camera</Text>", "<Text style={styles.switchButtonText}>{t('verify.switchToCamera', 'Switch to Live Camera')}</Text>");
  return content;
});

// 12. Settings Screen
updateFile('apps/mobile/app/settings.tsx', (content) => {
  if (!content.includes('useLanguage')) {
    content = content.replace(
      "import { t } from '../localization/i18n';",
      "import { useLanguage } from '../localization/i18n';"
    );
    content = content.replace(
      "export default function SettingsScreen() {",
      "export default function SettingsScreen() {\n  const { t } = useLanguage();"
    );
  }
  content = content.replace("<Text style={styles.headerTitle}>Application Settings</Text>", "<Text style={styles.headerTitle}>{t('settings.title', 'Application Settings')}</Text>");
  content = content.replace("<Text style={styles.sectionHeader}>Worker Account & Identity</Text>", "<Text style={styles.sectionHeader}>{t('settings.workerAccount', 'Worker Account & Identity')}</Text>");
  content = content.replace("<Text style={styles.editButtonText}>Edit</Text>", "<Text style={styles.editButtonText}>{t('common.edit', 'Edit')}</Text>");
  content = content.replace("<Text style={styles.sectionHeader}>Appearance & Theme</Text>", "<Text style={styles.sectionHeader}>{t('settings.appearance', 'Appearance & Theme')}</Text>");
  content = content.replace("<Text style={styles.sectionHeader}>Safety Training Preferences</Text>", "<Text style={styles.sectionHeader}>{t('settings.preferences', 'Safety Training Preferences')}</Text>");
  content = content.replace("<Text style={styles.settingTitle}>Language / Dialect</Text>", "<Text style={styles.settingTitle}>{t('settings.languageDialect', 'Language / Dialect')}</Text>");
  content = content.replace("<Text style={styles.settingTitle}>Push & Drill Notifications</Text>", "<Text style={styles.settingTitle}>{t('settings.notifications', 'Push & Drill Notifications')}</Text>");
  content = content.replace("<Text style={styles.settingSub}>Mandatory refresher reminders enabled</Text>", "<Text style={styles.settingSub}>{t('settings.remindersEnabled', 'Mandatory refresher reminders enabled')}</Text>");
  content = content.replace("<Text style={styles.settingTitle}>Offline Mode & Sync</Text>", "<Text style={styles.settingTitle}>{t('settings.offlineSync', 'Offline Mode & Sync')}</Text>");
  content = content.replace("<Text style={styles.settingSub}>Underground shaft caching active</Text>", "<Text style={styles.settingSub}>{t('settings.cachingActive', 'Underground shaft caching active')}</Text>");
  return content;
});

// 13. OfflineBanner
updateFile('apps/mobile/components/OfflineBanner.tsx', (content) => {
  content = content.replace(
    "import { t } from '../localization/i18n';",
    "import { useLanguage } from '../localization/i18n';"
  );
  content = content.replace(
    "export const OfflineBanner: React.FC = () => {",
    "export const OfflineBanner: React.FC = () => {\n  const { t } = useLanguage();"
  );
  content = content.replace("<Text style={styles.actionText}>Sync Queue</Text>", "<Text style={styles.actionText}>{t('common.syncQueue', 'Sync Queue')}</Text>");
  return content;
});

// 14. ProgressCard
updateFile('apps/mobile/components/ProgressCard.tsx', (content) => {
  content = content.replace(
    "import { t } from '../localization/i18n';",
    "import { useLanguage } from '../localization/i18n';"
  );
  content = content.replace(
    "export const ProgressCard: React.FC<ProgressCardProps> = ({ progress, onBreakdownPress }) => {",
    "export const ProgressCard: React.FC<ProgressCardProps> = ({ progress, onBreakdownPress }) => {\n  const { t } = useLanguage();"
  );
  content = content.replace("<Text style={styles.breakdownText}>View Breakdown</Text>", "<Text style={styles.breakdownText}>{t('progress.viewBreakdown', 'View Breakdown')}</Text>");
  return content;
});

// 15. ARCameraView
updateFile('apps/mobile/components/AR/ARCameraView.tsx', (content) => {
  if (!content.includes('useLanguage')) {
    content = content.replace(
      "import { t } from '../../localization/i18n';",
      "import { useLanguage } from '../../localization/i18n';"
    );
    content = content.replace(
      "export const ARCameraView: React.FC<ARCameraViewProps> = ({\n  children,",
      "export const ARCameraView: React.FC<ARCameraViewProps> = ({\n  children,"
    );
    // Find component body
    content = content.replace(
      "const [cameraReady, setCameraReady] = useState(false);",
      "const { t } = useLanguage();\n  const [cameraReady, setCameraReady] = useState(false);"
    );
  }
  content = content.replace("<Text style={styles.permButtonText}>Grant Live Camera Feed</Text>", "<Text style={styles.permButtonText}>{t('ar.grantCamera', 'Grant Live Camera Feed')}</Text>");
  content = content.replace("<Text style={styles.mockButtonText}>Enable Live Camera Feed</Text>", "<Text style={styles.mockButtonText}>{t('ar.enableCamera', 'Enable Live Camera Feed')}</Text>");
  content = content.replace("<Text style={styles.planeMetaLabel}>CONFIDENCE</Text>", "<Text style={styles.planeMetaLabel}>{t('ar.confidence', 'CONFIDENCE')}</Text>");
  content = content.replace("<Text style={styles.planeMetaLabel}>DISTANCE</Text>", "<Text style={styles.planeMetaLabel}>{t('ar.distance', 'DISTANCE')}</Text>");
  content = content.replace("<Text style={styles.planeMetaLabel}>SURFACE NORMAL</Text>", "<Text style={styles.planeMetaLabel}>{t('ar.surfaceNormal', 'SURFACE NORMAL')}</Text>");
  return content;
});

console.log('Batch localization application complete!');
