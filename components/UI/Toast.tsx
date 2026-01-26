import { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";

type ToastProps = {
  message: string;
  visible: boolean;
  onHide: () => void;
};

const Toast = ({ message, visible, onHide }: ToastProps) => {
  const translateY = useRef(new Animated.Value(80)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(translateY, {
          toValue: 80,
          duration: 250,
          useNativeDriver: true,
        }).start(onHide);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={{
        transform: [{ translateY }],
        position: "absolute",
        bottom: 24,
        left: 16,
        right: 16,
        zIndex: 9999,
        elevation: 9999,
      }}
    >
      <View className="bg-white px-5 py-3 w-full rounded-lg">
        <Text className="font-[abeezee] text-sm text-center">{message}</Text>
      </View>
    </Animated.View>
  );
};

export default Toast;
