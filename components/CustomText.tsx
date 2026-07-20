// components/CustomText.tsx
import React from "react";
import { StyleSheet, Text, TextProps } from "react-native";

interface CustomTextProps extends TextProps {
  children: React.ReactNode;
}

export default function CustomText({
  style,
  children,
  ...props
}: CustomTextProps) {
  return (
    <Text
      {...props}
      style={[styles.defaultFont, style]} // Apply your custom font
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  defaultFont: {
    fontFamily: "abeezee",
  },
});
