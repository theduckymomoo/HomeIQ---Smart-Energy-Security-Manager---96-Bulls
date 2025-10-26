import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CameraStatus = ({ cameraData }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return { name: 'videocam', color: '#10b981' };
      case 'offline':
        return { name: 'videocam-off', color: '#ef4444' };
      case 'recording':
        return { name: 'recording', color: '#10b981' };
      default:
        return { name: 'help-circle', color: '#ffffffff' };
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'LIVE';
      case 'offline':
        return 'OFFLINE';
      case 'recording':
        return 'RECORDING';
      default:
        return status.toUpperCase();
    }
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Camera Status</Text>
        <View style={styles.cameraCount}>
          <Ionicons name="camera" size={16} color="#10b981" />
          <Text style={styles.cameraCountText}>{cameraData.length} Cameras</Text>
        </View>
      </View>
      <Text style={styles.sectionSubtitle}>Monitor all connected security cameras</Text>
      
      <View style={styles.camerasContainer}>
        {cameraData.map(camera => {
          const statusIcon = getStatusIcon(camera.status);
          return (
            <View key={camera.id} style={styles.cameraCard}>
              <View style={styles.cameraHeader}>
                <View style={styles.cameraIcon}>
                  <Ionicons name={statusIcon.name} size={20} color={statusIcon.color} />
                </View>
                <View style={styles.cameraInfo}>
                  <Text style={styles.cameraName}>{camera.name}</Text>
                  <Text style={styles.cameraLocation}>{camera.location}</Text>
                </View>
                <View style={[styles.statusBadge, camera.status === 'active' ? styles.activeStatus : 
                  camera.status === 'recording' ? styles.recordingStatus : styles.offlineStatus]}>
                  <View style={[styles.statusDot, { backgroundColor: statusIcon.color }]} />
                  <Text style={styles.statusText}>{getStatusText(camera.status)}</Text>
                </View>
              </View>
              
              {camera.lastActivity && (
                <View style={styles.activityInfo}>
                  <Ionicons name="time" size={12} color="#ffffff" />
                  <Text style={styles.activityText}>Last activity: {camera.lastActivity}</Text>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#000000',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#10b981',
    marginHorizontal: 16,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#10b981',
    letterSpacing: -0.5,
  },
  cameraCount: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  cameraCountText: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  sectionSubtitle: {
    marginBottom: 20,
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  camerasContainer: {
    gap: 12,
  },
  cameraCard: {
    backgroundColor: '#f7f7f7ff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cameraHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cameraIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    marginRight: 12,
  },
  cameraInfo: {
    flex: 1,
  },
  cameraName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0d0d0dff',
    marginBottom: 2,
    letterSpacing: 0.2,
  },
  cameraLocation: {
    fontSize: 13,
    color: '#0b0b0bff',
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  activeStatus: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    color: '#10b981',
  },
  recordingStatus: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
    color: '#ef4444',
  },
  offlineStatus: {
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
    borderColor: 'rgba(107, 114, 128, 0.3)',
    color: '#ffffff',
  },
  activityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  activityText: {
    fontSize: 12,
    color: '#ffffff',
    marginLeft: 6,
    fontWeight: '500',
  },
});

export default CameraStatus;