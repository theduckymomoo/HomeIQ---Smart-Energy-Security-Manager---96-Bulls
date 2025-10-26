
// screens/DashboardComponets/SettingsPages/PrivacyPolicyScreen.js
import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, SafeAreaView, Linking } from 'react-native';

export default function PrivacyPolicyScreen({ navigation, route }) {
  const { appName = 'HomeIQ', contactEmail = 'support@homeiq.app', onAccept } = route?.params || {};
  const [isChecked, setIsChecked] = useState(false);
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const handleAccept = async () => {
    try { if (onAccept) await onAccept(); } catch (e) {}
    navigation.goBack();
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn} accessibilityLabel="Go back">
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 44 }} />
      </View>
      <Text style={styles.meta}>Last updated: {today}</Text>
      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 120 }}>
        <Section title="1. Overview">
          <Text style={styles.p}>
            This Privacy Policy explains how {appName} ("we", "us", "our") collects, uses, and shares information
            about you when you use our mobile application and related services (the "Service").
          </Text>
        </Section>
        <Section title="2. Information We Collect">
          <Bullet>Account information (e.g., name, email) if you sign up or contact support.</Bullet>
          <Bullet>Usage data such as app interactions, device type, OS version, crash logs.</Bullet>
          <Bullet>Approximate location (if you grant permission) for features that rely on it).</Bullet>
          <Bullet>Diagnostics and analytics to improve performance and reliability.</Bullet>
        </Section>
        <Section title="3. How We Use Information">
          <Bullet>Provide, maintain, and improve the Service.</Bullet>
          <Bullet>Personalize features and content.</Bullet>
          <Bullet>Monitor usage and address technical issues.</Bullet>
          <Bullet>Communicate with you about updates and support.</Bullet>
        </Section>
        <Section title="4. Sharing & Disclosure">
          <Bullet>Service providers under confidentiality obligations.</Bullet>
          <Bullet>Legal reasons (comply with law, enforce terms, protect rights and safety).</Bullet>
          <Bullet>Business transfers (merger, sale, or asset transfer).</Bullet>
        </Section>
        <Section title="5. Data Retention">
          <Text style={styles.p}>
            We retain information as long as necessary to provide the Service and for legitimate business or legal
            purposes.
          </Text>
        </Section>
        <Section title="6. Your Choices & Rights">
          <Bullet>Access, update, or delete your information by contacting us.</Bullet>
          <Bullet>Control device permissions in device settings.</Bullet>
          <Bullet>Opt out of analytics where supported.</Bullet>
        </Section>
        <Section title="7. Security">
          <Text style={styles.p}>
            We use reasonable safeguards designed to protect your information. No method is 100% secure.
          </Text>
        </Section>
        <Section title="8. Children's Privacy">
          <Text style={styles.p}>
            The Service is not directed to children under 13. If you believe a child has provided personal
            information, contact us to remove it.
          </Text>
        </Section>
        <Section title="9. Changes to This Policy">
          <Text style={styles.p}>
            We may update this Privacy Policy periodically. Material changes will be communicated reasonably.
          </Text>
        </Section>
        <Section title="10. Contact Us">
          <Text style={styles.p}>
            Questions or requests? Email{' '}
            <Text style={styles.link} onPress={() => Linking.openURL(`mailto:${contactEmail}`)}>
              {contactEmail}
            </Text>.
          </Text>
        </Section>
        <Pressable style={styles.checkboxRow} onPress={() => setIsChecked(!isChecked)}>
          <View style={[styles.checkbox, isChecked && styles.checkboxChecked]} />
          <Text style={styles.checkboxLabel}>I have read and agree to the Privacy Policy.</Text>
        </Pressable>
      </ScrollView>
      <View style={styles.footer}>
        <Pressable style={[styles.btn, styles.btnGhost]} onPress={() => navigation.goBack()}>
          <Text style={[styles.btnText, styles.btnGhostText]}>Decline</Text>
        </Pressable>
        <Pressable
          style={[styles.btn, isChecked ? styles.btnPrimary : styles.btnDisabled]}
          disabled={!isChecked}
          onPress={handleAccept}
        >
          <Text style={styles.btnText}>Accept</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function Section({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View>{children}</View>
    </View>
  );
}

function Bullet({ children }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bullet}>•</Text>
      <Text style={styles.p}>{children}</Text>
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
  scroll: { flex: 1, paddingHorizontal: 16, marginTop: 8 },
  section: { marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6, color: '#ffffff' },
  p: { fontSize: 14, lineHeight: 20, color: '#e5e7eb', flex: 1 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 4 },
  bullet: { fontSize: 18, lineHeight: 18, width: 18, textAlign: 'center', color: '#e5e7eb' },
  link: { color: '#60a5fa', textDecorationLine: 'underline' },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: '#6b7280', backgroundColor: '#0a0a0b' },
  checkboxChecked: { backgroundColor: '#ffffff', borderColor: '#ffffff' },
  checkboxLabel: { color: '#e5e7eb' },
  footer: {
    position: 'absolute', left: 0, right: 0, bottom: 0, padding: 12,
    backgroundColor: '#0a0a0b', borderTopWidth: 1, borderTopColor: '#1f2937',
    flexDirection: 'row', gap: 12,
  },
  btn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  btnPrimary: { backgroundColor: '#16a34a' },
  btnDisabled: { backgroundColor: '#374151' },
  btnGhost: { backgroundColor: '#0a0a0b', borderWidth: 1, borderColor: '#374151' },
  btnText: { color: '#ffffff', fontWeight: '700' },
  btnGhostText: { color: '#e5e7eb', fontWeight: '700' },
});
