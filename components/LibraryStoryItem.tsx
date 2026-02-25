import { useNavigation } from "@react-navigation/native";
import { Dispatch, SetStateAction } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { ProtectedRoutesNavigationProp } from "../Navigation/ProtectedNavigator";
import { LibraryStory } from "../types";
import {
  secondsToMinutes,
  splitByWordCountPreservingSentences,
} from "../utils/utils";
import Icon from "./Icon";
import ProgressBar from "./parents/ProgressBar";

const LibraryStoryItem = ({
  story,
  setActiveStory,
}: {
  story: LibraryStory;
  setActiveStory: Dispatch<
    SetStateAction<{
      title: string;
      id: string;
    } | null>
  >;
}) => {
  const navigator = useNavigation<ProtectedRoutesNavigationProp>();
  const paragraphs = splitByWordCountPreservingSentences(story.textContent, 30);

  const totalSteps = paragraphs.length;
  const progressRatio =
    totalSteps > 0 ? Math.min(story.progress / totalSteps, 1) : 0;
  const storyDuration = secondsToMinutes(story.durationSeconds);
  return (
    <Pressable
      key={story.id}
      onPress={() =>
        navigator.navigate("stories", {
          screen: "childStoryDetails",
          params: {
            story: {
              ageMax: story.ageMax,
              ageMin: story.ageMin,
              categories: story.categories,
              coverImageUrl: story.coverImageUrl,
              description: story.description,
              durationSeconds: story.durationSeconds,
              id: story.id,
              title: story.title,
              createdAt: story.createdAt,
            },
            page: story.progress ?? 0,
          },
        })
      }
      className="flex flex-col rounded-xl border border-border-light p-1"
    >
      <Image
        source={{ uri: story.coverImageUrl }}
        className="mb-3 h-40 rounded-xl"
      />
      <View className="p-2">
        <View className="flex flex-row items-center">
          <View className="flex flex-1 flex-row items-center gap-x-px">
            <Icon name="Dot" color="#EC0794" />
            <Text className="font-[abeezee] text-xs text-[#EC0794]">
              {story.categories?.[0]?.name ?? "Uncategorized"}
            </Text>
          </View>
          <View className="flex flex-1 flex-row items-center gap-x-2">
            <Icon name="Clock" size={12} color="#616161" />
            <Text className="font-[abeezee] text-xs text-text">
              {storyDuration > 0 ? storyDuration : "<1"}
              {storyDuration > 1 ? " mins" : " min"}
            </Text>
          </View>
        </View>
        <Text className="my-1.5 font-[abeezee] text-base text-black">
          {story.title}
        </Text>
        <Text className="mb-4 font-[abeezee] text-xs text-text">
          {story.ageMin} - {story.ageMax} years
        </Text>
        <View className="flex-row items-center gap-6">
          <View className="flex-1">
            <ProgressBar progress={progressRatio} color="#4807EC" />
          </View>

          <Pressable
            onPress={() => {
              setActiveStory({ id: story.id, title: story.title });
            }}
            className="rounded-full bg-[#EC0707] p-2"
          >
            <Icon name="Trash" color="#fff" size={24} />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};

export default LibraryStoryItem;
