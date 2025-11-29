import React, { useMemo, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { X, Play, Sparkles } from "lucide-react-native";

export type StoryMode = "plain" | "interactive";

type Props = {
  visible: boolean;
  initialMode?: StoryMode | null;
  onConfirm: (mode: StoryMode) => void;
  onClose: () => void;
};

const Card: React.FC<{
  title: string;
  subtitle: string;
  description: string;
  active: boolean;
  onPress: () => void;
  icon?: React.ReactNode;
}> = ({ title, subtitle, description, active, onPress, icon }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      className={`flex-row rounded-2xl mb-3 ${
        active ? "bg-[#6C63FF]/10 border" : "bg-white"
      }`}
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
        <View className="w-[70%]">{icon}</View>
      </View>

      <View className="flex-1 p-4 w-[60%]">
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
};

export default function StoryModeModal({
  visible,
  initialMode = null,
  onConfirm,
  onClose,
}: Props) {
  const [selected, setSelected] = useState<StoryMode | null>(
    initialMode ?? null
  );

  // reset selection when modal opens/closes
  React.useEffect(() => {
    if (!visible) return;
    setSelected(initialMode ?? null);
  }, [visible, initialMode]);

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
              {/* header */}
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

              {/* options */}
              <View className="flex-col gap-4">
                <Card
                  title="Plain story mode"
                  subtitle="Just sit back and listen!"
                  description={`The story is told from start to finish no interruptions, just imagination and fun.`}
                  active={selected === "plain"}
                  onPress={() => setSelected("plain")}
                  icon={
                    <Image
                      source={require("../../assets/parents/plain-mode.png")}
                      className="w-[80%]"
                      resizeMode="contain"
                    />
                  }
                />

                <Card
                  title="Interactive story mode"
                  subtitle="Step into the story!"
                  description={`Read along, explore the world of imagination and answer fun questions along the way.`}
                  active={selected === "interactive"}
                  onPress={() => setSelected("interactive")}
                  icon={
                    <Image
                      source={require("../../assets/parents/interactive-mode.png")}
                      className="w-[80%]"
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
