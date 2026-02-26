import { Text, View } from "react-native";
import Icon from "../../Icon";
import CustomButton from "../../UI/CustomButton";
import CustomModal, { CustomModalProps } from "../CustomModal";

type Props = Omit<CustomModalProps, "children">;

const InStoryModeModal = ({ isOpen, onClose }: Props) => {
  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      <View className="flex flex-col gap-y-6 bg-white">
        <View className="flex flex-row items-center justify-between border-b border-b-border-light pb-6">
          <Text className="font-[abeezee] text-base">Change story mode</Text>
          <Icon name="SquareX" onPress={onClose} />
        </View>
        <View className="flex flex-col gap-y-6 border-b border-b-border-light pb-6">
          <View className="flex flex-col gap-y-2 rounded-3xl border-2 border-[#EC400740] bg-primary p-6">
            <Text className="font-[quilka] text-xl text-white">
              Plain story mode
            </Text>
            <Text className="font-[abeezee] text-[#FED0C1]">
              Enjoy storytelling without stress.
            </Text>
          </View>
          <View className="flex flex-col gap-y-2 rounded-3xl border border-border-light bg-white p-6 opacity-60">
            <View className="flex h-6 items-center justify-center self-start rounded-full bg-[#E0F2FE] px-2">
              <Text className="font-[abeezee] text-xs text-[#0369A1]">
                Coming Soon
              </Text>
            </View>
            <Text className="font-[quilka] text-xl text-black">
              Interactive story mode
            </Text>
            <Text className="font-[abeezee] text-text">
              Listen and answer questions to the story.
            </Text>
          </View>
        </View>
        <CustomButton onPress={onClose} text="Got it" />
      </View>
    </CustomModal>
  );
};

export default InStoryModeModal;
