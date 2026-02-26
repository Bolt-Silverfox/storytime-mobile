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
};
const InStoryOptionsModal = ({
  isOptionsModalOpen,
  setIsOptionsModalOpen,
  handleVoiceModal,
}: PropTypes) => {
  const [isStoryModeModalOpen, setIsStoryModeModalOpen] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);

  return (
    <TopModal
      isOpen={isOptionsModalOpen}
      onClose={() => setIsOptionsModalOpen(false)}
    >
      <View className="flex flex-col gap-y-4">
        <View className="flex flex-row flex-wrap justify-center gap-6 gap-x-3">
          <View className="flex h-[96px] w-[90px] flex-col items-center justify-center gap-y-2 rounded-2xl border border-border-light">
            <Pressable
              onPress={() => handleVoiceModal(true)}
              className="flex size-11 flex-col items-center justify-center rounded-xl border border-border-lighter"
            >
              <MaterialIcons name="multitrack-audio" size={24} color="black" />
            </Pressable>
            <Text className="font-[abeezee] text-xs text-text">
              Change voice
            </Text>
          </View>
          {/* <View className="border border-border-light w-[90px] h-[96px] flex-col gap-y-2 flex justify-center items-center rounded-2xl">
            <Pressable className="flex size-11 rounded-xl flex-col justify-center items-center border border-border-lighter">
              <Icon name="Play" />
            </Pressable>
            <Text className="text-xs text-text font-[abeezee]">Autoplay</Text>
          </View> */}
          <View className="flex h-[96px] w-[90px] flex-col items-center justify-center gap-y-2 rounded-2xl border border-border-light">
            <Pressable
              onPress={() => setIsStoryModeModalOpen(true)}
              className="flex size-11 flex-col items-center justify-center rounded-xl border border-border-lighter"
            >
              <Icon name="ListMusic" />
            </Pressable>
            <Text className="font-[abeezee] text-xs text-text">Story Mode</Text>
          </View>
          <View className="flex h-[96px] w-[90px] flex-col items-center justify-center gap-y-2 rounded-2xl  border border-border-light">
            <Pressable
              onPress={() => setIsExitModalOpen(true)}
              className="flex size-11 flex-col items-center justify-center rounded-xl border border-[#FFC8C8] bg-[#FFE0E0]"
            >
              <Icon name="LogOut" color="#EC0707" />
            </Pressable>
            <Text className="font-[abeezee] text-xs text-text">Exit Story</Text>
          </View>
        </View>
      </View>
      <InStoryModeModal
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
