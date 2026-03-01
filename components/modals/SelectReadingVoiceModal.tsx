import { useQuery } from "@tanstack/react-query";
import { Dispatch, lazy, SetStateAction } from "react";
import { ScrollView, Text, View } from "react-native";
import queryAvailableVoices from "../../hooks/tanstack/queryHooks/queryAvailableVoices";
import Icon from "../Icon";
import SuspenseWrapper from "../supsense/SuspenseWrapper";
import CustomModal, { CustomModalProps } from "./CustomModal";

const AvailableVoices = lazy(() => import("../AvailableVoices"));

type PropTypes = {
  selectedVoice: string | null;
  setSelectedVoice: Dispatch<SetStateAction<string | null>>;
  storyId: string;
} & Omit<CustomModalProps, "children">;

const SelectReadingVoiceModal = ({
  isOpen,
  onClose,
  selectedVoice,
  setSelectedVoice,
  storyId,
}: PropTypes) => {
  const { data: voices } = useQuery(queryAvailableVoices);
  const selectedVoiceDisplay = voices?.find(
    (v) =>
      v.id === selectedVoice ||
      v.elevenLabsVoiceId === selectedVoice ||
      v.name === selectedVoice
  );

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} maxHeight={0.9}>
      <View className="flex flex-1 flex-col gap-y-6">
        <View className="flex flex-row items-center justify-between border-b border-b-border-lighter pb-6">
          <Text className="font-[abeezee] text-base text-black">
            Try new voice
          </Text>
          <Icon name="SquareX" onPress={onClose} />
        </View>
        <ScrollView
          className="flex-1"
          contentContainerClassName="flex flex-col pb-6"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex flex-row items-center justify-between rounded-xl border border-border-lighter p-4">
            <View className="flex flex-col">
              <Text className="font-[abeezee] text-text">
                Selected Story Voice
              </Text>
              <Text className="font-[quilka] text-2xl text-black">
                {selectedVoiceDisplay?.displayName ??
                  selectedVoiceDisplay?.name ??
                  (!selectedVoice
                    ? "No voice selected"
                    : voices
                      ? "Unknown voice"
                      : "Loading...")}
              </Text>
            </View>
            <Icon name="CircleCheck" color="green" />
          </View>
          <SuspenseWrapper>
            <AvailableVoices
              selectedVoice={selectedVoice}
              setSelectedVoice={setSelectedVoice}
              storyId={storyId}
            />
          </SuspenseWrapper>
        </ScrollView>
      </View>
    </CustomModal>
  );
};

export default SelectReadingVoiceModal;
