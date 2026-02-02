import { useSuspenseQuery } from "@tanstack/react-query";
import { useAudioPlayer } from "expo-audio";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Image, Pressable, Switch, Text, View } from "react-native";
import {
  BADGE_LABELS,
  COLORS,
  SUBSCRIPTION_STATUS,
  USER_ROLES,
} from "../constants/ui";
import queryAvailableVoices from "../hooks/tanstack/queryHooks/queryAvailableVoices";
import useGetUserProfile from "../hooks/tanstack/queryHooks/useGetUserProfile";
import Icon from "./Icon";
import SubscriptionModal from "./modals/SubscriptionModal";

const VoiceBadge = ({
  isDefault,
  isPremium,
}: {
  isDefault: boolean;
  isPremium: boolean;
}) => {
  if (isDefault) {
    return (
      <View
        style={{ backgroundColor: COLORS.defaultBadge.background }}
        className="flex h-6 items-center justify-center self-center rounded-full px-2"
      >
        <Text
          style={{ color: COLORS.defaultBadge.text }}
          className="font-[abeezee] text-xs"
        >
          {BADGE_LABELS.default}
        </Text>
      </View>
    );
  }

  if (!isPremium) {
    return (
      <View
        style={{ backgroundColor: COLORS.premiumBadge.background }}
        className="flex h-6 items-center justify-center self-center rounded-full px-2"
      >
        <Text className="font-[abeezee] text-xs text-black">
          {BADGE_LABELS.premium}
        </Text>
      </View>
    );
  }

  return <View className="h-6" />;
};

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

  // Auto-select the first (default) voice if none is selected
  useEffect(() => {
    if (!selectedVoice && data.length > 0) {
      setSelectedVoice(data[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVoice, data]);

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

  return (
    <View className="flex flex-row flex-wrap justify-center gap-x-4 gap-y-6 border-t border-t-border-lighter py-6">
      {data.map((voice, index) => {
        const isSelected = voice.id === selectedVoice;
        const isPreviewing = voice.id === previewingId;
        const isDefault = index === 0;

        return (
          <Pressable
            onPress={() => {
              handlePreview(voice.previewUrl, voice.id);
              if (isPremium || isDefault) {
                setSelectedVoice(voice.id);
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
                onValueChange={() => setSelectedVoice(voice.id)}
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
