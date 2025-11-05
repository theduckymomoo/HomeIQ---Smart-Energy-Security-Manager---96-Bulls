import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  // Base Container
  container: {
    flex: 1,
    backgroundColor: '#0a0a0b',
  },

  // Header - Match Analysis.js
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    backgroundColor: '#0a0a0b',
  },

  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    flex: 1,
    letterSpacing: -0.5,
  },

  closeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },

  // Tab Navigation - Match Analysis.js chart controls
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 16,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },

  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 9,
    gap: 6,
  },

  activeTab: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },

  tabText: {
    color: '#a1a1aa',
    fontSize: 12,
    fontWeight: '700',
  },

  activeTabText: {
    color: '#10b981',
  },

  // Content Layout
  content: {
    flex: 1,
    backgroundColor: '#0a0a0b',
  },

  tabContentScroll: {
    flex: 1,
  },

  scrollContentContainer: {
    paddingBottom: 120,
  },

  // Section Styles - Match Analysis.js
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 6,
  },

  sectionDescription: {
    fontSize: 12,
    color: '#a1a1aa',
    fontWeight: '500',
    marginBottom: 12,
    lineHeight: 16,
  },

  // Day Type Selector - Match Analysis.js chart controls
  dayTypeSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },

  dayTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 9,
    gap: 6,
  },

  activeDayType: {
    backgroundColor: '#10b981',
  },

  dayTypeText: {
    color: '#a1a1aa',
    fontSize: 12,
    fontWeight: '700',
  },

  activeDayTypeText: {
    color: '#ffffff',
  },

  // Presets Section - Match Analysis.js container
  presetsSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },

  presetsGrid: {
    gap: 10,
  },

  presetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 12,
  },

  presetInfo: {
    flex: 1,
  },

  presetTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },

  presetDescription: {
    color: '#a1a1aa',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },

  // Device List - Match Analysis.js deviceItem
  deviceListContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },

  deviceScrollContainer: {
    maxHeight: 280,
  },

  deviceItem: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },

  selectedDeviceItem: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderBottomColor: '#10b981',
    borderBottomWidth: 2,
  },

  deviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  deviceInfo: {
    flex: 1,
  },

  deviceName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },

  deviceType: {
    color: '#a1a1aa',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },

  // Device Scheduler
  deviceScheduler: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },

  schedulerTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },

  // Hour Grid - Improved with drag support
  hourGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
    justifyContent: 'center',
  },

  hourButton: {
    width: (width - 88) / 6,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },

  activeHourButton: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
    borderWidth: 2,
  },

  hourText: {
    color: '#a1a1aa',
    fontSize: 11,
    fontWeight: '700',
  },

  activeHourText: {
    color: '#ffffff',
  },

  // Schedule Summary - Match Analysis.js statsRow
  scheduleSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },

  summaryItem: {
    alignItems: 'center',
  },

  summaryLabel: {
    color: '#a1a1aa',
    fontSize: 11,
    fontWeight: '500',
  },

  summaryValue: {
    color: '#10b981',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 4,
  },

  // Bottom Button Container - Fixed positioning
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0a0a0b',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },

  // Advanced Settings
  advancedSettings: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },

  settingRow: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },

  settingLabel: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },

  settingHelpText: {
    color: '#a1a1aa',
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 16,
    marginBottom: 10,
  },

  settingInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    minWidth: 80,
    alignSelf: 'center',
  },

  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },

  sliderValue: {
    color: '#10b981',
    fontSize: 14,
    fontWeight: '800',
    minWidth: 50,
    textAlign: 'center',
  },

  behaviorSlider: {
    flex: 1,
    height: 30,
  },

  // Preview Card
  previewCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginLeft: 10,
  },

  // Timeline View - ENHANCED
  timelineCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },

  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    gap: 12,
  },

  timelineDeviceInfo: {
    width: 100,
  },

  timelineDeviceName: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },

  timelineDeviceType: {
    color: '#a1a1aa',
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  },

  timelineHours: {
    flexDirection: 'row',
    flex: 1,
    gap: 1,
  },

  timelineHour: {
    flex: 1,
    height: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 3,
  },

  activeTimelineHour: {
    backgroundColor: '#10b981',
  },

  // Button Styles - Match Analysis.js fastRefreshButton
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },

  primaryButton: {
    backgroundColor: '#10b981',
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },

  buttonContent: {
    alignItems: 'center',
  },

  progressHint: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
    fontWeight: '500',
  },

  progressHintComplete: {
    fontSize: 11,
    color: '#10b981',
    marginTop: 4,
    fontWeight: '700',
  },

  // Progress Bar
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 10,
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 8,
  },

  // Info Card
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    gap: 12,
  },

  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#d1d5db',
    fontWeight: '500',
    lineHeight: 18,
  },

  // Copy Schedule Button
  copyScheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    alignSelf: 'center',
    marginTop: 12,
    gap: 6,
  },

  copyScheduleText: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '700',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },

  emptyStateText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#a1a1aa',
    marginTop: 12,
  },

  emptyStateSubtext: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 6,
    textAlign: 'center',
  },

  // Preview Stats - Match Analysis.js statsRow
  previewStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },

  previewStat: {
    alignItems: 'center',
  },

  previewStatLabel: {
    color: '#a1a1aa',
    fontSize: 11,
    fontWeight: '500',
  },

  previewStatValue: {
    color: '#10b981',
    fontSize: 16,
    fontWeight: '800',
    marginTop: 6,
  },
});

export default styles;
