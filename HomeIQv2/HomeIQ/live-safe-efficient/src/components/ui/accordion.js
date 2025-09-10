import React from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react-native";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef(({ style, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    style={[{ borderBottomWidth: 1, borderBottomColor: "#e5e5e5" }, style]}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef(({ style, children, ...props }, ref) => {
  const [rotation] = React.useState(new Animated.Value(0));
  
  React.useEffect(() => {
    // Handle rotation animation based on data-state
    // This would need to be connected to the actual accordion state
  }, []);

  return (
    <AccordionPrimitive.Header style={{ flexDirection: "row" }}>
      <AccordionPrimitive.Trigger
        ref={ref}
        style={[
          {
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: 16,
            fontWeight: "500"
          },
          style
        ]}
        {...props}
      >
        <Text>{children}</Text>
        <Animated.View style={{ 
          transform: [{ rotate: rotation.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '180deg']
          })}] 
        }}>
          <ChevronDown size={16} />
        </Animated.View>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
});
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef(({ style, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    style={{ overflow: "hidden" }}
    {...props}
  >
    <View style={[{ paddingTop: 0, paddingBottom: 16 }, style]}>
      <Text>{children}</Text>
    </View>
  </AccordionPrimitive.Content>
));

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };