import { useSuspenseQuery } from "@tanstack/react-query";
import { useAudioPlayer } from "expo-audio";
import { Dispatch, SetStateAction, useState } from "react";
import { Image, Pressable, Switch, Text, View } from "react-native";
import { COLORS } from "../constants/ui";
import { AvailableVoices as VoiceData } from "../types";
import useSetPreferredVoice from "../hooks/tanstack/mutationHooks/useSetPreferredVoice";
import queryAvailableVoices from "../hooks/tanstack/queryHooks/queryAvailableVoices";
import useGetVoiceAccess from "../hooks/tanstack/queryHooks/useGetVoiceAccess";
import Icon from "./Icon";
import SubscriptionModal from "./modals/SubscriptionModal";

const AvailableVoices = ({
  selectedVoice,
  setSelectedVoice,
}: {
  selectedVoice: string | null;
  setSelectedVoice: Dispatch<SetStateAction<string | null>>;
}) => {
  const { data } = useSuspenseQuery(queryAvailableVoices);
  const { data: voiceAccess } = useGetVoiceAccess();
  const [previewingId, setPreviewingId] = useState<string | null>(null);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const player = useAudioPlayer();
  const { mutate: markPreferred } = useSetPreferredVoice();

  const isPremium = voiceAccess?.isPremium ?? false;
  const lockedVoiceId = voiceAccess?.lockedVoiceId ?? null;

  const isVoiceAllowed = (voice: VoiceData): boolean => {
    if (isPremium) return true;
    // While loading or no voice locked yet — allow all (backend enforces the real gate)
    if (!lockedVoiceId) return true;
    // Only the locked voice is allowed
    return voice.id === lockedVoiceId;
  };

  const handlePreview = (audioUrl: string, voiceId: string) => {
    setPreviewingId(voiceId);
    try {
      player.replace(audioUrl);
      player.play();
    } catch (error) {
      if (__DEV__) {
        console.error("Failed to load audio preview:", error);
      }
      setPreviewingId(null);
    }
  };

  const handleSelectVoice = (voice: VoiceData) => {
    if (!isVoiceAllowed(voice)) {
      setIsSubscriptionModalOpen(true);
      return;
    }
    setSelectedVoice(voice.id);
    markPreferred(voice.id);
  };

  return (
    <>
      {!isPremium && !lockedVoiceId && (
        <View className="mx-2 mb-4 rounded-xl bg-blue-50 p-3">
          <Text className="text-center font-[abeezee] text-sm text-blue-700">
            Choose your voice carefully — free users can only select one premium
            voice.
          </Text>
        </View>
      )}
      <View className="flex flex-row flex-wrap justify-center gap-x-4 gap-y-6 border-t border-t-border-lighter py-6">
        {data.map((voice) => {
        const isSelected = voice.id === selectedVoice;
        const isPreviewing = voice.id === previewingId;
        const allowed = isVoiceAllowed(voice);
        const isLocked = !isPremium && lockedVoiceId === voice.id;

        return (
          <Pressable
            onPress={() => {
              handleSelectVoice(voice);
              if (allowed) {
                handlePreview(voice.previewUrl, voice.id);
              }
            }}
            key={voice.id}
            className={`flex w-[47.5%] flex-col rounded-3xl px-4 py-6 ${
              !allowed
                ? "border border-border-light opacity-40"
                : isSelected
                  ? "border-2 border-primary"
                  : "border border-border-light"
            }`}
          >
            <Image
              source={{ uri: voice.voiceAvatar }}
              className="size-[70px] self-center"
            />
            {isLocked && (
              <View className="mt-2 flex h-6 items-center justify-center self-center rounded-full bg-[#FAEFEB] px-2">
                <Text className="font-[abeezee] text-xs text-primary">
                  Your voice
                </Text>
              </View>
            )}
            {!isPremium && !allowed && (
              <View className="mt-2 flex h-6 flex-row items-center justify-center self-center rounded-full bg-amber-50 px-2">
                <Text className="font-[abeezee] text-xs text-amber-600">
                  Premium
                </Text>
              </View>
            )}
            {(isPremium || (!isLocked && allowed)) && (
              <View className="mt-2 h-6" />
            )}
            <Text className="mt-3 self-center font-[abeezee] text-2xl text-black">
              {voice.displayName ?? voice.name}
            </Text>
            <View className="flex flex-row items-center justify-between gap-x-4">
              <Pressable
                onPress={() => {
                  if (!allowed) {
                    setIsSubscriptionModalOpen(true);
                    return;
                  }
                  handlePreview(voice.previewUrl, voice.id);
                }}
                className={`flex h-8 w-14 flex-row items-center justify-center rounded-full border ${isPreviewing ? "border-primary bg-primary/10" : "border-border"}`}
              >
                <Icon
                  name="Volume2"
                  color={
                    isPreviewing ? COLORS.blue : allowed ? "black" : "#9CA3AF"
                  }
                />
              </Pressable>
              <Switch
                onValueChange={() => handleSelectVoice(voice)}
                value={isSelected}
                disabled={!allowed}
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
    </>
  );
};

export default AvailableVoices;
