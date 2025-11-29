import React from "react";
import { Modal, View, Text, Pressable, Image } from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function SuccessModal({ visible, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/40 justify-center items-center px-6">
        <View
          className="bg-white w-full p-8 items-center"
          style={{ borderRadius: 36 }}
        >
          <Image
            source={require("../../assets/icons/successful-reset-illustration.png")}
            style={{ alignSelf: "center" }}
          />
          <Text className="text-2xl font-[quilka] text-center my-6">
            Story Recommended Successfully!
          </Text>

          <Pressable
            onPress={onClose}
            className="bg-transparent border border-black/20 w-full py-4 rounded-full mt-4"
          >
            <Text className="text-center text-black font-[abeezee]">Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
