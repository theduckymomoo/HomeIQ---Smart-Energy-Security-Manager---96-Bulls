import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  // Base Layout - Match Analysis.js
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

  // Loading States - Match Analysis.js
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

  // Header - Match Analysis.js exactly
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: 'transparent',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
    marginLeft: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10b981',
  },

  // Section Container - Match Analysis.js
  section: {
    marginHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginLeft: 10,
  },
  helperText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    fontWeight: '500',
    lineHeight: 16,
  },

  // Progress Bar - Match Analysis.js style
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 8,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },

  // Stats Grid - Match Analysis.js statsContainer
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 12,
  },
  statItem: {
    flex: 1,
    minWidth: (width - 80) / 4 - 5,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 14,
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

  // Button Grid - Match Analysis.js chart controls
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 12,
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    minWidth: (width - 80) / 2 - 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  actionButtonPrimary: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#a1a1aa',
  },
  dangerButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },

  // Card - Match Analysis.js deviceItem
  card: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 8,
    marginBottom: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardHeaderLeft: {
    flex: 1,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#a1a1aa',
    marginTop: 2,
    fontWeight: '500',
  },
  cardValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10b981',
    minWidth: 45,
    textAlign: 'right',
  },
  cardContent: {
    marginTop: 6,
    padding: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderRadius: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#10b981',
  },
  cardContentText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '500',
  },
  cardFooter: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  cardFooterText: {
    fontSize: 11,
    color: '#a1a1aa',
    fontWeight: '500',
  },

  // Expand Button - Match Analysis.js chart controls
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderRadius: 9,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  expandButtonText: {
    fontSize: 11,
    color: '#10b981',
    fontWeight: '700',
    marginLeft: 4,
  },
  expandedContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  expandedSection: {
    marginBottom: 8,
  },
  expandedLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10b981',
    marginBottom: 4,
  },
  expandedText: {
    fontSize: 12,
    color: '#a1a1aa',
    lineHeight: 18,
    fontWeight: '500',
  },

  // Empty State - Match Analysis.js noDataContainer
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    minHeight: 160,
  },
  emptyStateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#a1a1aa',
    marginTop: 10,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 16,
    lineHeight: 16,
  },

  // Fast Refresh Button - Match Analysis.js
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
  // Add these styles to your existing MLAnaStyles.js

// Statistics Cards - Match Analysis.js exactly
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
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  borderRadius: 16,
  padding: 14,
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

// Chart Controls - Match Analysis.js
chartControls: {
  paddingHorizontal: 20,
  marginBottom: 16,
},
chartTypeContainer: {
  flexDirection: 'row',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  borderRadius: 12,
  padding: 3,
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.08)',
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

// Section Title
sectionTitle: {
  fontSize: 16,
  fontWeight: '700',
  color: '#ffffff',
  marginBottom: 8,
},
subtitle: {
  fontSize: 14,
  color: '#a1a1aa',
  marginTop: 4,
  fontWeight: '500',
},
helperText: {
  fontSize: 12,
  color: '#6b7280',
  marginTop: 4,
  marginBottom: 12,
  fontWeight: '500',
  lineHeight: 16,
},

// Progress Bar
progressBar: {
  height: 8,
  backgroundColor: 'rgba(255, 255, 255, 0.08)',
  borderRadius: 8,
  marginBottom: 16,
  overflow: 'hidden',
},
progressFill: {
  height: '100%',
  backgroundColor: '#10b981',
  borderRadius: 8,
},

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

});

export default styles;
