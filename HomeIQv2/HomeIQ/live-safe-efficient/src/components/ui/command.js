import React, { forwardRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import { Search } from "lucide-react-native";

// Main Command Dialog
const CommandDialog = ({ visible, onClose, children }) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.dialog}>{children}</View>
      </View>
    </Modal>
  );
};

// Input with Search icon
const CommandInput = forwardRef(({ value, onChangeText, placeholder }, ref) => {
  return (
    <View style={styles.inputWrapper}>
      <Search size={16} color="#888" style={{ marginRight: 8 }} />
      <TextInput
        ref={ref}
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
      />
    </View>
  );
});

// Command list (like cmdk List)
const CommandList = forwardRef(({ data, renderItem }, ref) => {
  return <FlatList ref={ref} data={data} renderItem={renderItem} />;
});

// Empty state
const CommandEmpty = ({ text }) => {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
};

// Command group
const CommandGroup = ({ title, children }) => {
  return (
    <View style={styles.group}>
      {title && <Text style={styles.groupTitle}>{title}</Text>}
      {children}
    </View>
  );
};

// Command item
const CommandItem = forwardRef(({ children, onPress, disabled }, ref) => {
  return (
    <TouchableOpacity
      ref={ref}
      style={[styles.item, disabled && styles.itemDisabled]}
      onPress={onPress}
      disabled={disabled}
    >
      {children}
    </TouchableOpacity>
  );
});

// Shortcut text
const CommandShortcut = ({ text, style }) => {
  return <Text style={[styles.shortcut, style]}>{text}</Text>;
};

// Separator
const CommandSeparator = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  dialog: {
    width: "90%",
    backgroundColor: "#222",
    borderRadius: 8,
    padding: 0,
    maxHeight: "80%",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#555",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    height: 40,
    color: "#fff",
  },
  empty: {
    padding: 16,
    alignItems: "center",
  },
  emptyText: {
    color: "#888",
    fontSize: 14,
  },
  group: {
    paddingVertical: 4,
  },
  groupTitle: {
    color: "#aaa",
    fontSize: 12,
    fontWeight: "bold",
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  item: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  itemDisabled: {
    opacity: 0.5,
  },
  shortcut: {
    marginLeft: "auto",
    color: "#888",
    fontSize: 10,
    letterSpacing: 1,
  },
  separator: {
    height: 1,
    backgroundColor: "#555",
    marginVertical: 4,
  },
});

export {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
