import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform
} from 'react-native';
import { X, Lock, User, Briefcase, Phone, Clock, Globe, Check, Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { UserProfile, SupportedLanguage } from '@parishak/shared';
import { mobileApi } from '../services/api';
import { offlineStorage } from '../services/offlineStorage';
import { useTheme } from '../context/ThemeContext';
import { RADIUS, SPACING } from '../constants/theme';
import { getAppLanguage, setAppLanguage, useLanguage } from '../localization/i18n';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onProfileUpdated: (updatedUser: UserProfile) => void;
  onPhotoUpdated?: (photoUri: string | null) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  onClose,
  user,
  onProfileUpdated,
  onPhotoUpdated
}) => {
  const { colors, isDark } = useTheme();
  const { t } = useLanguage();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('en');
  const [saving, setSaving] = useState(false);
  const [localPhotoUri, setLocalPhotoUri] = useState<string | null>(null);

  useEffect(() => {
    if (user && visible) {
      setFullName(user.fullName || '');
      setPhone(user.phone || '');
      setJobRole(user.jobRole || '');
      setExperienceYears(user.experienceYears != null ? String(user.experienceYears) : '0');
      setSelectedLanguage((user.preferredLanguage as SupportedLanguage) || getAppLanguage());
      offlineStorage.getProfileImage().then((img) => setLocalPhotoUri(img));
    }
  }, [user, visible]);

  const handlePickPhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Gallery permission is required to select a photo.');
        return;
      }
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        base64: true
      });
      if (!res.canceled && res.assets && res.assets.length > 0) {
        const dataUrl = res.assets[0].base64
          ? `data:image/jpeg;base64,${res.assets[0].base64}`
          : res.assets[0].uri;
        // Temporary local profile image storage.
        // Replace with backend/cloud storage when profile image persistence is added to the database.
        await offlineStorage.saveProfileImage(dataUrl);
        setLocalPhotoUri(dataUrl);
        if (onPhotoUpdated) onPhotoUpdated(dataUrl);
        Alert.alert(t('common.success', 'Success'), t('profile.photoUpdated', 'Profile photo updated successfully.'));
      }
    } catch (e) {
      console.error('Error selecting photo', e);
    }
  };

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert(t('common.error', 'Validation Error'), t('profile.fullNameEmpty', 'Full Name cannot be empty.'));
      return;
    }

    const expNum = parseInt(experienceYears, 10);
    if (isNaN(expNum) || expNum < 0) {
      Alert.alert(t('common.error', 'Validation Error'), t('profile.invalidExperience', 'Industrial experience must be a valid positive number.'));
      return;
    }

    setSaving(true);
    try {
      const payload = {
        fullName: fullName.trim(),
        phone: phone.trim(),
        jobRole: jobRole.trim(),
        experienceYears: expNum,
        preferredLanguage: selectedLanguage
      };

      const updated = await mobileApi.updateProfile(payload);

      // Sync active app language if changed
      if (selectedLanguage !== getAppLanguage()) {
        setAppLanguage(selectedLanguage);
        await offlineStorage.saveLanguage(selectedLanguage);
      }

      onProfileUpdated(updated);
      onClose();
      Alert.alert(t('common.success', 'Success'), t('profile.profileUpdated', 'Worker profile credentials successfully updated.'));
    } catch (err: any) {
      Alert.alert(t('common.error', 'Update Failed'), err.message || t('profile.updateFailed', 'Unable to update profile. Please try again.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerTitleRow}>
              <View style={[styles.headerIconCircle, { backgroundColor: isDark ? '#134E4A' : '#E8F8F5' }]}>
                <User size={18} color={colors.primary} />
              </View>
              <Text style={[styles.modalTitle, { color: colors.darkText }]}>{t('profile.editProfile', 'Edit Worker Profile')}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <X size={20} color={colors.mutedText} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Locked Organizational Identity Banner */}
            <View style={[styles.lockedBanner, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9', borderColor: colors.border }]}>
              <Lock size={14} color={colors.mutedText} style={{ marginTop: 2 }} />
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={[styles.lockedIdText, { color: colors.darkText }]}>
                  {user?.workerId || 'WRK-ID'} • {user?.organizationName || 'Safety Organization'}
                </Text>
                <Text style={[styles.lockedSectorText, { color: colors.mutedText }]}>
                  {t('profile.industrySector', 'Sector')}: {user?.sector || 'INDUSTRIAL'} ({t('profile.lockedByAdmin', 'Locked by Plant Admin')})
                </Text>
              </View>
            </View>

            {/* Profile Photo Selection Action */}
            <TouchableOpacity
              style={[
                styles.photoEditButton,
                { backgroundColor: isDark ? '#1E293B' : '#E8F8F5', borderColor: colors.primary }
              ]}
              onPress={handlePickPhoto}
              activeOpacity={0.8}
            >
              <Camera size={16} color={colors.primary} />
              <Text style={[styles.photoEditButtonText, { color: colors.primary }]}>
                {localPhotoUri ? t('profile.changePicture', 'Change Profile Picture') : t('profile.uploadPicture', 'Upload Profile Picture')}
              </Text>
            </TouchableOpacity>

            {/* Full Name */}
            <View style={styles.formGroup}>
              <Text style={[styles.inputLabel, { color: colors.darkText }]}>{t('auth.fullName', 'Full Name')} *</Text>
              <View style={[styles.inputWrapper, { backgroundColor: isDark ? '#1E293B' : '#F8FAF9', borderColor: colors.border }]}>
                <User size={16} color={colors.mutedText} />
                <TextInput
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="e.g. Rajesh Kumar Soren"
                  placeholderTextColor={colors.mutedText}
                  style={[styles.textInput, { color: colors.darkText }]}
                />
              </View>
            </View>

            {/* Contact Phone */}
            <View style={styles.formGroup}>
              <Text style={[styles.inputLabel, { color: colors.darkText }]}>{t('profile.phone', 'Contact Phone Number')}</Text>
              <View style={[styles.inputWrapper, { backgroundColor: isDark ? '#1E293B' : '#F8FAF9', borderColor: colors.border }]}>
                <Phone size={16} color={colors.mutedText} />
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="+919876543210"
                  placeholderTextColor={colors.mutedText}
                  keyboardType="phone-pad"
                  style={[styles.textInput, { color: colors.darkText }]}
                />
              </View>
            </View>

            {/* Job Role */}
            <View style={styles.formGroup}>
              <Text style={[styles.inputLabel, { color: colors.darkText }]}>{t('profile.jobRole', 'Job Role / Designation')}</Text>
              <View style={[styles.inputWrapper, { backgroundColor: isDark ? '#1E293B' : '#F8FAF9', borderColor: colors.border }]}>
                <Briefcase size={16} color={colors.mutedText} />
                <TextInput
                  value={jobRole}
                  onChangeText={setJobRole}
                  placeholder="e.g. Blast Furnace Operator"
                  placeholderTextColor={colors.mutedText}
                  style={[styles.textInput, { color: colors.darkText }]}
                />
              </View>
            </View>

            {/* Experience Years */}
            <View style={styles.formGroup}>
              <Text style={[styles.inputLabel, { color: colors.darkText }]}>{t('profile.experienceYears', 'Experience (Years)')}</Text>
              <View style={[styles.inputWrapper, { backgroundColor: isDark ? '#1E293B' : '#F8FAF9', borderColor: colors.border }]}>
                <Clock size={16} color={colors.mutedText} />
                <TextInput
                  value={experienceYears}
                  onChangeText={setExperienceYears}
                  placeholder="e.g. 5"
                  placeholderTextColor={colors.mutedText}
                  keyboardType="numeric"
                  style={[styles.textInput, { color: colors.darkText }]}
                />
              </View>
            </View>

            {/* Preferred Language */}
            <View style={styles.formGroup}>
              <View style={styles.labelWithIcon}>
                <Globe size={14} color={colors.primary} />
                <Text style={[styles.inputLabel, { color: colors.darkText, marginLeft: 6, marginBottom: 0 }]}>
                  {t('profile.preferredLanguage', 'Preferred Language')}
                </Text>
              </View>
              <View style={styles.langPillsContainer}>
                <TouchableOpacity
                  style={[
                    styles.langPill,
                    { backgroundColor: isDark ? '#1E293B' : '#F8FAF9', borderColor: colors.border },
                    selectedLanguage === 'en' && { backgroundColor: colors.primary, borderColor: colors.primary }
                  ]}
                  onPress={() => setSelectedLanguage('en')}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.langPillText, { color: colors.mutedText }, selectedLanguage === 'en' && styles.langPillTextActive]}>
                    English
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.langPill,
                    { backgroundColor: isDark ? '#1E293B' : '#F8FAF9', borderColor: colors.border },
                    selectedLanguage === 'hi' && { backgroundColor: colors.primary, borderColor: colors.primary }
                  ]}
                  onPress={() => setSelectedLanguage('hi')}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.langPillText, { color: colors.mutedText }, selectedLanguage === 'hi' && styles.langPillTextActive]}>
                    हिन्दी
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.langPill,
                    { backgroundColor: isDark ? '#1E293B' : '#F8FAF9', borderColor: colors.border },
                    selectedLanguage === 'sat' && { backgroundColor: colors.primary, borderColor: colors.primary }
                  ]}
                  onPress={() => setSelectedLanguage('sat')}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.langPillText, { color: colors.mutedText }, selectedLanguage === 'sat' && styles.langPillTextActive]}>
                    ᱥᱟᱱᱛᱟᱲᱤ
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={[styles.modalActionRow, { borderTopColor: colors.border }]}>
            <TouchableOpacity
              style={[styles.cancelButton, { borderColor: colors.border }]}
              onPress={onClose}
              disabled={saving}
              activeOpacity={0.7}
            >
              <Text style={[styles.cancelButtonText, { color: colors.mutedText }]}>{t('common.cancel', 'Cancel')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: colors.primary }]}
              onPress={handleSave}
              disabled={saving}
              activeOpacity={0.85}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Check size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.saveButtonText}>{t('common.save', 'Save Changes')}</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    padding: SPACING.md
  },
  modalContainer: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    maxHeight: '90%',
    overflow: 'hidden'
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0'
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800'
  },
  modalCloseButton: {
    padding: 4
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md
  },
  lockedBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: SPACING.sm + 4,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    marginBottom: SPACING.md
  },
  lockedIdText: {
    fontSize: 13,
    fontWeight: '700'
  },
  lockedSectorText: {
    fontSize: 11,
    marginTop: 2
  },
  formGroup: {
    marginBottom: SPACING.md
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  labelWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 48
  },
  textInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    paddingVertical: 0
  },
  langPillsContainer: {
    flexDirection: 'row',
    gap: 8
  },
  langPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  langPillText: {
    fontSize: 12,
    fontWeight: '700'
  },
  langPillTextActive: {
    color: '#FFFFFF'
  },
  modalActionRow: {
    flexDirection: 'row',
    padding: SPACING.md,
    gap: 12,
    borderTopWidth: 1
  },
  cancelButton: {
    flex: 1,
    height: 46,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '700'
  },
  saveButton: {
    flex: 1.5,
    height: 46,
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800'
  },
  photoEditButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    marginBottom: 16
  },
  photoEditButtonText: {
    fontSize: 13,
    fontWeight: '700'
  }
});
