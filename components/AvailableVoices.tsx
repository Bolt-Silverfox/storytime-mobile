import { useSuspenseQuery } from "@tanstack/react-query";
import { useAudioPlayer } from "expo-audio";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Image, Pressable, Switch, Text, View } from "react-native";
import { BADGE_LABELS, COLORS, SUBSCRIPTION_STATUS, USER_ROLES } from "../constants/ui";
import queryAvailableVoices from "../hooks/tanstack/queryHooks/queryAvailableVoices";
import useGetUserProfile from "../hooks/tanstack/queryHooks/useGetUserProfile";
import Icon from "./Icon";
import SubscriptionModal from "./modals/SubscriptionModal";

const VoiceBadge = ({ isDefault, isPremium }: { isDefault: boolean; isPremium: boolean }) => {
  if (isDefault) {
    return (
      <View
        style={{ backgroundColor: COLORS.defaultBadge.background }}
        className="self-center rounded-full h-6 flex justify-center items-center px-2"
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
        className="self-center rounded-full h-6 flex justify-center items-center px-2"
      >
        <Text className="font-[abeezee] text-black text-xs">
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
    user?.subscriptionStatus === SUBSCRIPTION_STATUS.active || user?.role === USER_ROLES.admin;

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
      console.error("Failed to load audio preview:", error);
      setPreviewingId(null);
    }
  };

  return (
    <View className="border-t border-t-border-lighter gap-x-4 flex-wrap justify-center gap-y-6 py-6 flex flex-row">
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
            className={`rounded-3xl w-[47.5%] py-6 flex flex-col px-4 ${isSelected ? "border-primary border-2" : "border-border-light border"}`}
          >
            <Image
              source={{ uri: voice.voiceAvatar }}
              className="size-[70px] self-center"
            />
            <VoiceBadge isDefault={isDefault} isPremium={isPremium} />
            <Text className="text-2xl mt-3 capitalize text-black self-center font-[abeezee]">
              {voice.name.toLowerCase()}
            </Text>
            <View className="flex flex-row justify-between items-center gap-x-4">
              <Pressable
                onPress={() => handlePreview(voice.previewUrl, voice.id)}
                className={`h-8 w-14 flex flex-row justify-center items-center border rounded-full ${isPreviewing ? "border-primary bg-primary/10" : "border-border"}`}
              >
                <Icon name="Volume2" color={isPreviewing ? COLORS.blue : "black"} />
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
