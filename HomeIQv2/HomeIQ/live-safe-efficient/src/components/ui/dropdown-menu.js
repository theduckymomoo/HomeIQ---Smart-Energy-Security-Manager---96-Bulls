import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

const DropdownMenu = ({ children, visible, onClose }) => {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
      <View style={styles.content}>{children}</View>
    </Modal>
  );
};

const DropdownMenuTrigger = ({ onPress, children }) => {
  return <TouchableOpacity onPress={onPress}>{children}</TouchableOpacity>;
};

const DropdownMenuItem = ({ children, onPress, disabled }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.item, disabled && { opacity: 0.5 }]}
    >
      <Text>{children}</Text>
    </TouchableOpacity>
  );
};

const DropdownMenuCheckboxItem = ({ children, checked, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.item}>
      <Text>{checked ? "☑ " : "☐ "}{children}</Text>
    </TouchableOpacity>
  );
};

const DropdownMenuRadioItem = ({ children, selected, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.item}>
      <Text>{selected ? "🔘 " : "⚪ "}{children}</Text>
    </TouchableOpacity>
  );
};

const DropdownMenuLabel = ({ children }) => (
  <Text style={styles.label}>{children}</Text>
);

const DropdownMenuSeparator = () => (
  <View style={styles.separator} />
);

const DropdownMenuShortcut = ({ children }) => (
  <Text style={styles.shortcut}>{children}</Text>
);

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  content: {
    position: "absolute",
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 4,
    maxHeight: 300,
  },
  item: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    fontWeight: "600",
    fontSize: 12,
    color: "#555",
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 4,
  },
  shortcut: {
    marginLeft: "auto",
    fontSize: 10,
    color: "#888",
  },
});

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
};
