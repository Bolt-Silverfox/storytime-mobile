import Ionicons from "@expo/vector-icons/Ionicons";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { ActivityIndicator, Pressable, Switch, Text, View } from "react-native";
import { BADGE_LABELS, COLORS, VOICE_LABELS } from "../constants/ui";
import useTextToAudio from "../hooks/tanstack/mutationHooks/useTextToAudio";

const StoryAudioPlayer = ({
  audioUrl,
  textContent,
  nextPageContent,
  selectedVoice,
  isSubscribed,
  isPlaying,
  setIsPlaying,
  onPageFinished,
  setIsSubscriptionModalOpen,
  storyId,
}: {
  audioUrl: string;
  textContent: string;
  nextPageContent: string | null;
  selectedVoice: string | null;
  isSubscribed: boolean;
  isPlaying: boolean;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
  onPageFinished: () => void;
  setIsSubscriptionModalOpen: Dispatch<SetStateAction<boolean>>;
  storyId: string;
}) => {
  const voiceId = selectedVoice || "";
  const { data, isPending } = useTextToAudio({
    content: textContent,
    voiceId,
    storyId,
  });

  // Prefetch next page audio so it's cached and ready when we advance
  useTextToAudio({
    content: nextPageContent || "",
    voiceId,
    storyId,
  });

  const currentUrl = data?.audioUrl ?? audioUrl;
  const player = useAudioPlayer(currentUrl);
  const status = useAudioPlayerStatus(player);
  const prevUrlRef = useRef(currentUrl);
  const prevDidJustFinishRef = useRef(false);
  const isPlayingRef = useRef(isPlaying);
  const onPageFinishedRef = useRef(onPageFinished);

  // Keep refs in sync
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);
  useEffect(() => {
    onPageFinishedRef.current = onPageFinished;
  }, [onPageFinished]);

  // Detect edge transition: didJustFinish going from false → true
  // This fires exactly once per audio completion, regardless of re-renders
  useEffect(() => {
    const wasFinished = prevDidJustFinishRef.current;
    prevDidJustFinishRef.current = status.didJustFinish;

    if (!wasFinished && status.didJustFinish && isPlayingRef.current) {
      onPageFinishedRef.current();
    }
  }, [status.didJustFinish]);

  // When the audio URL changes (new voice or new page content), replace audio
  useEffect(() => {
    if (currentUrl && currentUrl !== prevUrlRef.current) {
      const wasPlaying = isPlayingRef.current;
      prevUrlRef.current = currentUrl;
      // Reset edge detection so the next finish is treated as fresh
      prevDidJustFinishRef.current = false;

      player.replace(currentUrl);

      if (wasPlaying) {
        player.play();
      } else {
        setIsPlaying(false);
      }
    }
  }, [currentUrl, player, setIsPlaying]);

  const playAudio = () => {
    if (!isSubscribed) {
      setIsSubscriptionModalOpen(true);
      return;
    }
    if (isPlaying) {
      setIsPlaying(false);
      player.pause();
      return;
    }
    setIsPlaying(true);
    player.play();
  };

  return (
    <Pressable
      disabled={isPending}
      onPress={playAudio}
      className={`${isPending || !isSubscribed ? "bg-white/50" : " bg-white"} flex h-20 flex-row items-center justify-between rounded-full px-2`}
    >
      <View className="flex flex-row items-center gap-x-2">
        <View
          className={`flex size-12 flex-col items-center justify-center rounded-full ${isSubscribed ? "bg-blue" : "bg-blue/70"}`}
        >
          <Ionicons name="volume-medium-outline" size={24} color="white" />
        </View>
        <Text
          className={`font-[quilka] text-xl ${!isSubscribed ? "text-black/60" : "text-black"}`}
        >
          {isPending
            ? VOICE_LABELS.loading
            : isPlaying
              ? VOICE_LABELS.mute
              : VOICE_LABELS.play}
        </Text>
      </View>
      <View className="flex flex-row items-center gap-x-3">
        {!isSubscribed && (
          <View
            style={{ backgroundColor: COLORS.premiumBadge.background }}
            className="flex h-6 items-center justify-center rounded-full px-3"
          >
            <Text className="text-center font-[abeezee] text-xs text-black">
              {BADGE_LABELS.premium}
            </Text>
          </View>
        )}
        {isPending ? (
          <ActivityIndicator size={"large"} />
        ) : (
          <Switch value={isPlaying} onValueChange={playAudio} />
        )}
      </View>
    </Pressable>
  );
};

export default StoryAudioPlayer;
