import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import WheelPicker from "react-native-wheel-picker-expo";
import { ItemType } from "react-native-wheel-picker-expo/lib/typescript/types";

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (time: string) => void;
};

const hourItems: ItemType[] = Array.from({ length: 12 }, (_, i) => {
  const val = (i + 1).toString();
  return { label: val, value: val };
});

const minuteItems: ItemType[] = Array.from({ length: 60 }, (_, i) => {
  const val = i.toString().padStart(2, "0");
  return { label: val, value: val };
});

const periodItems: ItemType[] = ["AM", "PM"].map((p) => ({
  label: p,
  value: p,
}));

const TimePickerOverlay = ({ visible, onClose, onConfirm }: Props) => {
  const [hourIndex, setHourIndex] = useState(11);
  const [minuteIndex, setMinuteIndex] = useState(0);
  const [periodIndex, setPeriodIndex] = useState(0);

  const handleConfirm = () => {
    const hour = hourItems[hourIndex].value;
    const minute = minuteItems[minuteIndex].value;
    const period = periodItems[periodIndex].value;
    const final = `${hour}:${minute} ${period}`;
    onConfirm(final);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/60 justify-center items-center">
        <View className="w-4/5 bg-white rounded-2xl p-6 items-center">
          <Text className="text-xl font-semibold mb-4">Select Time</Text>

          <View className="flex-row justify-between w-full">
            <WheelPicker
              items={hourItems}
              onChange={({ index }) => setHourIndex(index)}
              height={150}
              width={80}
            />

            <WheelPicker
              items={minuteItems}
              onChange={({ index }) => setMinuteIndex(index)}
              height={150}
              width={80}
            />

            <WheelPicker
              items={periodItems}
              onChange={({ index }) => setPeriodIndex(index)}
              height={150}
              width={80}
            />
          </View>

          <TouchableOpacity
            className="mt-6 bg-blue-600 px-6 py-2 rounded-xl"
            onPress={handleConfirm}
          >
            <Text className="text-white text-base">Done</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose}>
            <Text className="text-red-500 mt-3 text-base">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default TimePickerOverlay;
