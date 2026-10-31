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

  const handleClose = () => {
    if (!hasQuiz && currentMode !== "plain") {
      onModeChange("plain");
    }
    onClose();
  };

  // Sync pendingMode when modal opens with a new currentMode
  useEffect(() => {
    if (isOpen) {
      setPendingMode(currentMode);
    }
  }, [isOpen, currentMode]);

  return (
    <CustomModal isOpen={isOpen} onClose={handleClose}>
      <View className="flex flex-col gap-y-6 bg-surface">
        <View className="flex flex-row items-center justify-between border-b border-b-line-light pb-6">
          <Text className="font-[abeezee] text-base text-fg">
            Change story mode
          </Text>
          <Pressable
            onPress={handleClose}
            accessibilityRole="button"
            accessibilityLabel="Close"
            hitSlop={12}
          >
            <Icon name="SquareX" />
          </Pressable>
        </View>
        <View className="flex flex-col gap-y-6 border-b border-b-line-light pb-6">
          <Pressable
            onPress={() => setPendingMode("plain")}
            className={`flex flex-col gap-y-2 rounded-3xl border-2 p-6 ${
              pendingMode === "plain"
                ? "border-[#EC400740] bg-primary"
                : "border-line-light bg-surface"
            }`}
          >
            <Text
              className={`font-[quilka] text-xl ${
                pendingMode === "plain" ? "text-white" : "text-fg"
              }`}
            >
              Plain story mode
            </Text>
            <Text
              className={`font-[abeezee] ${
                pendingMode === "plain" ? "text-[#FED0C1]" : "text-body"
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
                  : "border-line-light bg-surface"
              }`}
            >
              <Text
                className={`font-[quilka] text-xl ${
                  pendingMode === "interactive" ? "text-white" : "text-fg"
                }`}
              >
                Interactive story mode
              </Text>
              <Text
                className={`font-[abeezee] ${
                  pendingMode === "interactive" ? "text-[#FED0C1]" : "text-body"
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
          <CustomButton onPress={handleClose} text="Got it" />
        )}
      </View>
    </CustomModal>
  );
};

export default InStoryModeModal;
