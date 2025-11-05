// hooks/useNetworkStatus.js
import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

/**
 * Custom hook to monitor network connectivity status
 * @returns {object} Network status information
 */
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [connectionType, setConnectionType] = useState('unknown');
  const [isInternetReachable, setIsInternetReachable] = useState(true);

  useEffect(() => {
    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener(state => {
      const online = state.isConnected && state.isInternetReachable !== false;
      
      setIsOnline(online);
      setConnectionType(state.type);
      setIsInternetReachable(state.isInternetReachable);
      
      console.log(`📡 Network status: ${online ? 'ONLINE' : 'OFFLINE'} (${state.type})`);
    });

    // Initial check
    NetInfo.fetch().then(state => {
      const online = state.isConnected && state.isInternetReachable !== false;
      setIsOnline(online);
      setConnectionType(state.type);
      setIsInternetReachable(state.isInternetReachable);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  return {
    isOnline,
    isOffline: !isOnline,
    connectionType,
    isInternetReachable,
  };
};

// Alternative simpler hook if you only need online/offline status
export const useIsOnline = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected && state.isInternetReachable !== false);
    });

    return () => unsubscribe();
  }, []);

  return isOnline;
};

export default useNetworkStatus;
