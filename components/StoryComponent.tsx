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

const HALFWAY_MODAL_KEY = "hasSeenHalfwayQuotaModal";

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
  const [showHalfwayModal, setShowHalfwayModal] = useState(false);
  const sessionStartTime = useRef(Date.now());

  const { data: preferredVoice } = useGetPreferredVoice();
  const { data: quota } = useGetStoryQuota();
  const { isPending, error, refetch, data } = useQuery(queryGetStory(storyId));

  useEffect(() => {
    if (preferredVoice?.name) {
      setSelectedVoice(preferredVoice.name.toUpperCase());
    }
  }, [preferredVoice]);

  // Check if we should show the halfway quota modal
  useEffect(() => {
    if (!quota) return;
    const halfway = Math.floor((quota.totalAllowed ?? 0) / 2);
    if ((quota.used ?? 0) >= halfway && (quota.remaining ?? 0) > 0) {
      AsyncStorage.getItem(HALFWAY_MODAL_KEY).then((seen) => {
        if (!seen) {
          setShowHalfwayModal(true);
        }
      });
    }
  }, [quota]);

  const handleDismissHalfway = () => {
    setShowHalfwayModal(false);
    AsyncStorage.setItem(HALFWAY_MODAL_KEY, "true");
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
        visible={showHalfwayModal}
        storyId={storyId}
        quota={quota}
        onClose={handleDismissHalfway}
      />
    </SafeAreaWrapper>
  );
};

export default StoryComponent;
