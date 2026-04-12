import { useQuery } from "@tanstack/react-query";
import { useAudioPlayer } from "expo-audio";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Image, Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { COLORS } from "../constants/ui";
import { GUEST_DEFAULT_VOICE_ID } from "../constants";
import { audioLogger } from "../utils/logger";
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
  deferSave = false,
  isGuest = false,
}: {
  selectedVoice: string | null;
  setSelectedVoice: Dispatch<SetStateAction<string | null>>;
  storyId?: string;
  /** When true, card taps only update local selection — caller handles persistence */
  deferSave?: boolean;
  /** When true, user is in guest mode and should have limited voice access */
  isGuest?: boolean;
}) => {
  const {
    data,
    isLoading: voicesLoading,
    isError: voicesError,
  } = useQuery(queryAvailableVoices);
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

  // Helper to check if a voice is selected (selectedVoice can be id, elevenLabsVoiceId, or name)
  const isVoiceSelected = (voice: VoiceData): boolean => {
    return (
      selectedVoice === voice.id ||
      selectedVoice === voice.elevenLabsVoiceId ||
      selectedVoice === voice.name
    );
  };

  const isVoiceAllowed = (voice: VoiceData): boolean => {
    // Guest users: only the default voice is allowed
    if (isGuest) {
      return voice.elevenLabsVoiceId === GUEST_DEFAULT_VOICE_ID;
    }

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

  const notifyVoiceLimitReached = () => {
    const usedCount = usedVoicesForStory.length;
    const usedNames = (data ?? [])
      .filter((v) => usedVoicesForStory.includes(v.id))
      .map((v) => v.displayName ?? v.name);
    notify(
      `You've used ${usedCount} ${usedCount === 1 ? "voice" : "voices"} on this story. Switch between ${usedNames.join(", ")}.`
    );
  };

  const handlePreview = (audioUrl: string, voiceId: string) => {
    setPreviewingId(voiceId);
    try {
      player.replace(audioUrl);
      player.play();
    } catch (error) {
      audioLogger.error("Failed to load audio preview:", error);
      setPreviewingId(null);
    }
  };

  const handleSelectVoice = (voice: VoiceData) => {
    if (!isGuest && voiceAccessLoading) return;
    if (isVoiceSelected(voice)) return;
    if (!isVoiceAllowed(voice)) {
      if (isGuest) {
        // Guests need to sign up to change voices
        setIsSubscriptionModalOpen(true);
        return;
      }
      if (isPremium && isStoryAtVoiceLimit) {
        notifyVoiceLimitReached();
      } else {
        setIsSubscriptionModalOpen(true);
      }
      return;
    }
    setSelectedVoice(voice.id);
    if (!deferSave) {
      markPreferred(voice.id);
    }
  };

  return (
    <>
      {voicesLoading && (
        <View className="flex items-center justify-center py-8">
          <Text className="font-[abeezee] text-text">Loading voices...</Text>
        </View>
      )}
      {voicesError && (
        <View className="flex items-center justify-center py-8">
          <Text className="font-[abeezee] text-red-600">
            Failed to load voices. Please try again.
          </Text>
        </View>
      )}
      {!voicesLoading && !voicesError && data && (
        <>
          {/* Guest mode warning */}
          {!voiceAccessLoading && isGuest && (
            <View className="mx-2 mb-4 flex-row items-center gap-x-4 rounded-2xl bg-[#ECC607] p-4">
              <Icon name="TriangleAlert" size={20} color="#212121" />
              <Text className="flex-1 font-[abeezee] text-xs text-[#212121]">
                Sign up to unlock more voices and choose your favorite!
              </Text>
            </View>
          )}
          {!voiceAccessLoading && !isPremium && !lockedVoiceId && !isGuest && (
            <View className="mx-2 mb-4 flex-row items-center gap-x-4 rounded-2xl bg-[#ECC607] p-4">
              <Icon name="TriangleAlert" size={20} color="#212121" />
              <Text className="flex-1 font-[abeezee] text-xs text-[#212121]">
                {
                  "Selecting a voice sets it as your default. To change it later, you'll need to subscribe."
                }
              </Text>
            </View>
          )}
          {!voiceAccessLoading && !isPremium && lockedVoiceId && !isGuest && (
            <View className="mx-2 mb-4 flex-row items-center gap-x-4 rounded-2xl bg-[#ECC607] p-4">
              <Icon name="TriangleAlert" size={20} color="#212121" />
              <Text className="flex-1 font-[abeezee] text-xs text-[#212121]">
                Upgrade to premium to unlock all voices.
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
              const isSelected = isVoiceSelected(voice);
              const isPreviewing = voice.id === previewingId;
              const allowed = isVoiceAllowed(voice);
              const isFreeUserLocked = !isPremium && lockedVoiceId === voice.id;
              const isGuestDefaultLocked =
                isGuest && voice.elevenLabsVoiceId === GUEST_DEFAULT_VOICE_ID;
              const isPremiumStoryLocked =
                isPremium && isStoryAtVoiceLimit && !allowed;

              return (
                <Pressable
                  onPress={() => {
                    if (isVoiceSelected(voice)) return;
                    handleSelectVoice(voice);
                    if (allowed) {
                      handlePreview(voice.previewUrl, voice.id);
                    }
                  }}
                  key={voice.id}
                  accessibilityLabel={`${voice.displayName ?? voice.name}${isSelected ? ", selected" : ""}${!allowed ? ", locked" : ""}`}
                  accessibilityRole="button"
                  style={isSelected ? voiceStyles.selectedShadow : undefined}
                  className={`flex w-[47.5%] flex-col rounded-3xl px-4 py-6 ${
                    !allowed
                      ? "border border-border-light opacity-40"
                      : isSelected
                        ? "border border-primary"
                        : "border border-border-light"
                  }`}
                >
                  <Image
                    source={{ uri: voice.voiceAvatar }}
                    className="size-[70px] self-center"
                  />
                  {(isFreeUserLocked || isGuestDefaultLocked) && (
                    <View className="mt-2 flex h-6 items-center justify-center self-center rounded-full bg-[#FAEFEB] px-5 py-0.5">
                      <Text className="font-[abeezee] text-[8px] text-primary">
                        Default
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
                  {isVoiceLocked &&
                    !allowed &&
                    !isPremiumStoryLocked &&
                    !isGuest && (
                      <View className="mt-2 flex h-6 flex-row items-center justify-center gap-x-1 self-center rounded-full bg-amber-50 px-2">
                        <Icon name="Lock" size={12} color="#D97706" />
                        <Text className="font-[abeezee] text-xs text-amber-600">
                          Premium
                        </Text>
                      </View>
                    )}
                  {isGuest &&
                    !allowed &&
                    voice.elevenLabsVoiceId !== GUEST_DEFAULT_VOICE_ID && (
                      <View className="mt-2 flex h-6 flex-row items-center justify-center gap-x-1 self-center rounded-full bg-amber-50 px-2">
                        <Icon name="Lock" size={12} color="#D97706" />
                        <Text className="font-[abeezee] text-xs text-amber-600">
                          Sign up
                        </Text>
                      </View>
                    )}
                  {!isFreeUserLocked &&
                    !isGuestDefaultLocked &&
                    !isPremiumStoryLocked &&
                    !(isVoiceLocked && !allowed) &&
                    !(isGuest && !allowed) && <View className="mt-2 h-6" />}
                  <Text className="mt-3 self-center font-[abeezee] text-2xl text-black">
                    {voice.displayName ?? voice.name}
                  </Text>
                  {isSelected ? (
                    <Pressable
                      onPress={() => {
                        if (voiceAccessLoading) return;
                        handlePreview(voice.previewUrl, voice.id);
                      }}
                      className="mt-3 flex-row items-center justify-center gap-x-1 self-center rounded-2xl border border-border-lighter bg-white px-4 py-2"
                    >
                      <Icon name="Volume2" size={18} color="black" />
                      <Text className="font-[abeezee] text-sm text-black">
                        Listen
                      </Text>
                    </Pressable>
                  ) : (
                    <View className="flex flex-row items-center justify-between gap-x-4">
                      <Pressable
                        onPress={() => {
                          if (voiceAccessLoading) return;
                          if (!allowed) {
                            if (isGuest) {
                              setIsSubscriptionModalOpen(true);
                              return;
                            }
                            if (isPremium && isStoryAtVoiceLimit) {
                              notifyVoiceLimitReached();
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
                      {/* Visual-only toggle; actual selection handled by card press */}
                      <View pointerEvents="none">
                        <Switch
                          value={isSelected}
                          disabled={!allowed}
                          accessibilityLabel={`Select voice ${voice.displayName ?? voice.name}`}
                        />
                      </View>
                    </View>
                  )}
                </Pressable>
              );
            })}
            <SubscriptionModal
              isOpen={isSubscriptionModalOpen}
              onClose={() => setIsSubscriptionModalOpen(false)}
            />
          </View>
        </>
      )}
    </>
  );
};

const voiceStyles = StyleSheet.create({
  selectedShadow: {
    shadowColor: "#FCCDBD",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default AvailableVoices;
