import * as React from "react";
import { View, Text } from "react-native";

const alertVariants = {
  default: {
    backgroundColor: "white",
    borderColor: "#e5e5e5",
    color: "black",
  },
  destructive: {
    borderColor: "#ef4444",
    color: "#ef4444",
  }
};

const Alert = React.forwardRef(({ style, variant = "default", children, ...props }, ref) => {
  const variantStyle = alertVariants[variant] || alertVariants.default;
  
  return (
    <View
      ref={ref}
      role="alert"
      style={[
        {
          position: "relative",
          width: "100%",
          borderRadius: 8,
          borderWidth: 1,
          padding: 16,
        },
        variantStyle,
        style,
      ]}
      {...props}
    >
      {/* Handle icon positioning - you'll need to implement icon logic */}
      {React.Children.map(children, (child) => {
        if (child && child.type && child.type.displayName === "Icon") {
          return React.cloneElement(child, {
            style: [
              { position: "absolute", left: 16, top: 16 },
              child.props.style
            ]
          });
        }
        return child;
      })}
    </View>
  );
});
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef(({ style, ...props }, ref) => (
  <Text
    ref={ref}
    style={[
      {
        marginBottom: 4,
        fontWeight: "500",
        fontSize: 16,
        letterSpacing: -0.5,
      },
      style,
    ]}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef(({ style, ...props }, ref) => (
  <Text
    ref={ref}
    style={[
      {
        fontSize: 14,
        lineHeight: 20,
      },
      style,
    ]}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };