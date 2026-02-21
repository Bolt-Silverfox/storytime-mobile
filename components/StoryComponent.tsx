import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { ImageBackground, Pressable, ScrollView, View } from "react-native";
import { ProtectedRoutesNavigationProp } from "../Navigation/ProtectedNavigator";
import useSetStoryProgress from "../hooks/tanstack/mutationHooks/UseSetStoryProgress";
import queryStoriesQuota from "../hooks/tanstack/queryHooks/queryStoriesQuota";
import useGetPreferredVoice from "../hooks/tanstack/queryHooks/useGetPreferredVoice";
import queryGetStory from "../hooks/tanstack/queryHooks/useGetStory";
import useGetUserProfile from "../hooks/tanstack/queryHooks/useGetUserProfile";
import { StoryModes } from "../types";
import ErrorComponent from "./ErrorComponent";
import LoadingOverlay from "./LoadingOverlay";
import StoryContentContainer from "./StoryContentContainer";
import SafeAreaWrapper from "./UI/SafeAreaWrapper";
import StoryLimitModal from "./UI/StoryLimitModal";
import SelectReadingVoiceModal from "./modals/SelectReadingVoiceModal";
import InStoryOptionsModal from "./modals/storyModals/InStoryOptionsModal";

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
  const [showLimitModal, setShowLimitModal] = useState(false);
  const sessionStartTime = useRef(Date.now());

  const { data: preferredVoice } = useGetPreferredVoice();
  const { isPending, error, refetch, data } = useQuery(queryGetStory(storyId));
  const { data: user } = useGetUserProfile();
  const { data: quota } = useQuery(queryStoriesQuota(user?.id));
  const { mutate: setStoryProgress } = useSetStoryProgress({
    storyId,
  });

  useEffect(() => {
    if (preferredVoice?.name) {
      setSelectedVoice(preferredVoice.name.toUpperCase());
    }
  }, [preferredVoice]);

  useEffect(() => {
    if (data === null) {
      setShowLimitModal(true);
    }
  }, [data]);

  if (isPending) return <LoadingOverlay visible />;
  if (error)
    return (
      <ErrorComponent
        message={error.message}
        goBack={() => navigator.goBack()}
        refetch={refetch}
      />
    );

  const isPremium =
    user?.subscriptionStatus === "active" || user?.role === "admin";

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
      ) : (
        <StoryLimitModal
          maxHeight={0.85}
          isOpen={showLimitModal && !isPremium}
          onClose={() => {
            navigator.goBack();
            setShowLimitModal(false);
          }}
          used={quota?.used}
          totalAllowed={quota?.totalAllowed}
        />
      )}
    </SafeAreaWrapper>
  );
};

export default StoryComponent;
