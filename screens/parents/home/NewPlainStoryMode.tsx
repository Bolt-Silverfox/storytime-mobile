import { useQuery } from "@tanstack/react-query";
import { useAudioPlayer } from "expo-audio";
import { useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
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
import { queryGetStory } from "../../../hooks/tanstack/queryHooks/useGetStory";

const NewPlainStoryMode = () => {
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
  const { activeStoryId } = useStoryMode();
  const { isPending, error, refetch, data } = useQuery(
    queryGetStory(activeStoryId!)
  );
  const player = useAudioPlayer(data?.audioUrl);
  console.log(activeStoryId);
  if (isPending) return <LoadingOverlay visible />;
  if (error)
    return <ErrorComponent message={error.message} refetch={refetch} />;
  return (
    <ScrollView contentContainerClassName="flex min-h-full">
      <ImageBackground
        source={{ uri: data.coverImageUrl }}
        resizeMode="stretch"
        className="p-4 flex-1 flex flex-col "
      >
        <Pressable
          onPress={() => setIsOptionsModalOpen(true)}
          className="size-10 self-end rounded-full border border-[#5E4404] flex justify-center items-center"
        >
          <Icon color="#5E4404" name="EllipsisVertical" />
        </Pressable>
        {/* <Text className="font-[quilka] text-[#5E4404] text-2xl">
          {data.title}
        </Text> */}
        <View className="flex justify-end flex-1 flex-col gap-y-3">
          <View className="bg-white rounded-full h-20 flex flex-row justify-between items-center px-2">
            <View className="flex flex-row gap-x-2 items-center">
              <Text className="font-[quilka] text-xl">Fanice</Text>
              <Icon
                name="SquarePen"
                size={20}
                onPress={() => setIsVoiceModalOpen(true)}
              />
            </View>
            <Pressable onPress={() => player.play()}>
              <Image
                source={require("../../../assets/recording-in-progress.png")}
                className="h-12 w-12"
              />
            </Pressable>
          </View>
          <StoryContentContainer story={data} />
        </View>
      </ImageBackground>
      <InStoryOptionsModal
        isOptionsModalOpen={isOptionsModalOpen}
        setIsOptionsModalOpen={setIsOptionsModalOpen}
      />
      <SelectReadingVoiceModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
      />
    </ScrollView>
  );
};

export default NewPlainStoryMode;
