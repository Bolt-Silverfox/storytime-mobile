import { useSuspenseQuery } from "@tanstack/react-query";
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
} & Omit<CustomModalProps, "children">;

const SelectReadingVoiceModal = ({
  isOpen,
  onClose,
  selectedVoice,
  setSelectedVoice,
}: PropTypes) => {
  const { data: voices } = useSuspenseQuery(queryAvailableVoices);
  const selectedVoiceName =
    voices.find((v) => v.id === selectedVoice)?.name ?? "No voice selected";

  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      <View className="flex flex-1 flex-col gap-y-6">
        <View className="flex flex-row items-center justify-between border-b border-b-border-lighter pb-6">
          <Text className="font-[abeezee] text-base text-black">
            Try new voice
          </Text>
          <Icon name="SquareX" onPress={onClose} />
        </View>
        <ScrollView
          contentContainerClassName="flex flex-col min-h-full"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex flex-row items-center justify-between rounded-xl border border-border-lighter p-4">
            <View className="flex flex-col">
              <Text className="font-[abeezee] text-text">
                Selected Story Voice
              </Text>
              <Text className="font-[quilka] text-2xl capitalize text-black">
                {selectedVoiceName.toLowerCase()}
              </Text>
            </View>
            <Icon name="CircleCheck" color="green" />
          </View>
          <SuspenseWrapper>
            <AvailableVoices
              selectedVoice={selectedVoice}
              setSelectedVoice={setSelectedVoice}
            />
          </SuspenseWrapper>
        </ScrollView>
      </View>
    </CustomModal>
  );
};

export default SelectReadingVoiceModal;
