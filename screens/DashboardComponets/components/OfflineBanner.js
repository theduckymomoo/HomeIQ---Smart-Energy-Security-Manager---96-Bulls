// components/OfflineBanner.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

/**
 * Banner component to display offline status
 * @param {boolean} isVisible - Show/hide banner
 * @param {string} message - Custom message (optional)
 */
const OfflineBanner = ({ isVisible = true, message = null }) => {
  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <MaterialIcons name="cloud-off" size={16} color="#ffffff" />
      <Text style={styles.text}>
        {message || 'Offline Mode - Changes will sync when reconnected'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f59e0b', // Amber/warning color
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 8,
  },
  text: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },
});

// Variant with sync status
export const OfflineBannerWithSync = ({ 
  isVisible = true, 
  isSyncing = false,
  queueCount = 0 
}) => {
  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <MaterialIcons 
        name={isSyncing ? "sync" : "cloud-off"} 
        size={16} 
        color="#ffffff" 
      />
      <Text style={styles.text}>
        {isSyncing 
          ? `Syncing ${queueCount} pending changes...`
          : `Offline - ${queueCount} pending changes`
        }
      </Text>
    </View>
  );
};

export default OfflineBanner;
