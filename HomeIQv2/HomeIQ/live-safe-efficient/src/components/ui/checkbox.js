import React, { forwardRef, useState } from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Check } from "lucide-react-native";

const Checkbox = forwardRef(({ style, disabled, value, onValueChange }, ref) => {
  const [checked, setChecked] = useState(value || false);

  const toggle = () => {
    if (disabled) return;
    const newValue = !checked;
    setChecked(newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <TouchableOpacity
      ref={ref}
      style={[styles.checkbox, checked && styles.checked, disabled && styles.disabled, style]}
      onPress={toggle}
      activeOpacity={0.7}
      disabled={disabled}
    >
      {checked && (
        <View style={styles.iconContainer}>
          <Check size={14} color="#fff" />
        </View>
      )}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#6200ee", // primary color
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  checked: {
    backgroundColor: "#6200ee", // primary background when checked
  },
  disabled: {
    opacity: 0.5,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export { Checkbox };
