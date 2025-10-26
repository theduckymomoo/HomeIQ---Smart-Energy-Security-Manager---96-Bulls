import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  Dimensions,
  Animated,
  StatusBar
} from 'react-native';
import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const RecentAlerts = ({ alertsData }) => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasAudioPermission, setHasAudioPermission] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const [activeTab, setActiveTab] = useState('Security');
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const handleCameraRecord = async () => {
    if (hasCameraPermission === null) {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === 'granted');
    }

    if (hasCameraPermission === false) {
      Alert.alert('Permission Required', 'Camera access is needed to record videos');
      return;
    }

    Alert.alert('Camera Activated', 'Security camera recording started', [
      { text: 'Stop Recording', style: 'destructive' },
      { text: 'Continue', style: 'default' }
    ]);
  };

  const handleVoiceRecord = async () => {
    if (hasAudioPermission === null) {
      const { status } = await Audio.requestPermissionsAsync();
      setHasAudioPermission(status === 'granted');
    }

    if (hasAudioPermission === false) {
      Alert.alert('Permission Required', 'Microphone access is needed for voice recording');
      return;
    }

    if (isRecording) {
      await recording.stopAndUnloadAsync();
      setIsRecording(false);
      setRecording(null);
      pulseAnim.stopAnimation();
      Alert.alert('Recording Saved', 'Security audio recording has been archived');
    } else {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording: newRecording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        setRecording(newRecording);
        setIsRecording(true);
        startPulse();
      } catch (error) {
        Alert.alert('Recording Failed', 'Could not start security recording');
      }
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'LOW': return styles.lowPriority;
      case 'MEDIUM': return styles.mediumPriority;
      case 'HIGH': return styles.highPriority;
      default: return styles.lowPriority;
    }
  };

  const tabs = ['Home', 'Devices', 'Analytics', 'Loadshedding', 'Security'];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Security Controls Section */}
      <View style={styles.securitySection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Security Controls</Text>
          <View style={styles.securityStatus}>
            <View style={styles.statusIndicator} />
            <Text style={styles.statusText}>ARMED</Text>
          </View>
        </View>

        {/* Recording Controls */}
        <View style={styles.recordingGrid}>
          <TouchableOpacity 
            style={styles.recordCard}
            onPress={handleCameraRecord}
          >
            <View style={styles.recordIcon}>
              <Ionicons name="videocam" size={28} color="#10b981" />
            </View>
            <Text style={styles.recordTitle}>Camera Record</Text>
            <Text style={styles.recordSubtitle}>Capture video evidence</Text>
          </TouchableOpacity>
          
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity 
              style={[styles.recordCard, isRecording && styles.recordingActive]}
              onPress={handleVoiceRecord}
            >
              <View style={styles.recordIcon}>
                <Ionicons 
                  name={isRecording ? "stop-circle" : "mic"} 
                  size={28} 
                  color={isRecording ? "#ef4444" : "#10b981"} 
                />
              </View>
              <Text style={styles.recordTitle}>
                {isRecording ? 'Stop Recording' : 'Voice Record'}
              </Text>
              <Text style={styles.recordSubtitle}>
                {isRecording ? 'Audio being captured' : 'Record audio evidence'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Recent Alerts */}
        <View style={styles.alertsContainer}>
          <View style={styles.alertsHeader}>
            <Text style={styles.sectionTitle}>Recent Alerts</Text>
            <Text style={styles.seeAllText}>View All</Text>
          </View>
          
          <ScrollView style={styles.alertsScrollView}>
            {alertsData.map(alert => (
              <View key={alert.id} style={styles.alertItem}>
                <View style={styles.alertIcon}>
                  <Ionicons 
                    name={
                      alert.priority === 'HIGH' ? "warning" : 
                      alert.priority === 'MEDIUM' ? "notifications" : "information"
                    } 
                    size={18} 
                    color={
                      alert.priority === 'HIGH' ? "#ef4444" : 
                      alert.priority === 'MEDIUM' ? "#f59e0b" : "#10b981"
                    } 
                  />
                </View>
                <View style={styles.alertContent}>
                  <Text style={styles.alertMessage}>{alert.message}</Text>
                  <Text style={styles.alertTime}>{alert.time}</Text>
                </View>
                <View style={[styles.alertBadge, getPriorityStyle(alert.priority)]}>
                  <Text style={styles.alertBadgeText}>{alert.priority}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#000000',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  headerStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#10b981',
  },
  statusText: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  powerCard: {
    backgroundColor: '#000000',
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 24,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#10b981',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  powerLabel: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 8,
    textAlign: 'center',
  },
  powerValue: {
    color: '#10b981',
    fontSize: 52,
    fontWeight: '800',
    marginBottom: 2,
    textAlign: 'center',
    textShadowColor: 'rgba(16, 185, 129, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  powerUnit: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  powerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#10b981',
    paddingTop: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#10b981',
  },
  quickActions: {
    marginBottom: 24,
  },
  quickActionsContent: {
    paddingHorizontal: 24,
  },
  actionButton: {
    alignItems: 'center',
    marginRight: 20,
  },
  actionIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#10b981',
    marginBottom: 8,
  },
  actionText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  tabContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  tab: {
    paddingHorizontal: 22,
    paddingVertical: 12,
    marginRight: 10,
    borderRadius: 25,
    backgroundColor: '#000000',
    borderWidth: 1.5,
    borderColor: '#10b981',
  },
  activeTab: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  tabText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  activeTabText: {
    color: '#000000',
  },
  securitySection: {
    flex: 1,
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  securityStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#10b981',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
    marginRight: 8,
  },
  recordingGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
    gap: 16,
  },
  recordCard: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 22,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#10b981',
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  recordingActive: {
    borderColor: '#ef4444',
    backgroundColor: '#000000',
    shadowColor: '#ef4444',
    shadowOpacity: 0.2,
  },
  recordIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: '#10b981',
  },
  recordTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  recordSubtitle: {
    color: '#ffffff',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 16,
  },
  alertsContainer: {
    flex: 1,
    backgroundColor: '#000000',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#10b981',
    padding: 20,
  },
  alertsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    color: '#10b981',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  alertsScrollView: {
    flex: 1,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
    borderWidth: 1,
    borderColor: '#10b981',
  },
  alertIcon: {
    marginRight: 14,
  },
  alertContent: {
    flex: 1,
  },
  alertMessage: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  alertTime: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  alertBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 60,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#10b981',
  },
  alertBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#ffffff',
  },
  lowPriority: {
    backgroundColor: '#000000',
  },
  mediumPriority: {
    backgroundColor: '#000000',
  },
  highPriority: {
    backgroundColor: '#000000',
  },
});

export default RecentAlerts;