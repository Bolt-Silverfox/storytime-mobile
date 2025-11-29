import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  ViewStyle,
  AccessibilityProps,
  StyleProp,
} from "react-native";

type ToggleProps = {
  value: boolean;
  onValueChange: (v: boolean) => void;
  width?: number;
  height?: number;
  thumbSize?: number;
  activeBg?: string;
  inactiveBg?: string;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  testID?: string;
} & AccessibilityProps;

export default function Toggle({
  value,
  onValueChange,
  width = 56,
  height = 32,
  thumbSize = 26,
  activeBg = "#6C63FF",
  inactiveBg = "#E5E7EB",
  style,
  disabled = false,
  testID,
  ...accessibility
}: ToggleProps) {
  // optimistic visual state so the thumb responds immediately
  const [localValue, setLocalValue] = useState<boolean>(Boolean(value));
  const anim = useRef(new Animated.Value(localValue ? 1 : 0)).current;

  // animate when localValue changes
  useEffect(() => {
    Animated.timing(anim, {
      toValue: localValue ? 0 : 1,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [localValue, anim]);

  // sync localValue when parent prop changes
  useEffect(() => {
    if (value !== localValue) {
      setLocalValue(Boolean(value));
    }
  }, [value]);

  const padding = (height - thumbSize) / 2;
  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [padding, width - thumbSize - padding],
  });
  const backgroundColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [inactiveBg, activeBg],
  });

  const handlePress = () => {
    if (disabled) return;
    const next = !localValue;
    setLocalValue(next);

    try {
      onValueChange(next);
    } catch (err) {
      console.warn("Toggle onValueChange error:", err);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="switch"
      accessibilityState={{ checked: Boolean(value), disabled }}
      accessibilityLabel={accessibility.accessibilityLabel || "Toggle"}
      testID={testID}
      style={{ borderRadius: height / 2 }}
    >
      <Animated.View
        style={[
          {
            width,
            height,
            borderRadius: height / 2,
            padding,
            justifyContent: "center",
            backgroundColor,
          },
          style,
        ]}
      >
        <Animated.View
          style={{
            width: thumbSize,
            height: thumbSize,
            borderRadius: thumbSize / 2,
            backgroundColor: "#fff",
            transform: [{ translateX }],
            shadowColor: "#000",
            shadowOpacity: 0.12,
            shadowRadius: 4,
            elevation: 3,
          }}
        />
      </Animated.View>
    </Pressable>
  );
}
