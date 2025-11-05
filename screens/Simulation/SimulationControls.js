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
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function SimulationControls({ visible, onClose, appliances, onSimulationUpdate }) {
  const [selectedTab, setSelectedTab] = useState('planner');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [deviceSchedules, setDeviceSchedules] = useState({});
  const [dayType, setDayType] = useState('weekday');
  const [isFastForwarding, setIsFastForwarding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentDays, setCurrentDays] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // NEW: Date picker and template state
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [dailySchedules, setDailySchedules] = useState({});
  const [savedTemplates, setSavedTemplates] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [completedDays, setCompletedDays] = useState([]);
  const [dragSelectMode, setDragSelectMode] = useState(false);
  const [dragStartHour, setDragStartHour] = useState(null);
  
  const [globalSettings, setGlobalSettings] = useState({
    simulationDays: 1,
    variationPercent: 15,
    includeWeekends: true,
    randomEvents: true,
    userBehaviorRealism: 80,
  });

  const [dayPresets] = useState({
    workday: {
      name: 'Typical Workday',
      description: 'Standard work from home day',
      icon: 'work'
    },
    weekend: {
      name: 'Relaxed Weekend',
      description: 'Leisurely weekend day',
      icon: 'weekend'
    },
    vacation: {
      name: 'Home All Day',
      description: 'Vacation day at home',
      icon: 'beach-access'
    },
    away: {
      name: 'Away Most of Day',
      description: 'Minimal home presence',
      icon: 'flight-takeoff'
    },
  });

  // Helper function to format dates
  function formatDate(date) {
    return date.toISOString().split('T')[0];
  }

  // Load saved data on mount
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const progress = await mlService.getTrainingProgress();
        setCurrentDays(progress.current || 0);
        
        // Load saved templates and completed days
        await loadSavedTemplates();
        await loadCompletedDays();
        await loadDailySchedules();
      } catch (error) {
        console.log('Could not fetch progress:', error);
      }
    };

    if (visible) {
      fetchProgress();
    }
  }, [visible, isFastForwarding, refreshTrigger]);

  useEffect(() => {
    if (visible && appliances.length > 0) {
      initializeSchedules();
    }
  }, [visible, appliances]);

  // Load saved templates from storage
  const loadSavedTemplates = async () => {
    try {
      const userId = mlService.getCurrentUserId();
      if (!userId) return;
      
      const templatesKey = `@day_templates_${userId}`;
      const savedData = await AsyncStorage.getItem(templatesKey);
      
      if (savedData) {
        setSavedTemplates(JSON.parse(savedData));
      }
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  // Load completed days
  const loadCompletedDays = async () => {
    try {
      const userId = mlService.getCurrentUserId();
      if (!userId) return;
      
      const completedKey = `@completed_days_${userId}`;
      const savedData = await AsyncStorage.getItem(completedKey);
      
      if (savedData) {
        setCompletedDays(JSON.parse(savedData));
      }
    } catch (error) {
      console.error('Error loading completed days:', error);
    }
  };

  // Load daily schedules
  const loadDailySchedules = async () => {
    try {
      const userId = mlService.getCurrentUserId();
      if (!userId) return;
      
      const schedulesKey = `@daily_schedules_${userId}`;
      const savedData = await AsyncStorage.getItem(schedulesKey);
      
      if (savedData) {
        setDailySchedules(JSON.parse(savedData));
      }
    } catch (error) {
      console.error('Error loading daily schedules:', error);
    }
  };

  // Save template
  const saveTemplate = async (templateName) => {
    try {
      const userId = mlService.getCurrentUserId();
      if (!userId) {
        Alert.alert('Error', 'No user logged in');
        return;
      }

      const template = {
        id: Date.now().toString(),
        name: templateName,
        dayType,
        devices: { ...deviceSchedules },
        created: new Date().toISOString(),
        energyProfile: calculateEnergyProfile(deviceSchedules)
      };

      const updated = [...savedTemplates, template];
      setSavedTemplates(updated);
      
      const templatesKey = `@day_templates_${userId}`;
      await AsyncStorage.setItem(templatesKey, JSON.stringify(updated));
      
      Alert.alert('Success', `Template "${templateName}" saved!`);
    } catch (error) {
      console.error('Error saving template:', error);
      Alert.alert('Error', 'Failed to save template');
    }
  };

  // Calculate energy profile for template
  const calculateEnergyProfile = (schedules) => {
    let totalActiveHours = 0;
    let deviceCount = 0;

    Object.values(schedules).forEach(schedule => {
      const scheduleType = dayType === 'weekday' ? 'weekdaySchedule' : 'weekendSchedule';
      const activeHours = schedule[scheduleType]?.filter(Boolean).length || 0;
      totalActiveHours += activeHours;
      deviceCount++;
    });

    const avgActiveHours = deviceCount > 0 ? totalActiveHours / deviceCount : 0;
    
    if (avgActiveHours < 8) return 'low';
    if (avgActiveHours < 16) return 'medium';
    return 'high';
  };

  // Apply saved template
  const applyTemplate = (template) => {
    setDeviceSchedules(template.devices);
    setDayType(template.dayType);
    Alert.alert('Template Applied', `Loaded "${template.name}" template`);
  };

  // Delete template
  const deleteTemplate = async (templateId) => {
    try {
      const userId = mlService.getCurrentUserId();
      const updated = savedTemplates.filter(t => t.id !== templateId);
      setSavedTemplates(updated);
      
      const templatesKey = `@day_templates_${userId}`;
      await AsyncStorage.setItem(templatesKey, JSON.stringify(updated));
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  };

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

  // Enhanced toggle with drag support
  const toggleHour = (deviceId, hour) => {
    if (dragSelectMode) {
      handleDragSelect(deviceId, hour);
    } else {
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
    }
  };

  // NEW: Drag select functionality
  const handleDragSelect = (deviceId, hour) => {
    if (dragStartHour === null) {
      setDragStartHour(hour);
    } else {
      const startHour = Math.min(dragStartHour, hour);
      const endHour = Math.max(dragStartHour, hour);
      const scheduleType = dayType === 'weekday' ? 'weekdaySchedule' : 'weekendSchedule';
      
      setDeviceSchedules(prev => ({
        ...prev,
        [deviceId]: {
          ...prev[deviceId],
          [scheduleType]: prev[deviceId][scheduleType].map((active, index) =>
            index >= startHour && index <= endHour ? !active : active
          ),
        },
      }));
      
      setDragStartHour(null);
      setDragSelectMode(false);
    }
  };

  // Quick device templates
  const applyDeviceTemplate = (deviceId, templateType) => {
    const device = appliances.find(d => d.id === deviceId);
    if (!device) return;

    const scheduleType = dayType === 'weekday' ? 'weekdaySchedule' : 'weekendSchedule';
    let schedule = Array(24).fill(false);

    switch (templateType) {
      case 'morning':
        schedule = schedule.map((_, hour) => hour >= 6 && hour <= 9);
        break;
      case 'work':
        schedule = schedule.map((_, hour) => hour >= 8 && hour <= 17);
        break;
      case 'evening':
        schedule = schedule.map((_, hour) => hour >= 18 && hour <= 23);
        break;
      case 'allDay':
        schedule = Array(24).fill(true);
        break;
      case 'night':
        schedule = schedule.map((_, hour) => hour >= 22 || hour <= 6);
        break;
    }

    setDeviceSchedules(prev => ({
      ...prev,
      [deviceId]: {
        ...prev[deviceId],
        [scheduleType]: schedule,
      },
    }));
  };

  const applyDayPreset = (presetType) => {
    Alert.alert(
      'Apply Day Preset',
      `Apply "${dayPresets[presetType].name}" schedule to all devices for ${dayType}s?`,
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

  // NEW: Copy from existing day
  const copyFromExistingDay = () => {
    if (completedDays.length === 0) {
      Alert.alert('No Days Available', 'Generate at least one day before copying');
      return;
    }

    const options = completedDays.map(day => ({
      text: `${day.date} (${day.type})`,
      onPress: () => loadDaySchedule(day.date)
    }));

    Alert.alert('Copy From Day', 'Select a day to copy:', [
      { text: 'Cancel', style: 'cancel' },
      ...options
    ]);
  };

  const loadDaySchedule = (date) => {
    const daySchedule = dailySchedules[date];
    if (daySchedule) {
      setDeviceSchedules(daySchedule.devices);
      Alert.alert('Schedule Loaded', `Loaded schedule from ${date}`);
    }
  };

  // NEW: Validation before generation
  const validateSchedule = () => {
    const warnings = [];
    
    Object.entries(deviceSchedules).forEach(([deviceId, schedule]) => {
      const device = appliances.find(d => d.id === deviceId);
      if (!device) return;

      const scheduleType = dayType === 'weekday' ? 'weekdaySchedule' : 'weekendSchedule';
      const activeHours = schedule[scheduleType].filter(Boolean).length;

      // Check for unusual patterns
      if (activeHours === 0 && device.type !== 'washing machine' && device.type !== 'microwave') {
        warnings.push(`${device.name} is never on - is this correct?`);
      }

      if (activeHours === 24 && device.type !== 'refrigerator' && device.type !== 'router') {
        warnings.push(`${device.name} is on 24/7 - high energy usage!`);
      }

      if (device.type === 'refrigerator' && activeHours < 20) {
        warnings.push(`${device.name} should typically run 24/7`);
      }
    });

    // Calculate total peak power
    const scheduleType = dayType === 'weekday' ? 'weekdaySchedule' : 'weekendSchedule';
    for (let hour = 0; hour < 24; hour++) {
      let hourPower = 0;
      Object.values(deviceSchedules).forEach(schedule => {
        if (schedule[scheduleType][hour]) {
          hourPower += schedule.power || 100;
        }
      });

      if (hourPower > 3000) {
        warnings.push(`Very high usage at ${hour}:00 (${hourPower}W) - is this intentional?`);
      }
    }

    return warnings;
  };

  const handleDaysInput = (text) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    const days = Math.max(1, Math.min(99, parseInt(numericValue) || 1));
    setGlobalSettings(prev => ({ ...prev, simulationDays: days }));
  };

  const generateCustomSimulationData = async () => {
    try {
      // Validate before generating
      const warnings = validateSchedule();
      
      if (warnings.length > 0) {
        const proceed = await new Promise((resolve) => {
          Alert.alert(
            'Schedule Warnings',
            warnings.join('\n\n'),
            [
              { text: 'Cancel', onPress: () => resolve(false), style: 'cancel' },
              { text: 'Generate Anyway', onPress: () => resolve(true) }
            ]
          );
        });

        if (!proceed) return;
      }

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

      // Save this day's schedule
      const dateKey = formatDate(new Date());
      const newDailySchedule = {
        date: dateKey,
        devices: { ...deviceSchedules },
        type: dayType,
        generated: true,
        metadata: {
          totalEnergy: samples.reduce((sum, s) => sum + s.totalPower, 0) / 1000,
          peakHour: 0
        }
      };

      const updatedSchedules = { ...dailySchedules, [dateKey]: newDailySchedule };
      setDailySchedules(updatedSchedules);

      const userId = mlService.getCurrentUserId();
      await AsyncStorage.setItem(`@daily_schedules_${userId}`, JSON.stringify(updatedSchedules));

      // Add to completed days
      const newCompletedDay = {
        date: dateKey,
        type: dayType,
        generated: true
      };
      const updatedCompleted = [...completedDays, newCompletedDay];
      setCompletedDays(updatedCompleted);
      await AsyncStorage.setItem(`@completed_days_${userId}`, JSON.stringify(updatedCompleted));

      const injectResult = await mlService.injectSimulationData({
        deviceUsage: samples,
        userActions: actions,
        totalSamples: samplesGenerated,
        simulatedDays: globalSettings.simulationDays,
        plannedData: true,
      });

      await new Promise(resolve => setTimeout(resolve, 200));

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
                if (onSimulationUpdate) {
                  await onSimulationUpdate(result);
                }
                
                const freshProgress = await mlService.getTrainingProgress();
                const newCurrentDays = freshProgress.current || 0;
                setCurrentDays(newCurrentDays);
                
                const stillNeeded = Math.max(0, 5 - newCurrentDays);
                
                Alert.alert(
                  '🎉 Day Planning Complete!',
                  `Generated ${globalSettings.simulationDays} complete day${globalSettings.simulationDays > 1 ? 's' : ''} of realistic energy patterns!\n\n` +
                  `${newCurrentDays >= 5
                    ? `✅ AI models trained with ${(result.accuracy * 100).toFixed(1)}% accuracy!`
                    : `📊 Progress: ${newCurrentDays}/5 days collected.\nNeed ${stillNeeded} more day${stillNeeded > 1 ? 's' : ''} for AI training.`}\n\n` +
                  `View predictions in the Analysis tab!`,
                  [{
                    text: 'Great!',
                    onPress: async () => {
                      if (newCurrentDays >= 5) {
                        setTimeout(() => {
                          onClose();
                        }, 500);
                      }
                      setRefreshTrigger(prev => prev + 1);
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
          <View style={styles.buttonContent}>
            {isFastForwarding ? (
              <Text style={styles.buttonText}>
                Generating {globalSettings.simulationDays} Day{globalSettings.simulationDays > 1 ? 's' : ''}... {progress}%
              </Text>
            ) : (
              <>
                <MaterialIcons name="flash-on" size={20} color="#ffffff" />
                <Text style={styles.buttonText}>
                  Generate {globalSettings.simulationDays} Day{globalSettings.simulationDays > 1 ? 's' : ''} of Data
                </Text>
              </>
            )}
            {currentDays > 0 && currentDays < 5 && !isFastForwarding && (
              <Text style={styles.progressHint}>
                {currentDays}/5 days • {daysNeeded} more needed
              </Text>
            )}
            {currentDays >= 5 && !isFastForwarding && (
              <Text style={styles.progressHintComplete}>
                ✓ Ready for training!
              </Text>
            )}
          </View>
          {isFastForwarding && (
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const renderAdvancedContent = () => (
    <ScrollView style={styles.tabContentScroll} contentContainerStyle={styles.scrollContentContainer}>
      <View style={styles.advancedSettings}>
        <Text style={styles.sectionTitle}>Simulation Settings</Text>
        <Text style={styles.sectionDescription}>
          Fine-tune how realistic your simulation data should be
        </Text>

        {/* Simulation Days */}
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Simulation Days</Text>
          <Text style={styles.settingHelpText}>How many days of data to generate (1-99)</Text>
          <TextInput
            style={styles.settingInput}
            value={globalSettings.simulationDays.toString()}
            onChangeText={handleDaysInput}
            keyboardType="number-pad"
            maxLength={2}
          />
        </View>

        {/* Daily Variation */}
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Daily Variation</Text>
          <Text style={styles.settingHelpText}>
            Natural changes in your routine (waking up earlier/later, etc.)
          </Text>
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
            <MaterialIcons name="shuffle" size={20} color="#10b981" />
          </View>
        </View>

        {/* Human Behavior Realism */}
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Human Behavior Realism</Text>
          <Text style={styles.settingHelpText}>
            How consistently you follow your schedule (100% = perfect, 70% = normal human)
          </Text>
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

        {/* Include Weekend Schedules */}
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Include Weekend Schedules</Text>
          <Text style={styles.settingHelpText}>
            Generate different patterns for weekends vs weekdays
          </Text>
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

        {/* Random Life Events */}
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Random Life Events</Text>
          <Text style={styles.settingHelpText}>
            Unexpected situations (forgot to turn off device, woke up early, etc.)
          </Text>
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
    </ScrollView>
  );

  const renderPlannerContent = () => {
    if (appliances.length === 0) {
      return (
        <View style={styles.emptyState}>
          <MaterialIcons name="devices" size={64} color="#a1a1aa" />
          <Text style={styles.emptyStateText}>No devices available</Text>
          <Text style={styles.emptyStateSubtext}>Add devices in the Controls tab to start planning</Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.tabContentScroll} contentContainerStyle={styles.scrollContentContainer}>
        {/* Progress Tracker */}
        <View style={styles.presetsSection}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="trending-up" size={20} color="#10b981" />
            <Text style={styles.cardTitle}>Training Data Progress</Text>
          </View>
          
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${Math.min(100, (currentDays / 5) * 100)}%` }]} />
          </View>
          
          <Text style={styles.sectionDescription}>
            {currentDays >= 5 
              ? `✅ ${currentDays}/5 days complete - Ready to train!`
              : `📊 ${currentDays}/5 days collected - Need ${5 - currentDays} more`}
          </Text>

          {completedDays.length > 0 && (
            <View style={{ marginTop: 12 }}>
              <Text style={styles.settingLabel}>Days Completed:</Text>
              {completedDays.slice(0, 5).map((day, index) => (
                <Text key={index} style={styles.settingHelpText}>
                  ✓ {day.date} - {day.type}
                </Text>
              ))}
            </View>
          )}
        </View>

        {/* Day Type Selector */}
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

        {/* Quick Presets */}
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
                <MaterialIcons name={dayPresets[preset].icon} size={24} color="#10b981" />
                <View style={styles.presetInfo}>
                  <Text style={styles.presetTitle}>{dayPresets[preset].name}</Text>
                  <Text style={styles.presetDescription}>{dayPresets[preset].description}</Text>
                </View>
                <MaterialIcons name="arrow-forward" size={20} color="#a1a1aa" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Saved Templates */}
        {savedTemplates.length > 0 && (
          <View style={styles.presetsSection}>
            <Text style={styles.sectionTitle}>My Templates</Text>
            <Text style={styles.sectionDescription}>Your saved day schedules</Text>
            
            {savedTemplates.map(template => (
              <TouchableOpacity
                key={template.id}
                style={styles.presetButton}
                onPress={() => applyTemplate(template)}
                onLongPress={() => {
                  Alert.alert(
                    'Delete Template',
                    `Delete "${template.name}"?`,
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Delete', onPress: () => deleteTemplate(template.id), style: 'destructive' }
                    ]
                  );
                }}
              >
                <MaterialIcons name="bookmark" size={24} color="#10b981" />
                <View style={styles.presetInfo}>
                  <Text style={styles.presetTitle}>{template.name}</Text>
                  <Text style={styles.presetDescription}>
                    {template.dayType} • {template.energyProfile} energy
                  </Text>
                </View>
                <MaterialIcons name="more-vert" size={20} color="#a1a1aa" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Device List */}
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
                    <Text style={styles.deviceType}>
                      {device.type} • {device.normal_usage || 100}W
                    </Text>
                  </View>
                  {selectedDevice?.id === device.id && (
                    <MaterialIcons name="check-circle" size={24} color="#10b981" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Device Scheduler */}
        {selectedDevice && deviceSchedules[selectedDevice.id] && (
          <View style={styles.deviceScheduler}>
            <Text style={styles.schedulerTitle}>
              24-Hour Schedule: {selectedDevice.name}
            </Text>

            {/* Quick Templates */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {['morning', 'work', 'evening', 'allDay', 'night'].map(template => (
                <TouchableOpacity
                  key={template}
                  style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: 'rgba(16, 185, 129, 0.3)',
                  }}
                  onPress={() => applyDeviceTemplate(selectedDevice.id, template)}
                >
                  <Text style={{ color: '#10b981', fontSize: 11, fontWeight: '700' }}>
                    {template === 'allDay' ? 'All Day' : template.charAt(0).toUpperCase() + template.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Hour Grid */}
            <View style={styles.hourGrid}>
              {Array.from({ length: 24 }).map((_, hour) => {
                const scheduleType = dayType === 'weekday' ? 'weekdaySchedule' : 'weekendSchedule';
                const isActive = deviceSchedules[selectedDevice.id][scheduleType][hour];
                
                return (
                  <TouchableOpacity
                    key={hour}
                    style={[
                      styles.hourButton,
                      isActive && styles.activeHourButton
                    ]}
                    onPress={() => toggleHour(selectedDevice.id, hour)}
                    onLongPress={() => {
                      setDragSelectMode(true);
                      setDragStartHour(hour);
                    }}
                  >
                    <Text style={[styles.hourText, isActive && styles.activeHourText]}>
                      {hour}h
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {dragSelectMode && (
              <View style={styles.infoCard}>
                <MaterialIcons name="touch-app" size={20} color="#3b82f6" />
                <Text style={styles.infoText}>
                  Drag select mode active! Tap another hour to select range.
                </Text>
              </View>
            )}

            {/* Schedule Summary */}
            <View style={styles.scheduleSummary}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Active Hours</Text>
                <Text style={styles.summaryValue}>
                  {deviceSchedules[selectedDevice.id][dayType === 'weekday' ? 'weekdaySchedule' : 'weekendSchedule'].filter(Boolean).length}/24
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Copy Schedule Button */}
        {selectedDevice && (
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
        )}

        {/* Action Buttons */}
        <View style={{ gap: 12, marginTop: 16, marginHorizontal: 20 }}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: 'rgba(59, 130, 246, 0.15)', borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.3)' }]}
            onPress={() => {
              Alert.prompt(
                'Save Template',
                'Enter a name for this template:',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Save', onPress: (name) => name && saveTemplate(name) }
                ],
                'plain-text'
              );
            }}
          >
            <MaterialIcons name="bookmark-add" size={20} color="#3b82f6" />
            <Text style={[styles.buttonText, { color: '#3b82f6' }]}>Save as Template</Text>
          </TouchableOpacity>

          {completedDays.length > 0 && (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: 'rgba(168, 85, 247, 0.15)', borderWidth: 1, borderColor: 'rgba(168, 85, 247, 0.3)' }]}
              onPress={copyFromExistingDay}
            >
              <MaterialIcons name="content-paste" size={20} color="#a855f7" />
              <Text style={[styles.buttonText, { color: '#a855f7' }]}>Copy from Existing Day</Text>
            </TouchableOpacity>
          )}
        </View>
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

          {/* Timeline View */}
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

        {/* Daily Summary */}
        <View style={styles.previewCard}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="assessment" size={20} color="#10b981" />
            <Text style={styles.cardTitle}>Daily Summary</Text>
          </View>

          <View style={styles.previewStats}>
            <View style={styles.previewStat}>
              <Text style={styles.previewStatLabel}>Total Devices</Text>
              <Text style={styles.previewStatValue}>{appliances.length}</Text>
            </View>

            <View style={styles.previewStat}>
              <Text style={styles.previewStatLabel}>Always On</Text>
              <Text style={styles.previewStatValue}>
                {appliances.filter(d => {
                  const schedule = deviceSchedules[d.id];
                  return schedule && schedule[scheduleType].every(Boolean);
                }).length}
              </Text>
            </View>

            <View style={styles.previewStat}>
              <Text style={styles.previewStatLabel}>Scheduled</Text>
              <Text style={styles.previewStatValue}>
                {appliances.filter(d => {
                  const schedule = deviceSchedules[d.id];
                  return schedule && schedule[scheduleType].some(Boolean) && !schedule[scheduleType].every(Boolean);
                }).length}
              </Text>
            </View>
          </View>
        </View>

        {/* Validation Warnings */}
        {(() => {
          const warnings = validateSchedule();
          if (warnings.length > 0) {
            return (
              <View style={styles.infoCard}>
                <MaterialIcons name="warning" size={20} color="#f59e0b" />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.infoText, { color: '#fbbf24' }]}>
                    Schedule Warnings:
                  </Text>
                  {warnings.slice(0, 3).map((warning, index) => (
                    <Text key={index} style={[styles.infoText, { marginTop: 4 }]}>
                      • {warning}
                    </Text>
                  ))}
                </View>
              </View>
            );
          }
          return null;
        })()}
      </ScrollView>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Plan Your Day</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialIcons name="close" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'planner' && styles.activeTab]}
            onPress={() => setSelectedTab('planner')}
          >
            <MaterialIcons name="calendar-today" size={16} color={selectedTab === 'planner' ? '#10b981' : '#a1a1aa'} />
            <Text style={[styles.tabText, selectedTab === 'planner' && styles.activeTabText]}>
              Day Planner
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'advanced' && styles.activeTab]}
            onPress={() => setSelectedTab('advanced')}
          >
            <MaterialIcons name="tune" size={16} color={selectedTab === 'advanced' ? '#10b981' : '#a1a1aa'} />
            <Text style={[styles.tabText, selectedTab === 'advanced' && styles.activeTabText]}>
              Settings
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'preview' && styles.activeTab]}
            onPress={() => setSelectedTab('preview')}
          >
            <MaterialIcons name="visibility" size={16} color={selectedTab === 'preview' ? '#10b981' : '#a1a1aa'} />
            <Text style={[styles.tabText, selectedTab === 'preview' && styles.activeTabText]}>
              Preview
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {selectedTab === 'planner' && renderPlannerContent()}
          {selectedTab === 'advanced' && renderAdvancedContent()}
          {selectedTab === 'preview' && renderPreviewContent()}
        </View>

        {/* Generate Button */}
        {renderGenerateButton()}
      </SafeAreaView>
    </Modal>
  );
}
