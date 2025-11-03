import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View, Text, ScrollView, Animated, RefreshControl, Alert, Modal,
  Vibration, ActivityIndicator, Dimensions, TouchableOpacity, Button
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import {
  LineChart, PieChart, BarChart
} from 'react-native-chart-kit';
import PropTypes from 'prop-types';
import { useAuth } from '../../context/AuthContext';
import * as Progress from 'react-native-progress';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const screenWidth = width - 32;

// --- DARK THEME + GLOW STYLES ---
const darkTheme = {
  bg: "#17181C",
  card: "#21242B",
  pale: "#10b981", // Neon green (kept only as color, not glow)
  text: "#E5E7EB",
  heading: "#f8f9f9ff",
  glow: "#10b981", // unused as glow, kept for icons/accent
  error: "#fb7185",
  accent: "#67e8f9",
  piePalette: ["#84cc16", "#f8f9f9ff", "#a21caf", "#c026d3", "#fde047", "#34d399", "#db2777"],
};

const styles = {
  root: { flex: 1, backgroundColor: darkTheme.bg },
  header: {
    fontSize: 26,
    fontWeight: '800',
    margin: 16,
    color: darkTheme.heading,
    letterSpacing: 1.4
  },
  statCard: {
    backgroundColor: darkTheme.card,
    margin: 10,
    flex: 1,
    alignItems: 'center',
    borderRadius: 13,
    padding: 18,
    borderWidth: 2.5,
    borderColor: darkTheme.pale, // keep as plain accent, no glow
  },
  statValue: {
    fontSize: 26,
    fontWeight: 'bold',
    color: darkTheme.pale,
    // textShadowColor: darkTheme.glow, // REMOVE
    // textShadowRadius: 12,           // REMOVE
  },
  statLabel: {
    color: '#f8f9f9ff',
    fontWeight: '600',
    fontSize: 13,
    marginTop: 6,
    opacity: 0.9
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 13
  },
  section: {
    backgroundColor: darkTheme.card,
    margin: 14,
    borderRadius: 16,
    padding: 14,
    borderColor: darkTheme.pale, // just accent border
    borderWidth: 3,
    // shadowColor: darkTheme.glow,      // REMOVE
    // shadowOpacity: 0.85,              // REMOVE
    // shadowRadius: 15,                 // REMOVE
    // shadowOffset: { width: 0, height: 0 }, // REMOVE
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
    backgroundColor: darkTheme.bg
  },
  loadingText: {
    fontSize: 17,
    color: darkTheme.heading,
    marginTop: 15,
    textAlign: 'center'
  },
  glowingBtn: {
    backgroundColor: "#111827",
    borderRadius: 10,
    padding: 14,
    margin: 13,
    alignItems: "center",
    borderWidth: 2,
    borderColor: darkTheme.pale,
    // shadowColor: darkTheme.glow,      // REMOVE
    // shadowOpacity: 0.99,              // REMOVE
    // shadowRadius: 10,                 // REMOVE
  }
};


const StatCard = React.memo(({ icon, val, label }) => (
  <View style={styles.statCard}>
    <MaterialIcons name={icon} size={36} color={darkTheme.glow} />
    <Text style={styles.statValue}>{val}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
));

export default function AnalysisTab({ appliances = [], stats = {} }) {
  const { user } = useAuth();

  const [refreshing, setRefreshing] = useState(false);
  const [goal] = useState(500);
  const [activeMode, setActiveMode] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);

  const [applianceStates, setApplianceStates] = useState(() =>
    Array.isArray(appliances) ? appliances.map(a => ({ ...a })) : []
  );
  useEffect(() => {
    setApplianceStates(Array.isArray(appliances) ? appliances.map(a => ({ ...a })) : []);
  }, [appliances]);

  // --- Analytics ---
  const [analytics, setAnalytics] = useState({
    totalEnergy: 0, totalCost: 0, peakUsage: 0, averageDaily: 0, efficiencyScore: 0,
    monthlyProjection: 0, carbonFootprint: 0, activeAppliances: 0, totalAppliances: 0,
    inactiveAppliances: 0, categoryUsage: [], peakHours: [],
  });
  useEffect(() => {
    if (!applianceStates?.length) {
      setAnalytics({
        totalEnergy: 0, totalCost: 0, peakUsage: 0, averageDaily: 0, efficiencyScore: 0,
        monthlyProjection: 0, carbonFootprint: 0, activeAppliances: 0, totalAppliances: 0,
        inactiveAppliances: 0, categoryUsage: [], peakHours: [],
      });
      return;
    }
    const active = applianceStates.filter(a => a.status === 'on');
    let totalEnergy = 0, peak = 0, catMap = {};
    applianceStates.forEach(a => {
      if (a.status === 'on') {
        const kWh = ((a.normal_usage || 0) * (a.average_hours_per_day || 8) * 30) / 1000;
        totalEnergy += kWh;
        if (a.normal_usage > peak) peak = a.normal_usage;
        if (!catMap[a.type]) catMap[a.type] = 0;
        catMap[a.type] += a.normal_usage || 0;
      }
    });
    const totalCost = totalEnergy * 2.5;
    setAnalytics({
      totalEnergy: Math.round(totalEnergy),
      totalCost: Math.round(totalCost),
      peakUsage: Math.round(peak),
      averageDaily: Math.round((totalEnergy / 30) * 100) / 100,
      efficiencyScore: 85 + Math.floor(Math.random() * 11),
      monthlyProjection: Math.round(totalCost * 1.05),
      carbonFootprint: Math.round(totalEnergy * 0.5),
      activeAppliances: active.length,
      totalAppliances: applianceStates.length,
      inactiveAppliances: applianceStates.length - active.length,
      categoryUsage: Object.entries(catMap).sort(([, a], [, b]) => b - a),
      peakHours: [],
    });
  }, [applianceStates]);

  // --- Animation ---
  const fadeAnim = useMemo(() => new Animated.Value(0), []);
  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }).start();
  }, [fadeAnim]);

  // --- Derived Data ---
  const efficiencyTrendData = useMemo(() => {
    const score = analytics.efficiencyScore;
    return [Math.max(score - 6, 0), Math.max(score - 3, 0), Math.max(score - 1, 0), score];
  }, [analytics.efficiencyScore]);
  const categoryUsageArr = useMemo(
    () => analytics.categoryUsage.map(([cat, watts], i) => ({
      name: cat,
      population: watts,
      color: darkTheme.piePalette[i % darkTheme.piePalette.length],
      legendFontColor: darkTheme.text,
      legendFontSize: 14
    })),
    [analytics.categoryUsage]
  );

  // --- Chart Config ---
  const chartConfig = {
    backgroundColor: darkTheme.card,
    backgroundGradientFrom: "#23272e",
    backgroundGradientTo: "#23272e",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(52,255,100,${opacity})`,
    labelColor: (opacity = 1) => darkTheme.text,
    style: { borderRadius: 15 },
    propsForDots: { r: "7", strokeWidth: "3", stroke: "#64ffda" }
  };

  const barData = useMemo(() => ({
    labels: analytics.categoryUsage.map(([cat]) => cat),
    datasets: [{ data: analytics.categoryUsage.map(([, watts]) => watts) }],
  }), [analytics.categoryUsage]);

  // --- Recommendations ---
  const recommendations = [];
  if (analytics.efficiencyScore < 80) recommendations.push('⚡ Boost efficiency: unplug idle devices and optimise schedules.');
  if (analytics.peakUsage > 2500) recommendations.push('⚠️ Consider staggering high-usage devices for lower peaks.');
  if (analytics.totalCost > goal) recommendations.push(`💰 Exceeding target by R${(analytics.totalCost - goal).toFixed(0)}!`);

  // --- Defensive: No Data Quick Exit ---
  if (!applianceStates?.length) {
    return (
      <View style={styles.loadingContainer}>
        <MaterialIcons name="error-outline" size={54} color={darkTheme.glow} style={{ margin: 9 }} />
        <Text style={styles.loadingText}>No device data yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => setRefreshing(false)} tintColor={darkTheme.pale} />
      }>
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.header}>Analytics</Text>
          <View style={styles.statsGrid}>
            <StatCard icon="devices" val={analytics.totalAppliances} label="Total Devices" />
            <StatCard icon="power" val={analytics.activeAppliances} label="Active Now" />
            <StatCard icon="flash-on" val={analytics.totalEnergy} label="Monthly Usage" />
            <StatCard icon="attach-money" val={`R${analytics.totalCost}`} label="Monthly Cost" />
          </View>

          {/* Efficiency Trend (Line Chart) */}
          <View style={styles.section}>
            <Text style={{ color: darkTheme.heading, fontWeight: 'bold', fontSize: 17, marginBottom: 9 }}>Efficiency Trend</Text>
            <LineChart
              data={{
                labels: ['-3', '-2', '-1', 'Now'],
                datasets: [{ data: efficiencyTrendData }]
              }}
              width={screenWidth - 10}
              height={170}
              yAxisSuffix="%"
              chartConfig={chartConfig}
              bezier
              style={{ borderRadius: 13, marginVertical: 3 }}
            />
          </View>

          {/* Category Breakdown (Pie Chart & Bar Chart) */}
          <View style={[styles.section, { marginBottom: 5 }]}>
            <Text style={{ color: darkTheme.pale, fontWeight: '800', fontSize: 16 }}>Category Usage Breakdown</Text>
            <PieChart
              data={categoryUsageArr}
              width={screenWidth - 10}
              height={170}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              center={[10, 0]}
              hasLegend={true}
              style={{ marginVertical: 12, borderRadius: 19 }}
            />
            <BarChart
              data={barData}
              width={screenWidth - 10}
              height={170}
              fromZero
              showValuesOnTopOfBars
              chartConfig={{
                ...chartConfig,
                color: (opacity = 1) => `rgba(132,250,176,${opacity})`,
                fillShadowGradient: darkTheme.glow,
                fillShadowGradientOpacity: 0.7,
              }}
              style={{ marginTop: 6, borderRadius: 19 }}
            />
          </View>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <View style={[styles.section, { borderColor: darkTheme.error, borderWidth: 2.2 }]}>
              <Text style={{ color: darkTheme.error, fontWeight: "bold" }}>Smart Recommendations</Text>
              {recommendations.map((rec, i) => <Text key={i} style={{ color: "#fff", marginTop: 4 }}>{rec}</Text>)}
            </View>
          )}

          {/* Example glowing export button */}
          <TouchableOpacity style={styles.glowingBtn} onPress={() => Alert.alert('Export', 'Export pressed!')}>
            <Text style={{ color: darkTheme.glow, fontWeight: 'bold' }}>Export & Share Report</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

AnalysisTab.propTypes = {
  appliances: PropTypes.arrayOf(PropTypes.object),
  stats: PropTypes.object,
};
AnalysisTab.defaultProps = {
  appliances: [],
  stats: {},
};
