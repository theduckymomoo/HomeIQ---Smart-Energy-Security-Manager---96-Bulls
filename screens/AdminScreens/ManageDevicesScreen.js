// FILE: ManageDevicesScreen.js

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  FlatList, 
  ActivityIndicator,
  TextInput,
  Alert,
  Modal
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function ManageDevicesScreen() {
  const { supabase } = useAuth();
  const navigation = useNavigation();
  
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, on, off
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const { data, error } = await supabase
        .from('appliances')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setDevices(data || []);
    } catch (error) {
      console.error('Error fetching devices:', error);
      Alert.alert('Error', 'Failed to load devices');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDevices();
  };

  const toggleDeviceStatus = async (device) => {
    try {
      const newStatus = device.status === 'on' ? 'off' : 'on';
      const { error } = await supabase
        .from('appliances')
        .update({ status: newStatus })
        .eq('id', device.id);
      
      if (error) throw error;
      
      setDevices(prev => 
        prev.map(d => d.id === device.id ? { ...d, status: newStatus } : d)
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update device status');
    }
  };

  const handleDeleteDevice = async (deviceId) => {
    Alert.alert(
      'Delete Device',
      'Are you sure you want to remove this device?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('appliances')
                .delete()
                .eq('id', deviceId);
              
              if (error) throw error;
              setDevices(prev => prev.filter(d => d.id !== deviceId));
              setModalVisible(false);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete device');
            }
          }
        }
      ]
    );
  };

  const openDeviceDetails = (device) => {
    setSelectedDevice(device);
    setModalVisible(true);
  };

  const getFilteredDevices = () => {
    let filtered = devices;
    
    if (searchQuery) {
      filtered = filtered.filter(device =>
        device.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.type?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(device => device.status === filterStatus);
    }
    
    return filtered;
  };

  const renderDeviceCard = ({ item }) => {
    const isOn = item.status === 'on';
    
    return (
      <TouchableOpacity 
        style={styles.deviceCard}
        onPress={() => openDeviceDetails(item)}
        activeOpacity={0.7}
      >
        <View style={styles.deviceHeader}>
          <View style={styles.deviceIcon}>
            <MaterialIcons 
              name={getDeviceIcon(item.type)} 
              size={28} 
              color="#8b5cf6" 
            />
          </View>
          <View style={styles.deviceInfo}>
            <Text style={styles.deviceName}>{item.name || 'Unnamed Device'}</Text>
            <Text style={styles.deviceType}>{item.type || 'Unknown Type'}</Text>
          </View>
          <TouchableOpacity 
            onPress={() => toggleDeviceStatus(item)}
            style={[styles.statusBadge, isOn ? styles.statusOn : styles.statusOff]}
          >
            <View style={[styles.statusDot, isOn && styles.statusDotActive]} />
            <Text style={styles.statusText}>{isOn ? 'ON' : 'OFF'}</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.deviceStats}>
          <View style={styles.statItem}>
            <MaterialIcons name="bolt" size={16} color="#f59e0b" />
            <Text style={styles.statText}>{item.power_usage || 0}W</Text>
          </View>
          <View style={styles.statItem}>
            <MaterialIcons name="schedule" size={16} color="#3b82f6" />
            <Text style={styles.statText}>{item.hours_used || 0}h today</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const getDeviceIcon = (type) => {
    const icons = {
      'light': 'lightbulb',
      'tv': 'tv',
      'ac': 'ac-unit',
      'heater': 'fireplace',
      'fan': 'air',
      'refrigerator': 'kitchen',
      'microwave': 'microwave',
      'default': 'power'
    };
    return icons[type?.toLowerCase()] || icons.default;
  };

  const filteredDevices = getFilteredDevices();
  const totalDevices = devices.length;
  const activeDevices = devices.filter(d => d.status === 'on').length;

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Manage Devices</Text>
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
        <Text style={styles.headerTitle}>Manage Devices</Text>
        <TouchableOpacity onPress={() => Alert.alert('Add Device', 'Device addition feature coming soon')}>
          <MaterialIcons name="add-circle-outline" size={24} color="#8b5cf6" />
        </TouchableOpacity>
      </View>

      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <MaterialIcons name="devices" size={20} color="#8b5cf6" />
          <Text style={styles.statNumber}>{totalDevices}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialIcons name="check-circle" size={20} color="#10b981" />
          <Text style={styles.statNumber}>{activeDevices}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialIcons name="cancel" size={20} color="#ef4444" />
          <Text style={styles.statNumber}>{totalDevices - activeDevices}</Text>
          <Text style={styles.statLabel}>Inactive</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color="#a1a1aa" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search devices..."
          placeholderTextColor="#71717a"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <MaterialIcons name="close" size={20} color="#a1a1aa" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        {['all', 'on', 'off'].map(filter => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterChip, filterStatus === filter && styles.filterChipActive]}
            onPress={() => setFilterStatus(filter)}
          >
            <Text style={[styles.filterText, filterStatus === filter && styles.filterTextActive]}>
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Device List */}
      <FlatList
        data={filteredDevices}
        keyExtractor={item => item.id.toString()}
        renderItem={renderDeviceCard}
        contentContainerStyle={styles.listContainer}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="devices-other" size={64} color="#3f3f46" />
            <Text style={styles.emptyText}>No devices found</Text>
            <Text style={styles.emptySubtext}>
              {searchQuery || filterStatus !== 'all' 
                ? 'Try adjusting your filters' 
                : 'Add your first device to get started'}
            </Text>
          </View>
        }
      />

      {/* Device Details Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Device Details</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>
            
            {selectedDevice && (
              <>
                <View style={styles.modalBody}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Name:</Text>
                    <Text style={styles.detailValue}>{selectedDevice.name}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Type:</Text>
                    <Text style={styles.detailValue}>{selectedDevice.type}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Status:</Text>
                    <Text style={[styles.detailValue, { color: selectedDevice.status === 'on' ? '#10b981' : '#ef4444' }]}>
                      {selectedDevice.status?.toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Power Usage:</Text>
                    <Text style={styles.detailValue}>{selectedDevice.power_usage || 0}W</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Hours Used:</Text>
                    <Text style={styles.detailValue}>{selectedDevice.hours_used || 0}h</Text>
                  </View>
                </View>
                
                <View style={styles.modalActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => {
                      setModalVisible(false);
                      Alert.alert('Edit Device', 'Edit functionality coming soon');
                    }}
                  >
                    <MaterialIcons name="edit" size={20} color="#3b82f6" />
                    <Text style={styles.actionButtonText}>Edit</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeleteDevice(selectedDevice.id)}
                  >
                    <MaterialIcons name="delete" size={20} color="#ef4444" />
                    <Text style={[styles.actionButtonText, { color: '#ef4444' }]}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#a1a1aa',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
    paddingVertical: 12,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  filterChipActive: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
  },
  filterText: {
    color: '#a1a1aa',
    fontSize: 14,
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#ffffff',
  },
  listContainer: {
    padding: 16,
  },
  deviceCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  deviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  deviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  deviceType: {
    fontSize: 14,
    color: '#a1a1aa',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  statusOn: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  statusOff: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ef4444',
  },
  statusDotActive: {
    backgroundColor: '#10b981',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  deviceStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: '#a1a1aa',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#71717a',
    marginTop: 8,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#18181b',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  modalBody: {
    padding: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  detailLabel: {
    fontSize: 14,
    color: '#a1a1aa',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  modalActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  deleteButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: '#ef4444',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
  },
});
