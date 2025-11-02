import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
  StatusBar,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../../context/AuthContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Logo3DAnimation from './Logo3DAnimation';
import styles from './HomeTabStyles';

const HomeTab = ({ onNavigateToAddDevice, onNavigateToAnalytics }) => {
  const { user, userProfile, supabase } = useAuth();
  const navigation = useNavigation();
  const [appliances, setAppliances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalData, setModalData] = useState({});

  const getApplianceIcon = useCallback((type) => {
    if (!type) return 'power';
    const iconMap = {
      refrigerator: 'kitchen',
      tv: 'tv',
      washing_machine: 'local-laundry-service',
      air_conditioner: 'ac-unit',
      heater: 'whatshot',
      light: 'lightbulb-outline',
      microwave: 'microwave',
      dishwasher: 'dishwasher',
      computer: 'computer',
      fan: 'toys',
      router: 'router',
      speaker: 'speaker',
      camera: 'videocam',
    };
    return iconMap[type.toLowerCase()] || 'power';
  }, []);

  const fetchAppliances = useCallback(async () => {
    if (!user?.id) {
      console.log('No user ID available');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('appliances')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching appliances:', error);
        Alert.alert('Error', 'Failed to load appliances. Please try again.');
        setAppliances([]);
        return;
      }

      console.log('Fetched appliances:', data?.length || 0, 'devices');
      setAppliances(data || []);
    } catch (error) {
      console.error('Error in fetchAppliances:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      setAppliances([]);
    }
  }, [user?.id, supabase]);

  const toggleAppliance = useCallback(async (applianceId, currentStatus) => {
    if (!applianceId) {
      Alert.alert('Error', 'Invalid device ID');
      return;
    }

    const newStatus = currentStatus === 'on' ? 'off' : 'on';
    const originalAppliances = [...appliances];
    const updatedAppliances = appliances.map(app =>
      app.id === applianceId ? { ...app, status: newStatus } : app
    );
    setAppliances(updatedAppliances);

    try {
      const { error } = await supabase
        .from('appliances')
        .update({ status: newStatus })
        .eq('id', applianceId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating appliance:', error);
        Alert.alert('Error', 'Failed to update device status. Please try again.');
        setAppliances(originalAppliances);
        return;
      }

      console.log(`Device ${applianceId} toggled to ${newStatus}`);
    } catch (error) {
      console.error('Error in toggleAppliance:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      setAppliances(originalAppliances);
    }
  }, [appliances, supabase, user?.id]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAppliances();
    setRefreshing(false);
  }, [fetchAppliances]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchAppliances();
      setLoading(false);
    };

    if (user?.id) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [user?.id, fetchAppliances]);

  useFocusEffect(
    useCallback(() => {
      if (user?.id && !loading) {
        fetchAppliances();
      }
    }, [user?.id, loading, fetchAppliances])
  );

  // FIXED: Calculate stats using average_hours_per_day like ControlsTab does
  const stats = {
    totalUsage: appliances
      .filter(a => a.status === 'on')
      .reduce((sum, a) => sum + (parseFloat(a.normal_usage) || 0), 0),
    activeDevices: appliances.filter(a => a.status === 'on').length,
    totalDevices: appliances.length,
    monthlyCost: (() => {
      let cost = 0;
      appliances
        .filter(a => a.status === 'on')
        .forEach(app => {
          const kWh = (parseFloat(app.normal_usage) || 0) / 1000;
          const hoursPerDay = app.average_hours_per_day || 8;
          const daysPerMonth = 30;
          const monthlyKwh = kWh * hoursPerDay * daysPerMonth;
          cost += monthlyKwh * 2.50;
        });
      return Math.round(cost);
    })(),
  };

  const filteredAppliances = selectedRoom === 'All'
    ? appliances
    : appliances.filter(a => a.room === selectedRoom);

  const rooms = ['All', ...new Set(appliances.map(a => a.room).filter(room => room))];

  const getDisplayName = useCallback(() => {
    if (userProfile?.first_name) {
      return userProfile.first_name;
    }
    if (userProfile?.username) {
      return userProfile.username;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  }, [userProfile, user]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const showModal = (type, data = {}) => {
    setModalType(type);
    setModalData(data);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalType('');
    setModalData({});
  };

  const handleGoalSelection = (percentage) => {
    const targetCost = Math.round(stats.monthlyCost * (1 - percentage));
    const savingsAmount = stats.monthlyCost - targetCost;
    closeModal();
    setTimeout(() => {
      showModal('goalSet', {
        target: targetCost,
        current: stats.monthlyCost,
        savings: savingsAmount,
        percentage: percentage * 100
      });
    }, 300);
  };

  // Updated function to navigate to Devices tab and trigger add device
  const handleAddDevicePress = () => {
    closeModal();
    if (onNavigateToAddDevice) {
      onNavigateToAddDevice();
    }
  };

  // New function to navigate to Analytics tab
  const handleReportsPress = () => {
    closeModal();
    if (appliances.length === 0) {
      showModal('noData');
      return;
    }
    if (onNavigateToAnalytics) {
      onNavigateToAnalytics();
    }
  };

  const renderModalContent = () => {
    switch (modalType) {
      case 'noData':
        return (
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.modalCloseButton} onPress={closeModal}>
              <MaterialIcons name="close" size={18} color="#a1a1aa" />
            </TouchableOpacity>
            <View style={styles.modalContent}>
              <View style={styles.modalIconContainer}>
                <MaterialIcons name="insert-chart" size={48} color="#8b5cf6" />
              </View>
              <Text style={styles.modalTitle}>No Data Available</Text>
              <Text style={styles.modalDescription}>
                Add some devices first to view reports and analytics.
              </Text>
              <TouchableOpacity
                style={styles.modalPrimaryButton}
                onPress={handleAddDevicePress}
                activeOpacity={0.7}
              >
                <Text style={styles.modalPrimaryButtonText}>Add Device</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSecondaryButton} onPress={closeModal}>
                <Text style={styles.modalSecondaryButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'schedules':
        return (
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.modalCloseButton} onPress={closeModal}>
              <MaterialIcons name="close" size={18} color="#a1a1aa" />
            </TouchableOpacity>
            <View style={styles.modalContent}>
              <View style={styles.modalIconContainer}>
                <MaterialIcons name="schedule" size={48} color="#8b5cf6" />
              </View>
              <Text style={styles.modalTitle}>Schedules</Text>
              <Text style={styles.modalDescription}>
                Set up automatic schedules for your devices to optimize energy usage during off-peak hours.
              </Text>
              <View style={styles.modalFeatureList}>
                <View style={styles.modalFeatureItem}>
                  <Text style={styles.modalFeatureBullet}>•</Text>
                  <Text style={styles.modalFeatureText}>Auto turn off devices at night</Text>
                </View>
                <View style={styles.modalFeatureItem}>
                  <Text style={styles.modalFeatureBullet}>•</Text>
                  <Text style={styles.modalFeatureText}>Peak hour optimization</Text>
                </View>
                <View style={styles.modalFeatureItem}>
                  <Text style={styles.modalFeatureBullet}>•</Text>
                  <Text style={styles.modalFeatureText}>Custom time ranges</Text>
                </View>
              </View>
              <View style={styles.modalComingSoonBadge}>
                <Text style={styles.modalComingSoonText}>Coming Soon</Text>
              </View>
              <TouchableOpacity style={styles.modalPrimaryButton} onPress={closeModal}>
                <Text style={styles.modalPrimaryButtonText}>Got It</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'goals':
        return (
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.modalCloseButton} onPress={closeModal}>
              <MaterialIcons name="close" size={18} color="#a1a1aa" />
            </TouchableOpacity>
            <View style={styles.modalContent}>
              <View style={styles.modalIconContainer}>
                <MaterialIcons name="emoji-events" size={48} color="#8b5cf6" />
              </View>
              <Text style={styles.modalTitle}>Energy Goals</Text>
              <Text style={styles.modalDescription}>
                Set monthly energy consumption and cost savings goals to track your progress.
              </Text>
              <View style={styles.modalCurrentStats}>
                <Text style={styles.modalCurrentLabel}>Current Monthly Cost</Text>
                <Text style={styles.modalCurrentValue}>R{stats.monthlyCost}</Text>
              </View>
              <Text style={styles.modalSubtitle}>What would you like to achieve?</Text>
              <TouchableOpacity
                style={styles.modalGoalOption}
                onPress={() => handleGoalSelection(0.1)}
                activeOpacity={0.7}
              >
                <View style={styles.modalGoalOptionContent}>
                  <Text style={styles.modalGoalOptionTitle}>Reduce by 10%</Text>
                  <Text style={styles.modalGoalOptionTarget}>
                    Target: R{Math.round(stats.monthlyCost * 0.9)}/month
                  </Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#a1a1aa" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalGoalOption}
                onPress={() => handleGoalSelection(0.2)}
                activeOpacity={0.7}
              >
                <View style={styles.modalGoalOptionContent}>
                  <Text style={styles.modalGoalOptionTitle}>Reduce by 20%</Text>
                  <Text style={styles.modalGoalOptionTarget}>
                    Target: R{Math.round(stats.monthlyCost * 0.8)}/month
                  </Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#a1a1aa" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSecondaryButton} onPress={closeModal}>
                <Text style={styles.modalSecondaryButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'goalSet':
        return (
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.modalCloseButton} onPress={closeModal}>
              <MaterialIcons name="close" size={18} color="#a1a1aa" />
            </TouchableOpacity>
            <View style={styles.modalContent}>
              <View style={styles.modalIconContainer}>
                <MaterialIcons name="celebration" size={48} color="#8b5cf6" />
              </View>
              <Text style={styles.modalTitle}>Goal Set!</Text>
              <View style={styles.modalGoalSetStats}>
                <View style={styles.modalGoalSetItem}>
                  <Text style={styles.modalGoalSetLabel}>Target</Text>
                  <Text style={styles.modalGoalSetValue}>R{modalData.target}</Text>
                  <Text style={styles.modalGoalSetSub}>per month</Text>
                </View>
                <View style={styles.modalGoalSetDivider} />
                <View style={styles.modalGoalSetItem}>
                  <Text style={styles.modalGoalSetLabel}>Savings</Text>
                  <Text style={styles.modalGoalSetValue}>R{modalData.savings}</Text>
                  <Text style={styles.modalGoalSetSub}>{modalData.percentage}% less</Text>
                </View>
              </View>
              <Text style={styles.modalDescription}>
                Great goal! Start saving by turning off unused devices. We'll help you track your progress.
              </Text>
              <TouchableOpacity style={styles.modalPrimaryButton} onPress={closeModal}>
                <Text style={styles.modalPrimaryButtonText}>Let's Go!</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.loadingText}>Loading your devices...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <MaterialIcons name="error-outline" size={48} color="#ef4444" />
        <Text style={styles.modalTitle}>Authentication Required</Text>
        <Text style={styles.loadingText}>Please sign in to view your devices</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0b" />
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#10b981"
            colors={['#10b981']}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Header */}
        <View style={styles.heroHeader}>
          <View style={styles.headerTop}>
            <View style={styles.greetingContainer}>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.userName}>{getDisplayName()}</Text>
            </View>
          </View>

          {/* Main Usage Card */}
          <View style={styles.mainUsageCard}>
            <TouchableOpacity style={styles.powerIconTouchable}>
              <Logo3DAnimation size={80} />
            </TouchableOpacity>
            <Text style={styles.currentUsageLabel}>Current Usage</Text>
            <Text style={styles.currentUsageValue}>{stats.totalUsage.toFixed(0)}</Text>
            <Text style={styles.currentUsageUnit}>Watts</Text>
            
            <View style={styles.usageDivider} />
            
            <View style={styles.usageFooter}>
              <View style={styles.usageFooterItem}>
                <Text style={styles.usageFooterValue}>{stats.activeDevices}/{stats.totalDevices}</Text>
                <Text style={styles.usageFooterLabel}>Active Devices</Text>
              </View>
              <View style={styles.usageFooterDivider} />
              <View style={styles.usageFooterItem}>
                <Text style={styles.usageFooterValue}>R{stats.monthlyCost}</Text>
                <Text style={styles.usageFooterLabel}>Est. Monthly</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleAddDevicePress}
            activeOpacity={0.7}
          >
            <View style={styles.actionIconContainer}>
              <MaterialIcons name="add" size={28} color="#10b981" />
            </View>
            <Text style={styles.actionText}>Add Device</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleReportsPress}
            activeOpacity={0.7}
          >
            <View style={styles.actionIconContainer}>
              <MaterialIcons name="insert-chart" size={28} color="#ef4444" />
            </View>
            <Text style={styles.actionText}>Reports</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => showModal('schedules')}
            activeOpacity={0.7}
          >
            <View style={styles.actionIconContainer}>
              <MaterialIcons name="schedule" size={28} color="#3b82f6" />
            </View>
            <Text style={styles.actionText}>Schedules</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => showModal('goals')}
            activeOpacity={0.7}
          >
            <View style={styles.actionIconContainer}>
              <MaterialIcons name="emoji-events" size={28} color="#fbbf24" />
            </View>
            <Text style={styles.actionText}>Goals</Text>
          </TouchableOpacity>
        </View>

        {/* Room Filter */}
        {appliances.length > 0 && rooms.length > 1 && (
          <View style={styles.roomFilterSection}>
            <Text style={styles.sectionTitle}>Rooms</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.roomFilter}
              contentContainerStyle={styles.roomFilterContent}
            >
              {rooms.map(room => (
                <TouchableOpacity
                  key={room}
                  style={[
                    styles.roomChip,
                    selectedRoom === room && styles.roomChipActive
                  ]}
                  onPress={() => setSelectedRoom(room)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.roomChipText,
                      selectedRoom === room && styles.roomChipTextActive
                    ]}
                  >
                    {room}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Devices Section */}
        <View style={styles.devicesSection}>
          <View style={styles.devicesSectionHeader}>
            <Text style={styles.sectionTitle}>Your Devices</Text>
            {appliances.length > 0 && (
              <Text style={styles.deviceCount}>
                {filteredAppliances.length} {filteredAppliances.length === 1 ? 'device' : 'devices'}
              </Text>
            )}
          </View>

          {filteredAppliances.length > 0 ? (
            <View style={styles.devicesGrid}>
              {filteredAppliances.map(device => (
                <TouchableOpacity
                  key={device.id}
                  style={[
                    styles.deviceGridCard,
                    device.status === 'on' && styles.deviceGridCardActive
                  ]}
                  onPress={() => toggleAppliance(device.id, device.status)}
                  activeOpacity={0.7}
                >
                  <View style={styles.deviceCardHeader}>
                    <View style={[
                      styles.deviceIconCircle,
                      device.status === 'on' && styles.deviceIconCircleActive
                    ]}>
                      <MaterialIcons
                        name={getApplianceIcon(device.type)}
                        size={28}
                        color={device.status === 'on' ? '#10b981' : '#71717a'}
                      />
                    </View>
                    <View style={[
                      styles.statusIndicator,
                      device.status === 'on' && styles.statusIndicatorActive
                    ]} />
                  </View>
                  <Text style={styles.deviceGridName}>{device.name || 'Unnamed Device'}</Text>
                  <Text style={styles.deviceGridRoom}>{device.room || 'No Room'}</Text>
                  <View style={styles.deviceGridFooter}>
                    <Text style={[
                      styles.deviceGridUsage,
                      device.status === 'on' && styles.deviceGridUsageActive
                    ]}>
                      {parseFloat(device.normal_usage) || 0}W
                    </Text>
                    <Text style={[
                      styles.deviceGridStatus,
                      device.status === 'on' && styles.deviceGridStatusActive
                    ]}>
                      {device.status === 'on' ? 'ON' : 'OFF'}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <MaterialIcons name="devices" size={48} color="#10b981" />
              </View>
              <Text style={styles.emptyTitle}>
                {selectedRoom === 'All' ? 'No devices yet' : `No devices in ${selectedRoom}`}
              </Text>
              <Text style={styles.emptySubtitle}>
                {selectedRoom === 'All'
                  ? 'Start monitoring your energy by adding your first device'
                  : `Add devices to your ${selectedRoom} to get started`}
              </Text>
              <TouchableOpacity
                style={styles.emptyActionButton}
                onPress={handleAddDevicePress}
                activeOpacity={0.7}
              >
                <Text style={styles.emptyActionText}>Add Your First Device</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Energy Saving Tip */}
        {stats.activeDevices > 0 && stats.monthlyCost > 0 && (
          <View style={styles.tipSection}>
            <View style={styles.tipHeader}>
              <MaterialIcons name="lightbulb-outline" size={24} color="#10b981" />
              <Text style={styles.tipTitle}>Energy Saving Tip</Text>
            </View>
            <Text style={styles.tipContent}>
              You could save up to R{Math.round(stats.monthlyCost * 0.2)} per month by turning off devices when not in use. Even standby mode consumes energy!
            </Text>
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Custom Modal */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={closeModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeModal}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={e => e.stopPropagation()}
          >
            {renderModalContent()}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default HomeTab;
