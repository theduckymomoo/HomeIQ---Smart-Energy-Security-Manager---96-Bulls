import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
  Alert,
  Switch,
  TextInput,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './SimulationStyles';
import mlService from '../MLEngine/MLService';

const { width } = Dimensions.get('window');

export default function SimulationControls({ visible, onClose, appliances, onSimulationUpdate }) {
  const [selectedTab, setSelectedTab] = useState('planner');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [deviceSchedules, setDeviceSchedules] = useState({});
  const [dayType, setDayType] = useState('weekday');
  const [isFastForwarding, setIsFastForwarding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentDays, setCurrentDays] = useState(0);

  const [globalSettings, setGlobalSettings] = useState({
    simulationDays: 1,
    variationPercent: 15,
    includeWeekends: true,
    randomEvents: true,
    userBehaviorRealism: 80,
  });

  const [dayPresets] = useState({
    workday: 'Standard work from home day',
    weekend: 'Relaxed weekend day',
    vacation: 'Home all day vacation',
    away: 'Away from home most of day',
  });

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const progress = await mlService.getTrainingProgress();
        setCurrentDays(progress.current || 0);
      } catch (error) {
        console.log('Could not fetch progress:', error);
      }
    };

    if (visible) {
      fetchProgress();
    }
  }, [visible, isFastForwarding]);

  useEffect(() => {
    if (visible && appliances.length > 0) {
      initializeSchedules();
    }
  }, [visible, appliances]);

  const initializeSchedules = () => {
    const schedules = {};
    appliances.forEach(device => {
      schedules[device.id] = {
        deviceName: device.name,
        deviceType: device.type,
        power: device.normal_usage || 100,
        weekdaySchedule: getSmartDefaultSchedule(device.type),
        weekendSchedule: getSmartDefaultSchedule(device.type, true),
        priority: getPriority(device.type),
        automation: {
          enabled: false,
          conditions: [],
        },
      };
    });
    setDeviceSchedules(schedules);
    if (appliances.length > 0) {
      setSelectedDevice(appliances[0]);
    }
  };

  const getSmartDefaultSchedule = (deviceType, isWeekend = false) => {
    const patterns = {
      refrigerator: Array(24).fill(true),
      router: Array(24).fill(true),
      light: Array(24).fill(false).map((_, hour) =>
        (hour >= 18 && hour <= 23) || (hour >= 6 && hour <= 8)
      ),
      tv: Array(24).fill(false).map((_, hour) =>
        isWeekend
          ? (hour >= 10 && hour <= 12) || (hour >= 19 && hour <= 23)
          : (hour >= 19 && hour <= 22)
      ),
      computer: Array(24).fill(false).map((_, hour) =>
        isWeekend
          ? (hour >= 14 && hour <= 18)
          : (hour >= 8 && hour <= 17)
      ),
      'air conditioner': Array(24).fill(false).map((_, hour) =>
        (hour >= 14 && hour <= 18) || (hour >= 22 && hour <= 6)
      ),
      heater: Array(24).fill(false).map((_, hour) =>
        (hour >= 6 && hour <= 9) || (hour >= 18 && hour <= 22)
      ),
      microwave: Array(24).fill(false).map((_, hour) =>
        hour === 7 || hour === 12 || hour === 18
      ),
      kettle: Array(24).fill(false).map((_, hour) =>
        hour === 7 || hour === 15 || hour === 20
      ),
      'washing machine': Array(24).fill(false).map((_, hour) =>
        isWeekend ? (hour >= 9 && hour <= 12) : hour === 8
      ),
      default: Array(24).fill(false).map((_, hour) => hour >= 18 && hour <= 22)
    };
    return patterns[deviceType.toLowerCase()] || patterns.default;
  };

  const getPriority = (deviceType) => {
    const priorities = {
      refrigerator: 'essential',
      router: 'essential',
      light: 'comfort',
      tv: 'optional',
      computer: 'comfort',
      'air conditioner': 'comfort',
      heater: 'comfort',
      microwave: 'comfort',
      kettle: 'comfort',
      'washing machine': 'optional',
    };
    return priorities[deviceType.toLowerCase()] || 'optional';
  };

  const getWorkdaySchedule = (deviceType) => {
    const schedules = {
      refrigerator: Array(24).fill(true),
      router: Array(24).fill(true),
      light: Array(24).fill(false).map((_, hour) =>
        (hour >= 6 && hour <= 8) || (hour >= 18 && hour <= 23)
      ),
      tv: Array(24).fill(false).map((_, hour) => hour >= 19 && hour <= 22),
      computer: Array(24).fill(false).map((_, hour) => hour >= 8 && hour <= 17),
      'air conditioner': Array(24).fill(false).map((_, hour) =>
        (hour >= 8 && hour <= 9) || (hour >= 17 && hour <= 22)
      ),
      heater: Array(24).fill(false).map((_, hour) =>
        (hour >= 6 && hour <= 9) || (hour >= 18 && hour <= 22)
      ),
      microwave: Array(24).fill(false).map((_, hour) =>
        hour === 7 || hour === 12 || hour === 18
      ),
      kettle: Array(24).fill(false).map((_, hour) =>
        hour === 7 || hour === 12 || hour === 15 || hour === 20
      ),
      'washing machine': Array(24).fill(false).map((_, hour) => hour === 8),
      default: Array(24).fill(false).map((_, hour) =>
        (hour >= 7 && hour <= 9) || (hour >= 18 && hour <= 21)
      ),
    };
    return schedules[deviceType.toLowerCase()] || schedules.default;
  };

  const getWeekendSchedule = (deviceType) => {
    const schedules = {
      refrigerator: Array(24).fill(true),
      router: Array(24).fill(true),
      light: Array(24).fill(false).map((_, hour) =>
        (hour >= 8 && hour <= 10) || (hour >= 18 && hour <= 24)
      ),
      tv: Array(24).fill(false).map((_, hour) =>
        (hour >= 10 && hour <= 14) || (hour >= 19 && hour <= 24)
      ),
      computer: Array(24).fill(false).map((_, hour) => hour >= 10 && hour <= 20),
      'air conditioner': Array(24).fill(false).map((_, hour) =>
        (hour >= 12 && hour <= 16) || (hour >= 20 && hour <= 8)
      ),
      heater: Array(24).fill(false).map((_, hour) =>
        (hour >= 7 && hour <= 10) || (hour >= 18 && hour <= 23)
      ),
      microwave: Array(24).fill(false).map((_, hour) =>
        hour === 9 || hour === 13 || hour === 19
      ),
      kettle: Array(24).fill(false).map((_, hour) =>
        hour === 9 || hour === 14 || hour === 16 || hour === 21
      ),
      'washing machine': Array(24).fill(false).map((_, hour) =>
        hour >= 10 && hour <= 12
      ),
      default: Array(24).fill(false).map((_, hour) =>
        (hour >= 9 && hour <= 12) || (hour >= 18 && hour <= 22)
      ),
    };
    return schedules[deviceType.toLowerCase()] || schedules.default;
  };

  const getVacationSchedule = (deviceType) => {
    return Array(24).fill(false).map((_, hour) => {
      if (deviceType === 'refrigerator' || deviceType === 'router') return true;
      if (deviceType === 'light') return (hour >= 7 && hour <= 24);
      if (deviceType === 'tv') return (hour >= 9 && hour <= 24);
      if (deviceType === 'computer') return (hour >= 9 && hour <= 22);
      return (hour >= 8 && hour <= 23);
    });
  };

  const getAwaySchedule = (deviceType) => {
    if (deviceType === 'refrigerator' || deviceType === 'router') {
      return Array(24).fill(true);
    }
    return Array(24).fill(false).map((_, hour) =>
      (hour >= 7 && hour <= 8) || (hour >= 18 && hour <= 20)
    );
  };

  const toggleHour = (deviceId, hour) => {
    const scheduleType = dayType === 'weekday' ? 'weekdaySchedule' : 'weekendSchedule';
    setDeviceSchedules(prev => ({
      ...prev,
      [deviceId]: {
        ...prev[deviceId],
        [scheduleType]: prev[deviceId][scheduleType].map((active, index) =>
          index === hour ? !active : active
        ),
      },
    }));
  };

  const applyDayPreset = (presetType) => {
    Alert.alert(
      'Apply Day Preset',
      `Apply "${presetType}" schedule to all devices for ${dayType}s?`,
      [
        { text: 'Cancel' },
        { text: 'Apply', onPress: () => applyPresetToAllDevices(presetType) }
      ]
    );
  };

  const applyPresetToAllDevices = (presetType) => {
    const schedules = { ...deviceSchedules };
    Object.keys(schedules).forEach(deviceId => {
      const device = appliances.find(a => a.id === deviceId);
      if (!device) return;

      let schedule = [];
      switch (presetType) {
        case 'workday':
          schedule = getWorkdaySchedule(device.type);
          break;
        case 'weekend':
          schedule = getWeekendSchedule(device.type);
          break;
        case 'vacation':
          schedule = getVacationSchedule(device.type);
          break;
        case 'away':
          schedule = getAwaySchedule(device.type);
          break;
        default:
          schedule = getSmartDefaultSchedule(device.type);
      }

      const scheduleType = dayType === 'weekday' ? 'weekdaySchedule' : 'weekendSchedule';
      schedules[deviceId][scheduleType] = schedule;
    });
    setDeviceSchedules(schedules);
  };

  const copyDaySchedule = (fromDay, toDay) => {
    const fromScheduleType = fromDay + 'Schedule';
    const toScheduleType = toDay + 'Schedule';

    setDeviceSchedules(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(deviceId => {
        updated[deviceId][toScheduleType] = [...updated[deviceId][fromScheduleType]];
      });
      return updated;
    });
    Alert.alert('Schedule Copied', `${fromDay} schedule copied to ${toDay} for all devices`);
  };

  const handleDaysInput = (text) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    const days = Math.max(1, Math.min(99, parseInt(numericValue) || 1));
    setGlobalSettings(prev => ({ ...prev, simulationDays: days }));
  };

  const generateCustomSimulationData = async () => {
    try {
      setIsFastForwarding(true);
      setProgress(0);

      const engine = mlService.getCurrentEngine();
      if (!engine) {
        throw new Error('ML Engine not available. Please ensure you\'re logged in.');
      }

      const samples = [];
      const actions = [];
      let samplesGenerated = 0;
      const totalHours = globalSettings.simulationDays * 24;

      for (let day = 0; day < globalSettings.simulationDays; day++) {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - globalSettings.simulationDays + day);
        const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
        const useWeekendSchedule = isWeekend && globalSettings.includeWeekends;

        for (let hour = 0; hour < 24; hour++) {
          const timestamp = new Date(currentDate);
          timestamp.setHours(hour, Math.floor(Math.random() * 60), Math.floor(Math.random() * 60));

          const devices = appliances.map(appliance => {
            const schedule = deviceSchedules[appliance.id];
            if (!schedule) return null;

            const scheduleType = useWeekendSchedule ? 'weekendSchedule' : 'weekdaySchedule';
            let isScheduledOn = schedule[scheduleType][hour];

            const realismFactor = globalSettings.userBehaviorRealism / 100;
            if (Math.random() > realismFactor) {
              if (schedule.priority === 'essential') {
                isScheduledOn = isScheduledOn && Math.random() > 0.05;
              } else if (schedule.priority === 'comfort') {
                if (isScheduledOn) {
                  isScheduledOn = isScheduledOn || Math.random() < 0.2;
                } else {
                  isScheduledOn = isScheduledOn || Math.random() < 0.1;
                }
              } else {
                if (Math.random() < globalSettings.variationPercent / 100) {
                  isScheduledOn = !isScheduledOn;
                }
              }
            }

            if (globalSettings.randomEvents && Math.random() < 0.03) {
              if (hour >= 6 && hour <= 22) {
                isScheduledOn = isScheduledOn || Math.random() < 0.3;
              } else {
                isScheduledOn = isScheduledOn && Math.random() > 0.1;
              }
            }

            return {
              id: appliance.id,
              type: appliance.type,
              room: appliance.room,
              status: isScheduledOn ? 'on' : 'off',
              power: isScheduledOn ? (schedule.power || appliance.normal_usage || 100) : 0,
              isActive: isScheduledOn,
              priority: schedule.priority,
            };
          }).filter(Boolean);

          if (hour > 0) {
            const prevSample = samples[samples.length - 1];
            if (prevSample) {
              devices.forEach(device => {
                const prevDevice = prevSample.devices.find(d => d.id === device.id);
                if (prevDevice && prevDevice.status !== device.status) {
                  const actionTime = new Date(timestamp);
                  actionTime.setMinutes(Math.floor(Math.random() * 60));
                  actions.push({
                    timestamp: actionTime.toISOString(),
                    hour: actionTime.getHours(),
                    dayOfWeek: actionTime.getDay(),
                    deviceId: device.id,
                    deviceType: device.type,
                    action: device.status === 'on' ? 'toggle_on' : 'toggle_off',
                    context: {
                      manual: true,
                      planned: true,
                      priority: device.priority,
                      totalActiveDevices: devices.filter(d => d.isActive).length,
                      totalPower: devices.filter(d => d.isActive).reduce((sum, d) => sum + d.power, 0),
                      dayType: isWeekend ? 'weekend' : 'weekday',
                    },
                  });
                }
              });
            }
          }

          const totalPower = devices
            .filter(device => device.isActive)
            .reduce((sum, device) => sum + device.power, 0);

          const sample = {
            timestamp: timestamp.toISOString(),
            hour,
            dayOfWeek: currentDate.getDay(),
            isWeekend: useWeekendSchedule,
            devices,
            totalPower,
            activeDeviceCount: devices.filter(d => d.isActive).length,
            plannedDay: true,
            dayType: isWeekend ? 'weekend' : 'weekday',
          };

          samples.push(sample);
          samplesGenerated++;

          const progressPercent = Math.round(((day * 24 + hour + 1) / totalHours) * 100);
          setProgress(progressPercent);
        }

        await new Promise(resolve => setTimeout(resolve, 10));
      }

      console.log(`Generated ${samplesGenerated} samples over ${globalSettings.simulationDays} days`);

      const injectResult = await mlService.injectSimulationData({
        deviceUsage: samples,
        userActions: actions,
        totalSamples: samplesGenerated,
        simulatedDays: globalSettings.simulationDays,
        plannedData: true,
      });

      let trainResult = { success: false };
      if (samplesGenerated >= 50) {
        console.log('Auto-training models...');
        trainResult = await mlService.trainModels();
      }

      return {
        success: true,
        samplesGenerated,
        simulatedDays: globalSettings.simulationDays,
        trained: trainResult.success,
        accuracy: trainResult.accuracy || 0,
      };
    } catch (error) {
      console.error('Generation error:', error);
      throw error;
    } finally {
      setIsFastForwarding(false);
      setProgress(0);
    }
  };

  const renderGenerateButton = () => {
    const daysNeeded = Math.max(0, 5 - currentDays);
    return (
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={async () => {
            try {
              const result = await generateCustomSimulationData();
              if (result.success) {
                const newCurrentDays = currentDays + globalSettings.simulationDays;
                const stillNeeded = Math.max(0, 5 - newCurrentDays);

                Alert.alert(
                  'Day Planning Complete!',
                  `Generated ${globalSettings.simulationDays} complete day${globalSettings.simulationDays > 1 ? 's' : ''} of realistic energy patterns!\n\n` +
                  `${newCurrentDays >= 5
                    ? `AI models trained with ${(result.accuracy * 100).toFixed(1)}% accuracy!`
                    : `Progress: ${newCurrentDays}/5 days collected.\nNeed ${stillNeeded} more day${stillNeeded > 1 ? 's' : ''} for AI training.`}\n\n` +
                  `View predictions in the Analysis tab!`,
                  [{
                    text: 'Great!',
                    onPress: () => {
                      if (onSimulationUpdate) {
                        onSimulationUpdate(result);
                      }
                      setCurrentDays(newCurrentDays);
                      if (newCurrentDays >= 5) {
                        onClose();
                      }
                    }
                  }]
                );
              }
            } catch (error) {
              console.error('Generation error:', error);
              Alert.alert(
                'Generation Error',
                error.message || 'Failed to generate simulation data. Please try again.',
                [{ text: 'OK' }]
              );
            }
          }}
          disabled={isFastForwarding}
        >
          {isFastForwarding ? (
            <View style={styles.buttonContent}>
              <ActivityIndicator size="small" color="#ffffff" />
              <Text style={styles.buttonText}>
                Generating {globalSettings.simulationDays} Day{globalSettings.simulationDays > 1 ? 's' : ''}... {progress}%
              </Text>
            </View>
          ) : (
            <View style={styles.buttonContent}>
              <MaterialIcons name="calendar-today" size={20} color="#ffffff" />
              <Text style={styles.buttonText}>
                Generate {globalSettings.simulationDays} Day{globalSettings.simulationDays > 1 ? 's' : ''} of Data
              </Text>
              {currentDays > 0 && currentDays < 5 && (
                <Text style={styles.progressHint}>
                  {currentDays}/5 days • {daysNeeded} more needed
                </Text>
              )}
              {currentDays >= 5 && (
                <Text style={styles.progressHintComplete}>
                  Ready for training!
                </Text>
              )}
            </View>
          )}
        </TouchableOpacity>
        {isFastForwarding && (
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        )}
      </View>
    );
  };

  const renderAdvancedContent = () => (
    <ScrollView style={styles.tabContentScroll} contentContainerStyle={styles.scrollContentContainer}>
      <View style={styles.advancedSettings}>
        <Text style={styles.sectionTitle}>Simulation Settings</Text>
        <Text style={styles.sectionDescription}>Fine-tune how realistic your simulation data should be</Text>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Simulation Days</Text>
          <Text style={styles.settingHelpText}>How many days of data to generate (1-99)</Text>
          <TextInput
            style={styles.settingInput}
            value={String(globalSettings.simulationDays)}
            onChangeText={handleDaysInput}
            keyboardType="number-pad"
            maxLength={2}
          />
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Daily Variation</Text>
          <Text style={styles.settingHelpText}>Natural changes in your routine (waking up earlier/later, etc.)</Text>
          <View style={styles.sliderRow}>
            <Text style={styles.sliderValue}>{globalSettings.variationPercent}%</Text>
            <Slider
              style={styles.behaviorSlider}
              value={globalSettings.variationPercent}
              onValueChange={(value) =>
                setGlobalSettings(prev => ({
                  ...prev,
                  variationPercent: Math.round(value)
                }))
              }
              minimumValue={0}
              maximumValue={50}
              step={5}
              minimumTrackTintColor="#10b981"
              maximumTrackTintColor="#18181b"
              thumbTintColor="#10b981"
            />
            <Text style={styles.settingHelpText}>variation</Text>
          </View>
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Human Behavior Realism</Text>
          <Text style={styles.settingHelpText}>How consistently you follow your schedule (100% = perfect, 70% = normal human)</Text>
          <View style={styles.sliderRow}>
            <Text style={styles.sliderValue}>{globalSettings.userBehaviorRealism}%</Text>
            <Slider
              style={styles.behaviorSlider}
              value={globalSettings.userBehaviorRealism}
              onValueChange={(value) =>
                setGlobalSettings(prev => ({
                  ...prev,
                  userBehaviorRealism: Math.round(value)
                }))
              }
              minimumValue={50}
              maximumValue={100}
              step={5}
              minimumTrackTintColor="#10b981"
              maximumTrackTintColor="#18181b"
              thumbTintColor="#10b981"
            />
          </View>
        </View>

        <View style={styles.settingRow}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>Include Weekend Schedules</Text>
              <Text style={styles.settingHelpText}>Generate different patterns for weekends vs weekdays</Text>
            </View>
            <Switch
              value={globalSettings.includeWeekends}
              onValueChange={(value) =>
                setGlobalSettings(prev => ({
                  ...prev,
                  includeWeekends: value
                }))
              }
              trackColor={{ false: '#18181b', true: '#10b981' }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        <View style={styles.settingRow}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>Random Life Events</Text>
              <Text style={styles.settingHelpText}>Unexpected situations (forgot to turn off device, woke up early, etc.)</Text>
            </View>
            <Switch
              value={globalSettings.randomEvents}
              onValueChange={(value) =>
                setGlobalSettings(prev => ({
                  ...prev,
                  randomEvents: value
                }))
              }
              trackColor={{ false: '#18181b', true: '#10b981' }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        <View style={styles.infoCard}>
          <MaterialIcons name="info" size={20} color="#3b82f6" />
          <Text style={styles.infoText}>
            These settings work together to create realistic patterns:{'\n'}
            • Realism: How consistently you follow your routine{'\n'}
            • Variation: Daily changes (wake up earlier/later){'\n'}
            • Random Events: Unexpected situations (forgot to turn off device)
          </Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderPlannerContent = () => {
    if (appliances.length === 0) {
      return (
        <View style={styles.emptyState}>
          <MaterialIcons name="devices" size={56} color="#3f3f46" />
          <Text style={styles.emptyStateText}>No devices available</Text>
          <Text style={styles.emptyStateSubtext}>Add devices in the Controls tab to start planning</Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.tabContentScroll} contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.dayTypeSelector}>
          <TouchableOpacity
            style={[styles.dayTypeButton, dayType === 'weekday' && styles.activeDayType]}
            onPress={() => setDayType('weekday')}
          >
            <MaterialIcons name="work" size={16} color={dayType === 'weekday' ? '#ffffff' : '#a1a1aa'} />
            <Text style={[styles.dayTypeText, dayType === 'weekday' && styles.activeDayTypeText]}>
              Weekday
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.dayTypeButton, dayType === 'weekend' && styles.activeDayType]}
            onPress={() => setDayType('weekend')}
          >
            <MaterialIcons name="weekend" size={16} color={dayType === 'weekend' ? '#ffffff' : '#a1a1aa'} />
            <Text style={[styles.dayTypeText, dayType === 'weekend' && styles.activeDayTypeText]}>
              Weekend
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.presetsSection}>
          <Text style={styles.sectionTitle}>Quick Presets</Text>
          <Text style={styles.sectionDescription}>Apply realistic daily patterns to all your devices</Text>
          <View style={styles.presetsGrid}>
            {Object.keys(dayPresets).map(preset => (
              <TouchableOpacity
                key={preset}
                style={styles.presetButton}
                onPress={() => applyDayPreset(preset)}
              >
                <MaterialIcons name="schedule" size={20} color="#10b981" />
                <View style={styles.presetInfo}>
                  <Text style={styles.presetTitle}>{preset.charAt(0).toUpperCase() + preset.slice(1)}</Text>
                  <Text style={styles.presetDescription}>{dayPresets[preset]}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={20} color="#a1a1aa" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.deviceListContainer}>
          <Text style={styles.sectionTitle}>Select Device</Text>
          <Text style={styles.sectionDescription}>Choose which device's daily schedule you want to customize</Text>
          <ScrollView style={styles.deviceScrollContainer}>
            {appliances.map(device => (
              <TouchableOpacity
                key={device.id}
                style={[
                  styles.deviceItem,
                  selectedDevice?.id === device.id && styles.selectedDeviceItem
                ]}
                onPress={() => setSelectedDevice(device)}
              >
                <View style={styles.deviceHeader}>
                  <View style={styles.deviceInfo}>
                    <Text style={styles.deviceName}>{device.name || device.type}</Text>
                    <Text style={styles.deviceType}>{device.type} • {device.normal_usage || 100}W</Text>
                  </View>
                  {selectedDevice?.id === device.id && (
                    <MaterialIcons name="check-circle" size={20} color="#10b981" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {selectedDevice && deviceSchedules[selectedDevice.id] && (
          <View style={styles.deviceScheduler}>
            <Text style={styles.schedulerTitle}>24-Hour Schedule</Text>
            <View style={styles.hourGrid}>
              {Array.from({ length: 24 }).map((_, hour) => {
                const scheduleType = dayType === 'weekday' ? 'weekdaySchedule' : 'weekendSchedule';
                const isActive = deviceSchedules[selectedDevice.id][scheduleType][hour];

                return (
                  <TouchableOpacity
                    key={hour}
                    style={[styles.hourButton, isActive && styles.activeHourButton]}
                    onPress={() => toggleHour(selectedDevice.id, hour)}
                  >
                    <Text style={[styles.hourText, isActive && styles.activeHourText]}>
                      {hour}h
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.scheduleSummary}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Active Hours:</Text>
                <Text style={styles.summaryValue}>
                  {deviceSchedules[selectedDevice.id][dayType === 'weekday' ? 'weekdaySchedule' : 'weekendSchedule'].filter(Boolean).length}/24
                </Text>
              </View>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={styles.copyScheduleButton}
          onPress={() => {
            Alert.alert(
              'Copy Schedule',
              'Copy current schedule to:',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: dayType === 'weekday' ? 'To Weekend' : 'To Weekday',
                  onPress: () => copyDaySchedule(dayType, dayType === 'weekday' ? 'weekend' : 'weekday')
                }
              ]
            );
          }}
        >
          <MaterialIcons name="content-copy" size={16} color="#10b981" />
          <Text style={styles.copyScheduleText}>
            Copy {dayType} to {dayType === 'weekday' ? 'Weekend' : 'Weekday'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  const renderPreviewContent = () => {
    const scheduleType = dayType === 'weekday' ? 'weekdaySchedule' : 'weekendSchedule';

    return (
      <ScrollView style={styles.tabContentScroll} contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.timelineCard}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="timeline" size={20} color="#10b981" />
            <Text style={styles.cardTitle}>Schedule Preview</Text>
          </View>
          <Text style={styles.sectionDescription}>
            {dayType === 'weekday' ? 'Weekday' : 'Weekend'} schedule for all devices
          </Text>

          {appliances.map(device => {
            const schedule = deviceSchedules[device.id];
            if (!schedule) return null;

            return (
              <View key={device.id} style={styles.timelineRow}>
                <View style={styles.timelineDeviceInfo}>
                  <Text style={styles.timelineDeviceName}>{device.name || device.type}</Text>
                  <Text style={styles.timelineDeviceType}>{device.type}</Text>
                </View>
                <View style={styles.timelineHours}>
                  {Array.from({ length: 24 }).map((_, hour) => (
                    <View
                      key={hour}
                      style={[
                        styles.timelineHour,
                        schedule[scheduleType][hour] && styles.activeTimelineHour
                      ]}
                    />
                  ))}
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.previewCard}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="assessment" size={20} color="#10b981" />
            <Text style={styles.cardTitle}>Daily Summary</Text>
          </View>
          <View style={styles.previewStats}>
            <View style={styles.previewStat}>
              <Text style={styles.previewStatLabel}>Total Devices:</Text>
              <Text style={styles.previewStatValue}>{appliances.length}</Text>
            </View>
            <View style={styles.previewStat}>
              <Text style={styles.previewStatLabel}>Always On:</Text>
              <Text style={styles.previewStatValue}>
                {appliances.filter(d => {
                  const schedule = deviceSchedules[d.id];
                  return schedule && schedule[scheduleType].every(Boolean);
                }).length}
              </Text>
            </View>
            <View style={styles.previewStat}>
              <Text style={styles.previewStatLabel}>Scheduled:</Text>
              <Text style={styles.previewStatValue}>
                {appliances.filter(d => {
                  const schedule = deviceSchedules[d.id];
                  return schedule && schedule[scheduleType].some(Boolean) && !schedule[scheduleType].every(Boolean);
                }).length}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Plan Your Day</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialIcons name="close" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'planner' && styles.activeTab]}
            onPress={() => setSelectedTab('planner')}
          >
            <MaterialIcons
              name="schedule"
              size={16}
              color={selectedTab === 'planner' ? '#10b981' : '#a1a1aa'}
            />
            <Text style={[styles.tabText, selectedTab === 'planner' && styles.activeTabText]}>
              Day Planner
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, selectedTab === 'advanced' && styles.activeTab]}
            onPress={() => setSelectedTab('advanced')}
          >
            <MaterialIcons
              name="settings"
              size={16}
              color={selectedTab === 'advanced' ? '#10b981' : '#a1a1aa'}
            />
            <Text style={[styles.tabText, selectedTab === 'advanced' && styles.activeTabText]}>
              Settings
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, selectedTab === 'preview' && styles.activeTab]}
            onPress={() => setSelectedTab('preview')}
          >
            <MaterialIcons
              name="visibility"
              size={16}
              color={selectedTab === 'preview' ? '#10b981' : '#a1a1aa'}
            />
            <Text style={[styles.tabText, selectedTab === 'preview' && styles.activeTabText]}>
              Preview
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {selectedTab === 'planner' && renderPlannerContent()}
          {selectedTab === 'advanced' && renderAdvancedContent()}
          {selectedTab === 'preview' && renderPreviewContent()}
        </View>

        {renderGenerateButton()}
      </SafeAreaView>
    </Modal>
  );
}
