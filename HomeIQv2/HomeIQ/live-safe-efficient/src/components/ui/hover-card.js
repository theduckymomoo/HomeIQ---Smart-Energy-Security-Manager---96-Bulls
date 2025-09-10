import React, { useState } from "react";
import { View, Text, Modal, Pressable, StyleSheet } from "react-native";

export const HoverCard = ({ children }: { children: React.ReactNode }) => {
  return <View>{children}</View>;
};

export const HoverCardTrigger = ({ children, onOpen }: any) => {
  return (
    <Pressable onPress={onOpen}>
      {children}
    </Pressable>
  );
};

export const HoverCardContent = ({ visible, onClose, children }: any) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.card}>
          <Text>{children}</Text>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  card: {
    width: 250,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
});

