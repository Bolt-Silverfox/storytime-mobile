import { useSuspenseQuery } from "@tanstack/react-query";
import { useAudioPlayer } from "expo-audio";
import { Dispatch, SetStateAction, useState } from "react";
import { Image, Pressable, Switch, Text, View } from "react-native";
import queryAvailableVoices from "../hooks/tanstack/queryHooks/queryAvailableVoices";
import useGetUserProfile from "../hooks/tanstack/queryHooks/useGetUserProfile";
import Icon from "./Icon";

const AvailableVoices = ({
  selectedVoice,
  setSelectedVoice,
}: {
  selectedVoice: string;
  setSelectedVoice: Dispatch<SetStateAction<string>>;
}) => {
  const { data, error } = useSuspenseQuery(queryAvailableVoices);
  const { data: user } = useGetUserProfile();
  const [currentlyViewing, setCurrentlyViewing] = useState(selectedVoice);
  const player = useAudioPlayer();

  const handlePreview = async (audioUrl: string) => {
    setCurrentlyViewing(audioUrl);
    player.replace(audioUrl);
    player.play();
  };

  const isPremium = user?.subscriptionStatus !== "free";
  return (
    <View className="border-t border-t-border-lighter gap-x-4 flex-wrap justify-center gap-y-6 py-6 flex flex-row">
      {data.map((voice, index) => (
        <View
          key={voice.name}
          className={` rounded-3xl min-w-48 py-6 flex flex-col px-4 ${currentlyViewing === voice.previewUrl ? "border-primary border-2" : "border-border-light border"}`}
        >
          <Image
            source={{ uri: voice.voiceAvatar }}
            className="size-[70px] self-center"
          />
          {!isPremium && voice.name !== "LILY" ? (
            <View className="bg-[#FFF8D2] self-center  rounded-full h-6 flex justify-center items-center px-2">
              <Text className="font-[abeezee] text-black text-xs">Premium</Text>
            </View>
          ) : (
            <View className="bg-[#FAEFEB] self-center rounded-full h-6 flex justify-center items-center px-2">
              <Text className="font-[abeezee] text-[#EC4007] text-xs">
                Default
              </Text>
            </View>
          )}
          <Text className="text-2xl capitalize text-black self-center font-[abeezee]">
            {voice.name.toLowerCase()}
          </Text>
          <View className="flex flex-row justify-between items-center gap-x-4">
            <Pressable
              onPress={() => handlePreview(voice.previewUrl)}
              className="h-8 w-14 flex flex-row justify-center items-center border border-border rounded-full"
            >
              <Icon name="Volume2" color={"black"} />
            </Pressable>
            <Switch
              onValueChange={() => setSelectedVoice(voice.name)}
              value={voice.name === selectedVoice}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

export default AvailableVoices;
