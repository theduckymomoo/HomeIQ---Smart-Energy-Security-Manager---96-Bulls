import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  // Base Layout
  container: {
    flex: 1,
    backgroundColor: '#0a0a0b',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
    flexGrow: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: 'transparent',
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#a1a1aa',
    marginTop: 4,
    fontWeight: '500',
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  exportButtonText: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '700',
    marginLeft: 6,
  },

  // Loading States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0a0b',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#a1a1aa',
    fontWeight: '500',
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#a1a1aa',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    minWidth: (width - 60) / 2 - 5,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    minHeight: 90,
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
    marginTop: 6,
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#a1a1aa',
    marginTop: 4,
    fontWeight: '500',
    textAlign: 'center',
  },

  // ML Status Card Styles
  mlStatusCard: {
    marginHorizontal: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  mlStatusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  mlStatusTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginLeft: 10,
  },
  mlStatusContent: {
    marginTop: 8,
  },
  progressBarContainer: {
    marginBottom: 12,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#8b5cf6',
    borderRadius: 8,
  },
  progressText: {
    fontSize: 12,
    color: '#a1a1aa',
    fontWeight: '500',
  },
  mlStatusDescription: {
    fontSize: 13,
    color: '#a1a1aa',
    lineHeight: 18,
    marginBottom: 16,
  },
  trainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    gap: 6,
  },
  trainButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  mlActionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  smallActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    gap: 4,
  },
  smallActionButtonText: {
    color: '#10b981',
    fontSize: 11,
    fontWeight: '600',
  },
  mlMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  mlMetric: {
    alignItems: 'center',
  },
  mlMetricValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
  },
  mlMetricLabel: {
    fontSize: 10,
    color: '#a1a1aa',
    marginTop: 2,
    fontWeight: '500',
  },
  retrainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    gap: 4,
    alignSelf: 'center',
  },
  retrainButtonText: {
    color: '#8b5cf6',
    fontSize: 11,
    fontWeight: '600',
  },

  // Section Styles
  section: {
    marginHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  sectionHeaderButton: {
    marginBottom: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#a1a1aa',
    marginTop: 2,
    fontWeight: '500',
  },
  expandIcon: {
    fontSize: 14,
    color: '#a1a1aa',
    fontWeight: '600',
  },
  sectionContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },

  // Prediction Styles
  predictionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  predictionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  predictionDeviceName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  predictionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    minWidth: 45,
    alignItems: 'center',
  },
  predictionActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  predictionInactive: {
    backgroundColor: 'rgba(161, 161, 170, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(161, 161, 170, 0.3)',
  },
  predictionBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },
  predictionText: {
    fontSize: 12,
    color: '#a1a1aa',
    marginBottom: 8,
    lineHeight: 16,
  },
  confidenceBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 2,
  },

  // Recommendation Styles
  recommendationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderLeftWidth: 3,
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recommendationType: {
    fontSize: 10,
    fontWeight: '800',
    color: '#a1a1aa',
    letterSpacing: 0.5,
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#ffffff',
    textTransform: 'uppercase',
  },
  recommendationText: {
    fontSize: 13,
    color: '#ffffff',
    lineHeight: 18,
    marginBottom: 6,
  },
  savingsText: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
    marginBottom: 4,
  },
  confidenceText: {
    fontSize: 11,
    color: '#a1a1aa',
    fontWeight: '500',
  },

  // Efficiency Card
  efficiencyCard: {
    marginHorizontal: 20,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  efficiencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  efficiencyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginLeft: 10,
  },
  efficiencyContent: {
    alignItems: 'center',
  },
  efficiencyRating: {
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: -1,
  },
  efficiencyExcellent: {
    color: '#10b981',
  },
  efficiencyGood: {
    color: '#3b82f6',
  },
  efficiencyFair: {
    color: '#f59e0b',
  },
  efficiencyPoor: {
    color: '#ef4444',
  },
  efficiencyDescription: {
    fontSize: 13,
    color: '#a1a1aa',
    textAlign: 'center',
    lineHeight: 18,
  },

  // Chart Controls
  chartControls: {
    marginBottom: 16,
  },
  timeRangeSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 3,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  timeRangeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 9,
    gap: 4,
  },
  timeRangeButtonActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  timeRangeText: {
    fontSize: 11,
    color: '#a1a1aa',
    fontWeight: '600',
  },
  timeRangeTextActive: {
    color: '#10b981',
    fontWeight: '700',
  },
  chartSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  chartButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 9,
    gap: 4,
  },
  chartButtonActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  chartButtonText: {
    fontSize: 11,
    color: '#a1a1aa',
    fontWeight: '600',
  },
  chartButtonTextActive: {
    color: '#10b981',
    fontWeight: '700',
  },

  // Charts Section
  chartsSection: {
    marginTop: 8,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  chart: {
    borderRadius: 16,
  },
  chartLegend: {
    marginTop: 12,
    alignItems: 'center',
  },
  chartLegendText: {
    fontSize: 11,
    color: '#a1a1aa',
    fontWeight: '500',
  },
  emptyChart: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyChartText: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 8,
    fontWeight: '500',
  },

  // Energy Forecast
  forecastSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  forecastStat: {
    alignItems: 'center',
  },
  forecastStatValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
  },
  forecastStatLabel: {
    fontSize: 11,
    color: '#a1a1aa',
    marginTop: 2,
    fontWeight: '500',
  },

  // Insights Grid
  insightsGrid: {
    gap: 12,
  },
  insightCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderLeftWidth: 3,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  insightIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  insightBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  insightTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 6,
  },
  insightDescription: {
    fontSize: 13,
    color: '#a1a1aa',
    lineHeight: 18,
    marginBottom: 10,
  },
  insightFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  insightImpact: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10b981',
  },
  insightAction: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3b82f6',
  },

  // Anomaly Styles
  anomalyContainer: {
    marginHorizontal: 20,
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  anomalyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  anomalyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginLeft: 10,
  },
  anomalyCard: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  anomalyMessage: {
    fontSize: 13,
    color: '#ffffff',
    lineHeight: 18,
    marginBottom: 8,
  },
  anomalyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  anomalyDetailText: {
    fontSize: 11,
    color: '#f59e0b',
    fontWeight: '600',
  },

  // Tips List
  tipsList: {
    gap: 8,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 10,
    gap: 8,
  },
  tipText: {
    fontSize: 12,
    color: '#a1a1aa',
    flex: 1,
    lineHeight: 16,
  },

  // Info Card
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    gap: 10,
  },
  infoText: {
    fontSize: 12,
    color: '#a1a1aa',
    lineHeight: 18,
    flex: 1,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#18181b',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    maxHeight: '80%',
    minWidth: width - 80,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalContent: {
    maxHeight: 400,
  },
  modalDescription: {
    fontSize: 14,
    color: '#a1a1aa',
    lineHeight: 20,
    marginBottom: 16,
  },
  modalSection: {
    marginBottom: 16,
  },
  modalSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  modalListItem: {
    fontSize: 13,
    color: '#a1a1aa',
    marginBottom: 4,
  },
  modalStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  modalStat: {
    alignItems: 'center',
  },
  modalStatValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#10b981',
  },
  modalStatLabel: {
    fontSize: 11,
    color: '#a1a1aa',
    marginTop: 2,
  },
  modalActionButton: {
    backgroundColor: '#10b981',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  modalActionText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  modalText: {
    fontSize: 14,
    color: '#a1a1aa',
    marginTop: 12,
    textAlign: 'center',
  },

  // Progress Bar Fill
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 8,
  },
});

export default styles;
