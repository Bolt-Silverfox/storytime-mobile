import { useSuspenseQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";
import { Image, Pressable, Switch, Text, View } from "react-native";
import queryAvailableVoices from "../hooks/tanstack/queryHooks/queryAvailableVoices";
import Icon from "./Icon";

const AvailableVoices = ({
  selectedVoice,
  setSelectedVoice,
}: {
  selectedVoice: string;
  setSelectedVoice: Dispatch<SetStateAction<string>>;
}) => {
  const { data, error } = useSuspenseQuery(queryAvailableVoices);

  const isPremium = false;
  return (
    <View className="border-t border-t-border-lighter gap-x-4 flex-wrap justify-center gap-y-6 py-6 flex flex-row">
      {data.map((voice, index) => (
        <View
          key={voice.voice_id}
          className={` rounded-3xl min-w-48 py-6 flex flex-col px-4 ${selectedVoice === voice.voice_id ? "border-primary border-2" : "border-border-light border"}`}
        >
          <Image
            source={require("../assets/avatars/Avatars-6.png")}
            className="size-[70px] self-center"
          />
          {!isPremium && index > 0 && (
            <View className="bg-[#FFF8D2] self-center  rounded-full h-6 flex justify-center items-center px-2">
              <Text className="font-[abeezee] text-black text-xs">Premium</Text>
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
              onValueChange={() => setSelectedVoice(voice.voice_id)}
              value={voice.voice_id === selectedVoice}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

export default AvailableVoices;
