import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  RefreshControl,
  ActivityIndicator,
  Platform,
  Image
} from 'react-native';
import {
  Globe,
  WifiOff,
  PhoneCall,
  LogOut,
  ChevronRight,
  Building,
  Briefcase,
  Edit3,
  Lock,
  Check,
  X,
  User,
  Award,
  ShieldCheck,
  CheckCircle2,
  QrCode,
  Camera,
  Trash2
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { offlineStorage } from '../../services/offlineStorage';
import { mobileApi } from '../../services/api';
import { UserProfile, SupportedLanguage, Certificate } from '@parishak/shared';
import { router } from 'expo-router';
import { useLanguage } from '../../localization/i18n';
import { useTheme } from '../../context/ThemeContext';

import { EditProfileModal } from '../../components/EditProfileModal';
import { Header } from '../../components/Header';

export default function ProfileScreen() {
  const { currentLanguage, setAppLanguage, t, resolveLocalizedText } = useLanguage();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isPhotoModalVisible, setIsPhotoModalVisible] = useState(false);

  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [progressList, setProgressList] = useState<any[]>([]);
  const { colors, isDark } = useTheme();

  const loadProfile = async () => {
    // Try offline storage first for instant render
    const local = await offlineStorage.getUser();
    if (local) setUser(local);

    // Temporary local profile image storage.
    // Replace with backend/cloud storage when profile image persistence is added to the database.
    const localPhoto = await offlineStorage.getProfileImage();
    if (localPhoto) setProfileImage(localPhoto);

    // Then revalidate with backend
    try {
      const [remote, certs, prog] = await Promise.all([
        mobileApi.getProfile(),
        mobileApi.getCertificates(),
        mobileApi.getUserProgress()
      ]);
      if (remote) setUser(remote);
      if (certs) setCertificates(certs);
      if (prog && Array.isArray(prog)) setProgressList(prog);
    } catch {
      // offline fallback
      try {
        const cachedCerts = await offlineStorage.getCertificates();
        if (cachedCerts) setCertificates(cachedCerts);
      } catch {
        // ignore
      }
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProfile();
    setRefreshing(false);
  };

  const handleOpenEditModal = () => {
    setIsEditModalVisible(true);
  };

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Permission to access photo gallery is required to choose a profile picture.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        base64: true
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const dataUrl = asset.base64
          ? `data:image/jpeg;base64,${asset.base64}`
          : asset.uri;

        setPreviewImage(dataUrl);
        setIsPhotoModalVisible(true);
      }
    } catch (err) {
      console.error('Failed to pick profile image', err);
      Alert.alert(t('common.error', 'Error'), t('profile.unablePickImage', 'Unable to pick image. Please try again.'));
    }
  };

  const handleSavePhoto = async () => {
    if (!previewImage) return;
    // Temporary local profile image storage.
    // Replace with backend/cloud storage when profile image persistence is added to the database.
    await offlineStorage.saveProfileImage(previewImage);
    setProfileImage(previewImage);
    setIsPhotoModalVisible(false);
    setPreviewImage(null);
  };

  const handleRemovePhoto = async () => {
    // Temporary local profile image storage.
    // Replace with backend/cloud storage when profile image persistence is added to the database.
    await offlineStorage.removeProfileImage();
    setProfileImage(null);
    setIsPhotoModalVisible(false);
    setPreviewImage(null);
  };

  const handleLanguageSelect = async (lang: SupportedLanguage) => {
    setAppLanguage(lang);
    await offlineStorage.saveLanguage(lang);
  };

  const handleLogout = async () => {
    Alert.alert(
      t('profile.signOut', 'Sign Out'),
      t('profile.signOutConfirm', 'Are you sure you want to sign out of PARIKSHAK?'),
      [
        { text: t('common.cancel', 'Cancel'), style: 'cancel' },
        {
          text: t('profile.signOut', 'Sign Out'),
          style: 'destructive',
          onPress: async () => {
            await mobileApi.logout();
            router.replace('/(auth)/login');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <Header workerName={user?.fullName} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.darkText }]}>{t('profile.title')}</Text>
        </View>

        {/* Worker ID Badge Card */}
        <View style={[styles.idCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.idCardHeader}>
            {/* Clickable Profile Image/Avatar with Camera Overlay */}
            <TouchableOpacity
              style={[
                styles.avatarLarge,
                {
                  backgroundColor: isDark ? '#134E4A' : '#E8F8F5',
                  borderColor: colors.primary
                }
              ]}
              onPress={handlePickImage}
              activeOpacity={0.8}
            >
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={styles.avatarLargeImg}
                  resizeMode="cover"
                />
              ) : (
                <Text style={[styles.avatarLargeText, { color: colors.primary }]}>
                  {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'W'}
                </Text>
              )}
              <View style={[styles.cameraBadge, { backgroundColor: colors.primary, borderColor: colors.card }]}>
                <Camera size={11} color="#FFFFFF" />
              </View>
            </TouchableOpacity>

            <View style={styles.idCardInfo}>
              <Text style={[styles.workerName, { color: colors.darkText }]}>{user?.fullName || t('profile.workerProfile', 'Worker Profile')}</Text>
              <Text style={[styles.workerIdTag, { color: colors.primary }]}>{user?.workerId || 'WRK-ID'}</Text>
              <Text style={[styles.jobRoleText, { color: colors.mutedText }]}>{user?.jobRole || t('profile.safetyTrainee', 'Safety Trainee')}</Text>
              <TouchableOpacity
                style={styles.changePhotoBtn}
                onPress={handlePickImage}
                activeOpacity={0.7}
              >
                <Camera size={11} color={colors.primary} />
                <Text style={[styles.changePhotoBtnText, { color: colors.primary }]}>
                  {profileImage ? t('profile.editPhoto', 'Edit Profile Photo') : t('profile.changePhoto', 'Change Profile Picture')}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.editButton, { backgroundColor: isDark ? '#334155' : '#F5F8F7' }]}
              onPress={handleOpenEditModal}
              activeOpacity={0.7}
            >
              <Edit3 size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={[styles.idCardDetails, { backgroundColor: isDark ? '#1E293B' : '#F8FAF9' }]}>
            <View style={styles.detailItem}>
              <Building size={14} color={colors.mutedText} />
              <Text style={[styles.detailText, { color: colors.darkText }]} numberOfLines={1}>
                {user?.organizationName || t('profile.plantLocation', 'Industrial Plant')}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Briefcase size={14} color={colors.mutedText} />
              <Text style={[styles.detailText, { color: colors.darkText }]}>
                {t('profile.sector', 'Sector')}: <Text style={{ fontWeight: '700' }}>{user?.sector || 'GENERAL'}</Text> • {user?.experienceYears || 0} {t('profile.yrsExp', 'yrs exp')}
              </Text>
            </View>
          </View>
        </View>

        {/* Worker Summary Statistics */}
        <View style={[styles.statsRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: '#16A34A' }]}>
              {certificates.filter((c) => c.status === 'VALID').length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.mutedText }]}>{t('profile.completed')}</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: '#D97706' }]}>
              {progressList.filter(
                (p) => !p.certificateId && ((p.lessonsCompleted && p.lessonsCompleted.length > 0) || p.arCompleted || p.progressPercentage > 0)
              ).length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.mutedText }]}>{t('profile.inProgress')}</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>{certificates.length}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedText }]}>{t('profile.issuedCerts', 'Issued Certs')}</Text>
          </View>
        </View>

        {/* Verified Safety Certifications Section */}
        <View style={[styles.sectionBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.sectionHeaderRow}>
            <Award size={18} color="#D97706" />
            <Text style={[styles.sectionTitle, { color: colors.darkText }]}>
              {t('profile.verifiedCertifications', 'Verified Safety Certifications')} ({certificates.length})
            </Text>
          </View>
          <Text style={[styles.sectionSubtitle, { color: colors.mutedText }]}>
            {t('profile.verifiedCertSubtitle', 'Official DGMS compliance credentials authorized by Safety Administration.')}
          </Text>

          {certificates.length === 0 ? (
            <View style={[styles.certEmptyBox, { backgroundColor: isDark ? '#1E293B' : '#F8FAF9' }]}>
              <Award size={28} color={colors.mutedText} opacity={0.6} />
              <Text style={[styles.certEmptyText, { color: colors.mutedText }]}>
                {t('certificates.emptySubtitle', 'No verified certificates earned yet. Complete the Fire AR Drill or Safety Assessment to earn verified credentials.')}
              </Text>
              <TouchableOpacity
                style={[styles.certStartButton, { backgroundColor: colors.primary }]}
                onPress={() => router.push('/ar-training/1')}
                activeOpacity={0.85}
              >
                <Text style={styles.certStartButtonText}>{t('certificates.startDrill', 'Start Fire Training Drill')}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.certListContainer}>
              {certificates.map((cert) => (
                <TouchableOpacity
                  key={cert.id}
                  style={[styles.profileCertCard, { backgroundColor: isDark ? '#1E293B' : '#F8FAF9', borderColor: colors.border }]}
                  onPress={() => router.push(`/certificate/${cert.id}`)}
                  activeOpacity={0.8}
                >
                  <View style={styles.profileCertTopRow}>
                    <View style={styles.profileCertIcon}>
                      <ShieldCheck size={18} color="#16A34A" />
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={[styles.profileCertTitle, { color: colors.darkText }]} numberOfLines={1}>
                        {cert.moduleTitle}
                      </Text>
                      <Text style={styles.profileCertId}>{cert.certificateId}</Text>
                    </View>
                    <View style={styles.profileCertScoreBadge}>
                      <Text style={styles.profileCertScoreText}>{cert.score}%</Text>
                    </View>
                  </View>

                  <View style={styles.profileCertAdminRow}>
                    <CheckCircle2 size={12} color="#16A34A" />
                    <Text style={styles.profileCertAdminText}>
                      {t('certificates.officialCredential', 'Official Credential')} • {cert.status === 'VALID' ? t('certificates.activeValid', 'Active & Valid') : cert.status}
                    </Text>
                  </View>

                  <View style={styles.profileCertFooter}>
                    <Text style={[styles.profileCertExpiry, { color: colors.mutedText }]}>
                      {t('certificates.issuedOn', 'Issued')}: {new Date(cert.issueDate).toLocaleDateString()}
                    </Text>
                    <View style={styles.profileCertAction}>
                      <QrCode size={13} color={colors.primary} />
                      <Text style={[styles.profileCertActionText, { color: colors.primary }]}>{t('certificates.viewQr', 'View QR')}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={styles.viewAllCertsLink}
                onPress={() => router.push('/(tabs)/certificates')}
                activeOpacity={0.7}
              >
                <Text style={[styles.viewAllCertsText, { color: colors.primary }]}>
                  {t('certificates.viewAllCertificates', 'View All Certificates →')}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Language Selection Setting */}
        <View style={[styles.sectionBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.sectionHeaderRow}>
            <Globe size={18} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.darkText }]}>{t('profile.languagePreference')}</Text>
          </View>

          <View style={styles.langPillRow}>
            <TouchableOpacity
              style={[
                styles.langPill,
                { backgroundColor: isDark ? '#1E293B' : '#F5F8F7', borderColor: colors.border },
                currentLanguage === 'en' && { backgroundColor: colors.primary, borderColor: colors.primary }
              ]}
              onPress={() => handleLanguageSelect('en')}
            >
              <Text style={[styles.langPillText, { color: colors.mutedText }, currentLanguage === 'en' && styles.langPillTextActive]}>
                English
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.langPill,
                { backgroundColor: isDark ? '#1E293B' : '#F5F8F7', borderColor: colors.border },
                currentLanguage === 'hi' && { backgroundColor: colors.primary, borderColor: colors.primary }
              ]}
              onPress={() => handleLanguageSelect('hi')}
            >
              <Text style={[styles.langPillText, { color: colors.mutedText }, currentLanguage === 'hi' && styles.langPillTextActive]}>
                हिन्दी (Hindi)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.langPill,
                { backgroundColor: isDark ? '#1E293B' : '#F5F8F7', borderColor: colors.border },
                currentLanguage === 'sat' && { backgroundColor: colors.primary, borderColor: colors.primary }
              ]}
              onPress={() => handleLanguageSelect('sat')}
            >
              <Text style={[styles.langPillText, { color: colors.mutedText }, currentLanguage === 'sat' && styles.langPillTextActive]}>
                ᱥᱟᱱᱛᱟᱲᱤ (Santali)
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Navigation Items */}
        <View style={[styles.menuCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: colors.border }]}
            onPress={() => router.push('/offline-mode')}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconContainer, { backgroundColor: isDark ? '#134E4A' : '#E8F8F5' }]}>
                <WifiOff size={18} color={colors.primary} />
              </View>
              <View>
                <Text style={[styles.menuItemLabel, { color: colors.darkText }]}>{t('offline.title')}</Text>
                <Text style={[styles.menuItemSub, { color: colors.mutedText }]}>{t('offline.banner')}</Text>
              </View>
            </View>
            <ChevronRight size={16} color={colors.mutedText} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: colors.border }]}
            onPress={() => router.push('/settings')}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconContainer, { backgroundColor: isDark ? '#334155' : '#F0F4F8' }]}>
                <User size={18} color={colors.primary} />
              </View>
              <View>
                <Text style={[styles.menuItemLabel, { color: colors.darkText }]}>{t('profile.accountSecurity')}</Text>
                <Text style={[styles.menuItemSub, { color: colors.mutedText }]}>{t('header.level2Safety')}</Text>
              </View>
            </View>
            <ChevronRight size={16} color={colors.mutedText} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomWidth: 0 }]}
            onPress={() => router.push('/help')}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconContainer, { backgroundColor: '#FDEDEC' }]}>
                <PhoneCall size={18} color={colors.danger} />
              </View>
              <View>
                <Text style={[styles.menuItemLabel, { color: colors.darkText }]}>{t('profile.support')}</Text>
                <Text style={[styles.menuItemSub, { color: colors.mutedText }]}>{t('profile.plantSafetyDesk', 'Plant Safety Desk')}</Text>
              </View>
            </View>
            <ChevronRight size={16} color={colors.mutedText} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <LogOut size={18} color={colors.danger} />
          <Text style={styles.logoutText}>{t('profile.signOut')}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Shared Reusable Edit Profile Modal */}
      <EditProfileModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        user={user}
        onProfileUpdated={(updated) => setUser(updated)}
        onPhotoUpdated={(img) => setProfileImage(img)}
      />

      {/* Photo Preview & Confirmation Modal */}
      <Modal
        visible={isPhotoModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsPhotoModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.darkText }]}>{t('profile.photoPreview', 'Profile Photo Preview')}</Text>
              <TouchableOpacity
                onPress={() => setIsPhotoModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <X size={18} color={colors.mutedText} />
              </TouchableOpacity>
            </View>

            <View style={styles.photoPreviewBox}>
              {previewImage && (
                <Image
                  source={{ uri: previewImage }}
                  style={styles.photoPreviewImg}
                  resizeMode="cover"
                />
              )}
            </View>

            <View style={styles.modalActionRow}>
              {profileImage && (
                <TouchableOpacity
                  style={[styles.modalRemoveBtn, { borderColor: colors.danger }]}
                  onPress={handleRemovePhoto}
                  activeOpacity={0.8}
                >
                  <Trash2 size={16} color={colors.danger} />
                  <Text style={[styles.modalRemoveBtnText, { color: colors.danger }]}>{t('common.remove', 'Remove')}</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.modalSaveButton, { backgroundColor: colors.primary }]}
                onPress={handleSavePhoto}
                activeOpacity={0.85}
              >
                <Check size={16} color="#FFFFFF" />
                <Text style={styles.modalSaveButtonText}>{t('profile.savePhoto', 'Save Photo')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    marginBottom: 16,
    ...SHADOWS.sm
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  statValue: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 2
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600'
  },
  statDivider: {
    width: 1,
    height: 32
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: 24
  },
  header: {
    marginBottom: 16
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800'
  },
  idCard: {
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    marginBottom: 16,
    ...SHADOWS.card
  },
  idCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14
  },
  avatarLarge: {
    width: 56,
    height: 56,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  avatarLargeImg: {
    width: '100%',
    height: '100%',
    borderRadius: 18
  },
  cameraBadge: {
    position: 'absolute',
    bottom: -3,
    right: -3,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2
  },
  changePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4
  },
  changePhotoBtnText: {
    fontSize: 11,
    fontWeight: '700'
  },
  photoPreviewBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16
  },
  photoPreviewImg: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: COLORS.primary
  },
  modalRemoveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1
  },
  modalRemoveBtnText: {
    fontSize: 13,
    fontWeight: '700'
  },
  avatarLargeText: {
    fontSize: 22,
    fontWeight: '900'
  },
  idCardInfo: {
    flex: 1
  },
  workerName: {
    fontSize: 16,
    fontWeight: '800'
  },
  workerIdTag: {
    fontSize: 12,
    fontFamily: 'monospace',
    fontWeight: '700',
    marginTop: 2
  },
  jobRoleText: {
    fontSize: 11,
    marginTop: 2
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  idCardDetails: {
    borderRadius: RADIUS.md,
    padding: 10,
    gap: 6
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  detailText: {
    fontSize: 11,
    flex: 1
  },
  sectionBox: {
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    marginBottom: 16,
    ...SHADOWS.sm
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700'
  },
  langPillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  langPill: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1
  },
  langPillText: {
    fontSize: 12,
    fontWeight: '600'
  },
  langPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700'
  },
  menuCard: {
    borderRadius: RADIUS.xl,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    marginBottom: 20,
    ...SHADOWS.sm
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  menuItemLabel: {
    fontSize: 13,
    fontWeight: '700'
  },
  menuItemSub: {
    fontSize: 10,
    marginTop: 1
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FDEDEC',
    borderRadius: RADIUS.lg,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#FADBD8'
  },
  logoutText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E74C3C'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    padding: SPACING.md
  },
  modalContainer: {
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    ...SHADOWS.floating
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800'
  },
  modalCloseButton: {
    padding: 4
  },
  lockedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
    borderRadius: RADIUS.sm,
    marginBottom: 14
  },
  lockedBannerText: {
    fontSize: 11,
    fontWeight: '600'
  },
  formGroup: {
    marginBottom: 12
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6
  },
  textInput: {
    borderRadius: RADIUS.md,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13
  },
  modalActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalCancelButtonText: {
    fontSize: 13,
    fontWeight: '700'
  },
  modalSaveButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: RADIUS.md
  },
  modalSaveButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800'
  },
  sectionSubtitle: {
    fontSize: 11,
    marginTop: 2,
    marginBottom: 12
  },
  certEmptyBox: {
    padding: 16,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    gap: 8
  },
  certEmptyText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 17
  },
  certStartButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.sm,
    marginTop: 4
  },
  certStartButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  },
  certListContainer: {
    gap: 10,
    marginTop: 4
  },
  profileCertCard: {
    borderWidth: 1,
    borderRadius: RADIUS.md,
    padding: 12
  },
  profileCertTopRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  profileCertIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center'
  },
  profileCertTitle: {
    fontSize: 13,
    fontWeight: '700'
  },
  profileCertId: {
    fontSize: 10,
    color: '#059669',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: '600',
    marginTop: 1
  },
  profileCertScoreBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12
  },
  profileCertScoreText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#16A34A'
  },
  profileCertAdminRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)'
  },
  profileCertAdminText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#16A34A'
  },
  profileCertFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6
  },
  profileCertExpiry: {
    fontSize: 10
  },
  profileCertAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  profileCertActionText: {
    fontSize: 11,
    fontWeight: '700'
  },
  viewAllCertsLink: {
    paddingVertical: 8,
    alignItems: 'center'
  },
  viewAllCertsText: {
    fontSize: 12,
    fontWeight: '700'
  }
});
