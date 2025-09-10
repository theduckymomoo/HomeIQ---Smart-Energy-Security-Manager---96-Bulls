import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  FlatList,
} from "react-native";
import { Check, ChevronRight, Circle } from "lucide-react-native";

// Root Menubar (horizontal container)
export const Menubar = ({ children }: { children: React.ReactNode }) => {
  return <View style={styles.menubar}>{children}</View>;
};

// Trigger button
export const MenubarTrigger = ({ label, onPress }: any) => (
  <Pressable style={styles.trigger} onPress={onPress}>
    <Text style={styles.triggerText}>{label}</Text>
  </Pressable>
);

// Menu content (modal dropdown)
export const MenubarContent = ({ visible, onClose, items }: any) => (
  <Modal transparent visible={visible} animationType="fade">
    <Pressable style={styles.overlay} onPress={onClose}>
      <View style={styles.menu}>
        <FlatList
          data={items}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <MenubarItem
              label={item.label}
              shortcut={item.shortcut}
              checked={item.checked}
              radio={item.radio}
              onPress={item.onPress}
            />
          )}
        />
      </View>
    </Pressable>
  </Modal>
);

// Basic item
export const MenubarItem = ({ label, shortcut, onPress, checked, radio }: any) => (
  <Pressable style={styles.item} onPress={onPress}>
    {checked && <Check size={16} style={styles.iconLeft} />}
    {radio && <Circle size={8} style={styles.iconLeft} />}
    <Text style={styles.itemText}>{label}</Text>
    {shortcut && <Text style={styles.shortcut}>{shortcut}</Text>}
  </Pressable>
);

// Separator
export const MenubarSeparator = () => <View style={styles.separator} />;

// Label
export const MenubarLabel = ({ children }: { children: React.ReactNode }) => (
  <Text style={styles.label}>{children}</Text>
);

const styles = StyleSheet.create({
  menubar: {
    flexDirection: "row",
    height: 40,
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    backgroundColor: "#fff",
  },
  trigger: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  triggerText: {
    fontSize: 14,
    fontWeight: "500",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  menu: {
    minWidth: 200,
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingVertical: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  itemText: {
    fontSize: 14,
    flex: 1,
  },
  shortcut: {
    fontSize: 12,
    color: "#888",
    marginLeft: 8,
  },
  iconLeft: {
    marginRight: 8,
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
});
