import { X } from "lucide-react-native";
import React from "react";
import { Modal, View, Text, Pressable, Image, Dimensions } from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onReadAgain: () => void;
  onGoHome: () => void;
};

const { width: screenWidth } = Dimensions.get("window");

export default function ParentStoryCompletionModal({
  visible,
  onClose,
  onReadAgain,
  onGoHome,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-[rgba(0,0,0,0.4)] justify-end">
        <View
          style={{ width: screenWidth }}
          className="bg-white px-6 pt-6 pb-10 items-center rounded-t-3xl"
        >
          <View className="w-full flex-row justify-end mb-3">
            <Pressable
              onPress={onClose}
              accessibilityLabel="Close"
              className="bg-white p-1 border rounded-md"
            >
              <X size={20} />
            </Pressable>
          </View>
          <Image
            source={require("../../assets/icons/successful-reset-illustration.png")}
            className="w-40 h-40 mb-2"
            resizeMode="contain"
          />

          <Text className="text-2xl text-center my-2 font-[quilka]">
            Great job!
          </Text>

          <Text className="text-lg text-center text-gray-600 mb-6 font-[abeezee]">
            You finished the story. What would you like to do next?
          </Text>

          <Pressable
            onPress={onReadAgain}
            className="w-full py-4 rounded-full mb-3 items-center justify-center bg-primary"
          >
            <Text className="text-white text-base font-[abeezee]">
              Read story again
            </Text>
          </Pressable>

          <Pressable
            onPress={onGoHome}
            className="w-full py-4 rounded-full border border-[rgba(0,0,0,0.12)] items-center justify-center"
          >
            <Text className="text-base font-[abeezee]">Back to Home</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
