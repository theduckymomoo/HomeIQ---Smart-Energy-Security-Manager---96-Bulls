// FILE: SystemSettingsScreen.js

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  Switch, 
  ScrollView,
  Alert,
  ActivityIndicator,
  TextInput
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';

export default function SystemSettingsScreen() {
  const navigation = useNavigation();
  const { supabase, getUserSettings, upsertUserSettings } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    emailAlerts: true,
    pushNotifications: true,
    dataCollection: true,
    autoBackup: true,
    twoFactorAuth: false,
    darkMode: true,
    energyThreshold: '300',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const userSettings = await getUserSettings();
      setSettings({
        maintenanceMode: false,
        emailAlerts: userSettings.email_product || true,
        pushNotifications: userSettings.notifications || true,
        dataCollection: true,
        autoBackup: true,
        twoFactorAuth: false,
        darkMode: userSettings.dark_mode || true,
        energyThreshold: userSettings.energy_threshold?.toString() || '300',
      });
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    try {
      // Map to user_settings columns
      const mapping = {
        emailAlerts: 'email_product',
        pushNotifications: 'notifications',
        darkMode: 'dark_mode',
      };
      
      if (mapping[key]) {
        await upsertUserSettings({ [mapping[key]]: value });
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      Alert.alert('Error', 'Failed to update settings');
    }
  };

  const handleBackup = () => {
    Alert.alert(
      'Database Backup',
      'Are you sure you want to create a backup of the database?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Backup',
          onPress: () => {
            // Simulate backup process
            Alert.alert('Success', 'Database backup initiated successfully');
          }
        }
      ]
    );
  };

  const handlePurgeLogs = () => {
    Alert.alert(
      'Purge System Logs',
      'This will delete logs older than 30 days. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Purge',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'Old system logs have been purged');
          }
        }
      ]
    );
  };

  const handleResetCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data. The app may be slower initially after this.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'Cache cleared successfully');
          }
        }
      ]
    );
  };

  const SettingItem = ({ icon, title, subtitle, value, onValueChange, iconColor }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <View style={[styles.settingIcon, { backgroundColor: `${iconColor}20` }]}>
          <MaterialIcons name={icon} size={24} color={iconColor} />
        </View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#3f3f46', true: '#8b5cf680' }}
        thumbColor={value ? '#8b5cf6' : '#a1a1aa'}
      />
    </View>
  );

  const ActionButton = ({ icon, title, subtitle, onPress, color, danger }) => (
    <TouchableOpacity 
      style={[styles.actionButton, danger && styles.actionButtonDanger]}
      onPress={onPress}
    >
      <View style={[styles.actionIcon, { backgroundColor: `${color}20` }]}>
        <MaterialIcons name={icon} size={24} color={color} />
      </View>
      <View style={styles.actionText}>
        <Text style={styles.actionTitle}>{title}</Text>
        {subtitle && <Text style={styles.actionSubtitle}>{subtitle}</Text>}
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#71717a" />
    </TouchableOpacity>
  );

  const StatCard = ({ icon, value, label, color }) => (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: `${color}20` }]}>
        <MaterialIcons name={icon} size={24} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>System Settings</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8b5cf6" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>System Settings</Text>
        <TouchableOpacity onPress={() => Alert.alert('Help', 'System settings help coming soon')}>
          <MaterialIcons name="help-outline" size={24} color="#8b5cf6" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* System Overview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>System Overview</Text>
            <View style={styles.statsContainer}>
              <StatCard icon="storage" value="2.4GB" label="Database Size" color="#3b82f6" />
              <StatCard icon="schedule" value="99.8%" label="Uptime" color="#10b981" />
              <StatCard icon="people" value="247" label="Active Users" color="#f59e0b" />
            </View>
          </View>

          {/* System Status */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>System Status</Text>
            
            <SettingItem
              icon="build"
              title="Maintenance Mode"
              subtitle="Disable user access for maintenance"
              value={settings.maintenanceMode}
              onValueChange={(val) => handleToggle('maintenanceMode', val)}
              iconColor="#ef4444"
            />
            
            <SettingItem
              icon="email"
              title="Email Alerts"
              subtitle="Receive system notifications via email"
              value={settings.emailAlerts}
              onValueChange={(val) => handleToggle('emailAlerts', val)}
              iconColor="#3b82f6"
            />
            
            <SettingItem
              icon="notifications"
              title="Push Notifications"
              subtitle="Enable push notifications for events"
              value={settings.pushNotifications}
              onValueChange={(val) => handleToggle('pushNotifications', val)}
              iconColor="#f59e0b"
            />
            
            <SettingItem
              icon="analytics"
              title="Data Collection"
              subtitle="Collect usage analytics"
              value={settings.dataCollection}
              onValueChange={(val) => handleToggle('dataCollection', val)}
              iconColor="#8b5cf6"
            />
          </View>

          {/* Security */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Security</Text>
            
            <SettingItem
              icon="security"
              title="Two-Factor Authentication"
              subtitle="Require 2FA for admin access"
              value={settings.twoFactorAuth}
              onValueChange={(val) => handleToggle('twoFactorAuth', val)}
              iconColor="#10b981"
            />
            
            <SettingItem
              icon="backup"
              title="Automatic Backups"
              subtitle="Daily database backups at 2:00 AM"
              value={settings.autoBackup}
              onValueChange={(val) => handleToggle('autoBackup', val)}
              iconColor="#3b82f6"
            />
          </View>

          {/* Appearance */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Appearance</Text>
            
            <SettingItem
              icon="dark-mode"
              title="Dark Mode"
              subtitle="Use dark theme throughout the app"
              value={settings.darkMode}
              onValueChange={(val) => handleToggle('darkMode', val)}
              iconColor="#8b5cf6"
            />
          </View>

          {/* Energy Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Energy Settings</Text>
            
            <View style={styles.inputContainer}>
              <View style={styles.inputLeft}>
                <View style={[styles.settingIcon, { backgroundColor: '#f59e0b20' }]}>
                  <MaterialIcons name="bolt" size={24} color="#f59e0b" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Energy Threshold</Text>
                  <Text style={styles.settingSubtitle}>Alert when usage exceeds (kWh)</Text>
                </View>
              </View>
              <TextInput
                style={styles.input}
                value={settings.energyThreshold}
                onChangeText={(val) => setSettings(prev => ({ ...prev, energyThreshold: val }))}
                keyboardType="numeric"
                placeholder="300"
                placeholderTextColor="#71717a"
              />
            </View>
          </View>

          {/* Database Management */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Database Management</Text>
            
            <ActionButton
              icon="backup"
              title="Initiate Database Backup"
              subtitle="Create a complete backup of all data"
              onPress={handleBackup}
              color="#3b82f6"
            />
            
            <ActionButton
              icon="delete-sweep"
              title="Purge Old System Logs"
              subtitle="Remove logs older than 30 days"
              onPress={handlePurgeLogs}
              color="#f59e0b"
            />
            
            <ActionButton
              icon="cached"
              title="Clear Cache"
              subtitle="Free up space by clearing cached data"
              onPress={handleResetCache}
              color="#8b5cf6"
            />
            
            <ActionButton
              icon="restart-alt"
              title="Reset to Defaults"
              subtitle="Restore all settings to factory defaults"
              onPress={() => Alert.alert('Reset', 'This feature is coming soon')}
              color="#ef4444"
              danger
            />
          </View>

          {/* System Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>System Information</Text>
            
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>App Version</Text>
                <Text style={styles.infoValue}>1.0.0</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Build Number</Text>
                <Text style={styles.infoValue}>2025.11.02</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Last Backup</Text>
                <Text style={styles.infoValue}>Nov 2, 2025 02:00</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Database Version</Text>
                <Text style={styles.infoValue}>PostgreSQL 15.3</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0b',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
    paddingLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#a1a1aa',
    textAlign: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#a1a1aa',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    minWidth: 80,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionButtonDanger: {
    borderColor: '#ef444420',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#a1a1aa',
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  infoLabel: {
    fontSize: 14,
    color: '#a1a1aa',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
});
