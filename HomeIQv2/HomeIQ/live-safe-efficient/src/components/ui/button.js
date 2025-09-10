import * as React from "react";
import { TouchableOpacity, Text, View, Animated } from "react-native";

const buttonVariants = {
  default: {
    backgroundColor: "#007AFF",
    color: "white",
    shadow: true,
    hoverEffect: true,
  },
  destructive: {
    backgroundColor: "#EF4444",
    color: "white",
    shadow: true,
    hoverEffect: true,
  },
  outline: {
    backgroundColor: "transparent",
    borderColor: "#E5E7EB",
    borderWidth: 1,
    color: "black",
    shadow: true,
    hoverEffect: false,
  },
  secondary: {
    backgroundColor: "#6B7280",
    color: "white",
    shadow: true,
    hoverEffect: true,
  },
  ghost: {
    backgroundColor: "transparent",
    color: "black",
    shadow: false,
    hoverEffect: false,
  },
  link: {
    backgroundColor: "transparent",
    color: "#007AFF",
    textDecorationLine: "underline",
    shadow: false,
    hoverEffect: false,
  },
  hero: {
    backgroundColor: "linear-gradient(to right, #007AFF, #0056CC)",
    color: "white",
    shadow: true,
    hoverEffect: true,
    gradient: true,
  },
  emergency: {
    backgroundColor: "#DC2626",
    color: "white",
    shadow: true,
    hoverEffect: true,
    pulse: true,
  },
  fire: {
    backgroundColor: "linear-gradient(to right, #FF6B35, #DC2626)",
    color: "white",
    shadow: true,
    hoverEffect: true,
    gradient: true,
  },
  glass: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
    color: "black",
    shadow: true,
    hoverEffect: true,
    backdrop: true,
  },
};

const buttonSizes = {
  default: {
    height: 40,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  sm: {
    height: 36,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  lg: {
    height: 44,
    paddingHorizontal: 32,
    paddingVertical: 10,
    borderRadius: 6,
  },
  icon: {
    height: 40,
    width: 40,
    borderRadius: 8,
    padding: 0,
  },
};

const Button = React.forwardRef(({
  style,
  variant = "default",
  size = "default",
  children,
  disabled,
  onPress,
  onPressIn,
  onPressOut,
  ...props
}, ref) => {
  const [isPressed, setIsPressed] = React.useState(false);
  const scaleValue = React.useRef(new Animated.Value(1)).current;
  const opacityValue = React.useRef(new Animated.Value(1)).current;

  const variantStyle = buttonVariants[variant] || buttonVariants.default;
  const sizeStyle = buttonSizes[size] || buttonSizes.default;

  const handlePressIn = () => {
    setIsPressed(true);
    if (variantStyle.hoverEffect) {
      Animated.spring(scaleValue, {
        toValue: 1.05,
        useNativeDriver: true,
      }).start();
    }
    onPressIn?.();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    if (variantStyle.hoverEffect) {
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
    onPressOut?.();
  };

  const baseStyle = {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    opacity: disabled ? 0.5 : 1,
  };

  const getBackgroundColor = () => {
    if (variantStyle.gradient) {
      // For gradient backgrounds, you might want to use a separate gradient component
      return variant === "fire" ? "#FF6B35" : "#007AFF";
    }
    return variantStyle.backgroundColor;
  };

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleValue }],
          opacity: opacityValue,
        },
      ]}
    >
      <TouchableOpacity
        ref={ref}
        disabled={disabled}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          baseStyle,
          sizeStyle,
          {
            backgroundColor: getBackgroundColor(),
            borderColor: variantStyle.borderColor,
            borderWidth: variantStyle.borderWidth || 0,
            shadowColor: variantStyle.shadow ? "#000" : "transparent",
            shadowOffset: variantStyle.shadow ? { width: 0, height: 2 } : undefined,
            shadowOpacity: variantStyle.shadow ? 0.25 : 0,
            shadowRadius: variantStyle.shadow ? 3.84 : 0,
            elevation: variantStyle.shadow ? 5 : 0,
          },
          isPressed && variantStyle.hoverEffect && {
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
            elevation: 7,
          },
          style,
        ]}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (typeof child === "string") {
            return (
              <Text
                style={{
                  color: variantStyle.color,
                  fontSize: 14,
                  fontWeight: "500",
                  textDecorationLine: variantStyle.textDecorationLine,
                }}
              >
                {child}
              </Text>
            );
          }
          return child;
        })}
      </TouchableOpacity>
    </Animated.View>
  );
});

Button.displayName = "Button";

export { Button, buttonVariants };