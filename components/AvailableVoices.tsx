import { useSuspenseQuery } from "@tanstack/react-query";
import { useAudioPlayer } from "expo-audio";
import { Dispatch, SetStateAction, useState } from "react";
import { Image, Pressable, Switch, Text, View } from "react-native";
import { COLORS, SUBSCRIPTION_STATUS, USER_ROLES } from "../constants/ui";
import { AvailableVoices as VoiceData } from "../types";
import useSetPreferredVoice from "../hooks/tanstack/mutationHooks/useSetPreferredVoice";
import queryAvailableVoices from "../hooks/tanstack/queryHooks/queryAvailableVoices";
import useGetUserProfile from "../hooks/tanstack/queryHooks/useGetUserProfile";
import Icon from "./Icon";
import SubscriptionModal from "./modals/SubscriptionModal";
import VoiceBadge from "./UI/VoiceBadge";

const AvailableVoices = ({
  selectedVoice,
  setSelectedVoice,
}: {
  selectedVoice: string | null;
  setSelectedVoice: Dispatch<SetStateAction<string | null>>;
}) => {
  const { data } = useSuspenseQuery(queryAvailableVoices);
  const { data: user } = useGetUserProfile();
  const [previewingId, setPreviewingId] = useState<string | null>(null);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const player = useAudioPlayer();
  const { mutate: markPreferred } = useSetPreferredVoice();

  const isPremium =
    user?.subscriptionStatus === SUBSCRIPTION_STATUS.active ||
    user?.role === USER_ROLES.admin;

  const handlePreview = async (audioUrl: string, voiceId: string) => {
    if (!isPremium) {
      setIsSubscriptionModalOpen(true);
      return;
    }
    setPreviewingId(voiceId);
    try {
      await player.replace(audioUrl);
      player.play();
    } catch (error) {
      if (__DEV__) {
        console.error("Failed to load audio preview:", error);
      }
      setPreviewingId(null);
    }
  };

  const handleSelectVoice = (voice: VoiceData) => {
    if (!isPremium) {
      setIsSubscriptionModalOpen(true);
      return;
    }
    const voiceValue =
      voice.type === "elevenlabs" ? voice.name.toUpperCase() : voice.id;
    setSelectedVoice(voiceValue);
    if (isPremium) {
      markPreferred(voice.id);
    }
  };

  return (
    <View className="flex flex-row flex-wrap justify-center gap-x-4 gap-y-6 border-t border-t-border-lighter py-6">
      {data.map((voice) => {
        const isSelected = voice.name.toUpperCase() === selectedVoice;
        const isPreviewing = voice.id === previewingId;
        const isDefault = voice.name.toUpperCase() === "LILY";

        return (
          <Pressable
            onPress={() => {
              handlePreview(voice.previewUrl, voice.id);
              if (isPremium || isDefault) {
                handleSelectVoice(voice);
              }
            }}
            key={voice.id}
            className={`flex w-[47.5%] flex-col rounded-3xl px-4 py-6 ${isSelected ? "border-2 border-primary" : "border border-border-light"}`}
          >
            <Image
              source={{ uri: voice.voiceAvatar }}
              className="size-[70px] self-center"
            />
            <VoiceBadge isDefault={isDefault} isPremium={isPremium} />
            <Text className="mt-3 self-center font-[abeezee] text-2xl capitalize text-black">
              {voice.name.toLowerCase()}
            </Text>
            <View className="flex flex-row items-center justify-between gap-x-4">
              <Pressable
                onPress={() => handlePreview(voice.previewUrl, voice.id)}
                className={`flex h-8 w-14 flex-row items-center justify-center rounded-full border ${isPreviewing ? "border-primary bg-primary/10" : "border-border"}`}
              >
                <Icon
                  name="Volume2"
                  color={isPreviewing ? COLORS.blue : "black"}
                />
              </Pressable>
              <Switch
                onValueChange={() => handleSelectVoice(voice)}
                value={isSelected}
              />
            </View>
          </Pressable>
        );
      })}
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
      />
    </View>
  );
};

export default AvailableVoices;
