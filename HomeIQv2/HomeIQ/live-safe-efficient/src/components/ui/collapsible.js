import React, { useState, useRef, useEffect } from "react";
import { Animated, TouchableOpacity, View, StyleSheet } from "react-native";

// Collapsible container
const Collapsible = ({ children, open: initialOpen = false, style }) => {
  const [open, setOpen] = useState(initialOpen);
  const animatedHeight = useRef(new Animated.Value(initialOpen ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: open ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [open]);

  return React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;
    // Pass open state and toggle function to triggers
    return React.cloneElement(child, { open, setOpen, animatedHeight });
  });
};

// Trigger button
const CollapsibleTrigger = ({ children, open, setOpen, style }) => {
  return (
    <TouchableOpacity onPress={() => setOpen(!open)} style={style}>
      {children}
    </TouchableOpacity>
  );
};

// Collapsible content
const CollapsibleContent = ({ children, animatedHeight, style }) => {
  const height = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 999], // large enough max height
  });

  return (
    <Animated.View style={[{ overflow: "hidden", height }, style]}>
      {children}
    </Animated.View>
  );
};

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
