import * as React from "react";
import { View } from "react-native";

const AspectRatio = ({ ratio = 1, style, children, ...props }) => {
  return (
    <View
      style={[
        {
          width: "100%",
          aspectRatio: ratio,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

export { AspectRatio };