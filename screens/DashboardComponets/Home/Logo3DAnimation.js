import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const Logo3DAnimation = ({ size = 100, icon = 'flash-on', color = '#10b981' }) => {
  const rotateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Continuous Y-axis rotation - THIS CREATES THE SPIN
    Animated.loop(
      Animated.timing(rotateY, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Breathing scale effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Rotation interpolation
  const spin = rotateY.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Single rotating container with 3D perspective */}
      <Animated.View
        style={[
          styles.iconWrapper,
          {
            width: size * 0.7,
            height: size * 0.7,
            borderRadius: size * 0.35,
            transform: [
              { perspective: 1000 },
              { rotateY: spin },
              { scale },
            ],
          },
        ]}
      >
        <View
          style={[
            styles.iconContainer,
            {
              width: size * 0.7,
              height: size * 0.7,
              borderRadius: size * 0.35,
              backgroundColor: `${color}20`,
              shadowColor: color,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.6,
              shadowRadius: 16,
              elevation: 15,
            },
          ]}
        >
          <MaterialIcons name={icon} size={size * 0.4} color={color} />
        </View>
      </Animated.View>

      {/* Pulsing glow effect */}
      <Animated.View
        style={[
          styles.glow,
          {
            width: size * 0.85,
            height: size * 0.85,
            borderRadius: size * 0.425,
            transform: [{ scale }],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: 'rgba(16, 185, 129, 0.5)',
  },
  glow: {
    position: 'absolute',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    pointerEvents: 'none',
  },
});

export default Logo3DAnimation;
