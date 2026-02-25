import { useCallback, useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
} from "react-native";
import { ToastItem } from "../../contexts/ToastContext";

type ToastProps = {
  toast: ToastItem;
  index: number;
  onDismiss: (id: number) => void;
};

const TOAST_HEIGHT = 60;
const TOAST_GAP = 8;

const Toast = ({ toast, index, onDismiss }: ToastProps) => {
  const translateY = useRef(new Animated.Value(100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const dismiss = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 100,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss(toast.id);
    });
  }, [toast.id, onDismiss, translateY, opacity]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      dismiss();
    }, 2500);

    return () => clearTimeout(timer);
  }, [dismiss, translateY, opacity]);

  const bottomOffset = 24 + index * (TOAST_HEIGHT + TOAST_GAP);

  return (
    <TouchableWithoutFeedback onPress={dismiss}>
      <Animated.View
        style={[
          styles.container,
          {
            bottom: bottomOffset,
            transform: [{ translateY }],
            opacity,
          },
        ]}
      >
        <View className="w-full rounded-lg border border-border-lighter bg-white px-5 py-3 shadow-lg">
          <Text
            numberOfLines={1}
            className="text-center font-[abeezee] text-sm"
          >
            {toast.message}
          </Text>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 9999,
    elevation: 9999,
  },
});

export default Toast;
