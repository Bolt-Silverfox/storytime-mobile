import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ImageBackground, Pressable, View } from "react-native";
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
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  const [debouncedVoice, setDebouncedVoice] = useState<string | null>(null);
  const [showQuotaReminder, setShowQuotaReminder] = useState(false);
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
  const { user } = useAuth();
  const { data: quota } = useGetStoryQuota();
  const { data: preferredVoice, isFetched: isVoiceFetched } =
    useGetPreferredVoice();
  const { isPending, error, refetch, data } = useQuery(queryGetStory(storyId));

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
  } = useBatchStoryAudio(storyId, debouncedVoice);
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

  useEffect(() => {
    if (!isVoiceFetched) return;
    setSelectedVoice(preferredVoice?.id ?? "NIMBUS");
  }, [preferredVoice, isVoiceFetched]);

  const getQuotaReminderKey = () => {
    const now = new Date();
    return `quotaReminder:${user?.id ?? "anon"}:${now.getFullYear()}-${now.getMonth() + 1}`;
  };

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
  }, [quota, user?.id]);

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
        <Pressable style={{ flex: 1 }} onPress={toggleControls}>
          <ImageBackground
            source={{ uri: data.coverImageUrl }}
            resizeMode="cover"
            className="flex flex-1 flex-col p-4 pt-12"
            style={{ backgroundColor: "#1a1a2e" }}
          >
            <View className="flex flex-1 flex-col">
              <Animated.View
                style={[
                  animatedControlsStyle,
                  { flexDirection: "row", justifyContent: "space-between" },
                ]}
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
                isInteractive={storyMode === "interactive"}
                story={data}
                activeParagraph={activeParagraph}
                audioUrl={
                  isVoiceTransitioning
                    ? null
                    : (audioUrlMap.get(activeParagraph) ?? null)
                }
                isAudioLoading={isBatchAudioLoading || isVoiceTransitioning}
                isAudioError={isBatchAudioError}
                setActiveParagraph={setActiveParagraph}
                onProgress={handleProgress}
                controlsInteractive={controlsInteractive}
                controlsVisible={controlsVisible}
                animatedControlsStyle={animatedControlsStyle}
                isTTSDegraded={isTTSDegraded}
              />
            </View>
          </ImageBackground>
        </Pressable>
        <SelectReadingVoiceModal
          isOpen={isVoiceModalOpen}
          onClose={() => setIsVoiceModalOpen(false)}
          selectedVoice={selectedVoice}
          setSelectedVoice={setSelectedVoice}
        />
        <InStoryOptionsModal
          handleVoiceModal={setIsVoiceModalOpen}
          isOptionsModalOpen={isOptionsModalOpen}
          setIsOptionsModalOpen={setIsOptionsModalOpen}
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

export default StoryComponent;
