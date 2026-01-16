import { useNavigation } from "@react-navigation/native";
import { Image, Pressable, Text, View } from "react-native";
import { ProtectedRoutesNavigationProp } from "../../../Navigation/ProtectedNavigator";
import CustomButton from "../../UI/CustomButton";
import CustomModal, { CustomModalProps } from "../CustomModal";

interface ExitModalProps extends Omit<CustomModalProps, "children"> {}

const ExitStoryModal = ({ isOpen, onClose }: ExitModalProps) => {
  const navigator = useNavigation<ProtectedRoutesNavigationProp>();

  const onExitStory = () => {
    navigator.reset({
      index: 0,
      routes: [{ name: "parents" }],
    });
  };

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
          <CustomButton onPress={onExitStory} text="Yes, exit" />
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
