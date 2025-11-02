// AnalysisStyles.js - Complete styles file with performance optimizations
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  // Base Layout
  container: {
    flex: 1,
    backgroundColor: '#0a0a0b',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
    flexGrow: 1,
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

  // Header Section
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: 'transparent', // CHANGED: removed gray background
  },
  pageTitle: {
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

  // Live Indicator
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
    marginRight: 6,
  },
  liveText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10b981',
  },

  // Statistics Cards - Optimized
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // CHANGED: lighter gray
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)', // CHANGED: lighter border
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

  // Chart Controls
  chartControls: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // CHANGED: lighter gray
    borderRadius: 12,
    padding: 3,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)', // CHANGED: lighter border
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 9,
    alignItems: 'center',
  },
  timeRangeButtonActive: {
    backgroundColor: '#10b981',
  },
  timeRangeText: {
    fontSize: 13,
    color: '#a1a1aa',
    fontWeight: '600',
  },
  timeRangeTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  chartTypeContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // CHANGED: lighter gray
    borderRadius: 12,
    padding: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)', // CHANGED: lighter border
  },
  chartTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 9,
  },
  chartTypeButtonActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  chartTypeText: {
    fontSize: 11,
    color: '#a1a1aa',
    marginLeft: 4,
    fontWeight: '600',
  },
  chartTypeTextActive: {
    color: '#10b981',
    fontWeight: '700',
  },

  // Chart Container - FIXED with proper sizing
  chartContainer: {
    marginHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.03)', // CHANGED: much lighter gray
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)', // CHANGED: lighter border
    overflow: 'visible',
  },
  chartHeader: {
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  chartSubtitle: {
    fontSize: 12,
    color: '#a1a1aa',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 16,
  },

  // Enhanced Bar Chart - FIXED dimensions
  barChartContainer: {
    width: '100%',
    minHeight: 300,
    paddingVertical: 8,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    height: 32,
    paddingHorizontal: 2,
  },
  deviceLabel: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
    width: 85,
    flexShrink: 0,
  },
  barContainer: {
    flex: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    marginHorizontal: 8,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 12,
    minWidth: 20,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 6,
  },
  barLabel: {
    fontSize: 9,
    color: '#ffffff',
    fontWeight: '700',
  },
  usageLabel: {
    fontSize: 10,
    color: '#a1a1aa',
    fontWeight: '500',
    width: 50,
    textAlign: 'right',
    flexShrink: 0,
  },

  // Enhanced Line Chart - FIXED dimensions
  lineChartContainer: {
    width: '100%',
    minHeight: 220,
    paddingVertical: 8,
  },
  lineChartWrapper: {
    flexDirection: 'row',
    height: 120,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    paddingBottom: 20,
    marginVertical: 12,
    backgroundColor: 'transparent', // CHANGED: removed gray background
    borderRadius: 8,
  },
  lineChartBar: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
    marginHorizontal: 1,
  },
  lineChartPoint: {
    backgroundColor: '#10b981',
    borderRadius: 2,
    marginBottom: 6,
    width: 4,
  },
  lineChartValue: {
    fontSize: 8,
    color: '#10b981',
    fontWeight: '600',
    marginBottom: 3,
    textAlign: 'center',
  },
  lineChartLabel: {
    fontSize: 7,
    color: '#a1a1aa',
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 3,
  },

  // Enhanced Pie Chart - FIXED dimensions
  pieChartContainer: {
    width: '100%',
    minHeight: 280,
    paddingVertical: 8,
    alignItems: 'center',
  },
  pieChartLegend: {
    width: '100%',
    marginTop: 16,
  },
  pieChartLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.03)', // CHANGED: lighter gray
    borderRadius: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)', // CHANGED: lighter border
  },
  pieChartLegendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  pieChartLegendText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '500',
    flex: 1,
  },

  // Chart Legend
  chartLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
    paddingHorizontal: 6,
    paddingVertical: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.02)', // CHANGED: lighter gray
    borderRadius: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  legendText: {
    fontSize: 9,
    color: '#a1a1aa',
    fontWeight: '500',
  },

  // No Data States - Optimized
  noDataContainer: {
    minHeight: 160,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: 'transparent', // CHANGED: removed gray background
    borderRadius: 8,
    marginVertical: 6,
  },
  noDataText: {
    fontSize: 14,
    color: '#a1a1aa',
    marginTop: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  noDataSubtext: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 16,
    lineHeight: 16,
  },

  // Active Devices Section
  activeDevicesContainer: {
    marginHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.03)', // CHANGED: lighter gray
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)', // CHANGED: lighter border
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
  },
  deviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 8,
    marginBottom: 4,
    backgroundColor: 'transparent', // CHANGED: removed gray background
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  deviceDetails: {
    marginLeft: 12,
    flex: 1,
  },
  deviceName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
  deviceRoom: {
    fontSize: 12,
    color: '#a1a1aa',
    marginTop: 2,
    fontWeight: '500',
  },
  devicePowerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  devicePower: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10b981',
    minWidth: 45,
    textAlign: 'right',
  },

  // Info boxes
  chartInfoBox: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartInfoText: {
    fontSize: 10,
    color: '#3b82f6',
    fontWeight: '500',
    textAlign: 'center',
    marginLeft: 4,
  },

  // Debug info
  debugInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 8,
    margin: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  debugText: {
    color: '#ffffff',
    fontSize: 11,
    fontFamily: 'monospace',
    lineHeight: 14,
  },

  // COMPLETE MODAL STYLES
  modalContainer: {
    flex: 1,
    backgroundColor: '#0a0a0b',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: 'transparent', // CHANGED: removed gray background
  },
  modalCancel: {
    fontSize: 16,
    color: '#10b981',
    fontWeight: '600',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    flex: 1,
  },
  modalSummary: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: 'transparent', // CHANGED: removed gray background
    gap: 12,
  },
  modalSummaryItem: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // CHANGED: lighter gray
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)', // CHANGED: lighter border
  },
  modalSummaryValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
    marginTop: 4,
  },
  modalSummaryLabel: {
    fontSize: 11,
    color: '#a1a1aa',
    marginTop: 2,
    fontWeight: '500',
    textAlign: 'center',
  },

  // Room Modal Items
  roomModalItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)', // CHANGED: lighter gray
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)', // CHANGED: lighter border
  },
  roomModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  roomModalDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  roomModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  roomModalPower: {
    fontSize: 20,
    fontWeight: '800',
    color: '#10b981',
    textAlign: 'right',
  },
  roomModalPercentage: {
    fontSize: 12,
    color: '#a1a1aa',
    fontWeight: '600',
    textAlign: 'right',
    marginTop: 2,
  },
  roomModalStats: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  roomModalStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
  roomModalStatText: {
    fontSize: 11,
    color: '#a1a1aa',
    fontWeight: '500',
  },
  roomModalDevices: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: 12,
  },
  roomModalDevicesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  roomModalDevice: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    gap: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 6,
    marginBottom: 3,
  },
  roomModalDeviceName: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
    color: '#ffffff',
  },
  roomModalDevicePower: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10b981',
    minWidth: 45,
    textAlign: 'right',
  },

  // Real-time Data Section - Simplified
  realTimeContainer: {
    marginHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.03)', // CHANGED: lighter gray
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)', // CHANGED: lighter border
  },
  realTimeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  liveIndicatorSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveDotSmall: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
    marginRight: 4,
  },
  liveTextSmall: {
    fontSize: 10,
    fontWeight: '700',
    color: '#10b981',
  },
  dataPoint: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 6,
    marginBottom: 3,
    backgroundColor: 'transparent', // CHANGED: removed gray background
  },
  dataTime: {
    fontSize: 11,
    color: '#a1a1aa',
    fontWeight: '500',
    width: 65,
  },
  dataValue: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },

  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 30,
    minHeight: 200,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    marginTop: 12,
    marginBottom: 6,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#a1a1aa',
    textAlign: 'center',
    lineHeight: 20,
  },

  // Performance optimized styles
  fastRefreshButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'center',
    marginVertical: 10,
  },
  fastRefreshText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },

  // Utility Classes
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  flex1: {
    flex: 1,
  },
  textCenter: {
    textAlign: 'center',
  },
  textBold: {
    fontWeight: '700',
  },
  textMedium: {
    fontWeight: '500',
  },
  marginBottom8: {
    marginBottom: 8,
  },
  marginBottom12: {
    marginBottom: 12,
  },
  marginBottom16: {
    marginBottom: 16,
  },
  paddingHorizontal8: {
    paddingHorizontal: 8,
  },
  paddingHorizontal12: {
    paddingHorizontal: 12,
  },
  paddingHorizontal16: {
    paddingHorizontal: 16,
  },
  paddingVertical8: {
    paddingVertical: 8,
  },
  paddingVertical12: {
    paddingVertical: 12,
  },
  borderRadius8: {
    borderRadius: 8,
  },
  borderRadius12: {
    borderRadius: 12,
  },
  borderRadius16: {
    borderRadius: 16,
  },

  // Color utilities
  textPrimary: {
    color: '#ffffff',
  },
  textSecondary: {
    color: '#a1a1aa',
  },
  textMuted: {
    color: '#6b7280',
  },
  textSuccess: {
    color: '#10b981',
  },
  textWarning: {
    color: '#f59e0b',
  },
  textError: {
    color: '#ef4444',
  },
  textInfo: {
    color: '#3b82f6',
  },
  bgTransparent: {
    backgroundColor: 'transparent',
  },
  bgPrimary: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // CHANGED: lighter gray
  },
  bgSecondary: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)', // CHANGED: lighter gray
  },
  bgSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  bgWarning: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  bgError: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  bgInfo: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
  },
});
