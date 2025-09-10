import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from "react-native";

const SCREEN_HEIGHT = Dimensions.get("window").height;

const Drawer = ({ visible, onClose, children }) => {
  const [animation] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(animation, {
      toValue: visible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_HEIGHT, 0],
  });

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
      <Animated.View style={[styles.content, { transform: [{ translateY }] }]}>
        <View style={styles.handle} />
        {children}
      </Animated.View>
    </Modal>
  );
};

const DrawerTrigger = ({ onPress, children }) => {
  return <TouchableOpacity onPress={onPress}>{children}</TouchableOpacity>;
};

const DrawerClose = ({ onPress }) => {
  return <TouchableOpacity onPress={onPress} style={styles.closeButton}><Text>Close</Text></TouchableOpacity>;
};

const DrawerHeader = ({ children, style }) => {
  return <View style={[styles.header, style]}>{children}</View>;
};

const DrawerFooter = ({ children, style }) => {
  return <View style={[styles.footer, style]}>{children}</View>;
};

const DrawerTitle = ({ children, style }) => {
  return <Text style={[styles.title, style]}>{children}</Text>;
};

const DrawerDescription = ({ children, style }) => {
  return <Text style={[styles.description, style]}>{children}</Text>;
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  content: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 16,
    maxHeight: "80%",
  },
  handle: {
    width: 100,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#ccc",
    alignSelf: "center",
    marginBottom: 8,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 8,
  },
  header: {
    marginBottom: 8,
  },
  footer: {
    marginTop: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  description: {
    fontSize: 14,
    color: "#555",
  },
});

export {
  Drawer,
  DrawerTrigger,
  DrawerClose,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
