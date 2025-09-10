import React, { useRef, useState } from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";
import { Dot } from "lucide-react-native"; // use the RN version

export const InputOTP = ({ length = 6, onChange }: any) => {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputs = useRef<TextInput[]>([]);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    onChange && onChange(newOtp.join(""));

    if (text && index < length - 1) {
      inputs.current[index + 1].focus(); // move to next
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  return (
    <View style={styles.container}>
      {otp.map((digit, index) => (
        <TextInput
          key={index}
          ref={(el) => (inputs.current[index] = el!)}
          style={styles.slot}
          keyboardType="numeric"
          maxLength={1}
          value={digit}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
        />
      ))}
    </View>
  );
};

export const InputOTPSeparator = () => (
  <View style={{ marginHorizontal: 4 }}>
    <Dot size={16} color="black" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  slot: {
    width: 40,
    height: 50,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 20,
    backgroundColor: "#fff",
  },
});

