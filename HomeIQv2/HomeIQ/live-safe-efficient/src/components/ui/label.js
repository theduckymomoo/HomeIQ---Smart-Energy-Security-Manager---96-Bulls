import React from "react";
import { Text, StyleSheet, TextProps } from "react-native";

type LabelProps = TextProps & {
  disabled?: boolean;
};

export const Label = React.forwardRef<Text, LabelProps>(
  ({ style, disabled, ...props }, ref) => {
    return (
      <Text
        ref={ref}
        style={[
          styles.label,
          disabled && styles.disabled,
          style, // allow overrides
        ]}
        {...props}
      />
    );
  }
);

Label.displayName = "Label";

const styles = StyleSheet.create({
  label: {
    fontSize: 14, // matches `text-sm`
    fontWeight: "500", // matches `font-medium`
    lineHeight: 18, // close to `leading-none`
    color: "#000",
  },
  disabled: {
    opacity: 0.7,
  },
});

