import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { X } from "lucide-react-native";

const Dialog = ({ visible, onClose, children, ...props }) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} {...props}>
      <View style={styles.overlay}>
        {children}
      </View>
    </Modal>
  );
};

const DialogOverlay = () => <View style={styles.overlay} />;

const DialogContent = ({ children, style }) => {
  return <View style={[styles.content, style]}>{children}</View>;
};

const DialogHeader = ({ children, style }) => {
  return <View style={[styles.header, style]}>{children}</View>;
};

const DialogFooter = ({ children, style }) => {
  return <View style={[styles.footer, style]}>{children}</View>;
};

const DialogTitle = ({ children, style }) => {
  return <Text style={[styles.title, style]}>{children}</Text>;
};

const DialogDescription = ({ children, style }) => {
  return <Text style={[styles.description, style]}>{children}</Text>;
};

const DialogClose = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.closeButton}>
      <X size={20} color="#000" />
    </TouchableOpacity>
  );
};

const DialogTrigger = ({ onPress, children }) => {
  return <TouchableOpacity onPress={onPress}>{children}</TouchableOpacity>;
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    marginBottom: 10,
    alignItems: "center",
  },
  footer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
  },
});

export {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogTrigger,
};
