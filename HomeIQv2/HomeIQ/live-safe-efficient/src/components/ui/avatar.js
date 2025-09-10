import * as React from "react";
import { View, Image, Text } from "react-native";

const Avatar = React.forwardRef(({ style, ...props }, ref) => (
  <View
    ref={ref}
    style={[
      {
        position: "relative",
        flexDirection: "row",
        width: 40,
        height: 40,
        borderRadius: 20,
        overflow: "hidden",
        flexShrink: 0,
      },
      style,
    ]}
    {...props}
  />
));
Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef(({ style, onLoad, onError, ...props }, ref) => (
  <Image
    ref={ref}
    style={[
      {
        width: "100%",
        height: "100%",
        aspectRatio: 1,
      },
      style,
    ]}
    onLoad={onLoad}
    onError={onError}
    {...props}
  />
));
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef(({ style, children, ...props }, ref) => (
  <View
    ref={ref}
    style={[
      {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
        backgroundColor: "#f3f4f6", // muted background color
      },
      style,
    ]}
    {...props}
  >
    <Text style={{ color: "#6b7280", fontWeight: "500", fontSize: 14 }}>
      {typeof children === "string" ? children : "US"}
    </Text>
  </View>
));
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };