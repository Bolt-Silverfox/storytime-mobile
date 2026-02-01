import React from "react";
import { Modal, View, Text } from "react-native";
import LottieView from "lottie-react-native";

type Props = {
  visible: boolean;
  label?: string;
  size?: number;
};

export default function LoadingOverlay({
  visible,
  label = "Loading...",
  size = 120,
}: Props) {
  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View className="absolute inset-0 items-center justify-center bg-black/50">
        {/* Lottie animation */}
        <LottieView
          autoPlay
          loop
          source={require("../assets/lottie/loader.json")}
          style={{ width: size, height: size }}
        />

        <Text className="mt-4 font-[abeezee] text-2xl text-white">{label}</Text>
      </View>
    </Modal>
  );
}
