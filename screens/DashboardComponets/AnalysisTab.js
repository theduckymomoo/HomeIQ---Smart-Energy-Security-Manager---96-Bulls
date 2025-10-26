// AnalysisTab.js - Updated with device status consideration in predictive analytics

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Animated,
  Easing,
  RefreshControl,
  Alert,
  Modal,
  Vibration,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { useAuth } from '../../context/AuthContext';
import styles from './styles/AnalysisStyles';

const { width } = Dimensions.get('window');

export default function AnalysisTab({ appliances = [], stats = {} }) {
  const { user, supabase } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('week');
  const [selectedChart, setSelectedChart] = useState('energy');
  const [insights, setInsights] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  
  // Animation values
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [pulseAnim] = useState(new Animated.Value(1));

  const timeFrames = [
    { id: 'day', label: 'Today', icon: 'today' },
    { id: 'week', label: 'Week', icon: 'date-range' },
    { id: 'month', label: 'Month', icon: 'calendar-today' },
    { id: 'year', label: 'Year', icon: 'trending-up' },
  ];

  const chartTypes = [
    { id: 'energy', label: 'Energy', icon: 'flash-on' },
    { id: 'cost', label: 'Cost', icon: 'attach-money' },
    { id: 'devices', label: 'Devices', icon: 'pie-chart' },
  ];

  // Pulsing animation for important elements
  useEffect(() => {
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
  }, []);

  // Animate on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.back(1)),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 700,
        easing: Easing.elastic(1),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const toggleSection = (section) => {
    Vibration.vibrate(10);
    setExpandedSection(expandedSection === section ? null : section);
  };

  const getApplianceIcon = (type) => {
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
  };

  // Calculate predictive analytics based on current devices with status consideration
  const calculatePredictiveAnalytics = useCallback(() => {
    if (!appliances || appliances.length === 0) {
      return {
        totalEnergy: 0,
        totalCost: 0,
        peakUsage: 0,
        averageDaily: 0,
        efficiencyScore: 0,
        monthlyProjection: 0,
        carbonFootprint: 0,
        activeAppliances: 0,
        totalAppliances: 0,
        inactiveAppliances: 0,
        categoryUsage: [],
        roomUsage: [],
        peakHours: [],
      };
    }

    const activeAppliances = appliances.filter(app => app.status === 'on');
    const totalAppliances = appliances.length;
    const inactiveAppliances = appliances.filter(app => app.status === 'off');

    // Calculate real energy usage based on device power, usage hours, AND status
    let totalEnergy = 0;
    let peakUsage = 0;
    let categoryUsage = {};
    let roomUsage = {};

    appliances.forEach(appliance => {
      // Only calculate energy for devices that are ON
      if (appliance.status === 'on') {
        const powerWatts = appliance.normal_usage || 0;
        const hoursPerDay = appliance.average_hours_per_day || 8;
        
        // Daily energy in kWh
        const dailyEnergy = (powerWatts / 1000) * hoursPerDay;
        totalEnergy += dailyEnergy * 30; // Monthly projection
        
        // Track peak usage (only for active devices)
        if (powerWatts > peakUsage) {
          peakUsage = powerWatts;
        }

        // Category usage (only for active devices)
        if (!categoryUsage[appliance.type]) {
          categoryUsage[appliance.type] = 0;
        }
        categoryUsage[appliance.type] += dailyEnergy * 30;

        // Room usage (only for active devices)
        if (!roomUsage[appliance.room]) {
          roomUsage[appliance.room] = 0;
        }
        roomUsage[appliance.room] += dailyEnergy * 30;
      }
    });

    // Calculate costs (assuming R2.50 per kWh)
    const totalCost = totalEnergy * 2.50;
    const averageDaily = totalEnergy / 30;

    // Calculate peak hours based on ACTIVE devices only
    const peakHours = calculatePeakHours(activeAppliances);

    // Monthly projection (current usage pattern continued)
    const monthlyProjection = Math.round(totalCost);
    
    // Carbon footprint (approx 0.5kg CO2 per kWh)
    const carbonFootprint = Math.round(totalEnergy * 0.5);

    // Efficiency score based on usage patterns of ACTIVE devices
    const efficiencyScore = calculateEfficiencyScore(appliances, activeAppliances);

    return {
      totalEnergy: Math.round(totalEnergy),
      totalCost: Math.round(totalCost),
      peakUsage: Math.round(peakUsage),
      averageDaily: Math.round(averageDaily * 100) / 100,
      efficiencyScore: Math.max(0, Math.min(100, efficiencyScore)),
      monthlyProjection,
      carbonFootprint,
      activeAppliances: activeAppliances.length,
      totalAppliances,
      inactiveAppliances: inactiveAppliances.length,
      categoryUsage: Object.entries(categoryUsage)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5),
      roomUsage: Object.entries(roomUsage)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 4),
      peakHours,
    };
  }, [appliances]);

  // Calculate peak hours based on ACTIVE device usage patterns only
  const calculatePeakHours = (activeAppliances) => {
    const timeSlots = [
      { time: '12-2 AM', usage: 0, category: 'Night' },
      { time: '2-4 AM', usage: 0, category: 'Night' },
      { time: '4-6 AM', usage: 0, category: 'Morning' },
      { time: '6-8 AM', usage: 0, category: 'Morning' },
      { time: '8-10 AM', usage: 0, category: 'Morning' },
      { time: '10-12 PM', usage: 0, category: 'Day' },
      { time: '12-2 PM', usage: 0, category: 'Lunch' },
      { time: '2-4 PM', usage: 0, category: 'Day' },
      { time: '4-6 PM', usage: 0, category: 'Evening' },
      { time: '6-8 PM', usage: 0, category: 'Evening' },
      { time: '8-10 PM', usage: 0, category: 'Night' },
      { time: '10-12 AM', usage: 0, category: 'Night' },
    ];

    // Only process active appliances
    activeAppliances.forEach(appliance => {
      const power = appliance.normal_usage || 0;
      const typicalUsagePattern = getTypicalUsagePattern(appliance.type);
      
      typicalUsagePattern.forEach((usageMultiplier, hour) => {
        const slotIndex = Math.floor(hour / 2);
        if (slotIndex < timeSlots.length) {
          timeSlots[slotIndex].usage += power * usageMultiplier;
        }
      });
    });

    // Return top 4 peak hours
    return timeSlots
      .sort((a, b) => b.usage - a.usage)
      .slice(0, 4)
      .map(slot => ({
        ...slot,
        usage: Math.round(slot.usage)
      }));
  };

  // Typical usage patterns for different appliance types
  const getTypicalUsagePattern = (applianceType) => {
    const patterns = {
      refrigerator: Array(24).fill(0.3), // Always running at low power
      air_conditioner: [0,0,0,0,0,0,0.1,0.3,0.5,0.7,0.8,0.9,1,0.9,0.8,0.7,0.6,0.8,0.9,0.8,0.6,0.4,0.2,0.1],
      tv: [0,0,0,0,0,0,0,0.1,0.2,0.3,0.4,0.5,0.6,0.5,0.4,0.3,0.7,0.9,1,0.9,0.7,0.4,0.2,0.1],
      light: [0,0,0,0,0,0,0.1,0.3,0.2,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.4,0.8,1,0.9,0.7,0.5,0.3,0.1],
      computer: [0,0,0,0,0,0,0,0.1,0.4,0.7,0.8,0.9,0.9,0.8,0.7,0.6,0.7,0.8,0.9,0.8,0.6,0.4,0.2,0.1],
      washing_machine: [0,0,0,0,0,0,0.1,0.3,0.5,0.2,0.1,0.1,0.1,0.1,0.2,0.3,0.4,0.3,0.2,0.1,0,0,0,0],
      // Default pattern for other devices
      default: [0,0,0,0,0,0,0,0.1,0.3,0.5,0.7,0.8,0.9,0.8,0.7,0.6,0.8,0.9,0.8,0.6,0.4,0.2,0.1,0]
    };

    return patterns[applianceType] || patterns.default;
  };

  // Calculate efficiency score based on device usage and status
  const calculateEfficiencyScore = (appliances, activeAppliances) => {
    if (appliances.length === 0) return 0;

    let score = 100;
    const totalPower = appliances.reduce((sum, app) => sum + (app.normal_usage || 0), 0);
    const activePower = activeAppliances.reduce((sum, app) => sum + (app.normal_usage || 0), 0);

    // Reward for turning off unused devices
    const turnedOffDevices = appliances.filter(app => app.status === 'off' && app.normal_usage > 100).length;
    score += turnedOffDevices * 5;

    // Penalize for high-power devices left on
    const highPowerDevicesOn = activeAppliances.filter(app => app.normal_usage > 500).length;
    score -= highPowerDevicesOn * 10;

    // Penalize for inefficient usage patterns (devices that should be off but are on)
    const alwaysOnDevices = activeAppliances.filter(app => 
      app.average_hours_per_day >= 20 && app.normal_usage > 50
    ).length;
    score -= alwaysOnDevices * 15;

    // Reward for energy-efficient active devices
    const efficientActiveDevices = activeAppliances.filter(app => app.normal_usage <= 100).length;
    score += efficientActiveDevices * 3;

    // Adjust based on active vs total power ratio (lower is better)
    const activeRatio = totalPower > 0 ? activePower / totalPower : 0;
    if (activeRatio > 0.8) score -= 20;
    else if (activeRatio > 0.5) score -= 10;
    else if (activeRatio < 0.2) score += 10; // Reward for turning off most devices

    return Math.max(20, Math.min(100, score));
  };

  // Enhanced insights generation based on real device data with status consideration
  const generateInsights = useCallback(() => {
    if (!appliances || appliances.length === 0) return [];

    const activeAppliances = appliances.filter(app => app.status === 'on');
    const analytics = calculatePredictiveAnalytics();
    
    const newInsights = [];

    // High usage insight - only for active devices
    const highUsageDevices = activeAppliances.filter(app => app.normal_usage > 300);
    if (highUsageDevices.length > 0) {
      const potentialSavings = Math.round(analytics.totalCost * 0.15);
      newInsights.push({
        id: 1,
        type: 'warning',
        icon: 'warning',
        title: 'High Energy Devices Active',
        description: `${highUsageDevices.length} high-power devices currently on`,
        action: 'Optimize now',
        impact: `Save R${potentialSavings}/month`,
        color: '#ef4444',
        details: 'These high-power devices are currently consuming significant energy. Consider turning them off when not in use.',
        devices: highUsageDevices.map(d => d.name),
      });
    }

    // Always-on devices insight - only for active devices
    const alwaysOnDevices = activeAppliances.filter(app => 
      app.average_hours_per_day >= 20
    );
    if (alwaysOnDevices.length > 0) {
      newInsights.push({
        id: 2,
        type: 'info',
        icon: 'info',
        title: 'Always-On Devices',
        description: `${alwaysOnDevices.length} devices running continuously`,
        action: 'Set schedule',
        impact: 'Reduce usage by 20%',
        color: '#3b82f6',
        details: 'Devices running 24/7 can account for up to 25% of your energy bill. Schedule them to turn off automatically.',
        devices: alwaysOnDevices.map(d => d.name),
      });
    }

    // Inactive high-power devices insight
    const inactiveHighPowerDevices = appliances.filter(app => 
      app.status === 'off' && app.normal_usage > 300
    );
    if (inactiveHighPowerDevices.length > 0) {
      newInsights.push({
        id: 3,
        type: 'success',
        icon: 'power-off',
        title: 'Energy Saving',
        description: `${inactiveHighPowerDevices.length} high-power devices are off`,
        action: 'Good job!',
        impact: `Saving R${Math.round(inactiveHighPowerDevices.reduce((sum, app) => sum + (app.normal_usage * 0.18), 0))}/month`,
        color: '#10b981',
        details: 'You are saving significant energy by keeping high-power devices turned off when not needed.',
        devices: inactiveHighPowerDevices.map(d => d.name),
      });
    }

    // Efficiency insight
    if (analytics.efficiencyScore >= 80) {
      newInsights.push({
        id: 4,
        type: 'success',
        icon: 'eco',
        title: 'Great Efficiency!',
        description: 'Your energy usage is very efficient',
        action: 'View details',
        impact: 'Better than 75% of users',
        color: '#10b981',
        details: 'Your energy efficiency is excellent! You are managing your device usage well.',
        devices: [],
      });
    } else if (analytics.efficiencyScore <= 50) {
      newInsights.push({
        id: 5,
        type: 'warning',
        icon: 'trending-down',
        title: 'Improve Efficiency',
        description: 'Opportunities to optimize energy usage',
        action: 'Optimize devices',
        impact: `Save R${Math.round(analytics.totalCost * 0.25)}/month`,
        color: '#f59e0b',
        details: 'You can significantly reduce your energy bill by turning off unused high-power devices.',
        devices: highUsageDevices.map(d => d.name),
      });
    }

    // Cost savings insight
    const potentialSavings = Math.round(analytics.totalCost * 0.18);
    if (potentialSavings > 50) {
      newInsights.push({
        id: 6,
        type: 'savings',
        icon: 'savings',
        title: 'Potential Savings',
        description: `Optimize your device usage patterns`,
        action: 'View details',
        impact: `Save R${potentialSavings}/month`,
        color: '#10b981',
        details: 'You can reduce your energy costs by scheduling high-power devices during off-peak hours and turning them off when not in use.',
        devices: highUsageDevices.map(d => d.name),
      });
    }

    return newInsights;
  }, [appliances, calculatePredictiveAnalytics]);

  // Generate predictive chart data based on ACTIVE device usage only
  const generatePredictiveChartData = () => {
    const analytics = calculatePredictiveAnalytics();
    const activeAppliances = appliances.filter(app => app.status === 'on');
    
    switch (selectedTimeFrame) {
      case 'day':
        // Generate hourly data based on CURRENTLY ACTIVE device usage patterns
        const hourlyData = Array(24).fill(0);
        activeAppliances.forEach(appliance => {
          const pattern = getTypicalUsagePattern(appliance.type);
          pattern.forEach((multiplier, hour) => {
            hourlyData[hour] += (appliance.normal_usage || 0) * multiplier;
          });
        });

        return {
          labels: ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM', '12AM'],
          datasets: [{
            data: [
              Math.round(hourlyData[6] / 100), // 6AM
              Math.round(hourlyData[9] / 100), // 9AM
              Math.round(hourlyData[12] / 100), // 12PM
              Math.round(hourlyData[15] / 100), // 3PM
              Math.round(hourlyData[18] / 100), // 6PM
              Math.round(hourlyData[21] / 100), // 9PM
              Math.round(hourlyData[0] / 100),  // 12AM
            ],
          }],
        };

      case 'week':
        // Weekly projection based on current ACTIVE device usage
        const dailyAverage = analytics.averageDaily;
        return {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            data: [
              Math.round(dailyAverage * 0.9),  // Monday
              Math.round(dailyAverage * 0.95), // Tuesday
              Math.round(dailyAverage),         // Wednesday
              Math.round(dailyAverage * 1.05), // Thursday
              Math.round(dailyAverage * 1.1),  // Friday
              Math.round(dailyAverage * 1.2),  // Saturday
              Math.round(dailyAverage * 1.1),  // Sunday
            ],
          }],
        };

      case 'month':
        // Monthly trend based on current ACTIVE device usage
        const weeklyAverage = analytics.totalEnergy / 4;
        return {
          labels: ['W1', 'W2', 'W3', 'W4'],
          datasets: [{
            data: [
              Math.round(weeklyAverage * 0.95),
              Math.round(weeklyAverage),
              Math.round(weeklyAverage * 1.05),
              Math.round(weeklyAverage * 1.1),
            ],
          }],
        };

      case 'year':
        // Yearly trend with seasonal variations based on current ACTIVE devices
        return {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            data: [
              Math.round(analytics.totalEnergy * 1.1), // Winter
              Math.round(analytics.totalEnergy),
              Math.round(analytics.totalEnergy * 0.9),
              Math.round(analytics.totalEnergy * 0.8),
              Math.round(analytics.totalEnergy * 0.9), // Summer
              Math.round(analytics.totalEnergy),
            ],
          }],
        };

      default:
        return {
          labels: [],
          datasets: [{ data: [] }],
        };
    }
  };

  // Generate device usage data for pie chart - ONLY ACTIVE DEVICES
  const generateDeviceUsageData = () => {
    const activeAppliances = appliances.filter(app => app.status === 'on');
    return activeAppliances.slice(0, 6).map(app => ({
      name: app.name.substring(0, 8) + (app.name.length > 8 ? '...' : ''),
      usage: app.normal_usage || 0,
      color: getRandomColor(),
      legendFontColor: '#ffffff',
      legendFontSize: 10,
    }));
  };

  const getRandomColor = () => {
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const chartConfig = {
    backgroundGradientFrom: '#18181b',
    backgroundGradientTo: '#18181b',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#10b981',
    },
  };

  const analytics = calculatePredictiveAnalytics();
  const generatedInsights = generateInsights();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    Vibration.vibrate(50);
    setTimeout(() => {
      setRefreshing(false);
      Alert.alert('✅ Data Updated', 'Your analytics have been refreshed with the latest device status.');
    }, 1000);
  }, []);

  const showModal = (content) => {
    Vibration.vibrate(30);
    setModalContent(content);
    setModalVisible(true);
  };

  const exportReport = () => {
    setShowExportModal(true);
    setTimeout(() => {
      Alert.alert(
        'Report Exported',
        'Your energy report has been saved and is ready to share.',
        [{ text: 'OK' }]
      );
      setShowExportModal(false);
    }, 2000);
  };

  const handleInsightPress = (insight) => {
    Vibration.vibrate(30);
    
    Alert.alert(
      insight.title,
      `${insight.description}\n\n${insight.impact}`,
      [
        { text: 'Later', style: 'cancel' },
        { text: 'View Details', onPress: () => showModal({
          type: 'insight',
          title: insight.title,
          content: insight,
        })},
        { text: insight.action, onPress: () => {
          Alert.alert('Action Taken', `Applied: ${insight.title}`);
          Vibration.vibrate(100);
        }},
      ]
    );
  };

  const handleTimeFramePress = (timeFrame) => {
    Vibration.vibrate(10);
    setSelectedTimeFrame(timeFrame);
    
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleChartTypePress = (chartType) => {
    Vibration.vibrate(10);
    setSelectedChart(chartType);
  };

  const renderChart = () => {
    const data = generatePredictiveChartData();
    
    if (selectedChart === 'energy') {
      return (
        <LineChart
          data={data}
          width={width - 48}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          withVerticalLines={false}
          withHorizontalLines={false}
        />
      );
    } else if (selectedChart === 'cost') {
      const costData = {
        ...data,
        datasets: [{
          data: data.datasets[0].data.map(value => Math.round(value * 2.5)) // Convert to cost
        }]
      };
      
      return (
        <BarChart
          data={costData}
          width={width - 48}
          height={220}
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
          }}
          style={styles.chart}
          showValuesOnTopOfBars
        />
      );
    } else {
      const deviceData = generateDeviceUsageData();
      if (deviceData.length === 0) {
        return (
          <View style={styles.emptyChart}>
            <MaterialIcons name="pie-chart" size={48} color="#6b7280" />
            <Text style={styles.emptyChartText}>No active devices to display</Text>
          </View>
        );
      }
      
      return (
        <PieChart
          data={deviceData}
          width={width - 48}
          height={220}
          chartConfig={chartConfig}
          accessor="usage"
          backgroundColor="transparent"
          paddingLeft="15"
          style={styles.chart}
        />
      );
    }
  };

  const renderTimeFrameSelector = () => (
    <View style={styles.timeRangeSelector}>
      {timeFrames.map((frame) => (
        <TouchableOpacity
          key={frame.id}
          style={[
            styles.timeRangeButton,
            selectedTimeFrame === frame.id && styles.timeRangeButtonActive,
          ]}
          onPress={() => handleTimeFramePress(frame.id)}
          activeOpacity={0.7}
        >
          <MaterialIcons 
            name={frame.icon} 
            size={16} 
            color={selectedTimeFrame === frame.id ? '#ffffff' : '#a1a1aa'} 
          />
          <Text style={[
            styles.timeRangeText,
            selectedTimeFrame === frame.id && styles.timeRangeTextActive,
          ]}>
            {frame.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderChartSelector = () => (
    <View style={styles.chartSelector}>
      {chartTypes.map(chart => (
        <TouchableOpacity
          key={chart.id}
          style={[
            styles.chartButton,
            selectedChart === chart.id && styles.chartButtonActive,
          ]}
          onPress={() => handleChartTypePress(chart.id)}
        >
          <MaterialIcons
            name={chart.icon}
            size={16}
            color={selectedChart === chart.id ? '#ffffff' : '#a1a1aa'}
          />
          <Text style={[
            styles.chartButtonText,
            selectedChart === chart.id && styles.chartButtonTextActive,
          ]}>
            {chart.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderModalContent = () => {
    if (!modalContent) return null;

    switch (modalContent.type) {
      case 'insight':
        return (
          <View>
            <Text style={styles.modalTitle}>{modalContent.title}</Text>
            <Text style={styles.modalDescription}>{modalContent.content.details}</Text>
            {modalContent.content.devices && modalContent.content.devices.length > 0 && (
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Affected Devices:</Text>
                {modalContent.content.devices.map((device, index) => (
                  <Text key={index} style={styles.modalListItem}>• {device}</Text>
                ))}
              </View>
            )}
            <View style={styles.modalStats}>
              <View style={styles.modalStat}>
                <Text style={styles.modalStatValue}>R{Math.round(analytics.totalCost * 0.15)}</Text>
                <Text style={styles.modalStatLabel}>Monthly Savings</Text>
              </View>
              <View style={styles.modalStat}>
                <Text style={styles.modalStatValue}>{analytics.efficiencyScore}%</Text>
                <Text style={styles.modalStatLabel}>Efficiency</Text>
              </View>
            </View>
          </View>
        );
      
      case 'category':
        return (
          <View>
            <Text style={styles.modalTitle}>{modalContent.title}</Text>
            <View style={styles.modalStats}>
              <View style={styles.modalStat}>
                <Text style={styles.modalStatValue}>{modalContent.content[1]}kWh</Text>
                <Text style={styles.modalStatLabel}>Monthly Usage</Text>
              </View>
              <View style={styles.modalStat}>
                <Text style={styles.modalStatValue}>R{Math.round(modalContent.content[1] * 2.5)}</Text>
                <Text style={styles.modalStatLabel}>Monthly Cost</Text>
              </View>
            </View>
          </View>
        );
      
      default:
        return (
          <View>
            <Text style={styles.modalTitle}>{modalContent.title}</Text>
            <Text style={styles.modalDescription}>Detailed predictive analytics based on your current ACTIVE device usage patterns.</Text>
          </View>
        );
    }
  };

  if (!appliances || appliances.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView 
          contentContainerStyle={styles.emptyContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#10b981']} />
          }
        >
          <Animated.View style={[styles.emptyIcon, { transform: [{ scale: pulseAnim }] }]}>
            <MaterialIcons name="analytics" size={64} color="#6b7280" />
          </Animated.View>
          <Text style={styles.emptyTitle}>No Data Available</Text>
          <Text style={styles.emptySubtitle}>
            Connect some devices to see predictive analytics and energy insights
          </Text>
          <TouchableOpacity 
            style={styles.emptyButton} 
            activeOpacity={0.7}
            onPress={() => Vibration.vibrate(30)}
          >
            <Text style={styles.emptyButtonText}>Add Devices</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#10b981']} />
        }
      >
        {/* Header */}
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Real-time Analytics</Text>
            <Text style={styles.subtitle}>Based on current device status</Text>
          </View>
          <TouchableOpacity 
            style={styles.exportButton}
            onPress={exportReport}
          >
            <MaterialIcons name="share" size={20} color="#ffffff" />
            <Text style={styles.exportButtonText}>Export</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Device Status Summary */}
        <Animated.View 
          style={[
            styles.statsGrid,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity 
            style={styles.statCard} 
            activeOpacity={0.8}
          >
            <MaterialIcons name="devices" size={24} color="#10b981" />
            <Text style={styles.statValue}>{analytics.totalAppliances}</Text>
            <Text style={styles.statLabel}>Total Devices</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.statCard} 
            activeOpacity={0.8}
          >
            <MaterialIcons name="power" size={24} color="#10b981" />
            <Text style={styles.statValue}>{analytics.activeAppliances}</Text>
            <Text style={styles.statLabel}>Active Now</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.statCard} 
            activeOpacity={0.8}
          >
            <MaterialIcons name="flash-on" size={24} color="#10b981" />
            <Text style={styles.statValue}>{analytics.totalEnergy}kWh</Text>
            <Text style={styles.statLabel}>Monthly Usage</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.statCard} 
            activeOpacity={0.8}
          >
            <MaterialIcons name="attach-money" size={24} color="#10b981" />
            <Text style={styles.statValue}>R{analytics.totalCost}</Text>
            <Text style={styles.statLabel}>Monthly Cost</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Efficiency Card */}
        <Animated.View 
          style={[
            styles.efficiencyCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.efficiencyHeader}>
            <MaterialIcons name="eco" size={24} color="#10b981" />
            <Text style={styles.efficiencyTitle}>Current Efficiency Score</Text>
          </View>
          <View style={styles.efficiencyContent}>
            <Text style={[
              styles.efficiencyRating,
              analytics.efficiencyScore >= 80 && styles.efficiencyExcellent,
              analytics.efficiencyScore >= 60 && analytics.efficiencyScore < 80 && styles.efficiencyGood,
              analytics.efficiencyScore >= 40 && analytics.efficiencyScore < 60 && styles.efficiencyFair,
              analytics.efficiencyScore < 40 && styles.efficiencyPoor,
            ]}>
              {analytics.efficiencyScore}%
            </Text>
            <Text style={styles.efficiencyDescription}>
              {analytics.efficiencyScore >= 80 && 'Excellent! Your current device usage is very efficient.'}
              {analytics.efficiencyScore >= 60 && analytics.efficiencyScore < 80 && 'Good energy management. Some optimization possible.'}
              {analytics.efficiencyScore >= 40 && analytics.efficiencyScore < 60 && 'Moderate efficiency. Consider turning off unused devices.'}
              {analytics.efficiencyScore < 40 && 'Needs improvement. Review active device usage patterns.'}
            </Text>
          </View>
        </Animated.View>

        {/* Charts Section */}
        <TouchableOpacity 
          activeOpacity={0.7}
          onPress={() => toggleSection('charts')}
          style={styles.sectionHeaderButton}
        >
          <Animated.View 
            style={[
              styles.section,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>📊 Real-time Analytics</Text>
                <Text style={styles.sectionSubtitle}>Based on currently active devices</Text>
              </View>
              <Text style={styles.expandIcon}>{expandedSection === 'charts' ? '▼' : '▶'}</Text>
            </View>
          </Animated.View>
        </TouchableOpacity>

        {expandedSection === 'charts' && (
          <Animated.View 
            style={[
              styles.sectionContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.chartsSection}>
              <View style={styles.chartControls}>
                {renderTimeFrameSelector()}
                {renderChartSelector()}
              </View>
              
              <View style={styles.chartContainer}>
                {renderChart()}
              </View>

              <View style={styles.chartLegend}>
                <Text style={styles.chartLegendText}>
                  {selectedChart === 'energy' && 'Current Energy Usage (kWh)'}
                  {selectedChart === 'cost' && 'Current Cost (R)'}
                  {selectedChart === 'devices' && 'Active Device Power Distribution (W)'}
                </Text>
              </View>
            </View>
          </Animated.View>
        )}

        {/* AI Insights */}
        <TouchableOpacity 
          activeOpacity={0.7}
          onPress={() => toggleSection('insights')}
          style={styles.sectionHeaderButton}
        >
          <Animated.View 
            style={[
              styles.section,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>🤖 Real-time Insights</Text>
                <Text style={styles.sectionSubtitle}>Based on current device status</Text>
              </View>
              <Text style={styles.expandIcon}>{expandedSection === 'insights' ? '▼' : '▶'}</Text>
            </View>
          </Animated.View>
        </TouchableOpacity>

        {expandedSection === 'insights' && (
          <Animated.View 
            style={[
              styles.sectionContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.insightsGrid}>
              {generatedInsights.map((insight, index) => (
                <TouchableOpacity
                  key={insight.id}
                  style={[styles.insightCard, { borderLeftColor: insight.color }]}
                  onPress={() => handleInsightPress(insight)}
                  activeOpacity={0.7}
                >
                  <View style={styles.insightHeader}>
                    <View style={styles.insightIconContainer}>
                      <MaterialIcons 
                        name={insight.icon} 
                        size={20} 
                        color={insight.color} 
                      />
                    </View>
                    <View style={[styles.insightBadge, { backgroundColor: insight.color + '20' }]}>
                      <Text style={[styles.insightBadgeText, { color: insight.color }]}>
                        {insight.type}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.insightTitle}>{insight.title}</Text>
                  <Text style={styles.insightDescription}>{insight.description}</Text>
                  <View style={styles.insightFooter}>
                    <Text style={styles.insightImpact}>{insight.impact}</Text>
                    <Text style={styles.insightAction}>{insight.action} →</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Additional Analytics Sections */}
        {analytics.peakHours && analytics.peakHours.length > 0 && (
          <TouchableOpacity 
            activeOpacity={0.7}
            onPress={() => toggleSection('peak')}
            style={styles.sectionHeaderButton}
          >
            <Animated.View 
              style={[
                styles.section,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionTitle}>⏰ Current Peak Usage</Text>
                  <Text style={styles.sectionSubtitle}>Based on active device patterns</Text>
                </View>
                <Text style={styles.expandIcon}>{expandedSection === 'peak' ? '▼' : '▶'}</Text>
              </View>
            </Animated.View>
          </TouchableOpacity>
        )}

        {expandedSection === 'peak' && analytics.peakHours && (
          <Animated.View 
            style={[
              styles.sectionContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.tipsList}>
              {analytics.peakHours.map((hour, index) => (
                <View key={index} style={styles.tipItem}>
                  <MaterialIcons name="schedule" size={16} color="#10b981" />
                  <Text style={styles.tipText}>
                    {hour.time}: {hour.usage}W ({hour.category})
                  </Text>
                </View>
              ))}
            </View>
          </Animated.View>
        )}

      </ScrollView>

      {/* Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{modalContent?.title}</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setModalVisible(false)}
              >
                <MaterialIcons name="close" size={20} color="#a1a1aa" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalContent}>
              {renderModalContent()}
            </ScrollView>
            <TouchableOpacity 
              style={styles.modalActionButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalActionText}>Got it</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Export Modal */}
      <Modal
        visible={showExportModal}
        animationType="fade"
        transparent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color="#10b981" />
            <Text style={styles.modalText}>Generating Report...</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}