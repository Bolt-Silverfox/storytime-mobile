import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  ImageBackground,
  Pressable,
  ScrollView,
} from "react-native";
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
import useAuth from "../contexts/AuthContext";

const StoryComponent = ({
  storyId,
  storyMode,
}: {
  storyId: string;
  storyMode: StoryModes;
}) => {
  const navigator = useNavigation<ProtectedRoutesNavigationProp>();
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
  const [activeParagraph, setActiveParagraph] = useState(0);
  const [selectedVoice, setSelectedVoice] = useState<string | null>("LILY");
  const [showQuotaReminder, setShowQuotaReminder] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const controlsOpacity = useRef(new Animated.Value(1)).current;
  const autoHideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sessionStartTime = useRef(Date.now());

  const resetAutoHideTimer = useCallback(() => {
    if (autoHideTimer.current) clearTimeout(autoHideTimer.current);
    autoHideTimer.current = setTimeout(() => {
      setControlsVisible(false);
    }, 4000);
  }, []);

  // Animate opacity when controlsVisible changes
  useEffect(() => {
    Animated.timing(controlsOpacity, {
      toValue: controlsVisible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [controlsVisible, controlsOpacity]);

  // Start auto-hide timer on mount
  useEffect(() => {
    resetAutoHideTimer();
    return () => {
      if (autoHideTimer.current) clearTimeout(autoHideTimer.current);
    };
  }, [resetAutoHideTimer]);

  const handleScreenTap = useCallback(() => {
    setControlsVisible((prev) => !prev);
    resetAutoHideTimer();
  }, [resetAutoHideTimer]);

  const { user } = useAuth();
  const { data: quota } = useGetStoryQuota();
  const { data: preferredVoice } = useGetPreferredVoice();
  const { isPending, error, refetch, data } = useQuery(queryGetStory(storyId));

  useEffect(() => {
    if (preferredVoice?.name) {
      setSelectedVoice(preferredVoice.name.toUpperCase());
    }
  }, [preferredVoice]);

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

  if (isPending) return <LoadingOverlay visible />;
  if (error) {
    return <ErrorComponent message={error.message} refetch={refetch} />;
  }

  const handleProgress = (progress: number, completed: boolean) => {
    setStoryProgress({
      progress,
      completed,
      time: sessionStartTime.current,
    });
  };

  return (
    <SafeAreaWrapper variant="transparent">
      {data ? (
        <ScrollView contentContainerClassName="flex min-h-full">
          <ImageBackground
            source={{ uri: data.coverImageUrl }}
            resizeMode="cover"
            className="flex flex-1 flex-col p-4 pt-12 "
          >
            <Pressable onPress={handleScreenTap} style={{ flex: 1 }}>
              <Animated.View
                style={{ opacity: controlsOpacity }}
                pointerEvents={controlsVisible ? "auto" : "none"}
                className="flex flex-row items-center justify-between"
              >
                <Pressable
                  onPress={() =>
                    navigator.reset({
                      index: 0,
                      routes: [{ name: "parents" }],
                    })
                  }
                  className="flex size-12 flex-col items-center justify-center rounded-full bg-blue"
                >
                  <FontAwesome6 name="house" size={20} color="white" />
                </Pressable>
                <Pressable
                  onPress={() => setIsOptionsModalOpen(true)}
                  className="flex size-12 flex-col items-center justify-center rounded-full bg-blue"
                >
                  <FontAwesome6 name="ellipsis" size={20} color="white" />
                </Pressable>
              </Animated.View>
              <StoryContentContainer
                selectedVoice={selectedVoice}
                isInteractive={storyMode === "interactive"}
                story={data}
                activeParagraph={activeParagraph}
                setActiveParagraph={setActiveParagraph}
                onProgress={handleProgress}
                controlsVisible={controlsVisible}
                controlsOpacity={controlsOpacity}
              />
            </Pressable>
          </ImageBackground>
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
            setActiveParagraph={setActiveParagraph}
          />
        </ScrollView>
      ) : null}
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
