import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Dispatch, SetStateAction, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Icon from "../../Icon";
import TopModal from "../TopModal";
import ExitStoryModal from "./ExitStoryModal";
import InStoryModeModal from "./InStoryModeModal";

type PropTypes = {
  setIsOptionsModalOpen: Dispatch<SetStateAction<boolean>>;
  handleVoiceModal: Dispatch<SetStateAction<boolean>>;
  isOptionsModalOpen: boolean;
  setActiveParagraph: Dispatch<SetStateAction<number>>;
};
const InStoryOptionsModal = ({
  isOptionsModalOpen,
  setIsOptionsModalOpen,
  handleVoiceModal,
  setActiveParagraph,
}: PropTypes) => {
  const [isStoryModeModalOpen, setIsStoryModeModalOpen] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);

  return (
    <TopModal
      isOpen={isOptionsModalOpen}
      onClose={() => setIsOptionsModalOpen(false)}
    >
      <View className="flex flex-col gap-y-4">
        <View className="flex flex-row flex-wrap gap-6 justify-center gap-x-3">
          <View className="border border-border-light w-[90px] h-[96px] flex-col gap-y-2 flex justify-center items-center rounded-2xl">
            <Pressable
              onPress={() => handleVoiceModal(true)}
              className="flex size-11 rounded-xl flex-col justify-center items-center border border-border-lighter"
            >
              <MaterialIcons name="multitrack-audio" size={24} color="black" />
            </Pressable>
            <Text className="text-xs text-text font-[abeezee]">
              Change voice
            </Text>
          </View>
          {/* <View className="border border-border-light w-[90px] h-[96px] flex-col gap-y-2 flex justify-center items-center rounded-2xl">
            <Pressable className="flex size-11 rounded-xl flex-col justify-center items-center border border-border-lighter">
              <Icon name="Play" />
            </Pressable>
            <Text className="text-xs text-text font-[abeezee]">Autoplay</Text>
          </View> */}
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
        setActiveParagraph={setActiveParagraph}
        isOpen={isStoryModeModalOpen}
        onClose={() => {
          setIsOptionsModalOpen(false);
          setIsStoryModeModalOpen(false);
        }}
      />
      <ExitStoryModal
        isOpen={isExitModalOpen}
        onClose={() => setIsExitModalOpen(false)}
      />
    </TopModal>
  );
};

export default InStoryOptionsModal;
