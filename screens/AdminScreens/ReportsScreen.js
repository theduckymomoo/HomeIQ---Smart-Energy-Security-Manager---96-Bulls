// FILE: ReportsScreen.js

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');

export default function ReportsScreen() {
  const navigation = useNavigation();
  const { supabase } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('week'); // week, month, year
  const [reportData, setReportData] = useState({
    totalEnergy: 0,
    totalCost: 0,
    topDevice: 'N/A',
    avgDailyUsage: 0,
    peakHour: 'N/A',
    savings: 0,
  });

  useEffect(() => {
    fetchReportData();
  }, [selectedPeriod]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      // Simulated data - replace with actual Supabase queries
      const { data, error } = await supabase
        .from('energy_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      // Process data based on selected period
      setReportData({
        totalEnergy: 487.5,
        totalCost: 1265.50,
        topDevice: 'Air Conditioner',
        avgDailyUsage: 69.6,
        peakHour: '18:00 - 20:00',
        savings: 15.2,
      });
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const ReportCard = ({ icon, title, value, subtitle, color, trend }) => (
    <View style={[styles.reportCard, { borderLeftColor: color }]}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
          <MaterialIcons name={icon} size={24} color={color} />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardValue}>{value}</Text>
          {subtitle && <Text style={styles.cardSubtitle}>{subtitle}</Text>}
        </View>
        {trend && (
          <View style={styles.trendContainer}>
            <MaterialIcons 
              name={trend > 0 ? 'trending-up' : 'trending-down'} 
              size={20} 
              color={trend > 0 ? '#10b981' : '#ef4444'} 
            />
            <Text style={[styles.trendText, { color: trend > 0 ? '#10b981' : '#ef4444' }]}>
              {Math.abs(trend)}%
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  const ExportButton = ({ title, icon, format }) => (
    <TouchableOpacity 
      style={styles.exportButton}
      onPress={() => alert(`Exporting ${format} report...`)}
    >
      <MaterialIcons name={icon} size={20} color="#8b5cf6" />
      <Text style={styles.exportButtonText}>{title}</Text>
    </TouchableOpacity>
  );

  const InsightCard = ({ icon, title, description, color }) => (
    <View style={styles.insightCard}>
      <View style={[styles.insightIcon, { backgroundColor: `${color}20` }]}>
        <MaterialIcons name={icon} size={24} color={color} />
      </View>
      <View style={styles.insightContent}>
        <Text style={styles.insightTitle}>{title}</Text>
        <Text style={styles.insightDescription}>{description}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Reports & Analytics</Text>
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
        <Text style={styles.headerTitle}>Reports & Analytics</Text>
        <TouchableOpacity onPress={() => alert('Download report')}>
          <MaterialIcons name="file-download" size={24} color="#8b5cf6" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Period Selector */}
          <View style={styles.periodContainer}>
            <Text style={styles.sectionTitle}>Time Period</Text>
            <View style={styles.periodButtons}>
              {['week', 'month', 'year'].map(period => (
                <TouchableOpacity
                  key={period}
                  style={[
                    styles.periodButton,
                    selectedPeriod === period && styles.periodButtonActive
                  ]}
                  onPress={() => setSelectedPeriod(period)}
                >
                  <Text style={[
                    styles.periodButtonText,
                    selectedPeriod === period && styles.periodButtonTextActive
                  ]}>
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Key Metrics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Metrics</Text>
            
            <ReportCard
              icon="bolt"
              title="Total Energy Consumption"
              value={`${reportData.totalEnergy} kWh`}
              subtitle={`Avg: ${reportData.avgDailyUsage} kWh/day`}
              color="#f59e0b"
              trend={-8.5}
            />
            
            <ReportCard
              icon="payments"
              title="Total Cost"
              value={`R${reportData.totalCost.toFixed(2)}`}
              subtitle="South African Rand"
              color="#10b981"
              trend={-12.3}
            />
            
            <ReportCard
              icon="devices"
              title="Top Energy Consumer"
              value={reportData.topDevice}
              subtitle="45% of total usage"
              color="#ef4444"
            />
            
            <ReportCard
              icon="schedule"
              title="Peak Usage Time"
              value={reportData.peakHour}
              subtitle="Evening hours"
              color="#3b82f6"
            />
            
            <ReportCard
              icon="savings"
              title="Estimated Savings"
              value={`${reportData.savings}%`}
              subtitle="Compared to last period"
              color="#8b5cf6"
              trend={15.2}
            />
          </View>

          {/* AI Insights */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>AI Insights</Text>
            
            <InsightCard
              icon="lightbulb"
              title="Energy Saving Opportunity"
              description="Your AC runs 3 hours longer than similar households. Consider scheduling auto-off at 10 PM to save R85/month."
              color="#f59e0b"
            />
            
            <InsightCard
              icon="trending-down"
              title="Usage Pattern Detected"
              description="Peak usage shifted to evening hours. Your energy cost increased by 8% this week."
              color="#ef4444"
            />
            
            <InsightCard
              icon="check-circle"
              title="Great Progress!"
              description="You've reduced standby power consumption by 22% compared to last month."
              color="#10b981"
            />
          </View>

          {/* Export Options */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Export Reports</Text>
            <View style={styles.exportGrid}>
              <ExportButton title="PDF Report" icon="picture-as-pdf" format="PDF" />
              <ExportButton title="CSV Data" icon="table-chart" format="CSV" />
              <ExportButton title="Email Report" icon="email" format="Email" />
              <ExportButton title="Share" icon="share" format="Share" />
            </View>
          </View>

          {/* Quick Stats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Statistics</Text>
            <View style={styles.quickStatsGrid}>
              <View style={styles.quickStatCard}>
                <MaterialIcons name="wb-sunny" size={28} color="#f59e0b" />
                <Text style={styles.quickStatValue}>287</Text>
                <Text style={styles.quickStatLabel}>Hours Active</Text>
              </View>
              <View style={styles.quickStatCard}>
                <MaterialIcons name="eco" size={28} color="#10b981" />
                <Text style={styles.quickStatValue}>42 kg</Text>
                <Text style={styles.quickStatLabel}>CO₂ Saved</Text>
              </View>
              <View style={styles.quickStatCard}>
                <MaterialIcons name="show-chart" size={28} color="#3b82f6" />
                <Text style={styles.quickStatValue}>94%</Text>
                <Text style={styles.quickStatLabel}>Efficiency</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
    paddingLeft: 4,
  },
  periodContainer: {
    marginBottom: 24,
  },
  periodButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  periodButtonActive: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#a1a1aa',
  },
  periodButtonTextActive: {
    color: '#ffffff',
  },
  reportCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    color: '#a1a1aa',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#71717a',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontSize: 14,
    fontWeight: '600',
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  insightIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  insightDescription: {
    fontSize: 14,
    color: '#a1a1aa',
    lineHeight: 20,
  },
  exportGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#8b5cf6',
    width: (width - 48) / 2,
  },
  exportButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  quickStatsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickStatCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  quickStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 8,
  },
  quickStatLabel: {
    fontSize: 12,
    color: '#a1a1aa',
    marginTop: 4,
    textAlign: 'center',
  },
});
