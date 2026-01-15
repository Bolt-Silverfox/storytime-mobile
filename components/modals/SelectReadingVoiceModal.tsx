import { Image, Pressable, ScrollView, Switch, Text, View } from "react-native";
import Icon from "../Icon";
import CustomButton from "../UI/CustomButton";
import CustomModal, { CustomModalProps } from "./CustomModal";
import { useState } from "react";

const SelectReadingVoiceModal = ({
  isOpen,
  onClose,
}: Omit<CustomModalProps, "children">) => {
  const [selectedVoice, setSelectedVoice] = useState("");

  const isPremium = false;
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
          <View className="border-t border-t-border-lighter gap-x-4 flex-wrap justify-center gap-y-6 py-6 flex flex-row">
            {voicesDummyData.map((voice, index) => (
              <View
                key={voice.id}
                className={` rounded-3xl min-w-48 py-6 flex flex-col px-4 ${selectedVoice === voice.id ? "border-primary border-2" : "border-border-light border"}`}
              >
                <Image
                  source={voice.avatarUrl}
                  className="size-[70px] self-center"
                />
                {!isPremium && index > 0 && (
                  <View className="bg-[#FFF8D2] self-center  rounded-full h-6 flex justify-center items-center px-2">
                    <Text className="font-[abeezee] text-black text-xs">
                      Premium
                    </Text>
                  </View>
                )}
                {index === 0 && (
                  <View className="bg-[#FAEFEB] self-centerd rounded-full h-6 flex justify-center items-center px-2">
                    <Text className="font-[abeezee] text-[#EC4007] text-xs">
                      Default
                    </Text>
                  </View>
                )}
                <Text className="text-2xl text-black self-center font-[abeezee]">
                  {voice.name}
                </Text>
                <View className="flex flex-row justify-between items-center gap-x-4">
                  <Pressable className="h-8 w-14 flex flex-row justify-center items-center border border-border rounded-full">
                    <Icon name="Volume2" />
                  </Pressable>
                  <Switch
                    onValueChange={() => setSelectedVoice(voice.id)}
                    value={voice.id === selectedVoice}
                  />
                </View>
              </View>
            ))}
          </View>
          <CustomButton text="Update default voice" disabled={!selectedVoice} />
        </ScrollView>
      </View>
    </CustomModal>
  );
};

export default SelectReadingVoiceModal;

const voicesDummyData = [
  {
    avatarUrl: require("../../assets/avatars/Avatars-6.png"),
    name: "Fanice",
    id: "1",
  },
  {
    avatarUrl: require("../../assets/avatars/Avatars-6.png"),
    name: "Fanice",
    id: "2",
  },
  {
    avatarUrl: require("../../assets/avatars/Avatars-6.png"),
    name: "Fanice",
    id: "3",
  },
  {
    avatarUrl: require("../../assets/avatars/Avatars-6.png"),
    name: "Fanice",
    id: "4",
  },
  {
    avatarUrl: require("../../assets/avatars/Avatars-6.png"),
    name: "Fanice",
    id: "5",
  },
  {
    avatarUrl: require("../../assets/avatars/Avatars-6.png"),
    name: "Fanice",
    id: "6",
  },
  {
    avatarUrl: require("../../assets/avatars/Avatars-6.png"),
    name: "Fanice",
    id: "7",
  },
  {
    avatarUrl: require("../../assets/avatars/Avatars-6.png"),
    name: "Fanice",
    id: "8",
  },
];
