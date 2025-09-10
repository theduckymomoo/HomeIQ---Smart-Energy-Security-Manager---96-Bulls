import * as React from "react";
import { View, Text, Modal, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

// Note: You'll need to create your own buttonVariants utility or import from your UI library
// import { buttonVariants } from "@/components/ui/button";

const AlertDialog = AlertDialogPrimitive.Root;
const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
const AlertDialogPortal = AlertDialogPrimitive.Portal;

const AlertDialogOverlay = React.forwardRef(({ style, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    style={[
      {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        zIndex: 50,
      },
      style,
    ]}
    {...props}
    ref={ref}
  />
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;

const AlertDialogContent = React.forwardRef(({ style, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      style={[
        {
          position: "absolute",
          left: "50%",
          top: "50%",
          zIndex: 50,
          width: "90%",
          maxWidth: 500,
          transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
          backgroundColor: "white",
          padding: 24,
          borderRadius: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        },
        style,
      ]}
      {...props}
    />
  </AlertDialogPortal>
));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;

const AlertDialogHeader = ({ style, ...props }) => (
  <View
    style={[
      {
        flexDirection: "column",
        alignItems: "center",
        marginBottom: 16,
      },
      style,
    ]}
    {...props}
  />
);
AlertDialogHeader.displayName = "AlertDialogHeader";

const AlertDialogFooter = ({ style, ...props }) => (
  <View
    style={[
      {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 16,
        gap: 8,
      },
      style,
    ]}
    {...props}
  />
);
AlertDialogFooter.displayName = "AlertDialogFooter";

const AlertDialogTitle = React.forwardRef(({ style, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    style={[
      {
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
        marginBottom: 8,
      },
      style,
    ]}
    {...props}
  />
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;

const AlertDialogDescription = React.forwardRef(({ style, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    style={[
      {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        lineHeight: 20,
      },
      style,
    ]}
    {...props}
  />
));
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;

// Simple button component (replace with your actual button implementation)
const Button = ({ variant = "default", style, children, ...props }) => {
  const baseStyle = {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  };

  const variantStyles = {
    default: {
      backgroundColor: "#007AFF",
    },
    outline: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: "#E5E5E5",
    },
  };

  return (
    <TouchableOpacity
      style={[baseStyle, variantStyles[variant], style]}
      {...props}
    >
      <Text style={{ color: variant === "outline" ? "#000" : "#FFF", fontWeight: "500" }}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const AlertDialogAction = React.forwardRef(({ style, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    asChild
    {...props}
  >
    <Button variant="default" style={style} {...props} />
  </AlertDialogPrimitive.Action>
));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;

const AlertDialogCancel = React.forwardRef(({ style, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    asChild
    {...props}
  >
    <Button variant="outline" style={[{ marginTop: 8 }, style]} {...props} />
  </AlertDialogPrimitive.Cancel>
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};