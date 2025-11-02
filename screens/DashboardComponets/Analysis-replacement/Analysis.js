// AnalysisTab.js - OPTIMIZED for super fast refresh and auto-refresh on tab enter

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
import { styles } from './AnalysisStyles';

const { width } = Dimensions.get('window');

export default function AnalysisTab({ appliances: propAppliances = [], stats = {} }) {
  const { user, supabase } = useAuth();
  const navigation = useNavigation();
  
  // Core states - simplified
  const [appliances, setAppliances] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [chartType, setChartType] = useState('bar');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  
  // Animation
  const fadeAnim = useRef(new Animated.Value(1)).current; // Start visible

  // FAST stats calculation - no complex dependencies
  const [currentStats, setCurrentStats] = useState({
    totalPower: 0,
    activeDevices: 0,
    peakUsage: 0,
    efficiency: 'Excellent',
    monthlyCost: 0,
    dailyUsage: 0
  });

  // SUPER FAST appliance fetch - minimal query
  const fastFetch = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      console.log('🚀 Fast fetching appliances...');
      const start = Date.now();
      
      // Single, simple query - no ordering, no complex selects
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
        
        setCurrentStats({
          totalPower: Math.round(totalPower),
          activeDevices: active.length,
          peakUsage: Math.max(currentStats.peakUsage, totalPower),
          efficiency: totalPower > 1500 ? 'Poor' : totalPower > 1000 ? 'Fair' : totalPower > 500 ? 'Good' : 'Excellent',
          monthlyCost: Math.round((totalPower / 1000) * 24 * 30 * 2.5),
          dailyUsage: Math.round((totalPower / 1000) * 24 * 100) / 100
        });
      }
    } catch (error) {
      console.error('Fast fetch error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [user?.id, supabase, currentStats.peakUsage]);

  // AUTO-REFRESH when tab comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('📱 Analysis tab focused - auto refreshing');
      fastFetch();
    }, [fastFetch])
  );

  // Use prop appliances immediately
  useEffect(() => {
    if (propAppliances.length > 0) {
      setAppliances(propAppliances);
      setLastUpdate(new Date());
      
      // Quick stats calc
      const active = propAppliances.filter(app => app.status === 'on');
      const totalPower = active.reduce((sum, app) => sum + (app.normal_usage || 0), 0);
      
      setCurrentStats({
        totalPower: Math.round(totalPower),
        activeDevices: active.length,
        peakUsage: Math.max(currentStats.peakUsage, totalPower),
        efficiency: totalPower > 1500 ? 'Poor' : totalPower > 1000 ? 'Fair' : totalPower > 500 ? 'Good' : 'Excellent',
        monthlyCost: Math.round((totalPower / 1000) * 24 * 30 * 2.5),
        dailyUsage: Math.round((totalPower / 1000) * 24 * 100) / 100
      });
    }
  }, [propAppliances, currentStats.peakUsage]);

  // INSTANT refresh handler
  const onRefresh = useCallback(() => {
    console.log('🔄 Manual refresh triggered');
    setRefreshing(true);
    fastFetch();
  }, [fastFetch]);

  // Navigate to ML Analytics
  const navigateToMLAnalytics = () => {
    // Pass current appliances and stats to ML Analytics
    navigation.navigate('MLAnalytics', { 
      appliances: appliances,
      stats: currentStats 
    });
  };

  // Get room data for modal
  const getRoomData = useCallback(() => {
    const roomData = {};
    let totalPower = 0;

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

    return { roomData, totalPower };
  }, [appliances]);

  // Render functions
  const renderStatsCards = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{currentStats.totalPower}W</Text>
          <Text style={styles.statLabel}>Current Usage</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{currentStats.activeDevices}</Text>
          <Text style={styles.statLabel}>Active Devices</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{currentStats.peakUsage}W</Text>
          <Text style={styles.statLabel}>Peak Usage</Text>
        </View>
      </View>
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{currentStats.efficiency}</Text>
          <Text style={styles.statLabel}>Efficiency</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{currentStats.dailyUsage}kWh</Text>
          <Text style={styles.statLabel}>Daily Usage</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>R{currentStats.monthlyCost}</Text>
          <Text style={styles.statLabel}>Monthly Est.</Text>
        </View>
      </View>
    </View>
  );

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return renderLineChart();
      case 'pie':
        return renderPieChart();
      case 'bar':
      default:
        return renderBarChart();
    }
  };

  const renderBarChart = () => {
    const activeDevices = appliances.filter(app => app.status === 'on');
    
    if (activeDevices.length === 0) {
      return (
        <View style={styles.noDataContainer}>
          <MaterialIcons name="bar-chart" size={48} color="#6b7280" />
          <Text style={styles.noDataText}>No active devices</Text>
          <Text style={styles.noDataSubtext}>Go to Controls tab and turn on some devices</Text>
        </View>
      );
    }

    const sortedDevices = [...activeDevices]
      .sort((a, b) => (b.normal_usage || 0) - (a.normal_usage || 0))
      .slice(0, 6);

    const maxUsage = Math.max(...sortedDevices.map(d => d.normal_usage || 0)) || 1;

    return (
      <View style={styles.barChartContainer}>
        <Text style={styles.chartSubtitle}>Top devices by power consumption</Text>
        {sortedDevices.map((device, index) => {
          const usage = device.normal_usage || 0;
          const barWidth = Math.max((usage / maxUsage) * 100, 15);
          const barColor = usage > 300 ? '#ef4444' : usage > 150 ? '#f59e0b' : '#10b981';

          return (
            <View key={device.id} style={styles.chartRow}>
              <Text style={styles.deviceLabel}>{device.name}</Text>
              <View style={styles.barContainer}>
                <View style={[styles.bar, { width: `${barWidth}%`, backgroundColor: barColor }]}>
                  <Text style={styles.barLabel}>{usage}W</Text>
                </View>
              </View>
              <Text style={styles.usageLabel}>{device.room || 'No room'}</Text>
            </View>
          );
        })}
        <View style={styles.chartLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#10b981' }]} />
            <Text style={styles.legendText}>Low (0-150W)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#f59e0b' }]} />
            <Text style={styles.legendText}>Medium (150-300W)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#ef4444' }]} />
            <Text style={styles.legendText}>High (300W+)</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderLineChart = () => {
    return (
      <View style={styles.noDataContainer}>
        <MaterialIcons name="show-chart" size={48} color="#6b7280" />
        <Text style={styles.noDataText}>Trend data coming soon</Text>
        <Text style={styles.noDataSubtext}>Use bar chart or room distribution for now</Text>
      </View>
    );
  };

  // ENHANCED: Clickable pie chart with modal
  const renderPieChart = () => {
    const { roomData, totalPower } = getRoomData();
    const activeRooms = Object.entries(roomData).filter(([, data]) => data.activePower > 0);

    if (activeRooms.length === 0) {
      return (
        <View style={styles.noDataContainer}>
          <MaterialIcons name="pie-chart" size={48} color="#6b7280" />
          <Text style={styles.noDataText}>No active devices</Text>
          <Text style={styles.noDataSubtext}>Turn on devices to see room distribution</Text>
        </View>
      );
    }

    if (totalPower === 0) {
      return (
        <View style={styles.noDataContainer}>
          <MaterialIcons name="pie-chart" size={48} color="#6b7280" />
          <Text style={styles.noDataText}>No power usage data</Text>
          <Text style={styles.noDataSubtext}>Add power usage info to devices</Text>
        </View>
      );
    }

    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
    const sortedRooms = activeRooms.sort(([,a], [,b]) => b.activePower - a.activePower);

    return (
      <View style={styles.pieChartContainer}>
        <Text style={styles.chartSubtitle}>Power usage across {sortedRooms.length} rooms</Text>
        
        {/* CLICKABLE Central power indicator */}
        <TouchableOpacity
          style={styles.pieChartCenter}
          onPress={() => {
            setSelectedRoom(null);
            setShowRoomModal(true);
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.pieChartCenterValue}>{totalPower}W</Text>
          <Text style={styles.pieChartCenterLabel}>Tap for details</Text>
        </TouchableOpacity>

        {/* Clickable room breakdown */}
        <View style={styles.pieChartLegend}>
          {sortedRooms.map(([roomName, roomInfo], index) => {
            const percentage = Math.round((roomInfo.activePower / totalPower) * 100);
            return (
              <TouchableOpacity
                key={roomName}
                style={styles.pieChartLegendItem}
                onPress={() => {
                  setSelectedRoom(roomName);
                  setShowRoomModal(true);
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.pieChartLegendDot, { backgroundColor: colors[index % colors.length] }]} />
                <Text style={styles.pieChartLegendText}>
                  {roomName}: {roomInfo.activePower}W ({percentage}%) • {roomInfo.activeDevices}/{roomInfo.totalDevices} active
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        
        <View style={styles.chartInfoBox}>
          <MaterialIcons name="touch-app" size={14} color="#3b82f6" />
          <Text style={styles.chartInfoText}>Tap center or any room for detailed breakdown</Text>
        </View>
      </View>
    );
  };

  // FAST Room Modal
  const renderRoomModal = () => {
    const { roomData, totalPower } = getRoomData();
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

    let displayData = [];
    let modalTitle = '';

    if (selectedRoom && roomData[selectedRoom]) {
      displayData = [{ name: selectedRoom, ...roomData[selectedRoom] }];
      modalTitle = `${selectedRoom} Details`;
    } else {
      displayData = Object.entries(roomData)
        .map(([name, data]) => ({ name, ...data }))
        .filter(room => room.activePower > 0)
        .sort((a, b) => b.activePower - a.activePower);
      modalTitle = 'Room Power Usage';
    }

    const renderRoomItem = ({ item, index }) => {
      const percentage = totalPower > 0 ? Math.round((item.activePower / totalPower) * 100) : 0;
      const color = colors[index % colors.length];

      return (
        <View style={styles.roomModalItem}>
          {/* Room Header */}
          <View style={styles.roomModalHeader}>
            <View style={styles.row}>
              <View style={[styles.roomModalDot, { backgroundColor: color }]} />
              <Text style={styles.roomModalTitle}>{item.name}</Text>
            </View>
            <View>
              <Text style={styles.roomModalPower}>{item.activePower}W</Text>
              <Text style={styles.roomModalPercentage}>{percentage}% of total</Text>
            </View>
          </View>

          {/* Quick Stats */}
          <View style={styles.roomModalStats}>
            <View style={styles.roomModalStat}>
              <MaterialIcons name="devices" size={14} color="#10b981" />
              <Text style={styles.roomModalStatText}>{item.activeDevices}/{item.totalDevices} devices active</Text>
            </View>
            <View style={styles.roomModalStat}>
              <MaterialIcons name="attach-money" size={14} color="#f59e0b" />
              <Text style={styles.roomModalStatText}>R{Math.round(item.activePower * 24 * 30 * 2.5 / 1000)}/month</Text>
            </View>
          </View>

          {/* Device List */}
          <View style={styles.roomModalDevices}>
            <Text style={styles.roomModalDevicesTitle}>Devices in this room:</Text>
            {item.devices.map(device => (
              <View key={device.id} style={styles.roomModalDevice}>
                <MaterialIcons 
                  name={device.status === 'on' ? 'power' : 'power-off'} 
                  size={16} 
                  color={device.status === 'on' ? '#10b981' : '#6b7280'} 
                />
                <Text style={styles.roomModalDeviceName}>{device.name}</Text>
                <Text style={[
                  styles.roomModalDevicePower,
                  device.status === 'off' && { color: '#6b7280' }
                ]}>
                  {device.status === 'on' ? `${device.normal_usage || 0}W` : 'OFF'}
                </Text>
              </View>
            ))}
          </View>
        </View>
      );
    };

    return (
      <Modal
        visible={showRoomModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowRoomModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowRoomModal(false)}>
              <Text style={styles.modalCancel}>Close</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <TouchableOpacity 
              onPress={() => {
                setSelectedRoom(null);
                // Don't close modal, just show all rooms
              }}
            >
              <MaterialIcons name="view-list" size={24} color="#10b981" />
            </TouchableOpacity>
          </View>

          {/* Summary */}
          <View style={styles.modalSummary}>
            <View style={styles.modalSummaryItem}>
              <MaterialIcons name="flash-on" size={20} color="#10b981" />
              <Text style={styles.modalSummaryValue}>{totalPower}W</Text>
              <Text style={styles.modalSummaryLabel}>Total Active</Text>
            </View>
            <View style={styles.modalSummaryItem}>
              <MaterialIcons name="meeting-room" size={20} color="#3b82f6" />
              <Text style={styles.modalSummaryValue}>{displayData.length}</Text>
              <Text style={styles.modalSummaryLabel}>Rooms</Text>
            </View>
            <View style={styles.modalSummaryItem}>
              <MaterialIcons name="attach-money" size={20} color="#f59e0b" />
              <Text style={styles.modalSummaryValue}>R{Math.round(totalPower * 24 * 30 * 2.5 / 1000)}</Text>
              <Text style={styles.modalSummaryLabel}>Monthly</Text>
            </View>
          </View>

          {/* Room List */}
          <FlatList
            data={displayData}
            renderItem={renderRoomItem}
            keyExtractor={item => item.name}
            contentContainerStyle={{ padding: 20, paddingTop: 0 }}
            showsVerticalScrollIndicator={false}
          />
        </SafeAreaView>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
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
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.pageTitle}>Device Analysis</Text>
              <Text style={styles.subtitle}>
                {appliances.length} devices • {appliances.filter(app => app.status === 'on').length} active • Updated: {lastUpdate.toLocaleTimeString()}
              </Text>
            </View>
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </View>

          {/* Statistics Cards */}
          {renderStatsCards()}

          {/* Chart Controls */}
          <View style={styles.chartControls}>
            <Text style={styles.sectionTitle}>Chart Options</Text>
            <View style={styles.chartTypeContainer}>
              {[
                { type: 'bar', icon: 'bar-chart', label: 'Usage' },
                { type: 'pie', icon: 'pie-chart', label: 'Rooms' }
              ].map(chart => (
                <TouchableOpacity
                  key={chart.type}
                  style={[
                    styles.chartTypeButton,
                    chartType === chart.type && styles.chartTypeButtonActive
                  ]}
                  onPress={() => setChartType(chart.type)}
                >
                  <MaterialIcons
                    name={chart.icon}
                    size={16}
                    color={chartType === chart.type ? '#10b981' : '#a1a1aa'}
                  />
                  <Text style={[
                    styles.chartTypeText,
                    chartType === chart.type && styles.chartTypeTextActive
                  ]}>
                    {chart.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Chart Container */}
          <View style={styles.chartContainer}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>
                {chartType === 'bar' && 'Device Usage'}
                {chartType === 'pie' && 'Room Distribution'}
              </Text>
            </View>
            {renderChart()}
          </View>

          {/* All Devices List */}
          <View style={styles.activeDevicesContainer}>
            <Text style={styles.sectionTitle}>
              All Devices ({appliances.filter(app => app.status === 'on').length}/{appliances.length} active)
            </Text>
            
            {appliances.length === 0 ? (
              <View style={styles.noDataContainer}>
                <MaterialIcons name="devices" size={48} color="#6b7280" />
                <Text style={styles.noDataText}>No devices configured</Text>
                <Text style={styles.noDataSubtext}>Add devices in Controls tab</Text>
              </View>
            ) : (
              appliances
                .sort((a, b) => {
                  if (a.status === 'on' && b.status === 'off') return -1;
                  if (a.status === 'off' && b.status === 'on') return 1;
                  return (b.normal_usage || 0) - (a.normal_usage || 0);
                })
                .map(device => (
                  <View key={device.id} style={styles.deviceItem}>
                    <View style={styles.deviceInfo}>
                      <MaterialIcons
                        name={device.status === 'on' ? 'power' : 'power-off'}
                        size={24}
                        color={device.status === 'on' ? '#10b981' : '#6b7280'}
                      />
                      <View style={styles.deviceDetails}>
                        <Text style={styles.deviceName}>{device.name}</Text>
                        <Text style={styles.deviceRoom}>
                          {device.room || 'No room'} • {device.type || 'Unknown'}
                        </Text>
                      </View>
                    </View>
                    <Text style={[
                      styles.devicePower,
                      device.status === 'off' && { color: '#6b7280' }
                    ]}>
                      {device.status === 'on' ? `${device.normal_usage || 0}W` : 'OFF'}
                    </Text>
                  </View>
                ))
            )}
          </View>

          {/* ML Analytics Navigation Button */}
          <TouchableOpacity
            style={styles.fastRefreshButton}
            onPress={navigateToMLAnalytics}
            activeOpacity={0.8}
          >
            <MaterialIcons name="analytics" size={20} color="#ffffff" />
            <Text style={styles.fastRefreshText}>View ML Analytics</Text>
          </TouchableOpacity>

          {/* INSTANT Refresh Button */}
          <TouchableOpacity
            style={styles.fastRefreshButton}
            onPress={onRefresh}
            disabled={refreshing}
            activeOpacity={0.8}
          >
            {refreshing ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <MaterialIcons name="refresh" size={20} color="#ffffff" />
            )}
            <Text style={styles.fastRefreshText}>
              {refreshing ? 'Refreshing...' : 'Instant Refresh'}
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Room Distribution Modal */}
        {renderRoomModal()}
      </Animated.View>
    </SafeAreaView>
  );
}
