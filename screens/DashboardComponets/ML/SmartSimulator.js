import React, { useState, useEffect, useCallback } from 'react';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Switch,
} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './SmartSimulatorStyles';
import { useAuth } from '../../../context/AuthContext';

// Import ML Service with error handling
let mlService;
try {
  mlService = require('../../MLEngine/MLService').default;
} catch (error) {
  console.warn('MLService not found, using mock service');
  // Mock ML Service for development
  mlService = {
    getCurrentEngine: () => null,
    getSimulationStatus: () => ({ simulatedDays: 0 }),
    initializeSimulation: () => ({ success: true }),
    fastForwardSimulation: () => Promise.resolve({ success: true, dayPatternsGenerated: 0, status: { simulatedDays: 0 } }),
    trainModels: () => Promise.resolve({ success: true, accuracy: 0.5 }),
    clearUserData: () => Promise.resolve({ success: true }),
  };
}

export default function SmartSimulator({ onClose }) {
  // State Management
  const { user, supabase } = useAuth();
  const [activeTab, setActiveTab] = useState('simulate');
  const [isSimulating, setIsSimulating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [simulatedDays, setSimulatedDays] = useState(0);
  const [mlStats, setMlStats] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [appliances, setAppliances] = useState([]);

  // Simulation Settings
  const [simulationSettings, setSimulationSettings] = useState({
    days: 7,
    includeWeekends: true,
    variationPercent: 15,
    behaviorRealism: 80,
    autoTrain: true,
  });

  // Predictions
  const [predictions, setPredictions] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);

  // Fetch appliances
  const fetchAppliances = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('appliances')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setAppliances(data || []);
    } catch (error) {
      console.error('Error fetching appliances:', error);
    }
  }, [user?.id, supabase]);

  // Load ML Stats
  const loadMLStats = useCallback(async () => {
    try {
      const engine = mlService.getCurrentEngine();
      if (!engine) {
        setMlStats({
          accuracy: 0,
          confidence: 0,
          predictionsMade: 0,
        });
        return;
      }

      const metrics = engine.getModelMetrics();
      const status = mlService.getSimulationStatus();

      setMlStats({
        ...metrics,
        ...status,
        accuracy: Math.round(metrics.accuracy * 100),
        confidence: Math.round(engine.getPredictionConfidence() * 100),
      });
      setSimulatedDays(status.simulatedDays || 0);
    } catch (error) {
      console.error('Error loading ML stats:', error);
      setMlStats({
        accuracy: 0,
        confidence: 0,
        predictionsMade: 0,
      });
    }
  }, []);

  // Load Predictions
  const loadPredictions = useCallback(async () => {
    try {
      const engine = mlService.getCurrentEngine();
      if (!engine || !appliances.length) {
        setPredictions([]);
        return;
      }

      const forecast = engine.getEnergyForecast(appliances, 24);
      if (forecast.success) {
        setPredictions(forecast.forecast || []);
      }
    } catch (error) {
      console.error('Error loading predictions:', error);
      setPredictions([]);
    }
  }, [appliances]);

  // Initialize
  useEffect(() => {
    fetchAppliances();
    loadMLStats();
  }, [fetchAppliances, loadMLStats]);

  useEffect(() => {
    if (appliances.length > 0) {
      loadPredictions();
    }
  }, [appliances, loadPredictions]);

  // Run Simulation
  const runSimulation = async () => {
    if (appliances.length === 0) {
      Alert.alert('No Devices', 'Please add devices first to run simulation');
      return;
    }

    try {
      setIsSimulating(true);
      setProgress(0);

      // Initialize simulation
      const initResult = mlService.initializeSimulation(appliances);
      if (!initResult.success) {
        Alert.alert('Error', 'Failed to initialize simulation');
        return;
      }

      // Fast-forward simulation
      const result = await mlService.fastForwardSimulation(
        simulationSettings.days,
        (progressUpdate) => {
          setProgress(progressUpdate.progress || 0);
          setSimulatedDays(progressUpdate.day || 0);
        }
      );

      if (result.success) {
        Alert.alert(
          'Simulation Complete',
          `Generated ${result.dayPatternsGenerated} day patterns\n` +
          `ML Engine ${result.status.simulatedDays} days trained\n` +
          `Accuracy: ${Math.round((mlStats?.accuracy || 0))}%`
        );
        await loadMLStats();
        await loadPredictions();
      }
    } catch (error) {
      Alert.alert('Simulation Error', error.message);
    } finally {
      setIsSimulating(false);
      setProgress(0);
    }
  };

  // Train Models
  const trainModels = async () => {
    try {
      setRefreshing(true);
      const result = await mlService.trainModels();
      if (result.success) {
        Alert.alert(
          'Training Complete',
          `Models trained successfully\nAccuracy: ${Math.round((result.accuracy || 0) * 100)}%`
        );
        await loadMLStats();
        await loadPredictions();
      } else {
        Alert.alert('Training Error', result.error || 'Unknown error');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setRefreshing(false);
    }
  };

  // Clear Data
  const clearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all ML training data. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            const result = await mlService.clearUserData();
            if (result.success) {
              Alert.alert('Success', 'All data cleared');
              await loadMLStats();
              setPredictions([]);
            }
          },
        },
      ]
    );
  };

  // Get Device Prediction
  const getDevicePrediction = (device) => {
    const engine = mlService.getCurrentEngine();
    if (!engine) return null;

    const currentHour = new Date().getHours();
    try {
      return engine.predictDeviceUsage(device, currentHour);
    } catch {
      return null;
    }
  };

  // Render Simulation Tab
  const renderSimulationTab = () => (
    <ScrollView style={styles.tabContent} contentContainerStyle={styles.scrollContent}>
      {/* ML Status Card */}
      <View style={styles.statusCard}>
        <Text style={styles.sectionTitle}>ML Engine Status</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Training Data</Text>
            <Text style={styles.statValue}>{simulatedDays} days</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Accuracy</Text>
            <Text style={styles.statValue}>{mlStats?.accuracy || 0}%</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Confidence</Text>
            <Text style={styles.statValue}>{mlStats?.confidence || 0}%</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Predictions</Text>
            <Text style={styles.statValue}>{mlStats?.predictionsMade || 0}</Text>
          </View>
        </View>
      </View>

      {/* Simulation Settings */}
      <View style={styles.settingsCard}>
        <Text style={styles.sectionTitle}>Simulation Settings</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Days to Simulate</Text>
          <View style={styles.daySelector}>
            {[3, 7, 14, 30].map((days) => (
              <TouchableOpacity
                key={days}
                style={[
                  styles.dayButton,
                  simulationSettings.days === days && styles.dayButtonActive
                ]}
                onPress={() => setSimulationSettings(prev => ({ ...prev, days }))}
              >
                <Text style={[
                  styles.dayButtonText,
                  simulationSettings.days === days && styles.dayButtonTextActive
                ]}>
                  {days}d
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Include Weekends</Text>
          <Switch
            value={simulationSettings.includeWeekends}
            onValueChange={(value) =>
              setSimulationSettings(prev => ({ ...prev, includeWeekends: value }))
            }
            trackColor={{ false: '#27272a', true: '#10b981' }}
            thumbColor="#ffffff"
          />
        </View>

        <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
          <Text style={styles.settingLabel}>Auto-train after simulation</Text>
          <Switch
            value={simulationSettings.autoTrain}
            onValueChange={(value) =>
              setSimulationSettings(prev => ({ ...prev, autoTrain: value }))
            }
            trackColor={{ false: '#27272a', true: '#10b981' }}
            thumbColor="#ffffff"
          />
        </View>
      </View>

      {/* Simulation Progress */}
      {isSimulating && (
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Simulating...</Text>
          <Text style={styles.progressText}>
            Day {simulatedDays} of {simulationSettings.days}
          </Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressPercent}>{progress}%</Text>
        </View>
      )}

      {/* Info Card */}
      <View style={styles.infoCard}>
        <MaterialIcons name="info" size={20} color="#3b82f6" />
        <Text style={styles.infoText}>
          Simulations generate realistic device usage patterns based on your current devices. 
          The more data you generate, the better the ML predictions become.
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.primaryButton, isSimulating && styles.buttonDisabled]}
          onPress={runSimulation}
          disabled={isSimulating}
        >
          {isSimulating ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <MaterialIcons name="play-arrow" size={20} color="#ffffff" />
          )}
          <Text style={styles.buttonText}>
            {isSimulating ? 'Simulating...' : 'Run Simulation'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryButton, refreshing && styles.buttonDisabled]}
          onPress={trainModels}
          disabled={refreshing}
        >
          {refreshing ? (
            <ActivityIndicator color="#10b981" />
          ) : (
            <MaterialIcons name="school" size={20} color="#10b981" />
          )}
          <Text style={styles.secondaryButtonText}>Train Models</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  // Render Predictions Tab
  const renderPredictionsTab = () => (
    <ScrollView style={styles.tabContent} contentContainerStyle={styles.scrollContent}>
      {/* 24-Hour Forecast */}
      <View style={styles.forecastCard}>
        <Text style={styles.sectionTitle}>24-Hour Energy Forecast</Text>
        {predictions.length > 0 ? (
          <View style={styles.chartContainer}>
            {predictions.map((pred, index) => {
              const height = Math.max(20, (pred.expectedPower / 500) * 100);
              return (
                <View key={index} style={styles.barContainer}>
                  <Text style={styles.barValue}>{pred.expectedPower}W</Text>
                  <LinearGradient
                    colors={['#10b981', '#059669']}
                    style={[styles.bar, { height: `${height}%` }]}
                  />
                  <Text style={styles.barLabel}>{pred.hour}h</Text>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <MaterialIcons name="show-chart" size={48} color="#a1a1aa" />
            <Text style={styles.emptyText}>No predictions available</Text>
            <Text style={styles.emptySubtext}>Run simulation first</Text>
          </View>
        )}
      </View>

      {/* Device Predictions */}
      <View style={styles.devicesCard}>
        <Text style={styles.sectionTitle}>Device Predictions</Text>
        {appliances.length > 0 ? (
          appliances.map((device) => {
            const prediction = getDevicePrediction(device);
            return (
              <TouchableOpacity
                key={device.id}
                style={styles.deviceCard}
                onPress={() => setSelectedDevice(device)}
              >
                <View style={styles.deviceHeader}>
                  <View style={styles.deviceInfo}>
                    <Text style={styles.deviceName}>{device.name || device.type}</Text>
                    <Text style={styles.deviceType}>{device.type}</Text>
                  </View>
                  {prediction && (
                    <View style={styles.predictionBadge}>
                      <Text style={styles.predictionText}>
                        {Math.round(prediction.probability * 100)}%
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <MaterialIcons name="devices" size={48} color="#a1a1aa" />
            <Text style={styles.emptyText}>No devices found</Text>
            <Text style={styles.emptySubtext}>Add devices in Controls tab</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );

  // Render Settings Tab
  const renderSettingsTab = () => (
    <ScrollView style={styles.tabContent} contentContainerStyle={styles.scrollContent}>
      <View style={styles.settingsCard}>
        <Text style={styles.sectionTitle}>Data Management</Text>
        
        <TouchableOpacity style={styles.actionButton} onPress={loadMLStats}>
          <MaterialIcons name="refresh" size={20} color="#10b981" />
          <Text style={styles.actionButtonText}>Refresh Stats</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={clearData}>
          <MaterialIcons name="delete-forever" size={20} color="#ef4444" />
          <Text style={[styles.actionButtonText, { color: '#ef4444' }]}>Clear All Data</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoCard}>
        <MaterialIcons name="lightbulb" size={20} color="#3b82f6" />
        <Text style={styles.infoText}>
          The ML engine learns from your device usage patterns to make intelligent
          predictions and optimize energy consumption. More data = better predictions.
        </Text>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <MaterialIcons name="close" size={24} color="#ffffff" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Smart Simulator</Text>
          <Text style={styles.headerSubtitle}>ML-Powered Predictions</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'simulate' && styles.activeTab]}
          onPress={() => setActiveTab('simulate')}
        >
          <MaterialIcons 
            name="play-circle-filled" 
            size={16} 
            color={activeTab === 'simulate' ? '#10b981' : '#a1a1aa'} 
          />
          <Text style={[styles.tabText, activeTab === 'simulate' && styles.activeTabText]}>
            Simulate
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'predictions' && styles.activeTab]}
          onPress={() => setActiveTab('predictions')}
        >
          <MaterialIcons 
            name="show-chart" 
            size={16} 
            color={activeTab === 'predictions' ? '#10b981' : '#a1a1aa'} 
          />
          <Text style={[styles.tabText, activeTab === 'predictions' && styles.activeTabText]}>
            Predictions
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'settings' && styles.activeTab]}
          onPress={() => setActiveTab('settings')}
        >
          <MaterialIcons 
            name="settings" 
            size={16} 
            color={activeTab === 'settings' ? '#10b981' : '#a1a1aa'} 
          />
          <Text style={[styles.tabText, activeTab === 'settings' && styles.activeTabText]}>
            Settings
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeTab === 'simulate' && renderSimulationTab()}
      {activeTab === 'predictions' && renderPredictionsTab()}
      {activeTab === 'settings' && renderSettingsTab()}
    </SafeAreaView>
  );
}
