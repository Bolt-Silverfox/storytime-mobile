import { Image, Pressable, Text, View } from "react-native";
import CustomModal, { CustomModalProps } from "../CustomModal";
import CustomButton from "../../UI/CustomButton";

interface ExitModalProps extends Omit<CustomModalProps, "children"> {
  onExit: () => void;
}

const ExitStoryModal = ({ isOpen, onClose, onExit }: ExitModalProps) => {
  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      <View className="bg-white flex flex-col gap-y-6">
        <Image
          source={require("../../../assets/images/angry_emoji.png")}
          className="size-40 self-center"
        />
        <View className="flex flex-col gap-y-3">
          <Text className="font-[quilka] text-center text-black text-2xl">
            Exit story?
          </Text>
          <Text className="font-[abeezee] text-center text-text text-base">
            You are about to exit this story, are you sure?
          </Text>
        </View>
        <View className="flex flex-col items-center gap-y-3 mt-4">
          <CustomButton onPress={onExit} text="Yes, exit" />
          <Pressable
            onPress={onClose}
            className="border max-w-sm flex w-full flex-row justify-center items-center h-10 rounded-full"
          >
            <Text className="font-[abeezee] text-black text-base">Cancel</Text>
          </Pressable>
        </View>
      </View>
    </CustomModal>
  );
};

export default ExitStoryModal;
