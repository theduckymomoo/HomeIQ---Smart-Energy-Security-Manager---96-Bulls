import React from "react";
import { TextInput, StyleSheet } from "react-native";

type InputProps = React.ComponentProps<typeof TextInput>;

export const Input = React.forwardRef<TextInput, InputProps>(
  ({ style, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        style={[styles.input, style]} // merge custom styles
        placeholderTextColor="#999" // placeholder color
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

const styles = StyleSheet.create({
  input: {
    height: 40,
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
});

