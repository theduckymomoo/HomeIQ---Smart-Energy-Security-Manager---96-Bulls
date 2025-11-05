import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

const SecurityControls = ({
  securityStatus,
  toggleSecurityStatus,
  motionDetection,
  toggleMotionDetection,
  fireDetection,
  toggleFireDetection,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Security</Text>
      
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.cardTitle}>Security Controls</Text>
          <Text style={styles.cardSubtitle}>Manage your security system settings</Text>
        </View>
        
        <View style={styles.controlsContainer}>
          <View style={styles.controlRow}>
            <View style={styles.controlInfo}>
              <Text style={styles.controlLabel}>Security Mode</Text>
              <Text style={styles.controlDescription}>Arm/disarm security system</Text>
            </View>
            <Switch
              value={securityStatus === 'ARMED'}
              onValueChange={toggleSecurityStatus}
              style={styles.switch}
              trackColor={{ false: '#2a2a2a', true: '#10b981' }}
              thumbColor={securityStatus === 'ARMED' ? '#ffffff' : '#f4f4f4'}
            />
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.controlRow}>
            <View style={styles.controlInfo}>
              <Text style={styles.controlLabel}>Motion Detection</Text>
              <Text style={styles.controlDescription}>Enable/disable motion sensors</Text>
            </View>
            <Switch
              value={motionDetection}
              onValueChange={toggleMotionDetection}
              style={styles.switch}
              trackColor={{ false: '#2a2a2a', true: '#10b981' }}
              thumbColor={motionDetection ? '#ffffff' : '#f4f4f4'}
            />
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.controlRow}>
            <View style={styles.controlInfo}>
              <Text style={styles.controlLabel}>Fire Detection</Text>
              <Text style={styles.controlDescription}>Enable/disable fire alarms</Text>
            </View>
            <Switch
              value={fireDetection}
              onValueChange={toggleFireDetection}
              style={styles.switch}
              trackColor={{ false: '#2a2a2a', true: '#10b981' }}
              thumbColor={fireDetection ? '#ffffff' : '#f4f4f4'}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#000000',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#10b981',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '400',
  },
  controlsContainer: {
    marginBottom: 0,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  controlInfo: {
    flex: 1,
  },
  controlLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 4,
  },
  controlDescription: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '400',
  },
  divider: {
    height: 1,
    backgroundColor: '#10b981',
    marginHorizontal: -20,
  },
  switch: {
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
  },
});

export default SecurityControls;