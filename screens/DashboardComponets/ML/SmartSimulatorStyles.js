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

  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },

  headerTitleContainer: {
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
  },

  headerSubtitle: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
    marginTop: 2,
  },

  // Tab Navigation - Match Analysis.js
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

  // Content
  tabContent: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 40,
  },

  // Cards - Match Analysis.js
  statusCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },

  settingsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },

  forecastCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },

  devicesCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },

  progressCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    alignItems: 'center',
  },

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

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  statItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },

  statLabel: {
    fontSize: 11,
    color: '#a1a1aa',
    fontWeight: '600',
    marginBottom: 4,
  },

  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#10b981',
  },

  // Settings
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },

  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
  },

  daySelector: {
    flexDirection: 'row',
    gap: 8,
  },

  dayButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },

  dayButtonActive: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },

  dayButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#a1a1aa',
  },

  dayButtonTextActive: {
    color: '#ffffff',
  },

  // Progress
  progressTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10b981',
    marginBottom: 8,
  },

  progressText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
    marginBottom: 12,
  },

  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 12,
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 8,
  },

  progressPercent: {
    fontSize: 24,
    fontWeight: '800',
    color: '#10b981',
    marginTop: 8,
  },

  // Buttons
  actionButtons: {
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 8,
  },

  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },

  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#10b981',
    gap: 8,
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  buttonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },

  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10b981',
  },

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 12,
    gap: 12,
  },

  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },

  // Device Cards
  deviceCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },

  deviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  deviceInfo: {
    flex: 1,
  },

  deviceName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 2,
  },

  deviceType: {
    fontSize: 12,
    color: '#a1a1aa',
    fontWeight: '500',
  },

  predictionBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  predictionText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#10b981',
  },

  // Chart
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 140,
    paddingVertical: 12,
    gap: 2,
  },

  barContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  bar: {
    width: '100%',
    minHeight: 20,
    borderRadius: 4,
    overflow: 'hidden',
    marginVertical: 4,
  },

  barGradient: {
    flex: 1,
  },

  barValue: {
    fontSize: 8,
    color: '#a1a1aa',
    fontWeight: '600',
    marginBottom: 2,
  },

  barLabel: {
    fontSize: 8,
    color: '#6c757d',
    fontWeight: '600',
    marginTop: 2,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },

  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#a1a1aa',
    marginTop: 12,
  },

  emptySubtext: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 4,
    fontWeight: '500',
  },

  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#d1d5db',
    fontWeight: '500',
    lineHeight: 18,
  },
});

export default styles;