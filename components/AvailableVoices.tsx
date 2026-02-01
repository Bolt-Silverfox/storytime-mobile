import { useSuspenseQuery } from "@tanstack/react-query";
import { useAudioPlayer } from "expo-audio";
import { Dispatch, SetStateAction, useState } from "react";
import { Image, Pressable, Switch, Text, View } from "react-native";
import queryAvailableVoices from "../hooks/tanstack/queryHooks/queryAvailableVoices";
import useGetUserProfile from "../hooks/tanstack/queryHooks/useGetUserProfile";
import Icon from "./Icon";
import SubscriptionModal from "./modals/SubscriptionModal";

const AvailableVoices = ({
  selectedVoice,
  setSelectedVoice,
}: {
  selectedVoice: string;
  setSelectedVoice: Dispatch<SetStateAction<string>>;
}) => {
  const { data } = useSuspenseQuery(queryAvailableVoices);
  const { data: user } = useGetUserProfile();
  const [currentlyViewing, setCurrentlyViewing] = useState(selectedVoice);
  const [isSubsriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const player = useAudioPlayer();

  const isPremium =
    user?.subscriptionStatus === "active" || user?.role === "admin";

  const handlePreview = (audioUrl: string, name: string) => {
    if (!isPremium) {
      setIsSubscriptionModalOpen(true);
      return;
    }
    setCurrentlyViewing(name);
    player.replace(audioUrl);
    player.play();
  };

  return (
    <View className="border-t border-t-border-lighter gap-x-4 flex-wrap justify-center gap-y-6 py-6 flex flex-row">
      {data.map((voice) => (
        <Pressable
          onPress={() => {
            if (!isPremium) {
              setIsSubscriptionModalOpen(true);
              return;
            }
            setCurrentlyViewing(voice.name);
            player.replace(voice.previewUrl);
          }}
          key={voice.name}
          className={` rounded-3xl w-[47.5%] py-6 flex flex-col px-4 ${currentlyViewing === voice.name ? "border-primary border-2" : "border-border-light border"}`}
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
          <Text className="text-2xl mt-3 capitalize text-black self-center font-[abeezee]">
            {voice.name.toLowerCase()}
          </Text>
          <View className="flex flex-row justify-between items-center gap-x-4">
            <Pressable
              onPress={() => handlePreview(voice.previewUrl, voice.name)}
              className="h-8 w-14 flex flex-row justify-center items-center border border-border rounded-full"
            >
              <Icon name="Volume2" color={"black"} />
            </Pressable>
            <Switch
              onValueChange={() => setSelectedVoice(voice.name)}
              value={voice.name === selectedVoice}
            />
          </View>
        </Pressable>
      ))}
      <SubscriptionModal
        isOpen={isSubsriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
      />
    </View>
  );
};

export default AvailableVoices;
