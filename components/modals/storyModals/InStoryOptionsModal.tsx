import { Dispatch, SetStateAction, useState } from "react";
import { StoryModes } from "../../../types";
import { ParentsNavigatorProp } from "../../../Navigation/ParentsNavigator";
import { useNavigation } from "@react-navigation/native";
import TopModal from "../TopModal";
import { Pressable, Text, View } from "react-native";
import ProgressBar from "../../UI/ProgressBar";
import Icon from "../../Icon";
import InStoryModeModal from "./InStoryModeModal";
import ExitStoryModal from "./ExitStoryModal";

type PropTypes = {
  setIsOptionsModalOpen: Dispatch<SetStateAction<boolean>>;
  isOptionsModalOpen: boolean;
  storyId: string;
};
const InStoryOptionsModal = ({
  isOptionsModalOpen,
  setIsOptionsModalOpen,
  storyId,
}: PropTypes) => {
  const [isStoryModeModalOpen, setIsStoryModeModalOpen] = useState(false);
  const [storyMode, setStoryMode] = useState<StoryModes>("plain");
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const navigator = useNavigation<ParentsNavigatorProp>();

  const onExitStory = () => {
    navigator.reset({
      index: 0,
      routes: [{ name: "home" }],
    });
  };

  return (
    <TopModal
      isOpen={isOptionsModalOpen}
      onClose={() => setIsOptionsModalOpen(false)}
    >
      <View className="flex flex-col gap-y-4">
        <ProgressBar
          backgroundColor="#4807EC"
          currentStep={15}
          label="Page"
          totalSteps={20}
          height={11}
        />
        <View className="flex flex-row flex-wrap gap-6 justify-center gap-x-3">
          <View className="border border-border-light w-[90px] h-[96px] flex-col gap-y-2 flex justify-center items-center rounded-2xl">
            <Pressable className="flex size-11 rounded-xl flex-col justify-center items-center border border-border-lighter">
              <Icon name="VolumeOff" />
            </Pressable>
            <Text className="text-xs text-text font-[abeezee]">Read aloud</Text>
          </View>
          <View className="border border-border-light w-[90px] h-[96px] flex-col gap-y-2 flex justify-center items-center rounded-2xl">
            <Pressable className="flex size-11 rounded-xl flex-col justify-center items-center border border-border-lighter">
              <Icon name="Play" />
            </Pressable>
            <Text className="text-xs text-text font-[abeezee]">Autoplay</Text>
          </View>
          <View className="border border-border-light w-[90px] h-[96px] flex-col gap-y-2 flex justify-center items-center rounded-2xl">
            <Pressable
              onPress={() => setIsStoryModeModalOpen(true)}
              className="flex size-11 rounded-xl flex-col justify-center items-center border border-border-lighter"
            >
              <Icon name="ListMusic" />
            </Pressable>
            <Text className="text-xs text-text font-[abeezee]">Story Mode</Text>
          </View>
          <View className="border border-border-light w-[90px] h-[96px] flex-col gap-y-2 flex justify-center  items-center rounded-2xl">
            <Pressable
              onPress={() => setIsExitModalOpen(true)}
              className="flex size-11 rounded-xl flex-col justify-center items-center bg-[#FFE0E0] border border-[#FFC8C8]"
            >
              <Icon name="LogOut" color="#EC0707" />
            </Pressable>
            <Text className="text-xs text-text font-[abeezee]">Exit Story</Text>
          </View>
        </View>
      </View>
      <InStoryModeModal
        isOpen={isStoryModeModalOpen}
        onClose={() => setIsStoryModeModalOpen(false)}
        setStoryMode={setStoryMode}
        currentStoryMode={storyMode}
        storyId={storyId}
      />
      <ExitStoryModal
        isOpen={isExitModalOpen}
        onClose={() => setIsExitModalOpen(false)}
        onExit={onExitStory}
      />
    </TopModal>
  );
};

export default InStoryOptionsModal;
