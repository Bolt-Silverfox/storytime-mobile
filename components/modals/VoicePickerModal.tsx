import React, { lazy, Suspense, useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { CircleCheck, X } from "lucide-react-native";

const StoryTellerVoice = lazy(() => import("../StoryTellerVoices"));

type Props = {
  visible: boolean;
  onClose: () => void;
  currentlyActiveVoiceId?: string | null;
  onConfirm: (selectedVoiceId: string, selectedVoiceName?: string | null) => void;
};

export default function VoicePickerModal({
  visible,
  onClose,
  currentlyActiveVoiceId,
  onConfirm,
}: Props) {
  const [activeId, setActiveId] = useState<string>(
    currentlyActiveVoiceId ?? "fanice"
  );
  const [selectedVoiceName, setSelectedVoiceName] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (visible) {
      setActiveId(currentlyActiveVoiceId ?? "fanice");
      setSelectedVoiceName(null);
    }
  }, [visible, currentlyActiveVoiceId]);

  // receives (id, name) from child
  const handleVoiceSelect = (id: string | null, name?: string | null) => {
    if (id === null) {
      setActiveId(currentlyActiveVoiceId ?? "fanice");
      setSelectedVoiceName(null);
    } else {
      setActiveId(id);
      setSelectedVoiceName(name ?? null);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* backdrop */}
      <Pressable onPress={onClose} className="flex-1 bg-black/40">
        <View />
      </Pressable>

      <View
        className="bg-white rounded-2xl p-4 pb-6 absolute bottom-0 w-full shadow-lg"
        style={{ borderTopRightRadius: 24, borderTopLeftRadius: 24 }}
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
        {/* header */}
        <View className="flex-col items-center gap-2 mb-3">
          <Text className="text-2xl font-[quilka] text-center">
            Choose Voice
          </Text>
          <Text className="font-[abeezee] text-center text-lg">
            Customize your preferred voice
          </Text>
        </View>
        <View className="flex-row justify-between items-center mt-6">
          <View className="flex-col gap-2 mb-3">
            <Text className="text-xl font-[abeezee]uppercase">
              Default AI voice
            </Text>
            <Text className="font-[quilka] text-2xl">Bella</Text>
          </View>
          <CircleCheck color="#07A92A" />
        </View>

        {/* content: Suspense + voice list (2 columns inside) */}
        <View className="flex-1">
          <Suspense
            fallback={
              <View className="py-8 items-center">
                <ActivityIndicator />
              </View>
            }
          >
            {/* @ts-ignore dynamic component */}
            <StoryTellerVoice
              currentlyActiveVoiceId={activeId}
              onSelectVoice={(id: string | null, name?: string | null) =>
                handleVoiceSelect(id, name)
              }
            />
          </Suspense>
        </View>

        {/* footer */}
        <View className="mt-3">
          <TouchableOpacity
            onPress={() => onConfirm(activeId, selectedVoiceName)}
            className="bg-primary w-full py-3 rounded-full"
            accessibilityLabel="Update voice"
          >
            <Text className="text-center text-white font-[abeezee]">
              Update default voice
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
