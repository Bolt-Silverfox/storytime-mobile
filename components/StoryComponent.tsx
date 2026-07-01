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
import { DEFAULT_GUEST_VOICE_ID } from "../constants/constants";
import { StoryModes } from "../types";
import { getDefaultVoiceListId, resolveVoiceIdForAudio } from "../utils/voice";
import ErrorComponent from "./ErrorComponent";
import LoadingOverlay from "./LoadingOverlay";
import StoryContentContainer from "./StoryContentContainer";
import SafeAreaWrapper from "./UI/SafeAreaWrapper";
import SelectReadingVoiceModal from "./modals/SelectReadingVoiceModal";
import StoryLimitModal from "./modals/StoryLimitModal";
import InStoryOptionsModal from "./modals/storyModals/InStoryOptionsModal";
import useGetStoryQuota from "../hooks/tanstack/queryHooks/useGetStoryQuota";
import useBatchStoryAudio from "../hooks/tanstack/queryHooks/useBatchStoryAudio";
import useGuestQuota from "../hooks/others/useGuestQuota";
import { CONTROLS_FADE_MS } from "../constants";
import useAuth from "../contexts/AuthContext";
import { audioLogger } from "../utils/logger";

const TOGGLE_DEBOUNCE_MS = 400;
// Throttle for writing the mid-page audio position to AsyncStorage.
const POSITION_PERSIST_INTERVAL_MS = 3000;
const storyPositionKey = (storyId: string) => `storyPosition:${storyId}`;

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
  // Mid-page audio position (seconds) to resume from, loaded once on entry.
  const [resumePositionSec, setResumePositionSec] = useState<number | null>(
    null
  );
  // Page the screen entered on — the only page the resume position applies to.
  const initialPageRef = useRef(page && page > 0 ? page - 1 : 0);
  const activeParagraphRef = useRef(activeParagraph);
  const latestPositionRef = useRef(0);
  const lastPositionPersistRef = useRef(0);
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
  const isGuestReader = isGuest || !user;
  const { data: quota } = useGetStoryQuota();
  const guestQuota = useGuestQuota();
  const { data: preferredVoice, isFetched: isVoiceFetched } =
    useGetPreferredVoice();
  const { data: availableVoices } = useQuery(queryAvailableVoices);

  // For guests: check if this story was already read locally to avoid quota consumption
  const canResolveGuestQuota = !isGuestReader || guestQuota.isLoaded;
  const storyAlreadyReadLocally =
    isGuestReader && guestQuota.isLoaded
      ? guestQuota.readStoryIds.includes(storyId)
      : false;
  const shouldConsumeGuestAccess = isGuestReader
    ? guestQuota.isLoaded && !storyAlreadyReadLocally
    : false;

  const { isPending, error, refetch, data } = useQuery({
    ...queryGetStory(storyId, { consumeGuestAccess: shouldConsumeGuestAccess }),
    enabled: canResolveGuestQuota,
  });

  const defaultAvailableVoiceId = useMemo(
    () => getDefaultVoiceListId(availableVoices),
    [availableVoices]
  );
  const effectiveSelectedVoice =
    selectedVoice ?? (isGuestReader ? DEFAULT_GUEST_VOICE_ID : null);
  const effectiveDebouncedVoice =
    debouncedVoice ??
    (isGuestReader ? DEFAULT_GUEST_VOICE_ID : DEFAULT_GUEST_VOICE_ID);
  const voiceIdForAudio = resolveVoiceIdForAudio({
    availableVoices,
    isGuest: isGuestReader,
    voiceId: effectiveDebouncedVoice,
  });
  const readyVoiceIdForAudio = data ? voiceIdForAudio : null;

  // Track story access for guests (only when consuming quota, not re-reading)
  const hasRecordedGuestAccess = useRef(false);
  useEffect(() => {
    hasRecordedGuestAccess.current = false;
  }, [storyId]);

  useEffect(() => {
    if (
      data &&
      isGuestReader &&
      guestQuota.isLoaded &&
      !storyAlreadyReadLocally &&
      !hasRecordedGuestAccess.current
    ) {
      hasRecordedGuestAccess.current = true;
      guestQuota.recordStoryAccess(storyId);
    }
  }, [guestQuota, data, isGuestReader, storyAlreadyReadLocally, storyId]);

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

  // Cancel stale batch queries when the actual audio voice changes (not on initial load)
  const prevAudioVoiceId = useRef<string | null>(null);
  useEffect(() => {
    if (
      readyVoiceIdForAudio &&
      prevAudioVoiceId.current &&
      prevAudioVoiceId.current !== readyVoiceIdForAudio
    ) {
      queryClient.cancelQueries({
        queryKey: ["batchStoryAudio", storyId],
        predicate: (query) => query.queryKey[2] !== readyVoiceIdForAudio,
      });
    }
    prevAudioVoiceId.current = readyVoiceIdForAudio;
  }, [readyVoiceIdForAudio, storyId, queryClient]);

  const {
    data: batchAudio,
    isLoading: isBatchAudioLoading,
    isError: isBatchAudioError,
    isStillGenerating,
    failedParagraphs,
    retryFailed,
    batchError,
    initialError,
  } = useBatchStoryAudio(storyId, readyVoiceIdForAudio);
  audioLogger.debug(
    `useBatchStoryAudio: storyId=${storyId}, debouncedVoice=${effectiveDebouncedVoice}, mappedVoiceId=${readyVoiceIdForAudio}`
  );
  // preferredProvider is only present when the backend fell back to a different provider
  const isTTSDegraded = !!batchAudio?.preferredProvider;
  const isVoiceTransitioning =
    !isGuestReader && selectedVoice !== debouncedVoice;

  const audioUrlMap = useMemo(() => {
    const map = new Map<number, string | null>();
    batchAudio?.paragraphs?.forEach((p) => {
      map.set(p.index, p.audioUrl);
    });
    return map;
  }, [batchAudio?.paragraphs]);

  const hasInitializedVoice = useRef(false);
  const hasAutoOpenedVoiceSetup = useRef(false);
  useEffect(() => {
    // For authenticated users, wait for voice query to fetch. For guests, skip this check.
    if (!isGuestReader && !isVoiceFetched) return;
    if (hasInitializedVoice.current) return;
    // Guests get a known default immediately. Authenticated users without a
    // preferred voice get the voice selection to ensure audio works.
    // Note: normalizePreferredVoice converts backend "default" placeholder to null.
    const voiceToSet =
      preferredVoice?.id ??
      (isGuestReader
        ? DEFAULT_GUEST_VOICE_ID
        : (defaultAvailableVoiceId ?? DEFAULT_GUEST_VOICE_ID));
    // Don't mark as initialized if we'd set null — wait for voices to load
    if (!voiceToSet) return;
    hasInitializedVoice.current = true;
    audioLogger.debug(
      `Initializing voice: preferredVoice?.id=${preferredVoice?.id}, defaultAvailableVoiceId=${defaultAvailableVoiceId}`
    );
    setSelectedVoice(voiceToSet);
  }, [isGuestReader, preferredVoice, isVoiceFetched, defaultAvailableVoiceId]);

  useEffect(() => {
    if (isGuestReader || !isVoiceFetched || preferredVoice?.id || selectedVoice)
      return;
    if (!hasAutoOpenedVoiceSetup.current) {
      hasAutoOpenedVoiceSetup.current = true;
      isFirstTimeVoiceSetup.current = true;
      setIsVoiceModalOpen(true);
    }
  }, [isGuestReader, isVoiceFetched, preferredVoice?.id, selectedVoice]);

  useEffect(() => {
    if (preferredVoice?.id) {
      hasAutoOpenedVoiceSetup.current = false;
      isFirstTimeVoiceSetup.current = false;
    }
  }, [preferredVoice?.id]);

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

  // Keep a ref of the current page so persistence always pairs the saved
  // position with the page it belongs to. Reset the latest position on page
  // change so the unmount flush can't pair the new page with the previous
  // page's audio time (the new page reports its own position once it plays).
  useEffect(() => {
    activeParagraphRef.current = activeParagraph;
    latestPositionRef.current = 0;
  }, [activeParagraph]);

  // Load any saved mid-page position once on entry. Only resume if the saved
  // page matches the page we're actually entering on (kept consistent with the
  // page-level `progress` resume), otherwise start that page from the top.
  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(storyPositionKey(storyId))
      .then((raw) => {
        if (!active || !raw) return;
        const saved = JSON.parse(raw) as { page: number; position: number };
        if (saved?.page === initialPageRef.current && saved.position > 0) {
          setResumePositionSec(saved.position);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [storyId]);

  // Receive the live playback position and persist it (throttled) so returning
  // to the story resumes mid-page instead of restarting the narration.
  const handlePositionChange = useCallback(
    (positionSec: number) => {
      latestPositionRef.current = positionSec;
      const now = Date.now();
      if (now - lastPositionPersistRef.current < POSITION_PERSIST_INTERVAL_MS) {
        return;
      }
      lastPositionPersistRef.current = now;
      AsyncStorage.setItem(
        storyPositionKey(storyId),
        JSON.stringify({
          page: activeParagraphRef.current,
          position: positionSec,
        })
      ).catch(() => {});
    },
    [storyId]
  );

  // Flush the latest position on unmount (the exit-mid-story case).
  useEffect(() => {
    return () => {
      if (latestPositionRef.current > 0) {
        AsyncStorage.setItem(
          storyPositionKey(storyId),
          JSON.stringify({
            page: activeParagraphRef.current,
            position: latestPositionRef.current,
          })
        ).catch(() => {});
      }
    };
  }, [storyId]);

  const handleProgress = useCallback(
    (progress: number, completed: boolean) => {
      setStoryProgress({
        progress,
        completed,
        time: sessionStartTime.current,
      });
      // Once finished, clear the saved position so re-reading starts fresh.
      if (completed) {
        latestPositionRef.current = 0;
        AsyncStorage.removeItem(storyPositionKey(storyId)).catch(() => {});
      }
    },
    [setStoryProgress, storyId]
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
            onClose={() => {
              // Close modal and navigate back
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (navigator as any).reset({
                index: 0,
                routes: [{ name: isGuest ? "guestTabs" : "parents" }],
              });
            }}
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
                    if (isGuest) {
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      (navigator as any).reset({
                        index: 0,
                        routes: [{ name: "guestTabs" }],
                      });
                    } else {
                      navigator.reset({
                        index: 0,
                        routes: [{ name: "parents" }],
                      });
                    }
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
                initialError={initialError}
                initialPositionSec={
                  activeParagraph === initialPageRef.current
                    ? (resumePositionSec ?? undefined)
                    : undefined
                }
                onPositionChange={handlePositionChange}
              />
            </View>
          </ImageBackground>
        </Pressable>
        {/* Modal management with priority: voice > options > quota reminder */}
        {isVoiceModalOpen && (
          <SelectReadingVoiceModal
            isOpen={true}
            onClose={() => {
              setIsVoiceModalOpen(false);
            }}
            selectedVoice={effectiveSelectedVoice}
            setSelectedVoice={setSelectedVoice}
            storyId={storyId}
            showSaveButton={isFirstTimeVoiceSetup.current}
          />
        )}
        {!isVoiceModalOpen && isOptionsModalOpen && (
          <InStoryOptionsModal
            handleVoiceModal={setIsVoiceModalOpen}
            isOptionsModalOpen={true}
            setIsOptionsModalOpen={setIsOptionsModalOpen}
            currentMode={currentMode}
            onModeChange={setCurrentMode}
            hasQuiz={!!(data?.isInteractive && data?.questions?.length)}
          />
        )}
      </View>
      {!isVoiceModalOpen && !isOptionsModalOpen && showQuotaReminder && (
        <StoryLimitModal
          visible={true}
          storyId={storyId}
          quota={quota}
          mode="reminder"
          onClose={handleDismissQuotaReminder}
        />
      )}
    </SafeAreaWrapper>
  );
};

const storyStyles = StyleSheet.create({
  flex1: { flex: 1 },
  storyBackground: { backgroundColor: "#1a1a2e" },
  controlsRow: { flexDirection: "row", justifyContent: "space-between" },
});

export default StoryComponent;
