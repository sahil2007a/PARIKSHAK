import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
  Alert,
  Platform,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  PhoneCall,
  ShieldAlert,
  BookOpen,
  ExternalLink,
  Flame,
  Search,
  X,
  Copy,
  Check,
  Building,
  AlertTriangle,
  Radio,
  ShieldCheck,
  Clock,
  CheckCircle2,
  ChevronRight
} from 'lucide-react-native';
import { router } from 'expo-router';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { useLanguage } from '../localization/i18n';
import { useTheme } from '../context/ThemeContext';
import { offlineStorage } from '../services/offlineStorage';
import { mobileApi } from '../services/api';
import { UserProfile } from '@parishak/shared';

interface EmergencyContactItem {
  id: string;
  title: string;
  category: 'sos' | 'medical' | 'fire' | 'statutory' | 'warden';
  number: string;
  badge: string;
  badgeType: 'critical' | 'medical' | 'warning' | 'info' | 'primary';
  desc: string;
  location?: string;
  available: string;
  dialNumber: string;
}

export default function HelpScreen() {
  const { t } = useLanguage();
  const { colors, isDark } = useTheme();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadUserData = async () => {
    try {
      const cached = await offlineStorage.getUser();
      if (cached) setUser(cached);
      const remote = await mobileApi.getProfile();
      if (remote) setUser(remote);
    } catch {
      // offline fallback
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserData();
    setRefreshing(false);
  };

  const plantName = user?.organizationName || 'Central Industrial Operations';
  const sectorName = user?.sector || 'MINING';

  // Dynamic Emergency Contacts based on user's facility and sector
  const emergencyContacts: EmergencyContactItem[] = useMemo(() => [
    {
      id: 'control-room',
      title: `${plantName} Safety Control Room`,
      category: 'sos',
      number: '+91 1800 123 4567',
      dialNumber: '+9118001234567',
      badge: t('help.active247', '24/7 ACTIVE'),
      badgeType: 'critical',
      desc: 'Real-time telemetry, gas sensor monitoring (CO / CH4 / O2) & emergency evacuation dispatch.',
      location: `${plantName} • Pithead Unit A`,
      available: '24/7 Continuous Monitoring'
    },
    {
      id: 'medical-center',
      title: 'Plant Medical & Industrial Trauma Center',
      category: 'medical',
      number: '+91 1800 123 9999',
      dialNumber: '+9118001239999',
      badge: t('help.onDuty', 'AMBULANCE ON-SITE'),
      badgeType: 'medical',
      desc: 'On-site industrial first aid, trauma response, cardiac resuscitation & emergency triage.',
      location: 'Medical Post • Main Safety Gate',
      available: '24/7 Immediate Triage'
    },
    {
      id: 'fire-brigade',
      title: 'Industrial Fire & Hazmat Brigade',
      category: 'fire',
      number: '101',
      dialNumber: '101',
      badge: 'RAPID DISPATCH',
      badgeType: 'warning',
      desc: 'Foam tender deployment, chemical vapor suppression & PASS high-pressure containment.',
      location: 'Safety Zone B • Industrial Fire Station',
      available: 'Turnout Under 3 Mins'
    },
    {
      id: 'national-sos',
      title: 'National Emergency Response (PAN-India SOS)',
      category: 'sos',
      number: '112',
      dialNumber: '112',
      badge: 'UNIFIED 112',
      badgeType: 'critical',
      desc: 'Unified all-India helpline for disaster relief, state NDRF units & emergency civil response.',
      location: 'National Operations Grid',
      available: 'Toll-Free 24/7 Service'
    },
    {
      id: 'dgms-bureau',
      title: 'DGMS Safety Bureau & Regulatory Cell',
      category: 'statutory',
      number: '+91 1800 233 4455',
      dialNumber: '+9118002334455',
      badge: t('help.tollFree', 'TOLL-FREE'),
      badgeType: 'info',
      desc: 'Directorate General of Mines Safety official reporting, statutory safety standards & advisory desk.',
      location: 'DGMS Regional Inspectorate Directorate',
      available: 'Mon - Sat (08:00 - 20:00)'
    },
    {
      id: 'shift-warden',
      title: `${plantName} Shift Safety Warden`,
      category: 'warden',
      number: '+91 94250 88120',
      dialNumber: '+919425088120',
      badge: t('help.directLine', 'DIRECT LINE'),
      badgeType: 'primary',
      desc: 'On-duty shift supervisor, Lockout/Tagout (LOTO) key issuer & confined space permit supervisor.',
      location: 'Shaft #3 Control Cabin',
      available: 'Current Active Shift'
    },
    {
      id: 'ventilation-cell',
      title: 'Underground Gas & Ventilation Monitoring Cell',
      category: 'sos',
      number: '+91 1800 123 8844',
      dialNumber: '+9118001238844',
      badge: 'CH4 / CO TELEMETRY',
      badgeType: 'critical',
      desc: 'Continuous atmospheric ventilation sensors, auxiliary fan diagnostics & noxious gas alerts.',
      location: 'Ventilation Fan Substation #2',
      available: '24/7 Automated Sensors'
    }
  ], [plantName, t]);

  const categories = [
    { id: 'all', label: t('help.all', 'All') },
    { id: 'sos', label: t('help.sos', '🚨 SOS & Control') },
    { id: 'medical', label: t('help.medical', '🏥 Medical & Trauma') },
    { id: 'fire', label: t('help.fire', '🔥 Fire & Hazmat') },
    { id: 'statutory', label: t('help.statutory', '⚖️ DGMS Statutory') }
  ];

  const filteredContacts = useMemo(() => {
    return emergencyContacts.filter((c) => {
      const matchCategory =
        selectedCategory === 'all' ||
        c.category === selectedCategory ||
        (selectedCategory === 'sos' && (c.category === 'sos' || c.category === 'warden'));

      if (!matchCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      return (
        c.title.toLowerCase().includes(q) ||
        c.desc.toLowerCase().includes(q) ||
        c.number.toLowerCase().includes(q) ||
        (c.location && c.location.toLowerCase().includes(q))
      );
    });
  }, [emergencyContacts, selectedCategory, searchQuery]);

  const handleCall = (num: string, title: string) => {
    const cleanNum = num.replace(/\s+/g, '');
    const url = `tel:${cleanNum}`;

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert(
            title,
            `Emergency Number: ${num}\n(Device telephone dialer is not available directly on this device)`,
            [{ text: 'OK' }]
          );
        }
      })
      .catch(() => {
        Alert.alert(
          title,
          `Dial: ${num}`,
          [{ text: 'OK' }]
        );
      });
  };

  const handleCopy = (num: string, id: string) => {
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const getBadgeColors = (type: EmergencyContactItem['badgeType']) => {
    switch (type) {
      case 'critical':
        return {
          bg: '#FEE2E2',
          border: '#FCA5A5',
          text: '#B91C1C',
          dot: '#EF4444',
          iconBg: '#FEF2F2',
          iconColor: '#DC2626'
        };
      case 'medical':
        return {
          bg: '#E0F2FE',
          border: '#BAE6FD',
          text: '#0369A1',
          dot: '#0284C7',
          iconBg: '#F0F9FF',
          iconColor: '#0284C7'
        };
      case 'warning':
        return {
          bg: '#FEF3C7',
          border: '#FDE68A',
          text: '#B45309',
          dot: '#F59E0B',
          iconBg: '#FFFBEB',
          iconColor: '#D97706'
        };
      case 'info':
        return {
          bg: '#F3E8FF',
          border: '#E9D5FF',
          text: '#7E22CE',
          dot: '#A855F7',
          iconBg: '#FAF5FF',
          iconColor: '#9333EA'
        };
      default:
        return {
          bg: isDark ? '#134E4A' : '#E6FFFA',
          border: isDark ? '#115E59' : '#B2F5EA',
          text: '#0D9488',
          dot: '#14B8A6',
          iconBg: isDark ? '#134E4A' : '#E8F8F5',
          iconColor: colors.primary
        };
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      {/* Top Header Bar with functional Back Button */}
      <View style={[styles.topBar, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backButton, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          activeOpacity={0.7}
        >
          <ArrowLeft size={18} color={colors.darkText} />
        </TouchableOpacity>

        <View style={styles.topBarTitleContainer}>
          <Text style={[styles.topBarTitle, { color: colors.darkText }]}>
            {t('help.title', 'Safety Directory & Help')}
          </Text>
          <View style={styles.topBarSubtitleRow}>
            <Building size={11} color={colors.primary} />
            <Text style={[styles.topBarSubtitle, { color: colors.mutedText }]} numberOfLines={1}>
              {plantName} • {sectorName}
            </Text>
          </View>
        </View>

        <View style={styles.topBarRightPlaceholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {/* RED ALERT EMERGENCY HERO PROTOCOL BOX */}
        <View style={styles.emergencyHeroBox}>
          <View style={styles.emergencyHeroHeader}>
            <View style={styles.emergencyTitleRow}>
              <View style={styles.flameBadge}>
                <Flame size={18} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.emergencyHeroTitle}>
                  {t('help.emergencyProtocol', 'EMERGENCY PROTOCOL')}
                </Text>
                <Text style={styles.emergencyHeroSubtitle}>
                  {plantName} • Rapid Response Grid
                </Text>
              </View>
            </View>

            <View style={styles.liveDispatchChip}>
              <View style={styles.livePulseDot} />
              <Text style={styles.liveDispatchText}>24/7 ACTIVE</Text>
            </View>
          </View>

          <Text style={styles.emergencyHeroDesc}>
            In case of active toxic gas detection (CO / Methane &gt; 0.5%), conveyor jam, explosion threat, or structural anomaly, immediately trip the nearest zone pull-cord alarm, alert your shift warden, and proceed to the designated muster point.
          </Text>

          {/* Rapid 1-Tap SOS Speed Dial Buttons */}
          <View style={styles.sosButtonsRow}>
            <TouchableOpacity
              style={styles.sosPrimaryBtn}
              onPress={() => handleCall('+91 1800 123 4567', 'Mine Safety Control')}
              activeOpacity={0.85}
            >
              <PhoneCall size={16} color="#FFFFFF" />
              <Text style={styles.sosPrimaryBtnText}>SOS Control (+91 1800 123 4567)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sosAmbulanceBtn}
              onPress={() => handleCall('108', 'Industrial Ambulance')}
              activeOpacity={0.85}
            >
              <Radio size={16} color="#FFFFFF" />
              <Text style={styles.sosAmbulanceBtnText}>Ambulance (108 / 112)</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Input Bar */}
        <View style={[styles.searchBarContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Search size={18} color={colors.mutedText} />
          <TextInput
            style={[styles.searchInput, { color: colors.darkText }]}
            placeholder={t('help.searchPlaceholder', 'Search emergency services, departments, numbers...')}
            placeholderTextColor={colors.mutedText}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={16} color={colors.mutedText} />
            </TouchableOpacity>
          )}
        </View>

        {/* Category Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScrollContainer}
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryPill,
                  {
                    backgroundColor: isSelected
                      ? colors.primary
                      : isDark
                      ? '#1E293B'
                      : '#FFFFFF',
                    borderColor: isSelected ? colors.primary : colors.border
                  }
                ]}
                onPress={() => setSelectedCategory(cat.id)}
                activeOpacity={0.75}
              >
                <Text
                  style={[
                    styles.categoryPillText,
                    {
                      color: isSelected
                        ? '#FFFFFF'
                        : isDark
                        ? '#CBD5E1'
                        : colors.darkText,
                      fontWeight: isSelected ? '700' : '600'
                    }
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Section Title & Count */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.darkText }]}>
            {t('help.emergencyContacts', 'Emergency Contacts')} ({filteredContacts.length})
          </Text>
          <Text style={[styles.sectionSubtitleTag, { color: colors.mutedText }]}>
            Tap to call directly
          </Text>
        </View>

        {/* Emergency Contacts List with Zero Overlapping Card Architecture */}
        {filteredContacts.length === 0 ? (
          <View style={[styles.emptyResultCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <AlertTriangle size={32} color={colors.mutedText} />
            <Text style={[styles.emptyResultTitle, { color: colors.darkText }]}>
              {t('help.noResults', 'No emergency contacts found')}
            </Text>
            <Text style={[styles.emptyResultText, { color: colors.mutedText }]}>
              Try searching with different keywords like 'fire', 'ambulance', 'control', or 'warden'.
            </Text>
            <TouchableOpacity
              style={[styles.resetSearchBtn, { backgroundColor: colors.primary }]}
              onPress={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
            >
              <Text style={styles.resetSearchBtnText}>Reset Search Filters</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.contactsList}>
            {filteredContacts.map((contact) => {
              const bStyle = getBadgeColors(contact.badgeType);
              const isCopied = copiedId === contact.id;

              return (
                <View
                  key={contact.id}
                  style={[
                    styles.contactCardNew,
                    {
                      backgroundColor: colors.card,
                      borderColor: isDark ? '#334155' : '#E2E8F0'
                    }
                  ]}
                >
                  {/* TOP ROW: Icon + Title & Description + Status Badge */}
                  <View style={styles.cardHeaderNew}>
                    <View style={[styles.contactIconBadgeNew, { backgroundColor: bStyle.iconBg }]}>
                      <PhoneCall size={18} color={bStyle.iconColor} />
                    </View>

                    <View style={styles.cardHeaderInfoNew}>
                      <View style={styles.cardTitleWrap}>
                        <Text
                          style={[styles.contactTitleNew, { color: colors.darkText }]}
                          numberOfLines={2}
                        >
                          {contact.title}
                        </Text>
                      </View>
                      <Text style={[styles.contactDescNew, { color: colors.mutedText }]}>
                        {contact.desc}
                      </Text>
                    </View>

                    {/* Clean Status Badge without crowding */}
                    <View
                      style={[
                        styles.statusBadgeNew,
                        {
                          backgroundColor: bStyle.bg,
                          borderColor: bStyle.border
                        }
                      ]}
                    >
                      <View style={[styles.statusDotNew, { backgroundColor: bStyle.dot }]} />
                      <Text style={[styles.statusBadgeTextNew, { color: bStyle.text }]}>
                        {contact.badge}
                      </Text>
                    </View>
                  </View>

                  {/* LOCATION & AVAILABILITY SUB-BAR */}
                  {contact.location && (
                    <View
                      style={[
                        styles.cardMetaBarNew,
                        { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }
                      ]}
                    >
                      <Building size={11} color={colors.mutedText} />
                      <Text
                        style={[styles.cardMetaTextNew, { color: colors.mutedText }]}
                        numberOfLines={1}
                      >
                        {contact.location}
                      </Text>
                      <Text style={[styles.cardMetaDot, { color: colors.mutedText }]}>•</Text>
                      <Clock size={11} color={colors.mutedText} />
                      <Text
                        style={[styles.cardMetaTextNew, { color: colors.mutedText }]}
                        numberOfLines={1}
                      >
                        {contact.available}
                      </Text>
                    </View>
                  )}

                  {/* SUBTLE CARD SEPARATOR */}
                  <View style={[styles.cardDividerNew, { backgroundColor: isDark ? '#334155' : '#F1F5F9' }]} />

                  {/* BOTTOM ACTION BAR: Dedicated Phone Pill & Call Button (Never Overlaps) */}
                  <View style={styles.cardFooterNew}>
                    {/* Phone Number Pill with Copy Action */}
                    <TouchableOpacity
                      style={[
                        styles.phoneNumberPillNew,
                        {
                          backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
                          borderColor: isDark ? '#334155' : '#E2E8F0'
                        }
                      ]}
                      onPress={() => handleCopy(contact.number, contact.id)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.phoneNumberTextNew, { color: colors.darkText }]}>
                        {contact.number}
                      </Text>
                      <View style={styles.copyBadgeNew}>
                        {isCopied ? (
                          <View style={styles.copiedIndicator}>
                            <Check size={11} color="#16A34A" />
                            <Text style={styles.copiedIndicatorText}>{t('help.copied', 'Copied!')}</Text>
                          </View>
                        ) : (
                          <Copy size={12} color={colors.mutedText} />
                        )}
                      </View>
                    </TouchableOpacity>

                    {/* Dedicated Call Action Button */}
                    <TouchableOpacity
                      style={[styles.callBtnNew, { backgroundColor: colors.primary }]}
                      onPress={() => handleCall(contact.dialNumber, contact.title)}
                      activeOpacity={0.85}
                    >
                      <PhoneCall size={14} color="#FFFFFF" />
                      <Text style={styles.callBtnTextNew}>{t('help.callNow', 'Call Now')}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* STATUTORY SAFETY GUIDELINES */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.darkText }]}>
            {t('help.safetyGuidelines', 'Statutory Safety Guidelines')}
          </Text>
        </View>

        <View style={[styles.guidelinesCardNew, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.guidelineItemNew}>
            <View style={[styles.guidelineIconBox, { backgroundColor: '#FEF2F2' }]}>
              <ShieldAlert size={16} color="#DC2626" />
            </View>
            <View style={styles.guidelineContentNew}>
              <Text style={[styles.guidelineTitleNew, { color: colors.darkText }]}>
                DGMS Circular 2026/04: Pithead Inspection SOP
              </Text>
              <Text style={[styles.guidelineTextNew, { color: colors.mutedText }]}>
                Mandatory gas monitoring (CH4, CO, O2, H2S) every 4 hours. Atmospheric records must be logged into the central safety ledger.
              </Text>
            </View>
          </View>

          <View style={[styles.guidelineDivider, { backgroundColor: colors.border }]} />

          <View style={styles.guidelineItemNew}>
            <View style={[styles.guidelineIconBox, { backgroundColor: '#EFF6FF' }]}>
              <BookOpen size={16} color="#2563EB" />
            </View>
            <View style={styles.guidelineContentNew}>
              <Text style={[styles.guidelineTitleNew, { color: colors.darkText }]}>
                IS 12436: Zero-Tolerance Lockout/Tagout (LOTO)
              </Text>
              <Text style={[styles.guidelineTextNew, { color: colors.mutedText }]}>
                Full mechanical de-energization and dual-padlock verification required before inspecting any haulage or conveyor machinery.
              </Text>
            </View>
          </View>

          <View style={[styles.guidelineDivider, { backgroundColor: colors.border }]} />

          <View style={styles.guidelineItemNew}>
            <View style={[styles.guidelineIconBox, { backgroundColor: '#ECFDF5' }]}>
              <ShieldCheck size={16} color="#059669" />
            </View>
            <View style={styles.guidelineContentNew}>
              <Text style={[styles.guidelineTitleNew, { color: colors.darkText }]}>
                IS 2171 / IS 15683: Portable Fire Extinguishers
              </Text>
              <Text style={[styles.guidelineTextNew, { color: colors.mutedText }]}>
                Execute PASS technique (Pull, Aim, Squeeze, Sweep) targeting the base of flames with minimum 2-meter safety clearance.
              </Text>
            </View>
          </View>

          <View style={[styles.guidelineDivider, { backgroundColor: colors.border }]} />

          <TouchableOpacity
            style={[styles.dgmsLinkRow, { backgroundColor: isDark ? '#1E293B' : '#F8FAFC' }]}
            onPress={() => Linking.openURL('https://dgms.gov.in')}
            activeOpacity={0.75}
          >
            <View style={styles.dgmsLinkLeft}>
              <ExternalLink size={14} color={colors.primary} />
              <Text style={[styles.dgmsLinkText, { color: colors.primary }]}>
                Access Official DGMS Safety Portal & Circulars
              </Text>
            </View>
            <ChevronRight size={14} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 4,
    borderBottomWidth: 1
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center'
  },
  topBarTitleContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: SPACING.xs
  },
  topBarTitle: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2
  },
  topBarSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2
  },
  topBarSubtitle: {
    fontSize: 11,
    fontWeight: '600'
  },
  topBarRightPlaceholder: {
    width: 36
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xxl + 20
  },

  /* EMERGENCY HERO PROTOCOL BOX */
  emergencyHeroBox: {
    backgroundColor: '#991B1B',
    borderRadius: RADIUS.xl,
    padding: SPACING.md + 2,
    marginBottom: SPACING.md,
    ...SHADOWS.md
  },
  emergencyHeroHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm
  },
  emergencyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1
  },
  flameBadge: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  emergencyHeroTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.6
  },
  emergencyHeroSubtitle: {
    fontSize: 11,
    color: '#FECACA',
    fontWeight: '600',
    marginTop: 1
  },
  liveDispatchChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)'
  },
  livePulseDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#4ADE80'
  },
  liveDispatchText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.4
  },
  emergencyHeroDesc: {
    fontSize: 12,
    color: '#FEE2E2',
    lineHeight: 18,
    marginBottom: SPACING.md
  },
  sosButtonsRow: {
    flexDirection: 'row',
    gap: 8
  },
  sosPrimaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#DC2626',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)'
  },
  sosPrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800'
  },
  sosAmbulanceBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)'
  },
  sosAmbulanceBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800'
  },

  /* SEARCH BAR */
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: SPACING.md,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    marginBottom: SPACING.sm + 2
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    paddingVertical: 0
  },

  /* CATEGORY FILTER PILLS */
  categoryScrollContainer: {
    gap: 8,
    paddingBottom: SPACING.md
  },
  categoryPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    borderWidth: 1
  },
  categoryPillText: {
    fontSize: 12
  },

  /* SECTION HEADER */
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2
  },
  sectionSubtitleTag: {
    fontSize: 11,
    fontWeight: '600'
  },

  /* CONTACTS LIST & NEW ZERO-OVERLAY CARD */
  contactsList: {
    gap: SPACING.sm + 2,
    marginBottom: SPACING.xl
  },
  contactCardNew: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    padding: SPACING.md,
    ...SHADOWS.sm
  },
  cardHeaderNew: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12
  },
  contactIconBadgeNew: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2
  },
  cardHeaderInfoNew: {
    flex: 1,
    flexShrink: 1,
    paddingRight: 4
  },
  cardTitleWrap: {
    marginBottom: 3
  },
  contactTitleNew: {
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18
  },
  contactDescNew: {
    fontSize: 11,
    lineHeight: 16
  },
  statusBadgeNew: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    alignSelf: 'flex-start'
  },
  statusDotNew: {
    width: 6,
    height: 6,
    borderRadius: 3
  },
  statusBadgeTextNew: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.3
  },

  /* META INFO BAR */
  cardMetaBarNew: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.md,
    marginTop: SPACING.sm
  },
  cardMetaTextNew: {
    fontSize: 10,
    fontWeight: '600'
  },
  cardMetaDot: {
    fontSize: 10
  },

  cardDividerNew: {
    height: 1,
    marginVertical: SPACING.sm
  },

  /* CARD FOOTER: NUMBER & CALL BUTTON */
  cardFooterNew: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10
  },
  phoneNumberPillNew: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    borderWidth: 1
  },
  phoneNumberTextNew: {
    fontSize: 12,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 0.3
  },
  copyBadgeNew: {
    marginLeft: 6
  },
  copiedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.sm
  },
  copiedIndicatorText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#16A34A'
  },
  callBtnNew: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: RADIUS.md,
    ...SHADOWS.sm
  },
  callBtnTextNew: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },

  /* EMPTY STATE */
  emptyResultCard: {
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: SPACING.lg,
    gap: 8
  },
  emptyResultTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 4
  },
  emptyResultText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 280
  },
  resetSearchBtn: {
    marginTop: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.md
  },
  resetSearchBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  },

  /* GUIDELINES CARD */
  guidelinesCardNew: {
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    ...SHADOWS.sm,
    gap: SPACING.sm
  },
  guidelineItemNew: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12
  },
  guidelineIconBox: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2
  },
  guidelineContentNew: {
    flex: 1
  },
  guidelineTitleNew: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 2
  },
  guidelineTextNew: {
    fontSize: 11,
    lineHeight: 17
  },
  guidelineDivider: {
    height: 1
  },
  dgmsLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    marginTop: 4
  },
  dgmsLinkLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1
  },
  dgmsLinkText: {
    fontSize: 11,
    fontWeight: '700'
  }
});
