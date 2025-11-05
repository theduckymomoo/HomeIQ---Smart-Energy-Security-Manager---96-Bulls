import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet, Animated, ScrollView } from 'react-native';

const EmergencyActions = () => {
  const [buttonStates, setButtonStates] = useState({
    security: new Animated.Value(0),
    neighbors: new Animated.Value(0),
    contact: new Animated.Value(0)
  });

  const callSecurity = () => {
    Linking.openURL('tel:1234567890');
  };

  const alertNeighbors = () => {
    alert('Neighbors alerted!');
  };

  const emergencyContact = () => {
    Linking.openURL('tel:0987654321');
  };

  const handlePressIn = (button) => {
    Animated.timing(buttonStates[button], {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (button) => {
    Animated.timing(buttonStates[button], {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const getButtonStyle = (button) => {
    const scale = buttonStates[button].interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.98]
    });

    const glowIntensity = buttonStates[button].interpolate({
      inputRange: [0, 1],
      outputRange: [0.4, 0.8]
    });

    return {
      transform: [{ scale }],
      shadowOpacity: glowIntensity,
    };
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionHeader}>Emergency Actions</Text>
      <Text style={styles.sectionSubtitle}>Quick access to emergency services and contacts</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.scrollContainer}
        contentContainerStyle={styles.emergencyContainer}
      >
        <Animated.View 
          style={[
            styles.buttonWrapper,
            getButtonStyle('security')
          ]}
        >
          <TouchableOpacity 
            style={styles.emergencyButton}
            onPress={callSecurity}
            onPressIn={() => handlePressIn('security')}
            onPressOut={() => handlePressOut('security')}
            activeOpacity={0.9}
          >
            <View style={styles.buttonGlow} />
            <Text style={styles.emergencyButtonText}>🚨 Call Security</Text>
          </TouchableOpacity>
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.buttonWrapper,
            getButtonStyle('neighbors')
          ]}
        >
          <TouchableOpacity 
            style={styles.emergencyButton}
            onPress={alertNeighbors}
            onPressIn={() => handlePressIn('neighbors')}
            onPressOut={() => handlePressOut('neighbors')}
            activeOpacity={0.9}
          >
            <View style={styles.buttonGlow} />
            <Text style={styles.emergencyButtonText}>🏘️ Alert Neighbors</Text>
          </TouchableOpacity>
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.buttonWrapper,
            getButtonStyle('contact')
          ]}
        >
          <TouchableOpacity 
            style={styles.emergencyButton}
            onPress={emergencyContact}
            onPressIn={() => handlePressIn('contact')}
            onPressOut={() => handlePressOut('contact')}
            activeOpacity={0.9}
          >
            <View style={styles.buttonGlow} />
            <Text style={styles.emergencyButtonText}>📞 Emergency Contact</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#000000',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#10b981',
    marginHorizontal: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#10b981',
    marginBottom: 8,
  },
  sectionSubtitle: {
    marginBottom: 15,
    color: '#9ca3af',
    fontSize: 14,
  },
  scrollContainer: {
    flexGrow: 0,
  },
  emergencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  buttonWrapper: {
    width: 140,
    height: 70,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 15,
    shadowOpacity: 0.4,
    elevation: 8,
  },
  emergencyButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#dc2626',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    shadowOpacity: 0.6,
    elevation: 6,
  },
  buttonGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(239, 68, 68, 0.8)',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 20,
    shadowOpacity: 0.9,
    elevation: 12,
  },
  emergencyButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    letterSpacing: 0.2,
    lineHeight: 16,
  },
});

export default EmergencyActions;