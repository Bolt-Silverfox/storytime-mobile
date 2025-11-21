import { Dispatch, SetStateAction } from "react";
import { Modal, Pressable, Text, View } from "react-native";

const ageRanges = ["1 - 4", "5 - 8", "9 - 12"];

type Props = {
  isOpen: boolean;
  onClose: () => void;
  selectAge: Dispatch<SetStateAction<string>>;
};

const AgeSelectionModal = ({ isOpen, onClose, selectAge }: Props) => {
  const onSelect = (range: string) => {
    selectAge(range);
    onClose();
  };
  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable onPress={onClose} className="flex-1 bg-black/40" />

      <View className="bg-white rounded-t-3xl p-6 pb-12 absolute bottom-0 w-full">
        <Text className="text-lg font-[quilka] mb-4 text-center">
          Select Age Range
        </Text>

        <View className="flex flex-col gap-y-3">
          {ageRanges.map((range) => (
            <Pressable
              key={range}
              onPress={() => onSelect(range)}
              className="py-4 border border-gray-300 rounded-full"
            >
              <Text className="text-center text-base font-[abeezee]">
                {range} years
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </Modal>
  );
};

export default AgeSelectionModal;
