import { useSuspenseQuery } from "@tanstack/react-query";
import { useAudioPlayer } from "expo-audio";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Image, Pressable, Switch, Text, View } from "react-native";
import { COLORS } from "../constants/ui";
import { AvailableVoices as VoiceData } from "../types";
import useSetPreferredVoice from "../hooks/tanstack/mutationHooks/useSetPreferredVoice";
import queryAvailableVoices from "../hooks/tanstack/queryHooks/queryAvailableVoices";
import useGetVoiceAccess from "../hooks/tanstack/queryHooks/useGetVoiceAccess";
import useToast from "../contexts/ToastContext";
import Icon from "./Icon";
import SubscriptionModal from "./modals/SubscriptionModal";

const AvailableVoices = ({
  selectedVoice,
  setSelectedVoice,
  storyId,
}: {
  selectedVoice: string | null;
  setSelectedVoice: Dispatch<SetStateAction<string | null>>;
  storyId: string;
}) => {
  const { data } = useSuspenseQuery(queryAvailableVoices);
  const { data: voiceAccess, isLoading: voiceAccessLoading } =
    useGetVoiceAccess(storyId);
  const [previewingId, setPreviewingId] = useState<string | null>(null);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const player = useAudioPlayer();
  const { mutate: markPreferred } = useSetPreferredVoice();

  const { notify } = useToast();
  const hasShownTrialToast = useRef(false);

  const isPremium = voiceAccess?.isPremium ?? false;
  const lockedVoiceId = voiceAccess?.lockedVoiceId ?? null;
  const usedVoicesForStory = voiceAccess?.usedVoicesForStory ?? [];
  const maxVoicesPerStory = voiceAccess?.maxVoicesPerStory ?? 3;
  const isStoryAtVoiceLimit =
    isPremium && usedVoicesForStory.length >= maxVoicesPerStory;

  useEffect(() => {
    if (voiceAccessLoading || hasShownTrialToast.current) return;
    if (!isPremium && !lockedVoiceId) {
      notify("Your first story gets our best voice — choose wisely!");
      hasShownTrialToast.current = true;
    }
  }, [voiceAccessLoading, isPremium, lockedVoiceId, notify]);

  const isVoiceLocked = !isPremium && !!lockedVoiceId;

  const isVoiceAllowed = (voice: VoiceData): boolean => {
    if (voiceAccessLoading) return false;

    // Premium per-story limit: if story has max voices used,
    // only those voices are allowed
    if (isPremium) {
      if (!isStoryAtVoiceLimit) return true;
      return usedVoicesForStory.includes(voice.id);
    }

    // Free user: no voice locked yet — allow all (backend enforces the real gate)
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
        console.error("Failed to load audio preview:", error); // eslint-disable-line no-console
      }
      setPreviewingId(null);
    }
  };

  const handleSelectVoice = (voice: VoiceData) => {
    if (voiceAccessLoading) return;
    if (voice.id === selectedVoice) return;
    if (!isVoiceAllowed(voice)) {
      if (isPremium && isStoryAtVoiceLimit) {
        notify(
          `This story already uses ${maxVoicesPerStory} voices. Pick one of the voices already used.`
        );
      } else {
        setIsSubscriptionModalOpen(true);
      }
      return;
    }
    setSelectedVoice(voice.id);
    markPreferred(voice.id);
  };

  return (
    <>
      {!voiceAccessLoading && !isPremium && !lockedVoiceId && (
        <View className="bg-blue-50 mx-2 mb-4 rounded-xl p-3">
          <Text className="text-blue-700 text-center font-[abeezee] text-sm">
            Choose your voice carefully — free users can only select one premium
            voice.
          </Text>
        </View>
      )}
      {!voiceAccessLoading && !isPremium && lockedVoiceId && (
        <View className="bg-blue-50 mx-2 mb-4 rounded-xl p-3">
          <Text className="text-blue-700 text-center font-[abeezee] text-sm">
            Upgrade to premium to unlock all voices
          </Text>
        </View>
      )}
      {!voiceAccessLoading && isPremium && isStoryAtVoiceLimit && (
        <View className="mx-2 mb-4 rounded-xl bg-amber-50 p-3">
          <Text className="text-center font-[abeezee] text-sm text-amber-700">
            {`${usedVoicesForStory.length}/${maxVoicesPerStory} voices used on this story`}
          </Text>
        </View>
      )}
      <View className="flex flex-row flex-wrap justify-center gap-x-4 gap-y-6 border-t border-t-border-lighter py-6">
        {data.map((voice) => {
          const isSelected = voice.id === selectedVoice;
          const isPreviewing = voice.id === previewingId;
          const allowed = isVoiceAllowed(voice);
          const isFreeUserLocked = !isPremium && lockedVoiceId === voice.id;
          const isPremiumStoryLocked =
            isPremium && isStoryAtVoiceLimit && !allowed;

          return (
            <Pressable
              onPress={() => {
                if (voice.id === selectedVoice) return;
                handleSelectVoice(voice);
                if (allowed) {
                  handlePreview(voice.previewUrl, voice.id);
                }
              }}
              key={voice.id}
              accessibilityLabel={`${voice.displayName ?? voice.name}${isSelected ? ", selected" : ""}${!allowed ? ", locked" : ""}`}
              accessibilityRole="button"
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
              {isFreeUserLocked && (
                <View className="mt-2 flex h-6 items-center justify-center self-center rounded-full bg-[#FAEFEB] px-2">
                  <Text className="font-[abeezee] text-xs text-primary">
                    Your voice
                  </Text>
                </View>
              )}
              {isPremiumStoryLocked && (
                <View className="mt-2 flex h-6 flex-row items-center justify-center gap-x-1 self-center rounded-full bg-amber-50 px-2">
                  <Icon name="Lock" size={12} color="#D97706" />
                  <Text className="font-[abeezee] text-xs text-amber-600">
                    {`${usedVoicesForStory.length}/${maxVoicesPerStory} voices`}
                  </Text>
                </View>
              )}
              {isVoiceLocked && !allowed && !isPremiumStoryLocked && (
                <View className="mt-2 flex h-6 flex-row items-center justify-center gap-x-1 self-center rounded-full bg-amber-50 px-2">
                  <Icon name="Lock" size={12} color="#D97706" />
                  <Text className="font-[abeezee] text-xs text-amber-600">
                    Premium
                  </Text>
                </View>
              )}
              {!isFreeUserLocked &&
                !isPremiumStoryLocked &&
                !(isVoiceLocked && !allowed) && <View className="mt-2 h-6" />}
              <Text className="mt-3 self-center font-[abeezee] text-2xl text-black">
                {voice.displayName ?? voice.name}
              </Text>
              <View className="flex flex-row items-center justify-between gap-x-4">
                <Pressable
                  onPress={() => {
                    if (voiceAccessLoading) return;
                    if (!allowed) {
                      if (isPremium && isStoryAtVoiceLimit) {
                        notify(
                          `This story already uses ${maxVoicesPerStory} voices. Pick one of the voices already used.`
                        );
                      } else {
                        setIsSubscriptionModalOpen(true);
                      }
                      return;
                    }
                    handlePreview(voice.previewUrl, voice.id);
                  }}
                  className={`flex h-8 w-14 flex-row items-center justify-center rounded-full border ${isPreviewing ? "border-primary bg-primary/10" : "border-border"}`}
                >
                  <Icon
                    name="Volume2"
                    color={
                      isPreviewing
                        ? COLORS.blue
                        : !allowed
                          ? COLORS.skeleton
                          : "black"
                    }
                  />
                </Pressable>
                <View pointerEvents="none">
                  <Switch
                    value={isSelected}
                    disabled={!allowed}
                    accessibilityLabel={`Select voice ${voice.displayName ?? voice.name}`}
                  />
                </View>
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
