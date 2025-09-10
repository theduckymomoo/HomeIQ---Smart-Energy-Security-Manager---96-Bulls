import * as React from "react";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { ChevronRight, MoreHorizontal } from "lucide-react-native";

const Breadcrumb = React.forwardRef(({ style, ...props }, ref) => (
  <View
    ref={ref}
    accessibilityRole="menu"
    accessibilityLabel="breadcrumb"
    style={[{ flexDirection: "row" }, style]}
    {...props}
  />
));
Breadcrumb.displayName = "Breadcrumb";

const BreadcrumbList = React.forwardRef(({ style, ...props }, ref) => (
  <View
    ref={ref}
    style={[
      {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 6,
        fontSize: 14,
        color: "#6b7280",
      },
      style,
    ]}
    {...props}
  />
));
BreadcrumbList.displayName = "BreadcrumbList";

const BreadcrumbItem = React.forwardRef(({ style, ...props }, ref) => (
  <View
    ref={ref}
    style={[
      {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
      },
      style,
    ]}
    {...props}
  />
));
BreadcrumbItem.displayName = "BreadcrumbItem";

const BreadcrumbLink = React.forwardRef(({ 
  asChild, 
  style, 
  onPress, 
  children, 
  ...props 
}, ref) => {
  const Comp = asChild ? Pressable : TouchableOpacity;
  
  return (
    <Comp
      ref={ref}
      onPress={onPress}
      style={[
        {
          paddingVertical: 4,
          paddingHorizontal: 2,
        },
        style,
      ]}
      {...props}
    >
      <Text style={{ color: "#6b7280", fontSize: 14 }}>
        {children}
      </Text>
    </Comp>
  );
});
BreadcrumbLink.displayName = "BreadcrumbLink";

const BreadcrumbPage = React.forwardRef(({ style, ...props }, ref) => (
  <Text
    ref={ref}
    accessibilityRole="link"
    accessibilityState={{ disabled: true }}
    accessibilityValue={{ now: true }}
    style={[
      {
        fontSize: 14,
        color: "black",
        fontWeight: "400",
        paddingVertical: 4,
      },
      style,
    ]}
    {...props}
  />
));
BreadcrumbPage.displayName = "BreadcrumbPage";

const BreadcrumbSeparator = ({
  children,
  style,
  ...props
}) => (
  <View
    accessibilityRole="none"
    accessibilityElementsHidden={true}
    importantForAccessibility="no-hide-descendants"
    style={[
      {
        marginHorizontal: 2,
      },
      style,
    ]}
    {...props}
  >
    {children ?? <ChevronRight size={14} color="#6b7280" />}
  </View>
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

const BreadcrumbEllipsis = ({
  style,
  ...props
}) => (
  <View
    accessibilityRole="none"
    accessibilityElementsHidden={true}
    importantForAccessibility="no-hide-descendants"
    style={[
      {
        width: 36,
        height: 36,
        alignItems: "center",
        justifyContent: "center",
      },
      style,
    ]}
    {...props}
  >
    <MoreHorizontal size={16} color="#6b7280" />
  </View>
);
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};