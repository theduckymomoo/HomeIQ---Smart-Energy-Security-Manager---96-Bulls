
// screens/DashboardComponets/SettingsPages/HelpFAQScreenFull.js
import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, SafeAreaView, Linking, TextInput, LayoutAnimation, Platform, UIManager } from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function HelpFAQScreenFull({ navigation, route }) {
  const { appName = 'HomeIQ', contactEmail = 'support@homeiq.app', contactPhone = '+27110000000' } = route?.params || {};
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [query, setQuery] = useState('');

  const faqs = [
    { q: 'How do I reset my password?', a: 'Go to Settings → Account → Reset Password. You will receive an email with a reset link. Check your spam if it does not arrive.' },
    { q: 'Why am I not receiving notifications?', a: 'Ensure notifications are enabled in Settings → Notifications and in your device system settings for the app.' },
    { q: 'How can I update the app?', a: 'Open your app store, search for the app, and tap Update. Enabling automatic updates is recommended.' },
    { q: 'What data does the app collect?', a: 'See the Privacy Policy page for details on data categories, usage, and your choices.' },
    { q: 'How do I contact support?', a: 'Use the buttons below to email or call us. Include screenshots and steps to reproduce the issue if possible.' },
  ];

  const filtered = faqs.filter(item => (item.q + ' ' + item.a).toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn} accessibilityLabel="Go back">
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Help & FAQ</Text>
        <View style={{ width: 44 }} />
      </View>

      <Text style={styles.meta}>Last updated: {today}</Text>

      <View style={styles.searchWrap}>
        <TextInput
          value={query}
          onChangeText={(t) => setQuery(t)}
          placeholder="Search help topics"
          placeholderTextColor="#9ca3af"
          style={styles.input}
          returnKeyType="search"
        />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 120 }}>
        <Text style={styles.sectionTitle}>Top Questions</Text>
        <View>
          {filtered.map((item, idx) => (
            <Accordion key={idx} title={item.q}>
              <Text style={styles.p}>{item.a}</Text>
            </Accordion>
          ))}
          {filtered.length === 0 && (
            <Text style={[styles.p, { marginTop: 8 }]}>No results for "{query}".</Text>
          )}
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Get Support</Text>
        <View style={{ gap: 12 }}>
          <Pressable style={[styles.btn, styles.btnPrimary]} onPress={() => Linking.openURL(`mailto:${contactEmail}`)}>
            <Text style={styles.btnText}>Email Support ({contactEmail})</Text>
          </Pressable>
          <Pressable style={[styles.btn, styles.btnGhost]} onPress={() => Linking.openURL(`tel:${contactPhone}`)}>
            <Text style={styles.btnGhostText}>Call Us ({contactPhone})</Text>
          </Pressable>
          <Pressable style={[styles.btn, styles.btnGhost]} onPress={() => navigation.navigate('PrivacyPolicy') }>
            <Text style={styles.btnGhostText}>Read Privacy Policy</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Accordion({ title, children }) {
  const [open, setOpen] = useState(false);
  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen(!open);
  };
  return (
    <View style={styles.card}>
      <Pressable onPress={toggle} style={styles.cardHeader} accessibilityRole="button" accessibilityState={{ expanded: open }}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.chev}>{open ? '˄' : '˅'}</Text>
      </Pressable>
      {open && <View style={styles.cardBody}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0b' },
  header: {
    paddingHorizontal: 12, paddingTop: 8, paddingBottom: 10,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderBottomWidth: 1, borderBottomColor: '#1f2937',
  },
  backBtn: { width: 44, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 10 },
  backIcon: { fontSize: 28, lineHeight: 28, color: '#ffffff' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#ffffff' },
  meta: { fontSize: 12, color: '#9ca3af', textAlign: 'center', marginTop: 6 },
  searchWrap: { paddingHorizontal: 16, marginTop: 10 },
  input: {
    borderWidth: 1, borderColor: '#374151', borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 12, fontSize: 16,
    backgroundColor: '#111827', color: '#e5e7eb',
  },
  scroll: { flex: 1, paddingHorizontal: 16, marginTop: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginVertical: 8, color: '#ffffff' },
  p: { fontSize: 14, lineHeight: 20, color: '#e5e7eb' },
  card: { borderWidth: 1, borderColor: '#1f2937', borderRadius: 14, marginBottom: 10, backgroundColor: '#0b0f17' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 12 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#ffffff', flex: 1, paddingRight: 8 },
  chev: { fontSize: 20, color: '#9ca3af' },
  cardBody: { paddingHorizontal: 12, paddingBottom: 12 },
  btn: { paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  btnPrimary: { backgroundColor: '#16a34a' },
  btnGhost: { backgroundColor: '#0a0a0b', borderWidth: 1, borderColor: '#374151' },
  btnText: { color: '#ffffff', fontWeight: '700' },
  btnGhostText: { color: '#e5e7eb', fontWeight: '700' },
});
