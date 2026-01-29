import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { ImageBackground, Pressable, ScrollView, View } from "react-native";
import queryGetStory from "../hooks/tanstack/queryHooks/useGetStory";
import ErrorComponent from "./ErrorComponent";
import LoadingOverlay from "./LoadingOverlay";
import StoryAudioPlayer from "./StoryAudioPlayer";
import StoryContentContainer from "./StoryContentContainer";
import ProgressBar from "./UI/ProgressBar";
import SelectReadingVoiceModal from "./modals/SelectReadingVoiceModal";
import InStoryOptionsModal from "./modals/storyModals/InStoryOptionsModal";
import { StoryModes } from "../types";
import { splitByWordCountPreservingSentences } from "../utils/utils";
import { ProtectedRoutesNavigationProp } from "../Navigation/ProtectedNavigator";
import useSetStoryProgress from "../hooks/tanstack/mutationHooks/UseSetStoryProgress";
import SafeAreaWrapper from "./UI/SafeAreaWrapper";

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
  const [selectedVoice, setSelectedVoice] = useState("LILY");
  const sessionStartTime = useRef(Date.now());

  const { isPending, error, refetch, data } = useQuery(queryGetStory(storyId));
  const { mutate: setStoryProgress } = useSetStoryProgress({
    storyId,
  });

  if (isPending) return <LoadingOverlay visible />;
  if (error)
    return <ErrorComponent message={error.message} refetch={refetch} />;

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
          className="p-4 flex-1 pt-10 flex flex-col "
        >
          <View className="flex flex-row justify-between items-center">
            <Pressable
              onPress={() =>
                navigator.reset({ index: 0, routes: [{ name: "parents" }] })
              }
              className="bg-blue size-12 rounded-full flex flex-col justify-center items-center"
            >
              <FontAwesome6 name="house" size={20} color="white" />
            </Pressable>
            <Pressable
              onPress={() => setIsOptionsModalOpen(true)}
              className="bg-blue size-12 rounded-full flex flex-col justify-center items-center"
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
    </SafeAreaWrapper>
  );
};

export default StoryComponent;
