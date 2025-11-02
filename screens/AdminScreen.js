import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function AdminScreen() {
  const { supabase, user, userProfile, signOut } = useAuth();
  const navigation = useNavigation();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDevices: 0,
    activeDevices: 0,
    monthlyEnergy: 0,
    recentUsers: [],
  });

  useEffect(() => {
    checkAdminAccess();
    fetchAdminStats();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        Alert.alert(
          'Access Denied',
          'You do not have admin privileges',
          [
            {
              text: 'OK',
              onPress: () => navigation.replace('Dashboard'),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      navigation.replace('Dashboard');
    }
  };

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      
      // Fetch total users
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch total devices
      const { count: deviceCount } = await supabase
        .from('appliances')
        .select('*', { count: 'exact', head: true });

      // Fetch active devices
      const { count: activeCount } = await supabase
        .from('appliances')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'on');

      // Fetch recent users
      const { data: recentUsers } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, created_at, role')
        .order('created_at', { ascending: false })
        .limit(5);

      setStats({
        totalUsers: userCount || 0,
        totalDevices: deviceCount || 0,
        activeDevices: activeCount || 0,
        monthlyEnergy: 1247.5, // This would come from your energy_logs table
        recentUsers: recentUsers || [],
      });
      
      setLastRefreshed(new Date());
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      Alert.alert('Error', 'Failed to load admin statistics');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAdminStats();
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  const formatDate = (date) => {
    if (!date) return 'Never';
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date);
  };

  const formatUserDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const StatCard = ({ icon, title, value, subtitle, color, trend }) => (
    <View style={styles.statCard}>
      <View style={styles.statHeader}>
        <View style={[styles.statIconContainer, { backgroundColor: `${color}15` }]}>
          <MaterialIcons name={icon} size={24} color={color} />
        </View>
        {trend !== undefined && (
          <View style={styles.trendBadge}>
            <MaterialIcons 
              name={trend >= 0 ? 'trending-up' : 'trending-down'} 
              size={14} 
              color={trend >= 0 ? '#10b981' : '#ef4444'} 
            />
            <Text style={[styles.trendText, { color: trend >= 0 ? '#10b981' : '#ef4444' }]}>
              {Math.abs(trend)}%
            </Text>
          </View>
        )}
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const ActionCard = ({ icon, title, subtitle, onPress, color }) => (
    <TouchableOpacity 
      style={styles.actionCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.actionIconContainer, { backgroundColor: `${color}15` }]}>
        <MaterialIcons name={icon} size={28} color={color} />
      </View>
      <View style={styles.actionContent}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionSubtitle}>{subtitle}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#71717a" />
    </TouchableOpacity>
  );

  const UserListItem = ({ user }) => {
    const initials = user.first_name?.[0]?.toUpperCase() || user.email[0].toUpperCase();
    const fullName = user.first_name && user.last_name 
      ? `${user.first_name} ${user.last_name}`
      : user.email;
    
    return (
      <TouchableOpacity 
        style={styles.userItem}
        onPress={() => navigation.navigate('ManageUsers')}
        activeOpacity={0.7}
      >
        <View style={styles.userAvatar}>
          <Text style={styles.userAvatarText}>{initials}</Text>
        </View>
        <View style={styles.userInfo}>
          <View style={styles.userNameRow}>
            <Text style={styles.userName}>{fullName}</Text>
            {user.role === 'admin' && (
              <View style={styles.adminBadge}>
                <MaterialIcons name="shield" size={12} color="#ef4444" />
                <Text style={styles.adminBadgeText}>ADMIN</Text>
              </View>
            )}
          </View>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
        <Text style={styles.userDate}>{formatUserDate(user.created_at)}</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0a0a0b" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8b5cf6" />
          <Text style={styles.loadingText}>Loading Admin Panel...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0b" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.adminBadgeHeader}>
            <MaterialIcons name="shield" size={20} color="#8b5cf6" />
          </View>
          <View>
            <Text style={styles.headerTitle}>Admin Panel</Text>
            <Text style={styles.headerSubtitle}>
              {userProfile?.first_name || 'Administrator'}
            </Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.signOutButton}
          onPress={handleSignOut}
        >
          <MaterialIcons name="logout" size={22} color="#ef4444" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#8b5cf6"
            colors={['#8b5cf6']}
          />
        }
      >
        {/* Last Updated */}
        {lastRefreshed && (
          <View style={styles.lastUpdatedContainer}>
            <MaterialIcons name="schedule" size={14} color="#71717a" />
            <Text style={styles.lastUpdatedText}>
              Updated {formatDate(lastRefreshed)}
            </Text>
          </View>
        )}

        {/* Statistics Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            <StatCard
              icon="people"
              title="Total Users"
              value={stats.totalUsers}
              subtitle="Registered"
              color="#8b5cf6"
              trend={12.5}
            />
            <StatCard
              icon="devices"
              title="Total Devices"
              value={stats.totalDevices}
              subtitle="Connected"
              color="#3b82f6"
              trend={8.3}
            />
          </View>
          <View style={styles.statsGrid}>
            <StatCard
              icon="check-circle"
              title="Active Devices"
              value={stats.activeDevices}
              subtitle="Currently On"
              color="#10b981"
              trend={-3.2}
            />
            <StatCard
              icon="bolt"
              title="Energy Usage"
              value={`${stats.monthlyEnergy} kWh`}
              subtitle="This Month"
              color="#f59e0b"
              trend={5.7}
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <ActionCard
            icon="people"
            title="Manage Users"
            subtitle="View and manage user accounts"
            onPress={() => navigation.navigate('ManageUsers')}
            color="#8b5cf6"
          />
          
          <ActionCard
            icon="devices"
            title="Manage Devices"
            subtitle="Monitor all connected devices"
            onPress={() => navigation.navigate('ManageDevices')}
            color="#3b82f6"
          />
          
          <ActionCard
            icon="assessment"
            title="View Reports"
            subtitle="Analytics and usage reports"
            onPress={() => navigation.navigate('Reports')}
            color="#10b981"
          />
          
          <ActionCard
            icon="settings"
            title="System Settings"
            subtitle="Configure system preferences"
            onPress={() => navigation.navigate('SystemSettings')}
            color="#f59e0b"
          />
        </View>

        {/* Recent Users */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Users</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ManageUsers')}>
              <Text style={styles.sectionLink}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.usersList}>
            {stats.recentUsers.length > 0 ? (
              stats.recentUsers.map((user) => (
                <UserListItem key={user.id} user={user} />
              ))
            ) : (
              <View style={styles.emptyState}>
                <MaterialIcons name="people-outline" size={48} color="#3f3f46" />
                <Text style={styles.emptyStateText}>No users yet</Text>
              </View>
            )}
          </View>
        </View>

        {/* Bottom Padding */}
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0b',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#a1a1aa',
    fontSize: 16,
    marginTop: 16,
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  adminBadgeHeader: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#a1a1aa',
    marginTop: 2,
  },
  signOutButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  lastUpdatedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  lastUpdatedText: {
    fontSize: 13,
    color: '#71717a',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
  },
  sectionLink: {
    fontSize: 14,
    color: '#8b5cf6',
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  statIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  trendText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statValue: {
    fontSize: 26,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 13,
    color: '#a1a1aa',
    fontWeight: '600',
  },
  statSubtitle: {
    fontSize: 11,
    color: '#71717a',
    marginTop: 2,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 13,
    color: '#a1a1aa',
  },
  usersList: {
    gap: 12,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#8b5cf6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userAvatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  userInfo: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  adminBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ef4444',
  },
  userEmail: {
    fontSize: 13,
    color: '#a1a1aa',
  },
  userDate: {
    fontSize: 12,
    color: '#71717a',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#71717a',
    marginTop: 12,
  },
});
