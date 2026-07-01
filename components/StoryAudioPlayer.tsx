import Ionicons from "@expo/vector-icons/Ionicons";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { ActivityIndicator, Pressable, Switch, Text, View } from "react-native";
import { VOICE_LABELS } from "../constants/ui";
import { audioLogger } from "../utils/logger";

const StoryAudioPlayer = ({
  audioUrl,
  isLoading,
  isError,
  isStillGenerating,
  isFailed,
  isPlaying,
  setIsPlaying,
  onPageFinished,
  initialPositionSec,
  onPositionChange,
}: {
  audioUrl: string | null;
  isLoading: boolean;
  isError: boolean;
  isStillGenerating: boolean;
  isFailed: boolean;
  isPlaying: boolean;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
  onPageFinished: () => void;
  // Position (in seconds) to resume the current page's audio from, applied once.
  initialPositionSec?: number;
  // Reports the current playback position (in seconds) so it can be persisted.
  onPositionChange?: (positionSec: number) => void;
}) => {
  const player = useAudioPlayer(audioUrl);
  const status = useAudioPlayerStatus(player);
  const prevUrlRef = useRef<string | null>(audioUrl);
  const prevDidJustFinishRef = useRef(false);
  const isPlayingRef = useRef(isPlaying);
  const onPageFinishedRef = useRef(onPageFinished);
  const onPositionChangeRef = useRef(onPositionChange);
  // Ensures the resume seek is applied at most once per mount.
  const initialSeekAppliedRef = useRef(false);

  // Keep refs in sync
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);
  useEffect(() => {
    onPageFinishedRef.current = onPageFinished;
  }, [onPageFinished]);
  useEffect(() => {
    onPositionChangeRef.current = onPositionChange;
  }, [onPositionChange]);

  // Resume mid-page playback: once the audio for the resume page is loaded,
  // seek to the previously saved position. Applied a single time so that
  // normal page-to-page navigation still starts each new page from 0.
  useEffect(() => {
    if (initialSeekAppliedRef.current) return;
    if (!initialPositionSec || initialPositionSec <= 0) return;
    if (isLoading || isError || isFailed || !audioUrl) return;
    if (!status.isLoaded) return;
    // Don't seek past (or to the very end of) the clip.
    if (status.duration && initialPositionSec >= status.duration) {
      initialSeekAppliedRef.current = true;
      return;
    }
    initialSeekAppliedRef.current = true;
    try {
      player.seekTo(initialPositionSec);
    } catch (e) {
      audioLogger.error("Audio resume seek failed:", e);
    }
  }, [
    initialPositionSec,
    isLoading,
    isError,
    isFailed,
    audioUrl,
    status.isLoaded,
    status.duration,
    player,
  ]);

  // Report current position upward so the parent can persist it for resume.
  useEffect(() => {
    if (status.currentTime > 0) {
      onPositionChangeRef.current?.(status.currentTime);
    }
  }, [status.currentTime]);

  // Detect edge transition: didJustFinish going from false → true
  // This fires exactly once per audio completion, regardless of re-renders
  useEffect(() => {
    const wasFinished = prevDidJustFinishRef.current;
    prevDidJustFinishRef.current = status.didJustFinish;

    if (!wasFinished && status.didJustFinish && isPlayingRef.current) {
      onPageFinishedRef.current();
    }
  }, [status.didJustFinish]);

  // Keep the native player in sync with parent-driven playback changes.
  // This is required for autoplay, where the parent sets isPlaying=true
  // without going through the local playAudio() handler.
  useEffect(() => {
    if (isLoading || isError || isFailed || !audioUrl || status.didJustFinish)
      return;

    try {
      if (isPlaying && !status.playing) {
        player.play();
      } else if (!isPlaying && status.playing) {
        player.pause();
      }
    } catch (e) {
      audioLogger.error("Audio sync failed:", e);
      setIsPlaying(false);
    }
  }, [
    audioUrl,
    isError,
    isFailed,
    isLoading,
    isPlaying,
    player,
    setIsPlaying,
    status.playing,
    status.didJustFinish,
  ]);

  // Track whether URL went through a null transition (voice switch)
  // vs a direct URL change (page navigation)
  const wasNullTransitionRef = useRef(false);
  // Track whether URL went null because audio is still generating (not a voice switch)
  const wasGeneratingWaitRef = useRef(false);

  // When the audio URL changes (new voice or new page content), replace audio
  // When URL goes null (voice switch in progress), pause old audio
  useEffect(() => {
    if (audioUrl && audioUrl !== prevUrlRef.current) {
      const wasPlaying = isPlayingRef.current;
      const wasVoiceSwitch = wasNullTransitionRef.current;
      const wasGeneratingWait = wasGeneratingWaitRef.current;
      prevUrlRef.current = audioUrl;
      wasNullTransitionRef.current = false;
      wasGeneratingWaitRef.current = false;
      // Reset edge detection so the next finish is treated as fresh
      prevDidJustFinishRef.current = false;

      try {
        player.replace(audioUrl);
        // Auto-resume for page navigation OR generation wait, but NOT voice switches
        if ((wasPlaying && !wasVoiceSwitch) || wasGeneratingWait) {
          player.play();
        }
      } catch (e) {
        audioLogger.error("Audio replace failed:", e);
        setIsPlaying(false);
      }
    } else if (!audioUrl && prevUrlRef.current) {
      prevUrlRef.current = null;
      if (isStillGenerating && isPlayingRef.current) {
        // Audio is still generating AND user was playing — mark for auto-resume
        wasGeneratingWaitRef.current = true;
      } else if (!isStillGenerating) {
        // Voice switched — stop old audio while new one loads
        wasNullTransitionRef.current = true;
      }
      try {
        player.pause();
      } catch (e) {
        audioLogger.error("Audio pause failed:", e);
      }
      setIsPlaying(false);
    }
  }, [audioUrl, player, setIsPlaying, isStillGenerating]);

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
      audioLogger.error("Audio playback failed:", e);
      setIsPlaying(false);
    }
  };

  return (
    <Pressable
      disabled={isLoading || isError || isFailed || !audioUrl}
      onPress={(e) => {
        e.stopPropagation();
        playAudio();
      }}
      className={`${isLoading || !audioUrl ? "bg-white/50" : "bg-white"} flex h-20 flex-row items-center justify-between rounded-full px-2`}
      accessibilityHint={
        isLoading
          ? "Audio is loading"
          : isFailed
            ? "Audio failed to generate"
            : !audioUrl
              ? "Audio is not available"
              : undefined
      }
    >
      <View className="flex flex-row items-center gap-x-2">
        <View
          className={`flex size-12 flex-col items-center justify-center rounded-full ${isFailed ? "bg-red-500" : "bg-blue"}`}
        >
          <Ionicons
            name={isFailed ? "close-circle-outline" : "volume-medium-outline"}
            size={24}
            color="white"
          />
        </View>
        <Text
          className={`font-[quilka] text-xl ${isFailed ? "text-red-600" : "text-black"}`}
        >
          {isLoading
            ? VOICE_LABELS.loading
            : isFailed
              ? "Audio failed"
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
            disabled={isError || isFailed || !audioUrl}
          />
        )}
      </View>
    </Pressable>
  );
};

export default StoryAudioPlayer;
