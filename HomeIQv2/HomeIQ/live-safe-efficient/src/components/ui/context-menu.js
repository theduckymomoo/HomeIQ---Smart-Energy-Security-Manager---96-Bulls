import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { Check, Circle, ChevronRight } from "lucide-react-native";

// Root context menu container
const ContextMenu = ({ visible, onClose, children }) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>{children}</View>
    </Modal>
  );
};

// Trigger button
const ContextMenuTrigger = ({ onPress, children }) => {
  return <TouchableOpacity onPress={onPress}>{children}</TouchableOpacity>;
};

// Menu content container
const ContextMenuContent = ({ children, style }) => {
  return <View style={[styles.content, style]}>{children}</View>;
};

// Menu item
const ContextMenuItem = ({ children, onPress, disabled, style }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.item, disabled && styles.disabled, style]}
    >
      <Text style={styles.itemText}>{children}</Text>
    </TouchableOpacity>
  );
};

// Checkbox item
const ContextMenuCheckboxItem = ({ children, checked, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.item}>
      {checked && <Check size={16} color="#000" style={{ marginRight: 8 }} />}
      <Text style={styles.itemText}>{children}</Text>
    </TouchableOpacity>
  );
};

// Radio item
const ContextMenuRadioItem = ({ children, selected, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.item}>
      {selected && <Circle size={12} color="#000" style={{ marginRight: 8 }} />}
      <Text style={styles.itemText}>{children}</Text>
    </TouchableOpacity>
  );
};

// Submenu trigger
const ContextMenuSubTrigger = ({ children, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.item}>
      <Text style={styles.itemText}>{children}</Text>
      <ChevronRight size={16} />
    </TouchableOpacity>
  );
};

// Label
const ContextMenuLabel = ({ children, style }) => {
  return <Text style={[styles.label, style]}>{children}</Text>;
};

// Separator
const ContextMenuSeparator = () => <View style={styles.separator} />;

// Shortcut text
const ContextMenuShortcut = ({ text, style }) => {
  return <Text style={[styles.shortcut, style]}>{text}</Text>;
};

// Group wrapper
const ContextMenuGroup = ({ children, style }) => {
  return <View style={style}>{children}</View>;
};

// Sub content container
const ContextMenuSubContent = ({ children, style }) => {
  return <View style={[styles.subContent, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  content: {
    backgroundColor: "#fff",
    borderRadius: 6,
    padding: 4,
    minWidth: 160,
  },
  subContent: {
    backgroundColor: "#fff",
    borderRadius: 6,
    padding: 4,
    marginLeft: 10,
    minWidth: 140,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  itemText: {
    fontSize: 14,
    color: "#000",
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    paddingHorizontal: 12,
    paddingVertical: 4,
    color: "#555",
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 4,
  },
  shortcut: {
    marginLeft: "auto",
    fontSize: 10,
    color: "#888",
    letterSpacing: 1,
  },
});

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
};
