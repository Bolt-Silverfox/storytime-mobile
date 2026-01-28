import { Dispatch, lazy, SetStateAction } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Icon from "../Icon";
import SuspenseWrapper from "../supsense/SuspenseWrapper";
import CustomModal, { CustomModalProps } from "./CustomModal";
import CustomButton from "../UI/CustomButton";

const AvailableVoices = lazy(() => import("../AvailableVoices"));

type PropTypes = {
  selectedVoice: string;
  setSelectedVoice: Dispatch<SetStateAction<string>>;
} & Omit<CustomModalProps, "children">;

const SelectReadingVoiceModal = ({
  isOpen,
  onClose,
  selectedVoice,
  setSelectedVoice,
}: PropTypes) => {
  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      <View className="flex flex-1 flex-col gap-y-6">
        <View className="flex flex-row justify-between border-b pb-6 border-b-border-lighter items-center">
          <Text className="text-base font-[abeezee] text-black">
            Try new voice
          </Text>
          <Icon name="SquareX" onPress={onClose} />
        </View>
        <ScrollView
          contentContainerClassName="flex flex-col min-h-full"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex flex-row items-center p-4 rounded-xl border border-border-lighter justify-between">
            <View className="flex flex-col">
              <Text className="font-[abeezee] text-text">
                Selected Story Voice
              </Text>
              <Text className="font-[quilka] text-2xl text-black">Fanice</Text>
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
