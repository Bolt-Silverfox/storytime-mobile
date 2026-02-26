import Ionicons from "@expo/vector-icons/Ionicons";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { ActivityIndicator, Pressable, Switch, Text, View } from "react-native";
import { VOICE_LABELS } from "../constants/ui";

const StoryAudioPlayer = ({
  audioUrl,
  isLoading,
  isError,
  isPlaying,
  setIsPlaying,
  onPageFinished,
}: {
  audioUrl: string | null;
  isLoading: boolean;
  isError: boolean;
  isPlaying: boolean;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
  onPageFinished: () => void;
}) => {
  const player = useAudioPlayer(audioUrl);
  const status = useAudioPlayerStatus(player);
  const prevUrlRef = useRef<string | null>(audioUrl);
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
  // When URL goes null (voice switch in progress), pause old audio
  useEffect(() => {
    if (audioUrl && audioUrl !== prevUrlRef.current) {
      const wasPlaying = isPlayingRef.current;
      prevUrlRef.current = audioUrl;
      // Reset edge detection so the next finish is treated as fresh
      prevDidJustFinishRef.current = false;

      try {
        player.replace(audioUrl);
        if (wasPlaying) {
          player.play();
        }
      } catch (e) {
        if (__DEV__) console.error("Audio replace failed:", e);
        setIsPlaying(false);
      }
    } else if (!audioUrl && prevUrlRef.current) {
      // Voice switched — stop old audio while new one loads
      prevUrlRef.current = null;
      try {
        player.pause();
      } catch (e) {
        if (__DEV__) console.error("Audio pause failed:", e);
      }
      setIsPlaying(false);
    }
  }, [audioUrl, player, setIsPlaying]);

  const playAudio = () => {
    try {
      if (isPlaying) {
        setIsPlaying(false);
        player.pause();
        return;
      }
      setIsPlaying(true);
      player.play();
    } catch (e) {
      if (__DEV__) console.error("Audio playback failed:", e);
      setIsPlaying(false);
    }
  };

  return (
    <Pressable
      disabled={isLoading || isError || !audioUrl}
      onPress={(e) => {
        e.stopPropagation();
        playAudio();
      }}
      className={`${isLoading || !audioUrl ? "bg-white/50" : "bg-white"} flex h-20 flex-row items-center justify-between rounded-full px-2`}
      accessibilityHint={
        isLoading
          ? "Audio is loading"
          : !audioUrl
            ? "Audio is not available"
            : undefined
      }
    >
      <View className="flex flex-row items-center gap-x-2">
        <View className="flex size-12 flex-col items-center justify-center rounded-full bg-blue">
          <Ionicons name="volume-medium-outline" size={24} color="white" />
        </View>
        <Text className="font-[quilka] text-xl text-black">
          {isLoading
            ? VOICE_LABELS.loading
            : isError || !audioUrl
              ? VOICE_LABELS.unavailable
              : isPlaying
                ? VOICE_LABELS.mute
                : VOICE_LABELS.play}
        </Text>
      </View>
      <View className="flex flex-row items-center gap-x-3">
        {isLoading ? (
          <ActivityIndicator size={"large"} />
        ) : (
          <Switch
            value={isPlaying}
            onValueChange={playAudio}
            disabled={isLoading || isError || !audioUrl}
          />
        )}
      </View>
    </Pressable>
  );
};

export default StoryAudioPlayer;
