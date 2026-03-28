import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ImageBackground, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  runOnJS,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { ProtectedRoutesNavigationProp } from "../Navigation/ProtectedNavigator";
import useSetStoryProgress from "../hooks/tanstack/mutationHooks/UseSetStoryProgress";
import useGetPreferredVoice from "../hooks/tanstack/queryHooks/useGetPreferredVoice";
import queryGetStory from "../hooks/tanstack/queryHooks/useGetStory";
import queryAvailableVoices from "../hooks/tanstack/queryHooks/queryAvailableVoices";
import { StoryModes } from "../types";
import ErrorComponent from "./ErrorComponent";
import LoadingOverlay from "./LoadingOverlay";
import StoryContentContainer from "./StoryContentContainer";
import SafeAreaWrapper from "./UI/SafeAreaWrapper";
import SelectReadingVoiceModal from "./modals/SelectReadingVoiceModal";
import StoryLimitModal from "./modals/StoryLimitModal";
import InStoryOptionsModal from "./modals/storyModals/InStoryOptionsModal";
import useGetStoryQuota from "../hooks/tanstack/queryHooks/useGetStoryQuota";
import useBatchStoryAudio from "../hooks/tanstack/queryHooks/useBatchStoryAudio";
import { CONTROLS_FADE_MS } from "../constants";
import useAuth from "../contexts/AuthContext";

const TOGGLE_DEBOUNCE_MS = 400;

const StoryComponent = ({
  storyId,
  storyMode,
  page,
}: {
  storyId: string;
  storyMode: StoryModes;
  page?: number;
}) => {
  const navigator = useNavigation<ProtectedRoutesNavigationProp>();
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
  const [activeParagraph, setActiveParagraph] = useState(() =>
    page && page > 0 ? page - 1 : 0
  );
  const [currentMode, setCurrentMode] = useState<StoryModes>(storyMode);
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  const [debouncedVoice, setDebouncedVoice] = useState<string | null>(null);
  const [showQuotaReminder, setShowQuotaReminder] = useState(false);
  // Tracks whether the voice modal was auto-shown for first-time setup (stable across re-renders)
  const isFirstTimeVoiceSetup = useRef(false);
  const sessionStartTime = useRef(Date.now());
  const [controlsVisible, setControlsVisible] = useState(true);
  const [controlsInteractive, setControlsInteractive] = useState(true);
  const controlsOpacity = useSharedValue(1);

  const animatedControlsStyle = useAnimatedStyle(() => ({
    opacity: controlsOpacity.value,
  }));

  const isTogglingRef = useRef(false);
  const toggleControls = useCallback(() => {
    if (isTogglingRef.current) return;
    isTogglingRef.current = true;
    setControlsVisible((prev) => !prev);
    setTimeout(() => {
      isTogglingRef.current = false;
    }, TOGGLE_DEBOUNCE_MS);
  }, []);

  useEffect(() => {
    if (!controlsVisible) {
      // Hiding — disable interaction immediately
      setControlsInteractive(false);
    }
    controlsOpacity.value = withTiming(
      controlsVisible ? 1 : 0,
      {
        duration: CONTROLS_FADE_MS,
      },
      (finished) => {
        if (controlsVisible && finished) {
          // Showing — enable interaction after animation completes
          runOnJS(setControlsInteractive)(true);
        }
      }
    );
  }, [controlsVisible, controlsOpacity]);

  const queryClient = useQueryClient();
  const { user, isGuest } = useAuth();
  const { data: quota } = useGetStoryQuota();
  const { data: preferredVoice, isFetched: isVoiceFetched } =
    useGetPreferredVoice();
  const { data: availableVoices } = useQuery(queryAvailableVoices);
  const { isPending, error, refetch, data } = useQuery(queryGetStory(storyId));

  // For guests, map "NIMBUS" to the actual voice ID
  const getGuestVoiceId = useCallback(() => {
    if (!isGuest || !availableVoices) return "NIMBUS";
    const nimbusVoice = availableVoices.find(
      (v) => v.elevenLabsVoiceId === "NIMBUS"
    );
    return nimbusVoice?.id ?? "NIMBUS";
  }, [isGuest, availableVoices]);

  // Map voice ID to elevenLabsVoiceId for audio API
  const getVoiceIdForAudio = useCallback((voiceId: string | null) => {
    if (!voiceId) return null;
    if (!isGuest) return voiceId;
    const voice = (availableVoices ?? []).find((v) => v.id === voiceId);
    return voice?.elevenLabsVoiceId ?? voiceId;
  }, [isGuest, availableVoices]);

  // Debounce voice selection to prevent rapid batch requests
  const isInitialVoiceSet = useRef(false);
  useEffect(() => {
    if (!selectedVoice) {
      setDebouncedVoice(null);
      return;
    }
    if (!isInitialVoiceSet.current) {
      isInitialVoiceSet.current = true;
      setDebouncedVoice(selectedVoice);
      return;
    }
    const timer = setTimeout(() => setDebouncedVoice(selectedVoice), 1000);
    return () => clearTimeout(timer);
  }, [selectedVoice]);

  // Cancel stale batch queries when debounced voice changes (not on initial load)
  const prevDebouncedVoice = useRef<string | null>(null);
  useEffect(() => {
    if (
      debouncedVoice &&
      prevDebouncedVoice.current &&
      prevDebouncedVoice.current !== debouncedVoice
    ) {
      queryClient.cancelQueries({
        queryKey: ["batchStoryAudio", storyId],
        predicate: (query) => query.queryKey[2] !== debouncedVoice,
      });
    }
    prevDebouncedVoice.current = debouncedVoice;
  }, [debouncedVoice, storyId, queryClient]);

  const {
    data: batchAudio,
    isLoading: isBatchAudioLoading,
    isError: isBatchAudioError,
    isStillGenerating,
    failedParagraphs,
    retryFailed,
    batchError,
  } = useBatchStoryAudio(storyId, getVoiceIdForAudio(debouncedVoice));
  // preferredProvider is only present when the backend fell back to a different provider
  const isTTSDegraded = !!batchAudio?.preferredProvider;
  const isVoiceTransitioning = selectedVoice !== debouncedVoice;

  const audioUrlMap = useMemo(() => {
    const map = new Map<number, string | null>();
    batchAudio?.paragraphs?.forEach((p) => {
      map.set(p.index, p.audioUrl);
    });
    return map;
  }, [batchAudio?.paragraphs]);

  // Only sync preferred voice on initial load — user's local selection is
  // authoritative after that.  Without this guard, the invalidated query
  // refetch can overwrite the local VoiceType key with a DB UUID.
  const getVoiceModalDismissedKey = useCallback(
    () => `voiceModalDismissed:${user?.id ?? "anon"}`,
    [user?.id]
  );

  const hasInitializedVoice = useRef(false);
  useEffect(() => {
    if (!isVoiceFetched || hasInitializedVoice.current) return;
    hasInitializedVoice.current = true;
    // For guests, use the mapped voice ID, otherwise use preferred voice ID or default
    const guestVoiceId = getGuestVoiceId();
    setSelectedVoice(preferredVoice?.id ?? guestVoiceId);

    // Auto-show voice selection modal for first-time users (no preferred voice).
    // Only show once — if dismissed, don't nag on subsequent stories.
    let mounted = true;
    if (!preferredVoice) {
      AsyncStorage.getItem(getVoiceModalDismissedKey()).then((dismissed) => {
        if (!dismissed && mounted) {
          isFirstTimeVoiceSetup.current = true;
          setIsVoiceModalOpen(true);
        }
      });
    }
    return () => {
      mounted = false;
    };
  }, [preferredVoice, isVoiceFetched, getVoiceModalDismissedKey, getGuestVoiceId]);

  const getQuotaReminderKey = useCallback(() => {
    const now = new Date();
    return `quotaReminder:${user?.id ?? "anon"}:${now.getFullYear()}-${now.getMonth() + 1}`;
  }, [user?.id]);

  // Check if we should show the quota reminder modal
  useEffect(() => {
    if (!quota || quota.isPremium || quota.unlimited) return;
    const used = quota.used;
    const halfway = Math.floor(quota.totalAllowed / 2);
    if (halfway > 0 && used >= halfway && quota.remaining > 0) {
      const key = getQuotaReminderKey();
      AsyncStorage.getItem(key)
        .then((seen) => {
          if (!seen) {
            setShowQuotaReminder(true);
          }
        })
        .catch(() => {});
    }
  }, [quota, user?.id, getQuotaReminderKey]);

  const handleDismissQuotaReminder = () => {
    setShowQuotaReminder(false);
    AsyncStorage.setItem(getQuotaReminderKey(), "true").catch(() => {});
  };

  const { mutate: setStoryProgress } = useSetStoryProgress({
    storyId,
  });

  const handleProgress = useCallback(
    (progress: number, completed: boolean) => {
      setStoryProgress({
        progress,
        completed,
        time: sessionStartTime.current,
      });
    },
    [setStoryProgress]
  );

  if (isPending) return <LoadingOverlay visible />;
  if (error) {
    // Check if error is due to quota limit (403)
    if (error.message?.includes("limit") || error.message?.includes("quota")) {
      return (
        <SafeAreaWrapper variant="transparent">
          <StoryLimitModal
            visible={true}
            storyId={storyId}
            quota={quota}
            mode="blocking"
          />
        </SafeAreaWrapper>
      );
    }
    return <ErrorComponent message={error.message} refetch={refetch} />;
  }
  if (!data) {
    return (
      <ErrorComponent
        message="This story is not available right now."
        refetch={refetch}
      />
    );
  }

  return (
    <SafeAreaWrapper variant="transparent">
      <View className="flex-1">
        <Pressable style={storyStyles.flex1} onPress={toggleControls}>
          <ImageBackground
            source={{ uri: data.coverImageUrl }}
            resizeMode="cover"
            className="flex flex-1 flex-col p-4 pt-12"
            style={storyStyles.storyBackground}
          >
            <View className="flex flex-1 flex-col">
              <Animated.View
                style={[animatedControlsStyle, storyStyles.controlsRow]}
                pointerEvents={controlsInteractive ? "auto" : "none"}
              >
                <Pressable
                  onPress={(e) => {
                    e.stopPropagation();
                    navigator.reset({
                      index: 0,
                      routes: [{ name: "parents" }],
                    });
                  }}
                  className="flex size-12 flex-col items-center justify-center rounded-full bg-blue"
                >
                  <FontAwesome6 name="house" size={20} color="white" />
                </Pressable>
                <Pressable
                  onPress={(e) => {
                    e.stopPropagation();
                    setIsOptionsModalOpen(true);
                  }}
                  className="flex size-12 flex-col items-center justify-center rounded-full bg-blue"
                >
                  <FontAwesome6 name="ellipsis" size={20} color="white" />
                </Pressable>
              </Animated.View>

              <StoryContentContainer
                isInteractive={currentMode === "interactive"}
                story={data}
                activeParagraph={activeParagraph}
                audioUrl={
                  isVoiceTransitioning
                    ? null
                    : (audioUrlMap.get(activeParagraph) ?? null)
                }
                isAudioLoading={isBatchAudioLoading || isVoiceTransitioning}
                isAudioError={isBatchAudioError}
                isStillGenerating={isStillGenerating}
                setActiveParagraph={setActiveParagraph}
                onProgress={handleProgress}
                controlsInteractive={controlsInteractive}
                controlsVisible={controlsVisible}
                animatedControlsStyle={animatedControlsStyle}
                isTTSDegraded={isTTSDegraded}
                failedParagraphs={failedParagraphs}
                onRetryFailed={retryFailed}
                batchError={batchError}
              />
            </View>
          </ImageBackground>
        </Pressable>
        <SelectReadingVoiceModal
          isOpen={isVoiceModalOpen}
          onClose={() => {
            setIsVoiceModalOpen(false);
            // Mark as dismissed so we don't re-show on next story
            if (isFirstTimeVoiceSetup.current) {
              AsyncStorage.setItem(getVoiceModalDismissedKey(), "true");
              isFirstTimeVoiceSetup.current = false;
            }
          }}
          selectedVoice={selectedVoice}
          setSelectedVoice={setSelectedVoice}
          storyId={storyId}
          showSaveButton={isFirstTimeVoiceSetup.current}
        />
        <InStoryOptionsModal
          handleVoiceModal={setIsVoiceModalOpen}
          isOptionsModalOpen={isOptionsModalOpen}
          setIsOptionsModalOpen={setIsOptionsModalOpen}
          currentMode={currentMode}
          onModeChange={setCurrentMode}
          hasQuiz={!!(data?.isInteractive && data?.questions?.length)}
        />
      </View>
      <StoryLimitModal
        visible={showQuotaReminder}
        storyId={storyId}
        quota={quota}
        mode="reminder"
        onClose={handleDismissQuotaReminder}
      />
    </SafeAreaWrapper>
  );
};

const storyStyles = StyleSheet.create({
  flex1: { flex: 1 },
  storyBackground: { backgroundColor: "#1a1a2e" },
  controlsRow: { flexDirection: "row", justifyContent: "space-between" },
});

export default StoryComponent;
