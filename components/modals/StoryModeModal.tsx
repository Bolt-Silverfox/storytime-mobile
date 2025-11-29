// components/modals/StoryModeModal.tsx
import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { X } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { ParntHomeNavigatorProp } from "../../Navigation/ParentHomeNavigator";

export type StoryMode = "plain" | "interactive";

type Props = {
  visible: boolean;
  storyId?: string | null;
  initialMode?: StoryMode | null;
  onClose: () => void;
};

const Card: React.FC<{
  title: string;
  subtitle: string;
  description: string;
  active: boolean;
  onPress: () => void;
  icon?: React.ReactNode;
}> = ({ title, subtitle, description, active, onPress, icon }) => (
  <TouchableOpacity
    activeOpacity={0.9}
    onPress={onPress}
    className={`flex-row rounded-2xl mb-3 ${active ? "bg-[#6C63FF]/10 border" : "bg-white"}`}
    style={{
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 6,
      elevation: 2,
    }}
    accessibilityRole="button"
    accessibilityState={{ selected: active }}
  >
    <View
      className="w-[40%] items-center justify-center mr-3 bg-primary-light p-2"
      style={{
        backgroundColor: "#FFC4DD",
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
      }}
    >
      <View className="w-[70%] mx-auto">{icon}</View>
    </View>

    <View className="flex-1 p-4 pl-1 w-[60%] justify-center">
      <Text
        className={`text-lg font-[quilka] ${active ? "text-[#2B1350]" : "text-black"}`}
      >
        {title}
      </Text>
      <Text className="font-[abeezee] text-gray-600 mt-1">{subtitle}</Text>
      <Text className="font-[abeezee] text-gray-600">{description}</Text>
    </View>
  </TouchableOpacity>
);

export default function StoryModeModal({
  visible,
  storyId,
  initialMode = null,
  onClose,
}: Props) {
  const nav = useNavigation<ParntHomeNavigatorProp>();
  const [selected, setSelected] = useState<StoryMode | null>(
    initialMode ?? null
  );

  useEffect(() => {
    if (!visible) return;
    setSelected(initialMode ?? null);
  }, [visible, initialMode]);

  const handleSelect = (mode: StoryMode) => {
    setSelected(mode);
    onClose(); // close modal for better UX

    if (!storyId) {
      console.warn(
        "StoryModeModal: no storyId passed; cannot navigate to story screen."
      );
      return;
    }

    // Navigate to the correct screen based on selection
    if (mode === "plain") {
      nav.navigate("plainStories", { storyId, mode: "plain" });
    } else {
      nav.navigate("interactiveStories", { storyId, mode: "interactive" });
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/40 justify-end">
          <TouchableWithoutFeedback>
            <View
              className="bg-white rounded-t-3xl px-4 pt-4 pb-8"
              style={{
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                minHeight: 320,
              }}
              accessibilityViewIsModal
              accessibilityLabel="Choose story mode modal"
            >
              <View className="flex-col items-end justify-between mb-3">
                <TouchableOpacity
                  onPress={onClose}
                  accessibilityLabel="Close"
                  className="bg-white p-1 border rounded-md"
                >
                  <X size={20} />
                </TouchableOpacity>
              </View>

              <Text className="text-2xl font-[quilka] text-center">
                Choose story mode
              </Text>
              <Text className="font-[abeezee] text-gray-600 mt-4 mb-8 text-center">
                Select the type of story you want to read
              </Text>

              <View className="flex-col gap-4">
                <Card
                  title="Plain story mode"
                  subtitle="Just sit back and listen!"
                  description="The story is told start to finish — no interruptions."
                  active={selected === "plain"}
                  onPress={() => handleSelect("plain")}
                  icon={
                    <Image
                      source={require("../../assets/parents/plain-mode.png")}
                      className="w-[80%] mx-auto"
                      resizeMode="contain"
                    />
                  }
                />

                <Card
                  title="Interactive story mode"
                  subtitle="Step into the story!"
                  description="Read along, explore, and answer fun questions."
                  active={selected === "interactive"}
                  onPress={() => handleSelect("interactive")}
                  icon={
                    <Image
                      source={require("../../assets/parents/interactive-mode.png")}
                      className="w-[80%] mx-auto"
                      resizeMode="contain"
                    />
                  }
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
