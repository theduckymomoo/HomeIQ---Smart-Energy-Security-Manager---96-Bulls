import * as React from "react";
import { View, Text, TouchableOpacity } from "react-native";

const badgeVariants = {
  default: {
    backgroundColor: "#007AFF",
    borderColor: "transparent",
    color: "white",
  },
  secondary: {
    backgroundColor: "#6B7280",
    borderColor: "transparent",
    color: "white",
  },
  destructive: {
    backgroundColor: "#EF4444",
    borderColor: "transparent",
    color: "white",
  },
  outline: {
    backgroundColor: "transparent",
    borderColor: "#E5E7EB",
    color: "black",
  },
};

const Badge = ({ 
  style, 
  variant = "default", 
  children, 
  onPress,
  ...props 
}) => {
  const variantStyle = badgeVariants[variant] || badgeVariants.default;
  
  const badgeContent = (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          borderRadius: 16,
          borderWidth: 1,
          paddingHorizontal: 10,
          paddingVertical: 4,
          alignSelf: "flex-start",
        },
        variantStyle,
        style,
      ]}
      {...props}
    >
      <Text
        style={{
          fontSize: 12,
          fontWeight: "600",
          color: variantStyle.color,
        }}
      >
        {children}
      </Text>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress}>
        {badgeContent}
      </TouchableOpacity>
    );
  }

  return badgeContent;
};

export { Badge, badgeVariants };