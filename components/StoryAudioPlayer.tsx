import Ionicons from "@expo/vector-icons/Ionicons";
import { useAudioPlayer } from "expo-audio";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Switch, Text, View } from "react-native";
import { BADGE_LABELS, COLORS, VOICE_LABELS } from "../constants/ui";
import useTextToAudio from "../hooks/tanstack/mutationHooks/useTextToAudio";

const StoryAudioPlayer = ({
  audioUrl,
  textContent,
  selectedVoice,
  isSubscribed,
  setIsSubscriptionModalOpen,
}: {
  audioUrl: string;
  textContent: string;
  selectedVoice: string | null;
  isSubscribed: boolean;
  setIsSubscriptionModalOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { data, isPending } = useTextToAudio({
    content: textContent,
    voiceId: selectedVoice || "",
    enabled: !!selectedVoice,
  });
  const player = useAudioPlayer(
    selectedVoice ? (data?.audioUrl ?? audioUrl) : audioUrl
  );
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    player.pause();
    setIsPlaying(false);

    return () => {
      player.pause(); // Cleanup on unmount
    };
  }, [selectedVoice, player]);

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
        <View
          style={{ backgroundColor: COLORS.premiumBadge.background }}
          className="flex h-6 items-center justify-center rounded-full px-3"
        >
          <Text className="text-center font-[abeezee] text-xs text-black">
            {BADGE_LABELS.premium}
          </Text>
        </View>
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
