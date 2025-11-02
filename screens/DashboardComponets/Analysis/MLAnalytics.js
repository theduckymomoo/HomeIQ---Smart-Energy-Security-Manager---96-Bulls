import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../../context/AuthContext';
import { useRoute } from '@react-navigation/native';
import mlService from '../../MLEngine/MLService';
import MLDataViewer from '../../MLEngine/MLDataViewer';
import SimulationControls from '../../Simulation/SimulationControls';
import styles from './MLAnaStyles';

const AnalyticsTab = ({ appliances: propAppliances, stats: propStats }) => {
  const { user, supabase } = useAuth();
  const route = useRoute();
  
  const [appliances, setAppliances] = useState(propAppliances || route.params?.appliances || []);
  const [stats, setStats] = useState(propStats || route.params?.stats || {});
  const [insights, setInsights] = useState({
    ready: false,
    predictions: [],
    recommendations: [],
    anomalies: { hasAnomaly: false, anomalies: [] },
    accuracy: 0,
    dataSamples: 0,
    dayPatterns: 0,
    averageDayAccuracy: 0,
    samplingMode: 'daily',
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showDataViewer, setShowDataViewer] = useState(false);
  const [showSimulationControls, setShowSimulationControls] = useState(false);
  const [expandedPredictions, setExpandedPredictions] = useState({});
  const [trainingProgress, setTrainingProgress] = useState({
    progress: 0,
    current: 0,
    required: 7,
    canTrain: false,
    samplingMode: 'daily',
  });

  const fetchAppliances = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('appliances')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      
      if (data && data.length > 0) {
        setAppliances(data);
        
        const active = data.filter(app => app.status === 'on');
        const totalPower = active.reduce((sum, app) => sum + (app.normal_usage || 0), 0);
        
        setStats({
          totalPower: Math.round(totalPower),
          activeDevices: active.length,
          peakUsage: Math.max(stats.peakUsage || 0, totalPower),
          efficiency: totalPower > 1500 ? 'Poor' : totalPower > 1000 ? 'Fair' : totalPower > 500 ? 'Good' : 'Excellent',
          monthlyCost: Math.round((totalPower / 1000) * 24 * 30 * 2.5),
          dailyUsage: Math.round((totalPower / 1000) * 24 * 100) / 100
        });
      }
    } catch (error) {
      console.error('Error fetching appliances:', error);
    }
  };

  const initializeMLService = async () => {
    try {
      if (!user?.id) {
        console.warn('No user available for ML service');
        return false;
      }

      console.log(`Initializing ML Service for user: ${user.id}`);
      mlService.setCurrentUser(user.id, supabase);
      const initResult = await mlService.initialize(user.id, supabase);

      if (!initResult.success) {
        console.error('ML Service initialization failed:', initResult.error);
        return false;
      }

      console.log('✅ ML Service initialized successfully');
      return true;
    } catch (error) {
      console.error('Error initializing ML Service:', error);
      return false;
    }
  };

  useEffect(() => {
    const initAndLoad = async () => {
      setLoading(true);
      
      if (appliances.length === 0) {
        await fetchAppliances();
      }
      
      const initialized = await initializeMLService();
      if (initialized) {
        await loadAnalytics();
      } else {
        setLoading(false);
      }
    };

    if (user?.id) {
      initAndLoad();
    }

    const interval = setInterval(() => {
      if (mlService.hasCurrentUser()) {
        loadAnalytics();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [user?.id]);

  const loadAnalytics = async () => {
    try {
      if (!mlService.hasCurrentUser()) {
        console.warn('ML Service not available');
        setLoading(false);
        return;
      }

      const mlInsights = mlService.getMLInsights(appliances || []);
      const progress = mlService.getTrainingProgress();

      setInsights(mlInsights);
      setTrainingProgress(progress);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAppliances();
    const initialized = await initializeMLService();
    if (initialized) {
      await loadAnalytics();
    } else {
      setRefreshing(false);
    }
  };

  const handlePlanDay = async () => {
    if (!mlService.hasCurrentUser()) {
      Alert.alert('ML Engine Setup Required', 'Please wait while we set up your ML engine.');
      return;
    }

    if (!appliances || appliances.length === 0) {
      await fetchAppliances();
    }

    if (!appliances || appliances.length === 0) {
      Alert.alert('No Devices Found', 'Please add some appliances in the Controls tab first.');
      return;
    }

    setShowSimulationControls(true);
  };

  const startSimpleSimulation = async () => {
    try {
      if (!mlService.hasCurrentUser()) {
        Alert.alert('ML Engine Setup Required', 'Please initialize the ML engine first.');
        return;
      }

      if (!appliances || appliances.length === 0) {
        await fetchAppliances();
      }

      if (!appliances || appliances.length === 0) {
        Alert.alert('No Devices Found', 'Please add appliances to generate training data.');
        return;
      }

      setLoading(true);
      
      const initResult = mlService.initializeSimulation(appliances);
      if (!initResult.success) {
        throw new Error(initResult.error);
      }

      const result = await mlService.fastForwardSimulation(7, (progress) => {
        console.log(`Simulation progress: ${progress.progress}%`);
      });

      if (result.success) {
        Alert.alert(
          'Simulation Complete!',
          `Generated ${result.samplesGenerated} day patterns over ${result.simulatedDays} days.`,
          [{ text: 'Great!', onPress: loadAnalytics }]
        );
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Simulation error:', error);
      Alert.alert('Simulation Error', error.message || 'Failed to generate simulation data');
    } finally {
      setLoading(false);
    }
  };

  const trainModelsDirectly = async () => {
    try {
      if (!mlService.hasCurrentUser()) {
        Alert.alert('ML Engine Error', 'ML Engine not available.');
        return;
      }

      setLoading(true);
      const result = await mlService.trainModels();

      if (result.success) {
        Alert.alert(
          'Training Complete!',
          `Day patterns: ${result.dayPatternsTrained || 0}\nAccuracy: ${(result.trainingAccuracy * 100).toFixed(1)}%`,
          [{ text: 'Excellent!', onPress: loadAnalytics }]
        );
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Training error:', error);
      Alert.alert('Training Error', error.message || 'Failed to train models');
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear Training Data',
      'This will delete all ML training data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await mlService.clearUserData();

              if (user?.id) {
                mlService.setCurrentUser(user.id, supabase);
                await mlService.initialize(user.id, supabase);
              }

              await loadAnalytics();
              Alert.alert('Cleared', 'Training data cleared successfully.');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data: ' + error.message);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const togglePredictionExpansion = (index) => {
    setExpandedPredictions(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <MaterialIcons name="analytics" size={32} color="#10b981" />
        <Text style={styles.title}>ML Analytics</Text>
      </View>
      <View style={styles.statusContainer}>
        <View style={styles.statusBadge}>
          <View style={[styles.statusDot, { backgroundColor: insights.ready ? '#10b981' : '#f59e0b' }]} />
          <Text style={styles.statusText}>{insights.ready ? 'Ready' : 'Learning'}</Text>
        </View>
        {insights.accuracy > 0 && (
          <View style={styles.statusBadge}>
            <MaterialIcons name="check-circle" size={14} color="#10b981" />
            <Text style={styles.statusText}>{(insights.accuracy * 100).toFixed(1)}%</Text>
          </View>
        )}
        <View style={styles.statusBadge}>
          <MaterialIcons name="calendar-today" size={14} color="#3b82f6" />
          <Text style={styles.statusText}>Daily Mode</Text>
        </View>
      </View>
    </View>
  );

  const renderTrainingProgress = () => (
    <View style={styles.statsContainer}>
      <Text style={styles.sectionTitle}>Training Progress</Text>
      <Text style={styles.subtitle}>
        {trainingProgress.current} / {trainingProgress.required} days ({trainingProgress.progress}%)
      </Text>
      <Text style={styles.helperText}>
        Day patterns provide richer, more accurate training data
      </Text>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${trainingProgress.progress}%` }]} />
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{insights.dayPatterns}</Text>
          <Text style={styles.statLabel}>Day Patterns</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{Math.floor((insights.dataSamples || 0) / 24)}</Text>
          <Text style={styles.statLabel}>Full Days</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{insights.predictions?.length || 0}</Text>
          <Text style={styles.statLabel}>Predictions</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{insights.recommendations?.length || 0}</Text>
          <Text style={styles.statLabel}>Tips</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{(insights.accuracy * 100).toFixed(0)}%</Text>
          <Text style={styles.statLabel}>Accuracy</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{insights.ready ? 'Ready' : 'Learning'}</Text>
          <Text style={styles.statLabel}>Status</Text>
        </View>
      </View>

      <View style={styles.chartControls}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.chartTypeContainer}>
          <TouchableOpacity
            style={[styles.chartTypeButton, styles.chartTypeButtonActive]}
            onPress={startSimpleSimulation}
            disabled={loading}
          >
            <MaterialIcons name="fast-forward" size={16} color="#10b981" />
            <Text style={[styles.chartTypeText, styles.chartTypeTextActive]}>Quick Generate</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.chartTypeButton}
            onPress={handlePlanDay}
            disabled={loading}
          >
            <MaterialIcons name="calendar-today" size={16} color="#a1a1aa" />
            <Text style={styles.chartTypeText}>Plan Day</Text>
          </TouchableOpacity>

          {trainingProgress.canTrain && (
            <TouchableOpacity
              style={styles.chartTypeButton}
              onPress={trainModelsDirectly}
              disabled={loading}
            >
              <MaterialIcons name="school" size={16} color="#a1a1aa" />
              <Text style={styles.chartTypeText}>Train</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.fastRefreshButton, { backgroundColor: '#ef4444' }]}
        onPress={handleClearData}
        disabled={loading}
      >
        <MaterialIcons name="delete-forever" size={20} color="#ffffff" />
        <Text style={styles.fastRefreshText}>Clear Training Data</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPredictions = () => {
    if (!insights.predictions || insights.predictions.length === 0) {
      return (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="insights" size={22} color="#3b82f6" />
            <Text style={styles.sectionTitle}>Device Predictions</Text>
          </View>
          <View style={styles.emptyState}>
            <MaterialIcons name="insights" size={56} color="#3f3f46" />
            <Text style={styles.emptyStateText}>No predictions available</Text>
            <Text style={styles.emptyStateSubtext}>
              {!mlService.hasCurrentUser() ? 'Setting up ML engine...' : 'Generate patterns to get predictions'}
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="insights" size={22} color="#3b82f6" />
          <Text style={styles.sectionTitle}>Device Predictions</Text>
        </View>
        <Text style={styles.helperText}>Based on {insights.dayPatterns} day patterns</Text>
        
        {insights.predictions.slice(0, 5).map((prediction, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <Text style={styles.cardTitle}>{prediction.deviceName}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <MaterialIcons 
                    name={prediction.prediction.willBeActive ? 'check-circle' : 'cancel'} 
                    size={14} 
                    color={prediction.prediction.willBeActive ? '#10b981' : '#ef4444'} 
                  />
                  <Text style={styles.cardSubtitle}>
                    {prediction.prediction.willBeActive ? 'Active' : 'Inactive'} • {Math.round(prediction.prediction.probability * 100)}% likely
                  </Text>
                </View>
              </View>
              <Text style={styles.cardValue}>{Math.round(prediction.prediction.expectedPower)}W</Text>
            </View>

            {prediction.prediction.nextStateChange && (
              <View style={styles.cardContent}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <MaterialIcons 
                    name={prediction.prediction.nextStateChange.action === 'turn_on' ? 'power-settings-new' : 'power-off'} 
                    size={16} 
                    color="#10b981" 
                  />
                  <Text style={styles.cardContentText}>
                    {prediction.prediction.nextStateChange.timeLabel} ({prediction.prediction.nextStateChange.hoursFromNow}h)
                  </Text>
                </View>
              </View>
            )}

            {prediction.prediction.energyImpact && (
              <View style={styles.cardFooter}>
                <Text style={styles.cardFooterText}>
                  {prediction.prediction.energyImpact.totalHoursOn}h • {prediction.prediction.energyImpact.totalEnergyKwh}kWh • R{prediction.prediction.energyImpact.totalCost}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.expandButton}
              onPress={() => togglePredictionExpansion(index)}
            >
              <MaterialIcons
                name={expandedPredictions[index] ? 'expand-less' : 'expand-more'}
                size={20}
                color="#3b82f6"
              />
              <Text style={styles.expandButtonText}>
                {expandedPredictions[index] ? 'Less' : 'More'} Details
              </Text>
            </TouchableOpacity>

            {expandedPredictions[index] && (
              <View style={styles.expandedContent}>
                {prediction.prediction.nextStateChange && (
                  <View style={styles.expandedSection}>
                    <Text style={styles.expandedLabel}>Details</Text>
                    <Text style={styles.expandedText}>{prediction.prediction.nextStateChange.reason}</Text>
                  </View>
                )}

                <View style={styles.expandedSection}>
                  <Text style={styles.expandedLabel}>Confidence</Text>
                  <Text style={styles.expandedText}>
                    {Math.round(prediction.prediction.confidence * 100)}% • {prediction.prediction.predictionMethod === 'day_based' ? 'Day patterns' : 'Hourly fallback'}
                  </Text>
                </View>
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderRecommendations = () => {
    if (!insights.recommendations || insights.recommendations.length === 0) {
      return (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="lightbulb" size={22} color="#f59e0b" />
            <Text style={styles.sectionTitle}>Recommendations</Text>
          </View>
          <View style={styles.emptyState}>
            <MaterialIcons name="lightbulb" size={56} color="#3f3f46" />
            <Text style={styles.emptyStateText}>No recommendations yet</Text>
            <Text style={styles.emptyStateSubtext}>Generate patterns to get insights</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="lightbulb" size={22} color="#f59e0b" />
          <Text style={styles.sectionTitle}>Recommendations</Text>
        </View>
        {insights.recommendations.map((rec, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{rec.type.replace(/_/g, ' ')}</Text>
              {rec.potentialSavings > 0 && (
                <Text style={styles.cardValue}>R{rec.potentialSavings}/mo</Text>
              )}
            </View>
            <Text style={styles.cardContentText}>{rec.suggestion}</Text>
            {rec.data?.basedOnDays && (
              <View style={styles.cardFooter}>
                <Text style={styles.cardFooterText}>Based on {rec.data.basedOnDays} day patterns</Text>
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderQuickActions = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <MaterialIcons name="bolt" size={22} color="#8b5cf6" />
        <Text style={styles.sectionTitle}>Quick Actions</Text>
      </View>
      <View style={styles.buttonGrid}>
        <TouchableOpacity style={styles.actionButton} onPress={onRefresh} disabled={loading}>
          <MaterialIcons name="refresh" size={20} color="#10b981" />
          <Text style={styles.actionButtonText}>Refresh</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handlePlanDay} disabled={loading}>
          <MaterialIcons name="calendar-today" size={20} color="#10b981" />
          <Text style={styles.actionButtonText}>Plan Day</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => setShowDataViewer(true)} disabled={loading}>
          <MaterialIcons name="data-usage" size={20} color="#10b981" />
          <Text style={styles.actionButtonText}>View Data</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleClearData} disabled={loading}>
          <MaterialIcons name="delete" size={20} color="#10b981" />
          <Text style={styles.actionButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={styles.loadingText}>
            {!mlService.hasCurrentUser() ? 'Setting up ML Engine...' : 'Loading Analytics...'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10b981" colors={['#10b981']} />
        }
        showsVerticalScrollIndicator={false}
      >
        {renderHeader()}
        {renderTrainingProgress()}
        {renderPredictions()}
        {renderRecommendations()}
        {renderQuickActions()}
      </ScrollView>

      <MLDataViewer
        visible={showDataViewer}
        onClose={() => setShowDataViewer(false)}
        userId={user?.id || 'unknown'}
      />

      <SimulationControls
        visible={showSimulationControls}
        onClose={() => setShowSimulationControls(false)}
        appliances={appliances || []}
        onSimulationUpdate={loadAnalytics}
      />
    </SafeAreaView>
  );
};

export default AnalyticsTab;
