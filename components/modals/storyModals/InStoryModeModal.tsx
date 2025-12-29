import { useNavigation } from "@react-navigation/native";
import { Dispatch, SetStateAction } from "react";
import { Pressable, Text, View } from "react-native";
import { ParntHomeNavigatorProp } from "../../../Navigation/ParentHomeNavigator";
import { StoryModes } from "../../../types";
import Icon from "../../Icon";
import CustomButton from "../../UI/CustomButton";
import CustomModal, { CustomModalProps } from "../CustomModal";

interface Props extends Omit<CustomModalProps, "children"> {
  setStoryMode: Dispatch<SetStateAction<StoryModes>>;
  currentStoryMode: StoryModes;
  storyId: string;
}

const InStoryModeModal = ({
  isOpen,
  onClose,
  setStoryMode,
  currentStoryMode,
  storyId,
}: Props) => {
  const navigator = useNavigation<ParntHomeNavigatorProp>();

  const confirmStoryMode = () => {
    if (currentStoryMode === "interactive") {
      setStoryMode("interactive");
      navigator.navigate("newInteractiveStoryMode", { storyId });
      return;
    }
    setStoryMode("plain");
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
            onPress={() => setStoryMode("plain")}
            className={`rounded-3xl p-6 flex flex-col gap-y-2 ${currentStoryMode === "plain" ? "border-2 bg-primary border-[#EC400740]" : "border border-border-light bg-white"}`}
          >
            <Text
              className={`font-[quilka] text-xl ${currentStoryMode === "plain" ? "text-white" : "text-black"}`}
            >
              Plain story mode
            </Text>
            <Text
              className={`font-[abeezee] ${currentStoryMode === "plain" ? "text-[#FED0C1]" : "text-text"}`}
            >
              Enjoy storytelling without stress.
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setStoryMode("interactive")}
            className={`rounded-3xl p-6 flex flex-col gap-y-2 ${currentStoryMode === "interactive" ? "border-2 border-primary/25 bg-primary" : "border border-border-light bg-white"}`}
          >
            <Text
              className={`font-[quilka] text-xl ${currentStoryMode === "interactive" ? "text-white" : "text-black"}`}
            >
              Interactive story mode
            </Text>
            <Text
              className={`font-[abeezee] ${currentStoryMode === "interactive" ? "text-[#FED0C1]" : "text-text"}`}
            >
              Listen and answer questions to the story.
            </Text>
          </Pressable>
        </View>
        <CustomButton
          onPress={confirmStoryMode}
          text="Select preferred story mode"
        />
      </View>
    </CustomModal>
  );
};

export default InStoryModeModal;
