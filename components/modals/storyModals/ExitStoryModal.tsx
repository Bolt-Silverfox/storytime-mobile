import { useNavigation } from "@react-navigation/native";
import { Image, Text, View } from "react-native";
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
      <View className="flex flex-col gap-y-6 bg-white">
        <Image
          source={require("../../../assets/exit-story.png")}
          className="size-40 self-center"
        />
        <View className="flex flex-col gap-y-3">
          <Text className="text-center font-[quilka] text-2xl text-black">
            Exit story?
          </Text>
          <Text className="text-center font-[abeezee] text-base text-text">
            You are about to exit this story, are you sure?
          </Text>
        </View>
        <View className="mt-4 flex flex-col items-center gap-y-3">
          <CustomButton onPress={onExitStory} text="Yes, exit" />
          <CustomButton transparent onPress={onClose} text="Cancel" />
        </View>
      </View>
    </CustomModal>
  );
};

export default ExitStoryModal;
