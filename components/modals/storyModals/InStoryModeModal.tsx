import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Dispatch, SetStateAction, useState } from "react";
import { Pressable, Text, View } from "react-native";
import {
  StoryNavigatorParamList,
  StoryNavigatorProp,
} from "../../../Navigation/StoryNavigator";
import { StoryModes } from "../../../types";
import Icon from "../../Icon";
import CustomButton from "../../UI/CustomButton";
import CustomModal, { CustomModalProps } from "../CustomModal";
import SubscriptionModal from "../SubscriptionModal";

interface Props extends Omit<CustomModalProps, "children"> {
  setActiveParagraph: Dispatch<SetStateAction<number>>;
}

type RoutePropTypes = RouteProp<StoryNavigatorParamList, "readStory">;

const InStoryModeModal = ({ isOpen, onClose, setActiveParagraph }: Props) => {
  const { params } = useRoute<RoutePropTypes>();
  const [newMode, setNewMode] = useState<StoryModes>(params.mode);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

  const navigator = useNavigation<StoryNavigatorProp>();

  const isPremium = false;

  const handleStoryMode = (storyMode: StoryModes) => {
    if (storyMode === "interactive") {
      isPremium ? setNewMode("interactive") : setIsSubscriptionModalOpen(true);
      return;
    }
    setNewMode("plain");
  };

  const handleChangeStoryMode = () => {
    if (newMode === params.mode) {
      onClose();
      return;
    }
    setActiveParagraph(0);
    navigator.navigate("readStory", { mode: newMode, storyId: params.storyId });
    onClose();
  };
  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      <View className="bg-white flex flex-col gap-y-6">
        <View className="flex border-b border-b-border-light pb-6 flex-row justify-between items-center">
          <Text className="font-[abeezee] text-base">Change story mode</Text>
          <Icon name="SquareX" onPress={onClose} />
        </View>
        <View className="flex flex-col gap-y-6 pb-6 border-b border-b-border-light">
          <Pressable
            onPress={() => handleStoryMode("plain")}
            className={`rounded-3xl p-6 flex flex-col gap-y-2 ${newMode === "plain" ? "border-2 bg-primary border-[#EC400740]" : "border border-border-light bg-white"}`}
          >
            <Text
              className={`font-[quilka] text-xl ${newMode === "plain" ? "text-white" : "text-black"}`}
            >
              Plain story mode
            </Text>
            <Text
              className={`font-[abeezee] ${newMode === "plain" ? "text-[#FED0C1]" : "text-text"}`}
            >
              Enjoy storytelling without stress.
            </Text>
          </Pressable>
          <Pressable
            onPress={() => handleStoryMode("interactive")}
            className={`rounded-3xl p-6 flex flex-col gap-y-2 ${newMode === "interactive" ? "border-2 border-primary/25 bg-primary" : "border border-border-light bg-white"}`}
          >
            {!isPremium && (
              <View className="bg-[#FFF8D2] self-start rounded-full h-6 flex justify-center items-center px-2">
                <Text className="font-[abeezee] text-black text-xs">
                  Premium
                </Text>
              </View>
            )}
            <Text
              className={`font-[quilka] text-xl ${newMode === "interactive" ? "text-white" : "text-black"}`}
            >
              Interactive story mode
            </Text>
            <Text
              className={`font-[abeezee] ${newMode === "interactive" ? "text-[#FED0C1]" : "text-text"}`}
            >
              Listen and answer questions to the story.
            </Text>
          </Pressable>
        </View>
        <CustomButton
          onPress={handleChangeStoryMode}
          text="Select preferred story mode"
          disabled={!newMode}
        />
      </View>
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
      />
    </CustomModal>
  );
};

export default InStoryModeModal;
