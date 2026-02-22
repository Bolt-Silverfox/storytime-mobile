import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { ImageBackground, Pressable, ScrollView, View } from "react-native";
import { ProtectedRoutesNavigationProp } from "../Navigation/ProtectedNavigator";
import { ApiError } from "../apiFetch";
import useSetStoryProgress from "../hooks/tanstack/mutationHooks/UseSetStoryProgress";
import useGetPreferredVoice from "../hooks/tanstack/queryHooks/useGetPreferredVoice";
import queryGetStory from "../hooks/tanstack/queryHooks/useGetStory";
import useGetStoryQuota from "../hooks/tanstack/queryHooks/useGetStoryQuota";
import { StoryModes } from "../types";
import ErrorComponent from "./ErrorComponent";
import LoadingOverlay from "./LoadingOverlay";
import StoryContentContainer from "./StoryContentContainer";
import SafeAreaWrapper from "./UI/SafeAreaWrapper";
import SelectReadingVoiceModal from "./modals/SelectReadingVoiceModal";
import StoryLimitModal from "./modals/StoryLimitModal";
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
  const sessionStartTime = useRef(Date.now());

  const { data: preferredVoice } = useGetPreferredVoice();
  const { data: quota } = useGetStoryQuota();
  const { isPending, error, refetch, data } = useQuery(queryGetStory(storyId));

  useEffect(() => {
    if (preferredVoice?.name) {
      setSelectedVoice(preferredVoice.name.toUpperCase());
    }
  }, [preferredVoice]);

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
        <StoryLimitModal visible={true} storyId={storyId} quota={quota} />
      )}
    </SafeAreaWrapper>
  );
};

export default StoryComponent;
