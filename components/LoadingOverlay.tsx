import React from "react";
import { Modal, View, Text } from "react-native";
import LoadingIcon from "./LoadingIcon";

type Props = {
  visible: boolean;
  label?: string;
};

export default function LoadingOverlay({
  visible,
  label = "Loading...",
}: Props) {
  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View className="absolute inset-0 items-center justify-center bg-black/50">
        <LoadingIcon />
        <Text className="mt-4 font-[abeezee] text-2xl text-white">{label}</Text>
      </View>
    </Modal>
  );
}
