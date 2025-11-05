// AnalysisTab.js - ENHANCED PROFESSIONAL VERSION
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
  Animated,
  Modal,
  FlatList,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../context/AuthContext';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { StyleSheet } from 'react-native';

// Import SmartSimulator with error handling
let SmartSimulator;
try {
  SmartSimulator = require('../ML/SmartSimulator').default;
} catch (error) {
  console.warn('SmartSimulator not found, using fallback');
  SmartSimulator = ({ onClose }) => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' }}>
      <MaterialIcons name="psychology" size={64} color="#8b5cf6" style={{ marginBottom: 20 }} />
      <Text style={{ color: '#f1f5f9', fontSize: 20, fontWeight: '700', marginBottom: 12 }}>Smart Simulator</Text>
      <Text style={{ color: '#94a3b8', marginBottom: 30, textAlign: 'center', paddingHorizontal: 40 }}>
        AI-powered energy optimization coming soon
      </Text>
      <TouchableOpacity onPress={onClose} style={{ backgroundColor: '#8b5cf6', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 }}>
        <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Close</Text>
      </TouchableOpacity>
    </View>
  );
}

const { width } = Dimensions.get('window');

// Professional Color System
const COLORS = {
  primary: '#10b981',
  secondary: '#3b82f6',
  accent: '#8b5cf6',
  danger: '#ef4444',
  warning: '#f59e0b',
  info: '#06b6d4',
  
  // Backgrounds
  bgPrimary: '#040404ff',
  bgSecondary: '#131313ff',
  bgTertiary: '#010101ff',
  
  // Text
  textPrimary: '#f1f5f9',
  textSecondary: '#cbd5e1',
  textTertiary: '#64748b',
  
  // Chart colors
  chartColors: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'],
};

// Spacing System
const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

export default function AnalysisTab({ appliances: propAppliances = [], stats = {} }) {
  const { user, supabase } = useAuth();
  const navigation = useNavigation();

  // Core states
  const [appliances, setAppliances] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [chartType, setChartType] = useState('bar');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showSmartSimulator, setShowSmartSimulator] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation for live badge
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  // Stats calculation
  const [currentStats, setCurrentStats] = useState({
    totalPower: 0,
    activeDevices: 0,
    peakUsage: 0,
    efficiency: 'Excellent',
    monthlyCost: 0,
    dailyUsage: 0
  });

  // Animate stats on change
  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.05,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentStats.totalPower]);

  // Fast appliance fetch
  const fastFetch = useCallback(async () => {
    if (!user?.id) return;
    try {
      console.log('🚀 Fast fetching appliances...');
      const start = Date.now();
      const { data, error } = await supabase
        .from('appliances')
        .select('id, name, type, room, normal_usage, status')
        .eq('user_id', user.id);

      if (error) throw error;
      console.log(`✅ Fetch completed in ${Date.now() - start}ms`);
      setAppliances(data || []);
      setLastUpdate(new Date());

      if (data && data.length > 0) {
        const active = data.filter(app => app.status === 'on');
        const totalPower = active.reduce((sum, app) => sum + (app.normal_usage || 0), 0);
        setCurrentStats(prev => ({
          totalPower: Math.round(totalPower),
          activeDevices: active.length,
          peakUsage: Math.max(prev.peakUsage, totalPower),
          efficiency: totalPower > 1500 ? 'Poor' : totalPower > 1000 ? 'Fair' : totalPower > 500 ? 'Good' : 'Excellent',
          monthlyCost: Math.round((totalPower / 1000) * 24 * 30 * 2.5),
          dailyUsage: Math.round((totalPower / 1000) * 24 * 100) / 100
        }));
      }
    } catch (error) {
      console.error('Fast fetch error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [user?.id, supabase]);

  // Auto-refresh when tab comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('📱 Analysis tab focused - auto refreshing');
      fastFetch();
    }, [fastFetch])
  );

  // Use prop appliances immediately
  useEffect(() => {
    if (propAppliances && propAppliances.length > 0) {
      setAppliances(propAppliances);
      setLastUpdate(new Date());
      const active = propAppliances.filter(app => app.status === 'on');
      const totalPower = active.reduce((sum, app) => sum + (app.normal_usage || 0), 0);
      setCurrentStats(prev => ({
        totalPower: Math.round(totalPower),
        activeDevices: active.length,
        peakUsage: Math.max(prev.peakUsage, totalPower),
        efficiency: totalPower > 1500 ? 'Poor' : totalPower > 1000 ? 'Fair' : totalPower > 500 ? 'Good' : 'Excellent',
        monthlyCost: Math.round((totalPower / 1000) * 24 * 30 * 2.5),
        dailyUsage: Math.round((totalPower / 1000) * 24 * 100) / 100
      }));
    }
  }, [propAppliances]);

  // Instant refresh handler
  const onRefresh = useCallback(() => {
    console.log('🔄 Manual refresh triggered');
    setRefreshing(true);
    fastFetch();
  }, [fastFetch]);

  // SmartSimulator handlers
  const openSmartSimulator = () => {
    console.log('Opening Smart Simulator...');
    setShowSmartSimulator(true);
  };

  const closeSmartSimulator = () => {
    console.log('Closing Smart Simulator...');
    setShowSmartSimulator(false);
    fastFetch();
  };

  // Get room data
  const getRoomData = useCallback(() => {
    const roomData = {};
    let totalPower = 0;
    if (appliances && Array.isArray(appliances)) {
      appliances.forEach(app => {
        const room = app.room || 'No Room Assigned';
        if (!roomData[room]) {
          roomData[room] = {
            name: room,
            devices: [],
            totalPower: 0,
            activePower: 0,
            activeDevices: 0,
            totalDevices: 0
          };
        }
        roomData[room].devices.push(app);
        roomData[room].totalDevices++;
        if (app.status === 'on') {
          const power = app.normal_usage || 0;
          roomData[room].activePower += power;
          roomData[room].activeDevices++;
          totalPower += power;
        }
      });
    }
    return { roomData, totalPower };
  }, [appliances]);

  // Get efficiency color
  const getEfficiencyColor = (efficiency) => {
    switch(efficiency) {
      case 'Excellent': return COLORS.primary;
      case 'Good': return COLORS.info;
      case 'Fair': return COLORS.warning;
      case 'Poor': return COLORS.danger;
      default: return COLORS.textSecondary;
    }
  };

  // Render stats cards - 3x2 grid
  const renderStatsCards = () => (
    <View style={styles.statsGrid}>
      {/* First row */}
      <Animated.View style={[styles.statCard, { transform: [{ scale: scaleAnim }] }]}>
        <MaterialIcons name="flash-on" size={24} color={COLORS.primary} style={{ marginBottom: 8 }} />
        <Text style={styles.statValue}>{currentStats.totalPower}W</Text>
        <Text style={styles.statLabel}>Current Usage</Text>
      </Animated.View>
      
      <View style={styles.statCard}>
        <MaterialIcons name="devices" size={24} color={COLORS.secondary} style={{ marginBottom: 8 }} />
        <Text style={styles.statValue}>{currentStats.activeDevices}</Text>
        <Text style={styles.statLabel}>Active Devices</Text>
      </View>
      
      <View style={styles.statCard}>
        <MaterialIcons name="trending-up" size={24} color={COLORS.warning} style={{ marginBottom: 8 }} />
        <Text style={styles.statValue}>{currentStats.peakUsage}W</Text>
        <Text style={styles.statLabel}>Peak Usage</Text>
      </View>
      
      {/* Second row */}
      <View style={styles.statCard}>
        <MaterialIcons name="eco" size={24} color={getEfficiencyColor(currentStats.efficiency)} style={{ marginBottom: 8 }} />
        <Text style={[styles.statValue, { color: getEfficiencyColor(currentStats.efficiency) }]}>
          {currentStats.efficiency}
        </Text>
        <Text style={styles.statLabel}>Efficiency</Text>
      </View>
      
      <View style={styles.statCard}>
        <MaterialIcons name="wb-sunny" size={24} color={COLORS.info} style={{ marginBottom: 8 }} />
        <Text style={styles.statValue}>{currentStats.dailyUsage}kWh</Text>
        <Text style={styles.statLabel}>Daily Usage</Text>
      </View>
      
      <View style={styles.statCard}>
        <MaterialIcons name="account-balance-wallet" size={24} color={COLORS.accent} style={{ marginBottom: 8 }} />
        <Text style={styles.statValue}>R{currentStats.monthlyCost}</Text>
        <Text style={styles.statLabel}>Monthly Est.</Text>
      </View>
    </View>
  );

  // Render chart based on type
  const renderChart = () => {
    if (!appliances || appliances.length === 0) {
      return (
        <View style={styles.emptyState}>
          <MaterialIcons name="devices-other" size={48} color={COLORS.textTertiary} style={styles.emptyIcon} />
          <Text style={styles.emptyTitle}>No devices configured</Text>
          <Text style={styles.emptySubtitle}>Add devices in Controls tab to see analytics</Text>
        </View>
      );
    }

    const activeDevices = appliances.filter(app => app.status === 'on');

    if (activeDevices.length === 0) {
      return (
        <View style={styles.emptyState}>
          <MaterialIcons name="power-off" size={48} color={COLORS.textTertiary} style={styles.emptyIcon} />
          <Text style={styles.emptyTitle}>No active devices</Text>
          <Text style={styles.emptySubtitle}>Turn on devices in Controls tab to see live data</Text>
        </View>
      );
    }

    switch (chartType) {
      case 'line':
        return renderLineChart(activeDevices);
      case 'pie':
        return renderPieChart();
      case 'bar':
      default:
        return renderBarChart(activeDevices);
    }
  };

  // Professional chart config
  const getChartConfig = () => ({
    backgroundColor: 'transparent',
    backgroundGradientFrom: COLORS.bgSecondary,
    backgroundGradientFromOpacity: 0.8,
    backgroundGradientTo: COLORS.bgTertiary,
    backgroundGradientToOpacity: 0.9,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(241, 245, 249, ${opacity})`,
    strokeWidth: 3,
    barPercentage: 0.7,
    propsForBackgroundLines: {
      strokeDasharray: '',
      strokeWidth: 1,
      stroke: COLORS.bgTertiary,
      strokeOpacity: 0.3,
    },
    propsForLabels: {
      fontSize: 11,
      fontWeight: '600',
    },
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: COLORS.primary
    }
  });

  // Render bar chart
  const renderBarChart = (activeDevices) => {
    try {
      if (!activeDevices || activeDevices.length === 0) {
        return (
          <View style={styles.emptyState}>
            <MaterialIcons name="bar-chart" size={48} color={COLORS.textTertiary} style={styles.emptyIcon} />
            <Text style={styles.emptyTitle}>No active devices</Text>
            <Text style={styles.emptySubtitle}>Turn on devices to see usage</Text>
          </View>
        );
      }

      const sortedDevices = [...activeDevices]
        .sort((a, b) => (b.normal_usage || 0) - (a.normal_usage || 0))
        .slice(0, 6)
        .filter(d => d.normal_usage > 0);

      if (sortedDevices.length === 0) {
        return (
          <View style={styles.emptyState}>
            <MaterialIcons name="error-outline" size={48} color={COLORS.textTertiary} style={styles.emptyIcon} />
            <Text style={styles.emptyTitle}>No power data available</Text>
            <Text style={styles.emptySubtitle}>Add power usage information to your devices</Text>
          </View>
        );
      }

      const labels = sortedDevices.map(d => d.name.substring(0, 8));
      const data = sortedDevices.map(d => parseFloat(d.normal_usage) || 0);

      const chartData = {
        labels: labels.length > 0 ? labels : ['N/A'],
        datasets: [
          {
            data: data.length > 0 ? data : [0]
          }
        ]
      };

      return (
        <View>
          <Text style={styles.chartSubtitle}>Top {sortedDevices.length} devices by power consumption</Text>
          <View style={styles.chartContainer}>
            <BarChart
              data={chartData}
              width={width - 48}
              height={260}
              yAxisLabel=""
              yAxisSuffix="W"
              chartConfig={getChartConfig()}
              style={styles.chart}
            />
          </View>
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.primary }]} />
              <Text style={styles.legendText}>Power Consumption (Watts)</Text>
            </View>
          </View>
          <View style={styles.deviceDetailsList}>
            {sortedDevices.map((device, index) => (
              <View key={device.id} style={styles.deviceDetailItem}>
                <View style={styles.deviceDetailLeft}>
                  <Text style={styles.deviceDetailRank}>#{index + 1}</Text>
                  <View>
                    <Text style={styles.deviceDetailName}>{device.name}</Text>
                    <Text style={styles.deviceDetailRoom}>{device.room || 'No room'}</Text>
                  </View>
                </View>
                <Text style={styles.deviceDetailPower}>{device.normal_usage || 0}W</Text>
              </View>
            ))}
          </View>
        </View>
      );
    } catch (error) {
      console.error('Bar chart error:', error);
      return (
        <View style={styles.emptyState}>
          <MaterialIcons name="error" size={48} color={COLORS.danger} style={styles.emptyIcon} />
          <Text style={styles.emptyTitle}>Chart error</Text>
          <Text style={styles.emptySubtitle}>{error.message}</Text>
        </View>
      );
    }
  };

  // Render line chart
  const renderLineChart = (activeDevices) => {
    try {
      if (!activeDevices || activeDevices.length === 0) {
        return (
          <View style={styles.emptyState}>
            <MaterialIcons name="show-chart" size={48} color={COLORS.textTertiary} style={styles.emptyIcon} />
            <Text style={styles.emptyTitle}>No data available</Text>
            <Text style={styles.emptySubtitle}>Turn on devices to see trends</Text>
          </View>
        );
      }

      const sortedDevices = [...activeDevices]
        .sort((a, b) => (b.normal_usage || 0) - (a.normal_usage || 0))
        .slice(0, 6)
        .filter(d => d.normal_usage > 0);

      if (sortedDevices.length === 0) {
        return (
          <View style={styles.emptyState}>
            <MaterialIcons name="error-outline" size={48} color={COLORS.textTertiary} style={styles.emptyIcon} />
            <Text style={styles.emptyTitle}>No power data</Text>
            <Text style={styles.emptySubtitle}>Add power usage to devices</Text>
          </View>
        );
      }

      const labels = sortedDevices.map(d => d.name.substring(0, 7));
      const data = sortedDevices.map(d => parseFloat(d.normal_usage) || 0);

      const chartData = {
        labels: labels.length > 0 ? labels : ['N/A'],
        datasets: [
          {
            data: data.length > 0 ? data : [0],
            strokeWidth: 3
          }
        ]
      };

      return (
        <View>
          <Text style={styles.chartSubtitle}>Power consumption trend across devices</Text>
          <View style={styles.chartContainer}>
            <LineChart
              data={chartData}
              width={width - 48}
              height={260}
              yAxisLabel=""
              yAxisSuffix="W"
              chartConfig={getChartConfig()}
              bezier
              style={styles.chart}
            />
          </View>
        </View>
      );
    } catch (error) {
      console.error('Line chart error:', error);
      return (
        <View style={styles.emptyState}>
          <MaterialIcons name="error" size={48} color={COLORS.danger} style={styles.emptyIcon} />
          <Text style={styles.emptyTitle}>Chart error</Text>
          <Text style={styles.emptySubtitle}>{error.message}</Text>
        </View>
      );
    }
  };

const renderPieChart = () => {
  try {
    const { roomData, totalPower } = getRoomData();
    const activeRooms = Object.entries(roomData)
      .filter(([, data]) => data && data.activePower > 0)
      .sort(([,a], [,b]) => (b.activePower || 0) - (a.activePower || 0))
      .slice(0, 6);

    if (activeRooms.length === 0 || totalPower === 0) {
      return (
        <View style={styles.emptyState}>
          <MaterialIcons name="pie-chart" size={48} color={COLORS.textTertiary} style={styles.emptyIcon} />
          <Text style={styles.emptyTitle}>No room data</Text>
          <Text style={styles.emptySubtitle}>Turn on devices in different rooms</Text>
        </View>
      );
    }

    const pieData = activeRooms.map(([roomName, roomInfo], index) => ({
      name: roomName.substring(0, 10),
      population: parseFloat(roomInfo.activePower) || 0,
      color: COLORS.chartColors[index % COLORS.chartColors.length],
      legendFontColor: COLORS.textSecondary,
      legendFontSize: 12
    }));

    return (
      <View>
        <Text style={styles.chartSubtitle}>
          Power distribution across {activeRooms.length} rooms
        </Text>
        
        {/* CENTERED PIE CHART - Remove paddingLeft, use container centering */}
        <View style={styles.pieChartContainer}>
          <PieChart
            data={pieData}
            width={width - 40}
            height={250}
            chartConfig={{
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="0"
            paddingRight="0"
            style={styles.chartCentered}
            hasLegend={false}
          />
        </View>

        {/* LEGEND BELOW CHART */}
        <View style={styles.legend}>
          {activeRooms.map(([roomName, roomInfo], index) => {
            const percentage = totalPower > 0 ? Math.round((roomInfo.activePower / totalPower) * 100) : 0;
            return (
              <TouchableOpacity
                key={roomName}
                onPress={() => {
                  setSelectedRoom(roomName);
                  setShowRoomModal(true);
                }}
                style={styles.legendItem}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.legendDot,
                    { backgroundColor: COLORS.chartColors[index % COLORS.chartColors.length] }
                  ]}
                />
                <Text style={styles.legendText}>
                  {roomName}: {percentage}% ({roomInfo.activePower}W)
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  } catch (error) {
    console.error('Pie chart error:', error);
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>Chart error</Text>
        <Text style={styles.emptySubtitle}>{error.message}</Text>
      </View>
    );
  }
};

  // Room modal
  const renderRoomModal = () => {
    const { roomData, totalPower } = getRoomData();
    let displayData = [];
    let modalTitle = '';

    if (selectedRoom && roomData[selectedRoom]) {
      displayData = [{ name: selectedRoom, ...roomData[selectedRoom] }];
      modalTitle = `${selectedRoom} Details`;
    } else {
      displayData = Object.entries(roomData)
        .map(([name, data]) => ({ name, ...data }))
        .filter(room => room && room.activePower > 0)
        .sort((a, b) => (b.activePower || 0) - (a.activePower || 0));
      modalTitle = 'Room Power Usage';
    }

    const renderRoomItem = ({ item, index }) => {
      const percentage = totalPower > 0 ? Math.round(((item.activePower || 0) / totalPower) * 100) : 0;
      const color = COLORS.chartColors[index % COLORS.chartColors.length];

      return (
        <View style={styles.roomModalItem}>
          <View style={styles.roomHeader}>
            <View style={styles.roomHeaderLeft}>
              <View style={[styles.roomColorIndicator, { backgroundColor: color }]} />
              <Text style={styles.roomName}>{item.name}</Text>
            </View>
            <Text style={styles.roomPower}>{item.activePower || 0}W</Text>
          </View>
          <Text style={styles.roomPercentage}>{percentage}% of total power consumption</Text>
          <View style={styles.roomStats}>
            <View style={styles.roomStatItem}>
              <MaterialIcons name="devices" size={16} color={COLORS.textTertiary} />
              <Text style={styles.roomStat}>{item.activeDevices}/{item.totalDevices} active</Text>
            </View>
            <View style={styles.roomStatItem}>
              <MaterialIcons name="attach-money" size={16} color={COLORS.textTertiary} />
              <Text style={styles.roomStat}>R{Math.round(((item.activePower || 0) * 24 * 30 * 2.5) / 1000)}/mo</Text>
            </View>
          </View>
          <Text style={styles.deviceListTitle}>Devices in this room:</Text>
          {item.devices && Array.isArray(item.devices) && item.devices.map(device => (
            <View key={device.id} style={styles.deviceItem}>
              <View style={styles.deviceItemLeft}>
                <MaterialIcons 
                  name={device.status === 'on' ? 'power' : 'power-off'} 
                  size={20} 
                  color={device.status === 'on' ? COLORS.primary : COLORS.textTertiary} 
                />
                <Text style={styles.deviceName}>{device.name}</Text>
              </View>
              <Text style={[
                styles.devicePower,
                device.status === 'off' && styles.devicePowerOff
              ]}>
                {device.status === 'on' ? `${device.normal_usage || 0}W` : 'OFF'}
              </Text>
            </View>
          ))}
        </View>
      );
    };

    return (
      <Modal visible={showRoomModal} animationType="slide" transparent={false}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowRoomModal(false)} style={styles.modalHeaderButton}>
              <MaterialIcons name="arrow-back" size={24} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <TouchableOpacity
              onPress={() => setSelectedRoom(null)}
              style={styles.modalHeaderButton}
            >
              <MaterialIcons name="refresh" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.modalSummary}>
            <View style={styles.summaryItem}>
              <MaterialIcons name="flash-on" size={24} color={COLORS.primary} />
              <Text style={styles.summaryValue}>{totalPower}W</Text>
              <Text style={styles.summaryLabel}>Total Active</Text>
            </View>
            <View style={styles.summaryItem}>
              <MaterialIcons name="meeting-room" size={24} color={COLORS.secondary} />
              <Text style={styles.summaryValue}>{displayData.length}</Text>
              <Text style={styles.summaryLabel}>Rooms</Text>
            </View>
            <View style={styles.summaryItem}>
              <MaterialIcons name="account-balance-wallet" size={24} color={COLORS.accent} />
              <Text style={styles.summaryValue}>R{Math.round((totalPower * 24 * 30 * 2.5) / 1000)}</Text>
              <Text style={styles.summaryLabel}>Monthly</Text>
            </View>
          </View>
          <FlatList
            data={displayData}
            renderItem={renderRoomItem}
            keyExtractor={item => item.name}
            contentContainerStyle={{ padding: SPACING.lg }}
            showsVerticalScrollIndicator={false}
          />
        </SafeAreaView>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.headerTitle}>Device Analysis</Text>
              <Text style={styles.headerSubtitle}>
                {appliances.length} devices • {appliances.filter(app => app.status === 'on').length} active
              </Text>
            </View>
            <Animated.View style={[styles.liveBadge, { transform: [{ scale: pulseAnim }] }]}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </Animated.View>
          </View>
          <Text style={styles.lastUpdate}>Updated: {lastUpdate.toLocaleTimeString()}</Text>
        </View>

        {/* Stats Cards */}
        {renderStatsCards()}

        {/* Chart Controls */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Visualization</Text>
          <View style={styles.chartControls}>
            {[
              { type: 'bar', icon: 'bar-chart', label: 'Bar Chart' },
              { type: 'line', icon: 'trending-up', label: 'Trend' },
              { type: 'pie', icon: 'pie-chart', label: 'Rooms' }
            ].map(chart => (
              <TouchableOpacity
                key={chart.type}
                onPress={() => setChartType(chart.type)}
                activeOpacity={0.7}
                style={[
                  styles.chartTypeButton,
                  chartType === chart.type && styles.chartTypeButtonActive
                ]}
              >
                <MaterialIcons 
                  name={chart.icon} 
                  size={22} 
                  color={chartType === chart.type ? '#fff' : COLORS.primary} 
                />
                <Text style={[
                  styles.chartTypeLabel,
                  chartType === chart.type && styles.chartTypeLabelActive
                ]}>
                  {chart.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Chart Container */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {chartType === 'bar' && 'Device Usage'}
              {chartType === 'line' && 'Consumption Trend'}
              {chartType === 'pie' && 'Room Distribution'}
            </Text>
            <MaterialIcons 
              name={chartType === 'bar' ? 'bar-chart' : chartType === 'line' ? 'show-chart' : 'pie-chart'} 
              size={24} 
              color={COLORS.primary} 
            />
          </View>
          {renderChart()}
        </View>

        {/* All Devices List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              All Devices
            </Text>
            <View style={styles.deviceCountBadge}>
              <Text style={styles.deviceCountText}>
                {appliances.filter(app => app.status === 'on').length}/{appliances.length}
              </Text>
            </View>
          </View>
          {!appliances || appliances.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialIcons name="devices-other" size={48} color={COLORS.textTertiary} style={styles.emptyIcon} />
              <Text style={styles.emptyTitle}>No devices configured</Text>
              <Text style={styles.emptySubtitle}>Add devices in Controls tab to get started</Text>
            </View>
          ) : (
            appliances
              .sort((a, b) => {
                if (a.status === 'on' && b.status === 'off') return -1;
                if (a.status === 'off' && b.status === 'on') return 1;
                return (b.normal_usage || 0) - (a.normal_usage || 0);
              })
              .map(device => (
                <View key={device.id} style={styles.deviceListItem}>
                  <View style={styles.deviceListLeft}>
                    <View style={[
                      styles.deviceStatusIndicator,
                      { backgroundColor: device.status === 'on' ? COLORS.primary : COLORS.textTertiary }
                    ]} />
                    <View>
                      <Text style={styles.deviceListName}>{device.name}</Text>
                      <View style={styles.deviceListMeta}>
                        <MaterialIcons name="room" size={12} color={COLORS.textTertiary} />
                        <Text style={styles.deviceListInfo}>
                          {device.room || 'No room'}
                        </Text>
                        <Text style={styles.deviceListDivider}>•</Text>
                        <Text style={styles.deviceListInfo}>{device.type || 'Unknown'}</Text>
                      </View>
                    </View>
                  </View>
                  <Text style={[
                    styles.deviceListPower,
                    device.status === 'off' && styles.deviceListPowerOff
                  ]}>
                    {device.status === 'on' ? `${device.normal_usage || 0}W` : 'OFF'}
                  </Text>
                </View>
              ))
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.simulatorButton} 
            onPress={openSmartSimulator}
            activeOpacity={0.8}
          >
            <MaterialIcons name="psychology" size={24} color="#fff" />
            <Text style={styles.simulatorButtonText}>Smart Simulator</Text>
            <View style={styles.betaBadge}>
              <Text style={styles.betaText}>AI</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.refreshButton} 
            onPress={onRefresh}
            activeOpacity={0.8}
            disabled={refreshing}
          >
            {refreshing ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <MaterialIcons name="refresh" size={24} color="#fff" />
            )}
            <Text style={styles.refreshButtonText}>
              {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Room Modal */}
      {renderRoomModal()}

      {/* SmartSimulator Modal */}
      <Modal visible={showSmartSimulator} animationType="slide" transparent={false}>
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bgPrimary }}>
          <SmartSimulator onClose={closeSmartSimulator} />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

// Professional Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.bgSecondary,
    backgroundColor: COLORS.bgSecondary,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    fontWeight: '500',
  },
  lastUpdate: {
    fontSize: 12,
    color: COLORS.textTertiary,
    fontWeight: '500',
  },
  liveBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  liveText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.md,
  },
  statCard: {
    backgroundColor: COLORS.bgSecondary,
    width: '31%',
    alignItems: 'center',
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.bgTertiary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: SPACING.xs,
  },
  statLabel: {
    color: COLORS.textSecondary,
    fontWeight: '600',
    fontSize: 11,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  section: {
    backgroundColor: COLORS.bgSecondary,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    borderRadius: 16,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.bgTertiary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  chartControls: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  chartTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
    gap: SPACING.sm,
    backgroundColor: 'transparent',
  },
  chartTypeButtonActive: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  chartTypeLabel: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  chartTypeLabelActive: {
    color: '#fff',
  },
  chartSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    fontWeight: '500',
  },
  chartContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: SPACING.sm,
  },
  chart: {
    borderRadius: 16,
    marginVertical: SPACING.sm,
  },
  emptyState: {
    alignItems: 'center',
    padding: SPACING.xxl * 2,
  },
  emptyIcon: {
    marginBottom: SPACING.lg,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  legend: {
    marginTop: SPACING.lg,
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.bgTertiary,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
    padding: SPACING.sm,
    borderRadius: 8,
  },
  legendDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  legendText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  deviceDetailsList: {
    marginTop: SPACING.lg,
    gap: SPACING.sm,
  },
  deviceDetailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.bgTertiary,
    borderRadius: 12,
  },
  deviceDetailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
  },
  deviceDetailRank: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primary,
    width: 28,
  },
  deviceDetailName: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  deviceDetailRoom: {
    color: COLORS.textTertiary,
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
  deviceDetailPower: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '800',
  },
  deviceCountBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  deviceCountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
  deviceListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.bgTertiary,
    borderRadius: 12,
    marginBottom: SPACING.sm,
  },
  deviceListLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
  },
  deviceStatusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  deviceListName: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  deviceListMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  deviceListInfo: {
    color: COLORS.textTertiary,
    fontSize: 12,
    fontWeight: '500',
  },
  deviceListDivider: {
    color: COLORS.textTertiary,
    fontSize: 12,
  },
  deviceListPower: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '800',
  },
  deviceListPowerOff: {
    color: COLORS.textTertiary,
  },
  actionButtons: {
    marginHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  simulatorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.accent,
    padding: SPACING.lg,
    borderRadius: 16,
    gap: SPACING.md,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  simulatorButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
  },
  betaBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  betaText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    borderRadius: 16,
    gap: SPACING.md,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.bgSecondary,
    backgroundColor: COLORS.bgSecondary,
  },
  modalHeaderButton: {
    padding: SPACING.sm,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  modalSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: SPACING.xl,
    backgroundColor: COLORS.bgSecondary,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.lg,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryItem: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary,
  },
  summaryLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  roomModalItem: {
    backgroundColor: COLORS.bgSecondary,
    padding: SPACING.lg,
    borderRadius: 16,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.bgTertiary,
  },
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  roomHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  roomColorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  roomName: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  roomPower: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.primary,
  },
  roomPercentage: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: SPACING.md,
    fontWeight: '500',
  },
  roomStats: {
    flexDirection: 'row',
    gap: SPACING.lg,
    marginBottom: SPACING.md,
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.bgTertiary,
  },
  roomStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  roomStat: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  deviceListTitle: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  deviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.bgTertiary,
    borderRadius: 12,
    marginBottom: SPACING.sm,
  },
  deviceItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
  },
  deviceName: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  devicePower: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '800',
  },
pieChartContainer: {
  justifyContent: 'center',
  alignItems: 'center',
  marginVertical: SPACING.lg,
  width: '100%',
},
chartCentered: {
  alignSelf: 'center',
  borderRadius: 16,
  marginVertical: SPACING.sm,
},
  devicePowerOff: {
    color: COLORS.textTertiary,
  },
});