import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0b',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 48,
  },
  emptyIcon: {
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#a1a1aa',
    marginBottom: 28,
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyButton: {
    backgroundColor: '#10b981',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#a1a1aa',
  },
  exportButton: {
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  exportButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: (width - 56) / 2,
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#27272a',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#10b981',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#a1a1aa',
  },
  // Efficiency Card
  efficiencyCard: {
    backgroundColor: '#18181b',
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  efficiencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  efficiencyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  efficiencyContent: {
    alignItems: 'center',
  },
  efficiencyRating: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
  },
  efficiencyExcellent: {
    color: '#10b981',
  },
  efficiencyGood: {
    color: '#22c55e',
  },
  efficiencyFair: {
    color: '#f59e0b',
  },
  efficiencyPoor: {
    color: '#ef4444',
  },
  efficiencyDescription: {
    fontSize: 14,
    color: '#a1a1aa',
    textAlign: 'center',
    lineHeight: 20,
  },
  // Sections
  section: {
    marginHorizontal: 20,
    marginBottom: 8,
  },
  sectionHeaderButton: {
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#18181b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#a1a1aa',
    marginTop: 2,
  },
  expandIcon: {
    fontSize: 18,
    color: '#a1a1aa',
    fontWeight: '600',
  },
  sectionContent: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  // Charts Section
  chartsSection: {
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  chartControls: {
    gap: 12,
    marginBottom: 16,
  },
  timeRangeSelector: {
    flexDirection: 'row',
    backgroundColor: '#27272a',
    borderRadius: 8,
    padding: 4,
  },
  timeRangeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6,
  },
  timeRangeButtonActive: {
    backgroundColor: '#10b981',
  },
  timeRangeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#a1a1aa',
  },
  timeRangeTextActive: {
    color: '#ffffff',
  },
  chartSelector: {
    flexDirection: 'row',
    backgroundColor: '#27272a',
    borderRadius: 12,
    padding: 4,
  },
  chartButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  chartButtonActive: {
    backgroundColor: '#10b981',
  },
  chartButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#a1a1aa',
  },
  chartButtonTextActive: {
    color: '#ffffff',
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  emptyChart: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyChartText: {
    color: '#6b7280',
    marginTop: 12,
    fontSize: 14,
  },
  chartLegend: {
    alignItems: 'center',
  },
  chartLegendText: {
    fontSize: 12,
    color: '#a1a1aa',
    fontWeight: '600',
  },
  // Insights
  insightsGrid: {
    gap: 12,
  },
  insightCard: {
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#27272a',
    borderLeftWidth: 4,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  insightIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  insightBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
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
    marginBottom: 8,
    lineHeight: 20,
  },
  insightFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  insightImpact: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
  },
  insightAction: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '600',
  },
  // Tips
  tipsList: {
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#27272a',
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#a1a1aa',
    lineHeight: 20,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#18181b',
    borderRadius: 24,
    padding: 0,
    borderWidth: 1,
    borderColor: '#27272a',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#27272a',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#27272a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    padding: 20,
  },
  modalDescription: {
    fontSize: 15,
    color: '#a1a1aa',
    lineHeight: 22,
    marginBottom: 16,
  },
  modalSection: {
    marginTop: 16,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  modalListItem: {
    fontSize: 14,
    color: '#a1a1aa',
    marginBottom: 4,
    lineHeight: 20,
  },
  modalStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  modalStat: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#27272a',
    padding: 12,
    borderRadius: 8,
  },
  modalStatValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10b981',
    marginBottom: 4,
  },
  modalStatLabel: {
    fontSize: 12,
    color: '#a1a1aa',
  },
  modalDeviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#27272a',
    borderRadius: 6,
  },
  modalDeviceName: {
    flex: 1,
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
  modalDeviceUsage: {
    fontSize: 12,
    color: '#a1a1aa',
  },
  modalActionButton: {
    backgroundColor: '#10b981',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalActionText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalText: {
    color: '#ffffff',
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
  },
});