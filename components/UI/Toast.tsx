import { useCallback, useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

type ToastProps = {
  message: string;
  visible: boolean;
  onHide: () => void;
};

const Toast = ({ message, visible, onHide }: ToastProps) => {
  const translateY = useRef(new Animated.Value(80)).current;
  const onHideRef = useRef(onHide);

  useEffect(() => {
    onHideRef.current = onHide;
  }, [onHide]);

  const handleHide = useCallback(() => {
    onHideRef.current();
  }, []);

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
        }).start(handleHide);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [visible, translateY, handleHide]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
      <View className="w-full rounded-lg bg-white px-5 py-3">
        <Text className="text-center font-[abeezee] text-sm">{message}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 24,
    left: 16,
    right: 16,
    zIndex: 9999,
    elevation: 9999,
  },
});

export default Toast;
