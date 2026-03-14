import { Pressable, Text, View } from "react-native";
import { StoryModes } from "../../../types";
import Icon from "../../Icon";
import CustomButton from "../../UI/CustomButton";
import CustomModal, { CustomModalProps } from "../CustomModal";
import { useEffect, useState } from "react";

type Props = Omit<CustomModalProps, "children"> & {
  currentMode: StoryModes;
  onModeChange: (mode: StoryModes) => void;
  hasQuiz: boolean;
};

const InStoryModeModal = ({
  isOpen,
  onClose,
  currentMode,
  onModeChange,
  hasQuiz,
}: Props) => {
  const [pendingMode, setPendingMode] = useState<StoryModes>(currentMode);

  // Sync pendingMode when modal opens with a new currentMode
  useEffect(() => {
    if (isOpen) {
      setPendingMode(currentMode);
    }
  }, [isOpen, currentMode]);

  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      <View className="flex flex-col gap-y-6 bg-white">
        <View className="flex flex-row items-center justify-between border-b border-b-border-light pb-6">
          <Text className="font-[abeezee] text-base">Change story mode</Text>
          <Icon name="SquareX" onPress={onClose} />
        </View>
        <View className="flex flex-col gap-y-6 border-b border-b-border-light pb-6">
          <Pressable
            onPress={() => setPendingMode("plain")}
            className={`flex flex-col gap-y-2 rounded-3xl border-2 p-6 ${
              pendingMode === "plain"
                ? "border-[#EC400740] bg-primary"
                : "border-border-light bg-white"
            }`}
          >
            <Text
              className={`font-[quilka] text-xl ${
                pendingMode === "plain" ? "text-white" : "text-black"
              }`}
            >
              Plain story mode
            </Text>
            <Text
              className={`font-[abeezee] ${
                pendingMode === "plain" ? "text-[#FED0C1]" : "text-text"
              }`}
            >
              Enjoy storytelling without stress.
            </Text>
          </Pressable>
          {hasQuiz && (
            <Pressable
              onPress={() => setPendingMode("interactive")}
              className={`flex flex-col gap-y-2 rounded-3xl border-2 p-6 ${
                pendingMode === "interactive"
                  ? "border-[#EC400740] bg-primary"
                  : "border-border-light bg-white"
              }`}
            >
              <Text
                className={`font-[quilka] text-xl ${
                  pendingMode === "interactive" ? "text-white" : "text-black"
                }`}
              >
                Interactive story mode
              </Text>
              <Text
                className={`font-[abeezee] ${
                  pendingMode === "interactive" ? "text-[#FED0C1]" : "text-text"
                }`}
              >
                Listen and answer questions to the story.
              </Text>
            </Pressable>
          )}
        </View>
        {hasQuiz ? (
          <CustomButton
            onPress={() => {
              if (pendingMode !== currentMode) {
                onModeChange(pendingMode);
              }
              onClose();
            }}
            text="Switch mode"
          />
        ) : (
          <CustomButton
            onPress={() => {
              if (currentMode !== "plain") {
                onModeChange("plain");
              }
              onClose();
            }}
            text="Got it"
          />
        )}
      </View>
    </CustomModal>
  );
};

export default InStoryModeModal;
