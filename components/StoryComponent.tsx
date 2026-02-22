import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { ImageBackground, Pressable, ScrollView, View } from "react-native";
import { ProtectedRoutesNavigationProp } from "../Navigation/ProtectedNavigator";
import useSetStoryProgress from "../hooks/tanstack/mutationHooks/UseSetStoryProgress";
import useGetPreferredVoice from "../hooks/tanstack/queryHooks/useGetPreferredVoice";
import queryGetStory from "../hooks/tanstack/queryHooks/useGetStory";
import { StoryModes } from "../types";
import { splitByWordCountPreservingSentences } from "../utils/utils";
import { ApiError } from "../apiFetch";
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
  const sessionStartTime = useRef(Date.now());

  const { user } = useAuth();
  const { data: preferredVoice } = useGetPreferredVoice();
  const { data: quota } = useGetStoryQuota();
  const { isPending, error, refetch, data } = useQuery(queryGetStory(storyId));

  useEffect(() => {
    if (preferredVoice?.name) {
      setSelectedVoice(preferredVoice.name.toUpperCase());
    }
  }, [preferredVoice]);

  // Check if we should show the quota reminder modal
  useEffect(() => {
    if (!quota || quota.isPremium || quota.unlimited) return;
    const halfway = Math.floor((quota.totalAllowed ?? 0) / 2);
    if ((quota.used ?? 0) >= halfway && (quota.remaining ?? 0) > 0) {
      const now = new Date();
      const key = `quotaReminder:${user?.id ?? "anon"}:${now.getFullYear()}-${now.getMonth() + 1}`;
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
    const now = new Date();
    const key = `quotaReminder:${user?.id ?? "anon"}:${now.getFullYear()}-${now.getMonth() + 1}`;
    AsyncStorage.setItem(key, "true").catch(() => {});
  };

  const { mutate: setStoryProgress } = useSetStoryProgress({
    storyId,
  });

  if (isPending) return <LoadingOverlay visible />;
  if (error) {
    if (error instanceof ApiError && error.status === 403) {
      return <StoryLimitModal visible storyId={storyId} quota={quota} />;
    }
    return <ErrorComponent message={error.message} refetch={refetch} />;
  }

  const paragraphs = splitByWordCountPreservingSentences(data.textContent, 30);

  const handleProgress = (progress: number, completed: boolean) => {
    setStoryProgress({
      progress,
      completed,
      time: sessionStartTime.current,
    });
  };

  return (
    <SafeAreaWrapper variant="transparent">
      <ScrollView contentContainerClassName="flex min-h-full">
        <ImageBackground
          source={{ uri: data.coverImageUrl }}
          resizeMode="cover"
          className="flex flex-1 flex-col p-4 pt-12 "
        >
          <View className="flex flex-row items-center justify-between">
            <Pressable
              onPress={() =>
                navigator.reset({ index: 0, routes: [{ name: "parents" }] })
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
          </View>
          <StoryContentContainer
            selectedVoice={selectedVoice}
            isInteractive={storyMode === "interactive"}
            story={data}
            paragraphs={paragraphs}
            activeParagraph={activeParagraph}
            setActiveParagraph={setActiveParagraph}
            onProgress={handleProgress}
          />
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
