import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useQuery } from "@tanstack/react-query";
import { useAudioPlayer } from "expo-audio";
import { useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from "react-native";
import ErrorComponent from "../../../components/ErrorComponent";
import Icon from "../../../components/Icon";
import LoadingOverlay from "../../../components/LoadingOverlay";
import SelectReadingVoiceModal from "../../../components/modals/SelectReadingVoiceModal";
import InStoryOptionsModal from "../../../components/modals/storyModals/InStoryOptionsModal";
import StoryContentContainer from "../../../components/StoryContentContainer";
import useStoryMode from "../../../contexts/StoryModeContext";
import queryGetStory from "../../../hooks/tanstack/queryHooks/useGetStory";
import ProgressBar from "../../../components/UI/ProgressBar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { ParentsNavigatorProp } from "../../../Navigation/ParentsNavigator";

// CREATE REUSABLE COMPONENTS FOR STORY MODES, wouldn't need to use context when this is handled.

const NewInteractiveStoryModeScreen = () => {
  const navigator = useNavigation<ParentsNavigatorProp>();
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
  const { activeStoryId } = useStoryMode();
  const [activeParagraph, setActiveParagraph] = useState(0);
  const { isPending, error, refetch, data } = useQuery(
    queryGetStory(activeStoryId!)
  );
  const player = useAudioPlayer(data?.audioUrl);

  if (isPending) return <LoadingOverlay visible />;
  if (error)
    return <ErrorComponent message={error.message} refetch={refetch} />;
  const paragraphs = data.textContent.split(/\n\s*\n/);
  return (
    <ScrollView contentContainerClassName="flex min-h-full">
      <ImageBackground
        source={{ uri: data.coverImageUrl }}
        resizeMode="cover"
        className="p-4 flex-1 flex flex-col "
      >
        <View className="flex flex-row justify-between items-center">
          <Pressable
            onPress={() =>
              navigator.reset({ index: 0, routes: [{ name: "home" }] })
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
        <View className="flex justify-end flex-1 flex-col gap-y-3">
          <View className="bg-white rounded-full h-20 flex flex-row justify-between items-center px-2">
            <View className="flex flex-row gap-x-2 items-center">
              <Pressable className="bg-blue size-12 rounded-full flex flex-col justify-center items-center">
                <Ionicons
                  name="volume-medium-outline"
                  size={24}
                  color="white"
                />
              </Pressable>
              <Text className="font-[quilka] text-xl">Mute Voice</Text>
            </View>
            <Pressable onPress={() => player.play()}>
              <Switch value={true} />
            </Pressable>
          </View>
          <StoryContentContainer
            isInteractive
            story={data}
            paragraphs={paragraphs}
            activeParagraph={activeParagraph}
            setActiveParagraph={setActiveParagraph}
          />
          <View className="bg-white p-4 rounded-2xl">
            <ProgressBar
              backgroundColor="#4807EC"
              currentStep={1}
              label="Page"
              totalSteps={4}
              height={11}
            />
          </View>
        </View>
      </ImageBackground>
      <SelectReadingVoiceModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
      />
      <InStoryOptionsModal
        handleVoiceModal={setIsVoiceModalOpen}
        isOptionsModalOpen={isOptionsModalOpen}
        setIsOptionsModalOpen={setIsOptionsModalOpen}
      />
    </ScrollView>
  );
};

export default NewInteractiveStoryModeScreen;
