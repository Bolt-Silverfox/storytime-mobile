import { RouteProp, useRoute } from "@react-navigation/native";
import { Pressable, Text, View } from "react-native";
import { StoryNavigatorParamList } from "../../../Navigation/StoryNavigator";
import Icon from "../../Icon";
import CustomButton from "../../UI/CustomButton";
import CustomModal, { CustomModalProps } from "../CustomModal";

type Props = Omit<CustomModalProps, "children">;

type RoutePropTypes = RouteProp<StoryNavigatorParamList, "readStory">;

const InStoryModeModal = ({ isOpen, onClose }: Props) => {
  const { params } = useRoute<RoutePropTypes>();

  const handleChangeStoryMode = () => {
    onClose();
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      <View className="flex flex-col gap-y-6 bg-white">
        <View className="flex flex-row items-center justify-between border-b border-b-border-light pb-6">
          <Text className="font-[abeezee] text-base">Change story mode</Text>
          <Icon name="SquareX" onPress={onClose} />
        </View>
        <View className="flex flex-col gap-y-6 border-b border-b-border-light pb-6">
          <Pressable
            onPress={handleChangeStoryMode}
            className={`flex flex-col gap-y-2 rounded-3xl p-6 ${params.mode === "plain" ? "border-2 border-[#EC400740] bg-primary" : "border border-border-light bg-white"}`}
          >
            <Text
              className={`font-[quilka] text-xl ${params.mode === "plain" ? "text-white" : "text-black"}`}
            >
              Plain story mode
            </Text>
            <Text
              className={`font-[abeezee] ${params.mode === "plain" ? "text-[#FED0C1]" : "text-text"}`}
            >
              Enjoy storytelling without stress.
            </Text>
          </Pressable>
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
        <CustomButton onPress={handleChangeStoryMode} text="Got it" />
      </View>
    </CustomModal>
  );
};

export default InStoryModeModal;
