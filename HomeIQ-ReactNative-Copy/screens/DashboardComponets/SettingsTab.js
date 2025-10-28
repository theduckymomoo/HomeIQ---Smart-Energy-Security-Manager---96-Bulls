// SettingsTab.js - Themed + hoisted modals + Language Coming Soon
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  TextInput,
  Modal,
  StatusBar,
  Vibration,
  Share,
  Linking,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useTheme } from '../../context/ThemeContext';

const APP_NAME = 'HomeIQ';
const SUPPORT_EMAIL = 'support@homeiq.app';
const APP_STORE_ID = '';
const PLAY_STORE_PACKAGE_NAME = '';

const CURRENCIES = [
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
];

// helpers
const star = (filled) => (
  <MaterialIcons name={filled ? 'star' : 'star-border'} size={28} color="#f59e0b" />
);

const openStoreReviewPage = async () => {
  const iosUrl = APP_STORE_ID ? `itms-apps://itunes.apple.com/app/id${APP_STORE_ID}?action=write-review` : null;
  const androidMarket = PLAY_STORE_PACKAGE_NAME ? `market://details?id=${PLAY_STORE_PACKAGE_NAME}` : null;
  const androidWeb = PLAY_STORE_PACKAGE_NAME ? `https://play.google.com/store/apps/details?id=${PLAY_STORE_PACKAGE_NAME}` : null;
  const fallback = `https://www.google.com/search?q=${encodeURIComponent(APP_NAME + ' app')}`;
  const target = Platform.OS === 'ios' ? (iosUrl ?? fallback) : (androidMarket ?? androidWeb ?? fallback);
  try { await Linking.openURL(target); } catch { await Linking.openURL(fallback); }
};
const mailto = (to, subject, body) =>
  Linking.openURL(`mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);

// ---------- Small UI bits ----------
const SectionHeader = ({ title, color }) => (
  <Text style={[styles.sectionHeader, { color }]}>{title}</Text>
);

const SettingRow = ({ icon, title, subtitle, right, onPress, danger, border = true, colors }) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={!onPress}
    style={[
      styles.row,
      border && { borderBottomWidth: 1, borderBottomColor: colors.border },
      danger && styles.rowDanger,
    ]}
    activeOpacity={onPress ? 0.7 : 1}
  >
    <View style={styles.rowLeft}>
      <View style={[styles.iconContainer, { backgroundColor: 'rgba(16,185,129,0.1)' }]}>
        <MaterialIcons name={icon} size={20} color={danger ? '#ef4444' : colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.rowTitle, { color: danger ? '#ef4444' : colors.text }]}>{title}</Text>
        {subtitle ? <Text style={[styles.rowSubtitle, { color: colors.subtext }]}>{subtitle}</Text> : null}
      </View>
    </View>
    <View style={styles.rowRight}>
      {right ?? <MaterialIcons name="chevron-right" size={24} color={colors.subtext} />}
    </View>
  </TouchableOpacity>
);

// ---------- HOISTED MODALS ----------
function ChangePasswordModal({ visible, onClose, onSubmit }) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => { if (!visible) { setCurrent(''); setNext(''); setConfirm(''); } }, [visible]);

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Change Password</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#a1a1aa" />
            </TouchableOpacity>
          </View>
          <View style={styles.modalBody}>
            <View style={styles.inputField}>
              <Text style={styles.inputLabel}>Current Password</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  placeholder="Enter current password"
                  placeholderTextColor="#6b7280"
                  secureTextEntry={!showCurrent}
                  style={[styles.input, styles.passwordInput]}
                  value={current}
                  onChangeText={setCurrent}
                />
                <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowCurrent(!showCurrent)}>
                  <MaterialIcons name={showCurrent ? 'visibility-off' : 'visibility'} size={20} color="#a1a1aa" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.inputField}>
              <Text style={styles.inputLabel}>New Password (min 8)</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  placeholder="Enter new password"
                  placeholderTextColor="#6b7280"
                  secureTextEntry={!showNext}
                  style={[styles.input, styles.passwordInput]}
                  value={next}
                  onChangeText={setNext}
                />
                <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowNext(!showNext)}>
                  <MaterialIcons name={showNext ? 'visibility-off' : 'visibility'} size={20} color="#a1a1aa" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.inputField}>
              <Text style={styles.inputLabel}>Confirm New Password</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  placeholder="Confirm new password"
                  placeholderTextColor="#6b7280"
                  secureTextEntry={!showConfirm}
                  style={[styles.input, styles.passwordInput]}
                  value={confirm}
                  onChangeText={setConfirm}
                />
                <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowConfirm(!showConfirm)}>
                  <MaterialIcons name={showConfirm ? 'visibility-off' : 'visibility'} size={20} color="#a1a1aa" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.btnSecondary} onPress={onClose}>
              <Text style={styles.btnSecondaryText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnPrimary} onPress={() => onSubmit(current, next, confirm)}>
              <Text style={styles.btnPrimaryText}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function EmailPrefsModal({ visible, marketing, product, onClose, onChange }) {
  const [m, setM] = useState(marketing);
  const [p, setP] = useState(product);
  useEffect(() => { setM(marketing); setP(product); }, [marketing, product, visible]);

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Email Preferences</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#a1a1aa" />
            </TouchableOpacity>
          </View>
          <View style={styles.modalBody}>
            <View style={styles.switchRow}>
              <View style={styles.switchRowLeft}>
                <MaterialIcons name="campaign" size={20} color="#10b981" />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.switchRowTitle}>Marketing emails</Text>
                  <Text style={styles.switchRowSubtitle}>{m ? 'Subscribed' : 'Unsubscribed'}</Text>
                </View>
              </View>
              <Switch
                value={m}
                onValueChange={(v) => setM(v)}
                trackColor={{ false: '#3f3f46', true: '#10b981' }}
                thumbColor="#ffffff"
                ios_backgroundColor="#3f3f46"
              />
            </View>
            <View style={[styles.switchRow, { borderBottomWidth: 0 }]}>
              <View style={styles.switchRowLeft}>
                <MaterialIcons name="construction" size={20} color="#10b981" />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.switchRowTitle}>Product updates</Text>
                  <Text style={styles.switchRowSubtitle}>{p ? 'Subscribed' : 'Unsubscribed'}</Text>
                </View>
              </View>
              <Switch
                value={p}
                onValueChange={(v) => setP(v)}
                trackColor={{ false: '#3f3f46', true: '#10b981' }}
                thumbColor="#ffffff"
                ios_backgroundColor="#3f3f46"
              />
            </View>
          </View>
          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.btnSecondary} onPress={onClose}>
              <Text style={styles.btnSecondaryText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnPrimary} onPress={() => { onChange(m, p); onClose(); }}>
              <Text style={styles.btnPrimaryText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function RateAppModal({ visible, onClose, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  useEffect(() => { if (!visible) { setRating(0); setFeedback(''); } }, [visible]);
  const cta = rating >= 4 ? 'Rate on Store' : 'Send Feedback';

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Enjoying {APP_NAME}?</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#a1a1aa" />
            </TouchableOpacity>
          </View>
          <View style={styles.modalBody}>
            <Text style={styles.modalSubtitle}>Tap to rate</Text>
            <View style={styles.stars}>
              {[1,2,3,4,5].map(i => (
                <TouchableOpacity key={i} onPress={() => setRating(i)} style={{ padding: 4 }}>
                  {star(rating >= i)}
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              placeholder={rating >= 4 ? 'Anything we should highlight?' : 'Tell us what to improve...'}
              placeholderTextColor="#6b7280"
              style={[styles.input, styles.textArea]}
              multiline
              maxLength={800}
              value={feedback}
              onChangeText={setFeedback}
            />
          </View>
          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.btnSecondary} onPress={onClose}>
              <Text style={styles.btnSecondaryText}>Not now</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btnPrimary, rating === 0 && styles.btnDisabled]}
              onPress={() => onSubmit(rating, feedback)}
              disabled={rating === 0}
            >
              <Text style={styles.btnPrimaryText}>{rating === 0 ? 'Pick stars' : cta}</Text>
            </TouchableOpacity>
          </View>
          {rating >= 4 && (!APP_STORE_ID || !PLAY_STORE_PACKAGE_NAME) ? (
            <Text style={styles.hintText}>
              Tip: set APP_STORE_ID (iOS) and PLAY_STORE_PACKAGE_NAME (Android) for direct review links.
            </Text>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

function CurrencyModal({ visible, selected, onClose, onSelect }) {
  const [query, setQuery] = useState('');
  const filtered = CURRENCIES.filter(
    c => c.code.toLowerCase().includes(query.toLowerCase()) ||
         c.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Choose Currency</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#a1a1aa" />
            </TouchableOpacity>
          </View>

          <View style={[styles.modalBody, { paddingTop: 12 }]}>
            <TextInput
              placeholder="Search currency or code (e.g. ZAR)"
              placeholderTextColor="#6b7280"
              style={styles.input}
              value={query}
              onChangeText={setQuery}
            />

            <View style={{ marginTop: 12 }}>
              {filtered.map((c, idx) => {
                const active = c.code === selected;
                return (
                  <TouchableOpacity
                    key={c.code}
                    onPress={() => onSelect(c.code)}
                    style={{
                      paddingVertical: 12,
                      paddingHorizontal: 12,
                      borderBottomWidth: idx === filtered.length - 1 ? 0 : 1,
                      borderBottomColor: 'rgba(255,255,255,0.08)',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={[styles.iconContainer, { marginRight: 12 }]}>
                        <Text style={{ color: '#10b981', fontWeight: '700' }}>{c.symbol}</Text>
                      </View>
                      <View>
                        <Text style={styles.switchRowTitle}>{c.name}</Text>
                        <Text style={styles.switchRowSubtitle}>{c.code}</Text>
                      </View>
                    </View>
                    {active ? (
                      <MaterialIcons name="radio-button-checked" size={20} color="#10b981" />
                    ) : (
                      <MaterialIcons name="radio-button-unchecked" size={20} color="#6b7280" />
                    )}
                  </TouchableOpacity>
                );
              })}
              {filtered.length === 0 && (
                <Text style={{ color: '#a1a1aa', marginTop: 8 }}>No results for “{query}”.</Text>
              )}
            </View>
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.btnSecondary} onPress={onClose}>
              <Text style={styles.btnSecondaryText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// NEW: Language Coming Soon modal
function LanguageComingSoonModal({ visible, onClose, colors, themeDark }) {
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Language</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color={colors.subtext} />
            </TouchableOpacity>
          </View>

          <View style={[styles.modalBody, { alignItems: 'center' }]}>
            {/* Big round icon */}
            <View
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: themeDark ? 'rgba(139,92,246,0.15)' : 'rgba(139,92,246,0.12)',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}
            >
              <MaterialIcons name="language" size={48} color="#8B5CF6" />
            </View>

            <Text style={{ color: colors.text, fontSize: 28, fontWeight: '800', marginBottom: 8 }}>
              Coming Soon
            </Text>

            <Text style={{ color: colors.subtext, fontSize: 16, textAlign: 'center', lineHeight: 22, marginBottom: 16 }}>
              We’re adding multi-language support so you can personalize your HomeIQ experience.
            </Text>

            {/* bullets */}
            <View style={{ width: '100%', paddingHorizontal: 8, marginBottom: 16 }}>
              {[
                'Switch the entire app language',
                'Localized tips and guidance',
                'Right-to-left support where needed',
              ].map((t) => (
                <View key={t} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 6 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#10b981', marginRight: 10 }} />
                  <Text style={{ color: colors.text, fontSize: 16 }}>{t}</Text>
                </View>
              ))}
            </View>

            {/* badge */}
            <View
              style={{
                backgroundColor: '#ffb300',
                paddingVertical: 8,
                paddingHorizontal: 18,
                borderRadius: 12,
                marginBottom: 12,
              }}
            >
              <Text style={{ color: '#000', fontWeight: '800', letterSpacing: 0.5 }}>COMING SOON</Text>
            </View>
          </View>

          <View style={[styles.modalActions, { borderTopColor: colors.border }]}>
            <TouchableOpacity style={[styles.btnPrimary, { backgroundColor: colors.primary }]} onPress={onClose}>
              <Text style={styles.btnPrimaryText}>Got It</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ======================= MAIN: SettingsTab =======================
export default function SettingsTab() {
  const { user, userProfile, supabase, updateProfile, signOut, getUserSettings, upsertUserSettings } = useAuth();
  const { currency: globalCurrency, setCurrency: setGlobalCurrency } = useCurrency();
  const { darkMode: themeDark, setDarkMode: setDarkModeGlobal, colors } = useTheme();

  // UI state
  const [privacyVisible, setPrivacyVisible] = useState(false);
  const [termsVisible, setTermsVisible] = useState(false);
  const [helpVisible, setHelpVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [pwdModalVisible, setPwdModalVisible] = useState(false);
  const [emailPrefsVisible, setEmailPrefsVisible] = useState(false);
  const [energyModalVisible, setEnergyModalVisible] = useState(false);
  const [aboutVisible, setAboutVisible] = useState(false);
  const [rateVisible, setRateVisible] = useState(false);
  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);
  const [languageSoonVisible, setLanguageSoonVisible] = useState(false); // NEW

  const [saving, setSaving] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(true);

  const [editProfile, setEditProfile] = useState({ firstName: '', lastName: '', phone: '' });

  // persisted settings
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [haptics, setHaptics] = useState(true);
  const [energyAlerts, setEnergyAlerts] = useState(true);
  const [energyThreshold, setEnergyThreshold] = useState('300');
  const [autoOptimize, setAutoOptimize] = useState(false);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [currency, setCurrency] = useState('ZAR');
  const [language, setLanguage] = useState('English'); // label only (kept)
  const [emailMarketing, setEmailMarketing] = useState(true);
  const [emailProduct, setEmailProduct] = useState(true);

  const version = useMemo(() => Constants.expoConfig?.version ?? '1.0.0', []);

  const tick = () => { if (haptics) Vibration.vibrate(50); };

  // load settings
  const hydrateProfile = useCallback(() => {
    if (!userProfile) return;
    setEditProfile({
      firstName: userProfile.first_name || '',
      lastName: userProfile.last_name || '',
      phone: userProfile.phone || '',
    });
  }, [userProfile]);

  const loadUserSettings = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoadingSettings(true);
      const settings = await getUserSettings();
      if (settings) {
        setDarkMode(!!settings.dark_mode);
        setDarkModeGlobal(!!settings.dark_mode); // sync with app theme
        setNotifications(!!settings.notifications);
        setHaptics(!!settings.haptic_feedback);
        setEnergyAlerts(!!settings.energy_alerts);
        setEnergyThreshold(String(settings.energy_threshold ?? '300'));
        setAutoOptimize(!!settings.auto_optimization);
        setWeeklyReports(!!settings.weekly_reports);

        const c = settings.currency ?? 'ZAR';
        setCurrency(c);
        setGlobalCurrency(c);

        setLanguage(settings.language ?? 'English');
        setEmailMarketing(!!settings.email_marketing);
        setEmailProduct(!!settings.email_product);
      }
    } catch (e) {
      console.warn('loadUserSettings error:', e.message);
      try {
        const cached = await AsyncStorage.getItem('@settings');
        if (cached) {
          const s = JSON.parse(cached);
          setDarkMode(!!s.darkMode);
          setDarkModeGlobal(!!s.darkMode);
          setNotifications(!!s.notifications);
          setHaptics(!!s.haptics);
          setEnergyAlerts(!!s.energyAlerts);
          setEnergyThreshold(String(s.energyThreshold ?? '300'));
          setAutoOptimize(!!s.autoOptimize);
          setWeeklyReports(!!s.weeklyReports);

          const c = s.currency ?? 'ZAR';
          setCurrency(c);
          setGlobalCurrency(c);

          setLanguage(s.language ?? 'English');
          setEmailMarketing(!!s.emailMarketing);
          setEmailProduct(!!s.emailProduct);
        }
      } catch (cacheError) {
        console.warn('Cache fallback failed:', cacheError.message);
      }
    } finally {
      setLoadingSettings(false);
    }
  }, [user?.id, getUserSettings, setGlobalCurrency, setDarkModeGlobal]);

  useEffect(hydrateProfile, [hydrateProfile]);
  useEffect(() => { loadUserSettings(); }, [loadUserSettings]);

  // keep local currency label in sync
  useEffect(() => {
    if (globalCurrency && globalCurrency !== currency) setCurrency(globalCurrency);
  }, [globalCurrency]); // eslint-disable-line

  // cache snapshot (optional)
  useEffect(() => {
    const s = { darkMode, notifications, haptics, energyAlerts, energyThreshold, autoOptimize, weeklyReports, currency, language, emailMarketing, emailProduct };
    AsyncStorage.setItem('@settings', JSON.stringify(s)).catch(() => {});
  }, [darkMode, notifications, haptics, energyAlerts, energyThreshold, autoOptimize, weeklyReports, currency, language, emailMarketing, emailProduct]);

  const saveSetting = useCallback(async (patch) => {
    if (!user?.id) return;
    try { await upsertUserSettings(patch); }
    catch (e) { Alert.alert('Save failed', e.message || 'Could not save setting.'); }
  }, [user?.id, upsertUserSettings]);

  // THEME TOGGLE — updates local label, global theme, and persists
  const handleDarkModeToggle = (value) => {
    tick();
    setDarkMode(value);
    setDarkModeGlobal(value);
    saveSetting({ dark_mode: value });
  };

  const handleSaveProfile = async () => {
    if (saving) return;
    const errs = [];
    if (!editProfile.firstName.trim()) errs.push('First name is required.');
    if (!editProfile.lastName.trim()) errs.push('Last name is required.');
    if (editProfile.phone && !/^[0-9+\-() ]{6,}$/.test(editProfile.phone.trim())) errs.push('Phone looks invalid.');
    if (errs.length) return Alert.alert('Please fix', errs.join('\n'));

    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ data: {
        first_name: editProfile.firstName.trim(),
        last_name: editProfile.lastName.trim(),
        phone: editProfile.phone.trim(),
      }});
      if (error) throw error;
      setProfileModalVisible(false);
      Alert.alert('Success', 'Profile updated.');
    } catch (e) {
      Alert.alert('Error', e.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (current, next, confirm) => {
    if (!next || next.length < 8) return Alert.alert('Invalid', 'New password must be at least 8 characters.');
    if (next !== confirm) return Alert.alert('Invalid', 'Passwords do not match.');
    try {
      const { error } = await supabase.auth.updateUser({ password: next });
      if (error) throw error;
      setPwdModalVisible(false);
      Alert.alert('Password changed', 'Use your new password next sign-in.');
    } catch (e) {
      Alert.alert('Error', e.message || 'Could not change password.');
    }
  };

  const handleExportData = useCallback(async () => {
    try {
      const rows = [];
      if (user?.id) {
        const { data: p } = await supabase.from('profiles').select('first_name,last_name,phone').eq('id', user.id).maybeSingle();
        if (p) rows.push(['First Name', 'Last Name', 'Phone'], [p.first_name ?? '', p.last_name ?? '', p.phone ?? ''], ['','','']);
      }
      const { data: appliances } = await supabase.from('appliances').select('*').eq('user_id', user?.id);
      if (appliances?.length) {
        rows.push(['Name', 'Type', 'Room', 'Usage', 'Status']);
        appliances.forEach(a => rows.push([a.name, a.type, a.room, a.usage ?? '', a.status ?? '']));
      }
      try {
        const { data: usage } = await supabase.from('energy_usage').select('*').eq('user_id', user?.id);
        if (usage?.length) {
          rows.push(['','',''], ['Date', 'kWh', 'Cost']);
          usage.forEach(u => rows.push([u.date ?? '', u.kwh ?? '', u.cost ?? '']));
        }
      } catch {}
      const csv = rows.map(r => r.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
      await Share.share({ title: `${APP_NAME} Export`, message: csv });
    } catch (e) {
      Alert.alert('Error', 'Failed to export data.');
    }
  }, [user?.id, supabase]);

  const handleBackup = useCallback(async () => {
    try {
      const snapshot = {
        at: new Date().toISOString(),
        profile: editProfile,
        settings: { darkMode, notifications, haptics, energyAlerts, energyThreshold, autoOptimize, weeklyReports, currency, language, emailMarketing, emailProduct },
      };
      await Share.share({ title: `${APP_NAME} Backup`, message: JSON.stringify(snapshot, null, 2) });
    } catch {
      Alert.alert('Error', 'Failed to create backup.');
    }
  }, [editProfile, darkMode, notifications, haptics, energyAlerts, energyThreshold, autoOptimize, weeklyReports, currency, language, emailMarketing, emailProduct]);

  const handleDeleteAccount = useCallback(() => {
    Alert.alert(
      'Delete Account',
      'This removes your profile and settings. You will be signed out.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              if (!user?.id) return;
              await supabase.from('appliances').delete().eq('user_id', user.id);
              await supabase.from('energy_usage').delete().eq('user_id', user.id);
              await supabase.from('user_settings').delete().eq('id', user.id);
              await supabase.from('profiles').delete().eq('id', user.id);
              await signOut();
            } catch (e) {
              Alert.alert('Error', e.message || 'Failed to delete account data.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  }, [user?.id, supabase, signOut]);

  const handleRateSubmit = async (rating, feedback) => {
    if (rating >= 4) {
      await openStoreReviewPage();
    } else {
      await mailto(SUPPORT_EMAIL, `${APP_NAME} Feedback (${rating}★)`, `${feedback || ''}\n\nDevice: ${Platform.OS} ${Platform.Version}`);
    }
    setRateVisible(false);
  };

  if (loadingSettings) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading settings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={themeDark ? 'light' : 'dark'} backgroundColor={colors.background} />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
          <Text style={[styles.headerSubtitle, { color: colors.subtext }]}>
            {userProfile?.first_name ? `${userProfile.first_name} ${userProfile.last_name || ''}` : user?.email || 'Manage your preferences'}
          </Text>
        </View>

        {/* Account */}
        <SectionHeader title="Account" color={colors.subtext} />
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SettingRow icon="person" title="Edit Profile" subtitle={`${userProfile?.first_name ?? ''} ${userProfile?.last_name ?? ''}`} onPress={() => setProfileModalVisible(true)} colors={colors} />
          <SettingRow icon="lock" title="Change Password" subtitle="Update your account password" onPress={() => setPwdModalVisible(true)} border={false} colors={colors} />
        </View>

        {/* Email Preferences */}
        <SectionHeader title="Email Preferences" color={colors.subtext} />
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SettingRow icon="mail" title="Manage email subscriptions" subtitle="Marketing & product updates" onPress={() => setEmailPrefsVisible(true)} border={false} colors={colors} />
        </View>

        {/* App Preferences */}
        <SectionHeader title="App Preferences" color={colors.subtext} />
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SettingRow
            icon="dark-mode"
            title="Dark Mode"
            subtitle={darkMode ? 'Enabled' : 'Disabled'}
            right={
              <Switch
                value={darkMode}
                onValueChange={handleDarkModeToggle}
                trackColor={{ false: '#3f3f46', true: colors.primary }}
                thumbColor="#ffffff"
                ios_backgroundColor="#3f3f46"
              />
            }
            colors={colors}
          />
          <SettingRow
            icon="notifications"
            title="Notifications"
            subtitle={notifications ? 'Enabled' : 'Disabled'}
            right={
              <Switch
                value={notifications}
                onValueChange={(v) => { tick(); setNotifications(v); saveSetting({ notifications: v }); }}
                trackColor={{ false: '#3f3f46', true: colors.primary }}
                thumbColor="#ffffff"
                ios_backgroundColor="#3f3f46"
              />
            }
            colors={colors}
          />
          <SettingRow
            icon="vibration"
            title="Haptic Feedback"
            subtitle={haptics ? 'Enabled' : 'Disabled'}
            right={
              <Switch
                value={haptics}
                onValueChange={(v) => { setHaptics(v); saveSetting({ haptic_feedback: v }); }}
                trackColor={{ false: '#3f3f46', true: colors.primary }}
                thumbColor="#ffffff"
                ios_backgroundColor="#3f3f46"
              />
            }
            border={false}
            colors={colors}
          />
        </View>

        {/* Energy */}
        <SectionHeader title="Energy Management" color={colors.subtext} />
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SettingRow
            icon="bolt"
            title="Energy Alerts"
            subtitle={energyAlerts ? 'Enabled' : 'Disabled'}
            right={
              <Switch
                value={energyAlerts}
                onValueChange={(v) => { tick(); setEnergyAlerts(v); saveSetting({ energy_alerts: v }); }}
                trackColor={{ false: '#3f3f46', true: colors.primary }}
                thumbColor="#ffffff"
                ios_backgroundColor="#3f3f46"
              />
            }
            colors={colors}
          />
          <SettingRow icon="trending-up" title="Energy Threshold" subtitle={`${energyThreshold} kWh`} onPress={() => setEnergyModalVisible(true)} colors={colors} />
          <SettingRow
            icon="auto-awesome"
            title="Auto-Optimization"
            subtitle={autoOptimize ? 'Enabled' : 'Disabled'}
            right={
              <Switch
                value={autoOptimize}
                onValueChange={(v) => { tick(); setAutoOptimize(v); saveSetting({ auto_optimization: v }); }}
                trackColor={{ false: '#3f3f46', true: colors.primary }}
                thumbColor="#ffffff"
                ios_backgroundColor="#3f3f46"
              />
            }
            colors={colors}
          />
          <SettingRow
            icon="assessment"
            title="Weekly Reports"
            subtitle={weeklyReports ? 'Subscribed' : 'Unsubscribed'}
            right={
              <Switch
                value={weeklyReports}
                onValueChange={(v) => { tick(); setWeeklyReports(v); saveSetting({ weekly_reports: v }); }}
                trackColor={{ false: '#3f3f46', true: colors.primary }}
                thumbColor="#ffffff"
                ios_backgroundColor="#3f3f46"
              />
            }
            border={false}
            colors={colors}
          />
        </View>

        {/* Locale */}
        <SectionHeader title="Locale" color={colors.subtext} />
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SettingRow icon="attach-money" title="Currency" subtitle={currency} onPress={() => setCurrencyModalVisible(true)} colors={colors} />

          {/* Language row now shows COMING SOON badge + opens modal */}
          <SettingRow
            icon="language"
            title="Language"
            subtitle="App localization"
            onPress={() => setLanguageSoonVisible(true)}
            right={
              <View style={{ backgroundColor: '#ffb300', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8 }}>
                <Text style={{ color: '#000', fontWeight: '800', fontSize: 12 }}>COMING SOON</Text>
              </View>
            }
            border={false}
            colors={colors}
          />
        </View>

        {/* Data & Privacy */}
        <SectionHeader title="Data & Privacy" color={colors.subtext} />
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SettingRow icon="backup" title="Backup Data" subtitle="Create a portable backup" onPress={handleBackup} colors={colors} />
          <SettingRow icon="file-download" title="Export Data" subtitle="Download your data (CSV)" onPress={handleExportData} colors={colors} />
          <SettingRow icon="privacy-tip" title="Privacy Policy" subtitle="Read our privacy policy" onPress={() => setPrivacyVisible(true)} colors={colors} />
          <SettingRow icon="article" title="Terms of Service" subtitle="Review our terms" onPress={() => setTermsVisible(true)} border={false} colors={colors} />
        </View>

        {/* Support & About */}
        <SectionHeader title="Support & About" color={colors.subtext} />
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SettingRow icon="help" title="Help & FAQ" subtitle="Find answers to common questions" onPress={() => setHelpVisible(true)} colors={colors} />
          <SettingRow icon="phone" title="Contact Support" subtitle={SUPPORT_EMAIL} onPress={() => mailto(SUPPORT_EMAIL, `${APP_NAME} Support`, '')} colors={colors} />
          <SettingRow icon="star" title="Rate App" subtitle="Rate us on the app store" onPress={() => setRateVisible(true)} colors={colors} />
          <SettingRow icon="info" title="About" subtitle={`Version ${version}`} onPress={() => setAboutVisible(true)} border={false} colors={colors} />
        </View>

        {/* Account Actions */}
        <SectionHeader title="Account Actions" color={colors.subtext} />
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SettingRow
            icon="logout"
            title="Sign Out"
            subtitle="Sign out of your account"
            onPress={() => {
              Alert.alert('Sign Out', 'Do you want to sign out?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Sign Out', style: 'destructive', onPress: () => signOut().catch(() => Alert.alert('Error', 'Failed to sign out.')) },
              ]);
            }}
            colors={colors}
          />
          <SettingRow
            icon="delete-forever"
            title="Delete Account"
            subtitle="Permanently delete your account data"
            onPress={handleDeleteAccount}
            danger
            border={false}
            colors={colors}
          />
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* -------- Modals -------- */}
      <Modal visible={profileModalVisible} animationType="slide" transparent onRequestClose={() => setProfileModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setProfileModalVisible(false)}>
                <MaterialIcons name="close" size={24} color={colors.subtext} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <View style={styles.inputField}>
                <Text style={[styles.inputLabel, { color: colors.subtext }]}>First Name</Text>
                <TextInput
                  placeholder="Enter first name"
                  placeholderTextColor={colors.subtext}
                  value={editProfile.firstName}
                  onChangeText={(v) => setEditProfile(s => ({ ...s, firstName: v }))}
                  style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: themeDark ? 'rgba(255,255,255,0.05)' : '#fff' }]}
                />
              </View>
              <View style={styles.inputField}>
                <Text style={[styles.inputLabel, { color: colors.subtext }]}>Last Name</Text>
                <TextInput
                  placeholder="Enter last name"
                  placeholderTextColor={colors.subtext}
                  value={editProfile.lastName}
                  onChangeText={(v) => setEditProfile(s => ({ ...s, lastName: v }))}
                  style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: themeDark ? 'rgba(255,255,255,0.05)' : '#fff' }]}
                />
              </View>
              <View style={styles.inputField}>
                <Text style={[styles.inputLabel, { color: colors.subtext }]}>Phone</Text>
                <TextInput
                  placeholder="Enter phone number"
                  placeholderTextColor={colors.subtext}
                  value={editProfile.phone}
                  onChangeText={(v) => setEditProfile(s => ({ ...s, phone: v }))}
                  style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: themeDark ? 'rgba(255,255,255,0.05)' : '#fff' }]}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
            <View style={[styles.modalActions, { borderTopColor: colors.border }]}>
              <TouchableOpacity style={[styles.btnSecondary, { borderColor: colors.border }]} onPress={() => setProfileModalVisible(false)}>
                <Text style={[styles.btnSecondaryText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btnPrimary, { backgroundColor: colors.primary }]} onPress={handleSaveProfile} disabled={saving}>
                {saving ? <ActivityIndicator color="#ffffff" size="small" /> : <Text style={styles.btnPrimaryText}>Save</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ChangePasswordModal visible={pwdModalVisible} onClose={() => setPwdModalVisible(false)} onSubmit={handleChangePassword} />
      <EmailPrefsModal
        visible={emailPrefsVisible}
        marketing={emailMarketing}
        product={emailProduct}
        onClose={() => setEmailPrefsVisible(false)}
        onChange={(m, p) => { setEmailMarketing(m); setEmailProduct(p); saveSetting({ email_marketing: m, email_product: p }); }}
      />
      <Modal visible={energyModalVisible} animationType="fade" transparent onRequestClose={() => setEnergyModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Energy Threshold</Text>
              <TouchableOpacity onPress={() => setEnergyModalVisible(false)}>
                <MaterialIcons name="close" size={24} color={colors.subtext} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={[styles.modalSubtitle, { color: colors.subtext }]}>Set alert threshold (kWh)</Text>
              <TextInput
                value={energyThreshold}
                onChangeText={(v) => setEnergyThreshold(v.replace(/[^\d.]/g, ''))}
                keyboardType="numeric"
                style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: themeDark ? 'rgba(255,255,255,0.05)' : '#fff' }]}
                placeholderTextColor={colors.subtext}
              />
            </View>
            <View style={[styles.modalActions, { borderTopColor: colors.border }]}>
              <TouchableOpacity style={[styles.btnSecondary, { borderColor: colors.border }]} onPress={() => setEnergyModalVisible(false)}>
                <Text style={[styles.btnSecondaryText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btnPrimary, { backgroundColor: colors.primary }]} onPress={() => { saveSetting({ energy_threshold: Number(energyThreshold || 0) }); setEnergyModalVisible(false); }}>
                <Text style={styles.btnPrimaryText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <CurrencyModal
        visible={currencyModalVisible}
        selected={currency}
        onClose={() => setCurrencyModalVisible(false)}
        onSelect={(code) => { setCurrency(code); saveSetting({ currency: code }); setGlobalCurrency(code); setCurrencyModalVisible(false); }}
      />

      {/* NEW: Language Coming Soon */}
      <LanguageComingSoonModal visible={languageSoonVisible} onClose={() => setLanguageSoonVisible(false)} colors={colors} themeDark={themeDark} />

      <RateAppModal visible={rateVisible} onClose={() => setRateVisible(false)} onSubmit={handleRateSubmit} />

      {/* Legal/Support */}
      <Modal visible={privacyVisible} animationType="slide" transparent onRequestClose={() => setPrivacyVisible(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 16 }}>
          <View style={{ backgroundColor: colors.card, borderRadius: 16, maxHeight: '85%' }}>
            <ScrollView contentContainerStyle={{ padding: 20 }}>
              <Text style={[styles.modalTitle, { marginBottom: 8, color: colors.text }]}>Privacy Policy — Home IQ</Text>
              <Text style={[styles.aboutText, { color: colors.text }]}>
                We respect your privacy. Home IQ collects only what’s needed to provide core features like device control, automations, alerts, and account security.
              </Text>
              <Text style={[styles.sectionHeader, { marginTop: 16, color: colors.subtext }]}>1. Information We Collect</Text>
              <Text style={[styles.aboutText, { color: colors.text }]}>
                • Account data: name, email, profile image (optional){'\n'}
                • App usage: button taps, screen views, crash logs{'\n'}
                • Device metadata: model, OS version, app version{'\n'}
                • Approximate location (only if you enable location-based features){'\n'}
                • Diagnostics & analytics for reliability and performance
              </Text>
              <Text style={[styles.sectionHeader, { marginTop: 16, color: colors.subtext }]}>2. How We Use It</Text>
              <Text style={[styles.aboutText, { color: colors.text }]}>
                • Operate and improve Home IQ{'\n'}
                • Personalize experiences and recommendations{'\n'}
                • Detect and fix issues, keep your data safe{'\n'}
                • Communicate updates and support responses
              </Text>
              <Text style={[styles.sectionHeader, { marginTop: 16, color: colors.subtext }]}>3. Sharing</Text>
              <Text style={[styles.aboutText, { color: colors.text }]}>
                We don’t sell your data. We may share with service providers who help run the app (e.g., cloud hosting, analytics) under strict agreements.
              </Text>
              <Text style={[styles.sectionHeader, { marginTop: 16, color: colors.subtext }]}>4. Your Controls</Text>
              <Text style={[styles.aboutText, { color: colors.text }]}>
                • Export your data from Settings → Export Data{'\n'}
                • Request deletion from Settings → Delete Account{'\n'}
                • Manage permissions in your OS (location, notifications)
              </Text>
              <Text style={[styles.sectionHeader, { marginTop: 16, color: colors.subtext }]}>5. Contact</Text>
              <Text style={[styles.aboutText, { color: colors.text }]}>Questions? Contact support at {SUPPORT_EMAIL}.</Text>
              <TouchableOpacity style={[styles.btnPrimary, { marginTop: 20, alignSelf: 'flex-end', backgroundColor: colors.primary }]} onPress={() => setPrivacyVisible(false)}>
                <Text style={styles.btnPrimaryText}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal visible={termsVisible} animationType="slide" transparent onRequestClose={() => setTermsVisible(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 16 }}>
          <View style={{ backgroundColor: colors.card, borderRadius: 16, maxHeight: '85%' }}>
            <ScrollView contentContainerStyle={{ padding: 20 }}>
              <Text style={[styles.modalTitle, { marginBottom: 8, color: colors.text }]}>Terms of Service — Home IQ</Text>
              <Text style={[styles.aboutText, { color: colors.text }]}>By using Home IQ, you agree to these terms.</Text>
              <Text style={[styles.sectionHeader, { marginTop: 16, color: colors.subtext }]}>1. Service</Text>
              <Text style={[styles.aboutText, { color: colors.text }]}>
                Home IQ provides smart-home controls, automations, and insights. We may update features over time.
              </Text>
              <Text style={[styles.sectionHeader, { marginTop: 16, color: colors.subtext }]}>2. Accounts</Text>
              <Text style={[styles.aboutText, { color: colors.text }]}>Keep your credentials safe. You’re responsible for actions under your account.</Text>
              <Text style={[styles.sectionHeader, { marginTop: 16, color: colors.subtext }]}>3. Acceptable Use</Text>
              <Text style={[styles.aboutText, { color: colors.text }]}>
                Don’t misuse the app, interfere with services, or access others’ devices without permission.
              </Text>
              <Text style={[styles.sectionHeader, { marginTop: 16, color: colors.subtext }]}>4. Software & Updates</Text>
              <Text style={[styles.aboutText, { color: colors.text }]}>
                We may push updates that change functionality. Continued use means you accept updates.
              </Text>
              <Text style={[styles.sectionHeader, { marginTop: 16, color: colors.subtext }]}>5. Disclaimer</Text>
              <Text style={[styles.aboutText, { color: colors.text }]}>
                Home IQ is provided “as is” to the extent permitted by law. Use appropriate safety precautions with connected devices.
              </Text>
              <Text style={[styles.sectionHeader, { marginTop: 16, color: colors.subtext }]}>6. Termination</Text>
              <Text style={[styles.aboutText, { color: colors.text }]}>
                We may suspend/terminate accounts that violate these terms or security policies.
              </Text>
              <Text style={[styles.sectionHeader, { marginTop: 16, color: colors.subtext }]}>7. Contact</Text>
              <Text style={[styles.aboutText, { color: colors.text }]}>For questions, reach us at {SUPPORT_EMAIL}.</Text>
              <TouchableOpacity style={[styles.btnPrimary, { marginTop: 20, alignSelf: 'flex-end', backgroundColor: colors.primary }]} onPress={() => setTermsVisible(false)}>
                <Text style={styles.btnPrimaryText}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal visible={helpVisible} animationType="slide" transparent onRequestClose={() => setHelpVisible(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 16 }}>
          <View style={{ backgroundColor: colors.card, borderRadius: 16, maxHeight: '85%' }}>
            <ScrollView contentContainerStyle={{ padding: 20 }}>
              <Text style={[styles.modalTitle, { marginBottom: 8, color: colors.text }]}>Help & FAQ — Home IQ</Text>
              <Text style={[styles.sectionHeader, { marginTop: 8, color: colors.subtext }]}>Quick Tips</Text>
              <Text style={[styles.aboutText, { color: colors.text }]}>
                • Add a device: Dashboard → Devices → “+”{'\n'}
                • Create an automation: Dashboard → Automations → “New Rule”{'\n'}
                • Check loadshedding: Dashboard → Loadshedding tab{'\n'}
                • Reset password: Settings → Security → Change Password
              </Text>
              <Text style={[styles.sectionHeader, { marginTop: 16, color: colors.subtext }]}>Common Questions</Text>
              <Text style={[styles.aboutText, { color: colors.text }]}>
                Q: Why aren’t my lights responding?{'\n'}
                A: Ensure Wi-Fi is stable and the device is online in Manage Devices. Try toggling power or re-pairing.{'\n'}{'\n'}
                Q: How do I enable notifications?{'\n'}
                A: Settings → Notifications. Also verify OS notification permissions.{'\n'}{'\n'}
                Q: Can I export my data?{'\n'}
                A: Yes — Settings → Export Data (CSV).
              </Text>
              <Text style={[styles.sectionHeader, { marginTop: 16, color: colors.subtext }]}>Support</Text>
              <Text style={[styles.aboutText, { color: colors.text }]}>
                Email {SUPPORT_EMAIL} or tap “Contact Support” in Settings.
              </Text>
              <TouchableOpacity style={[styles.btnPrimary, { marginTop: 20, alignSelf: 'flex-end', backgroundColor: colors.primary }]} onPress={() => setHelpVisible(false)}>
                <Text style={styles.btnPrimaryText}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ---------- Styles ----------
const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 16, marginTop: 16, fontWeight: '600' },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 32 },
  header: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 },
  headerTitle: { fontSize: 32, fontWeight: '800' },
  headerSubtitle: { fontSize: 16 },
  sectionHeader: {
    fontSize: 13, fontWeight: '700', textTransform: 'uppercase',
    marginTop: 24, marginBottom: 12, paddingHorizontal: 24, letterSpacing: 0.5,
  },
  section: { marginHorizontal: 24, borderRadius: 12, borderWidth: 1, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16 },
  rowDanger: { borderBottomColor: 'rgba(239, 68, 68, 0.2)' },
  rowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconContainer: { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  rowTitle: { fontSize: 15, fontWeight: '600' },
  rowSubtitle: { fontSize: 13, marginTop: 2 },
  rowRight: { marginLeft: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', paddingHorizontal: 24 },
  modalCard: { borderRadius: 16, borderWidth: 1, maxHeight: '80%', backgroundColor: '#18181b', borderColor: 'rgba(255,255,255,0.1)' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#fff' },
  modalSubtitle: { fontSize: 14, marginBottom: 16, color: '#a1a1aa' },
  modalBody: { paddingHorizontal: 20, paddingVertical: 20 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, paddingHorizontal: 20, paddingBottom: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
  inputField: { marginBottom: 16 },
  inputLabel: { fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#a1a1aa' },
  input: { height: 44, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', borderRadius: 10, paddingHorizontal: 12, fontSize: 16, color: '#fff', backgroundColor: 'rgba(255,255,255,0.05)' },
  passwordInputContainer: { position: 'relative' },
  passwordInput: { paddingRight: 45 },
  eyeIcon: { position: 'absolute', right: 12, top: '50%', transform: [{ translateY: -10 }], padding: 4 },
  textArea: { height: 100, textAlignVertical: 'top', paddingTop: 12 },
  btnPrimary: { backgroundColor: '#10b981', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10, minWidth: 100, alignItems: 'center', justifyContent: 'center' },
  btnPrimaryText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  btnSecondary: { backgroundColor: 'transparent', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', minWidth: 100, alignItems: 'center', justifyContent: 'center' },
  btnSecondaryText: { color: '#e5e7eb', fontSize: 15, fontWeight: '600' },
  btnDisabled: { opacity: 0.5 },
  switchRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  switchRowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  switchRowTitle: { color: '#ffffff', fontSize: 15, fontWeight: '600' },
  switchRowSubtitle: { color: '#a1a1aa', fontSize: 13, marginTop: 2 },
  stars: { flexDirection: 'row', justifyContent: 'center', marginVertical: 16, gap: 4 },
  aboutText: { fontSize: 15, lineHeight: 22, color: '#e5e7eb' },
  hintText: { color: '#a1a1aa', fontSize: 12, paddingHorizontal: 20, paddingBottom: 12, fontStyle: 'italic' },
});
