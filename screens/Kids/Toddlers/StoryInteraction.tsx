import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
  ImageBackground,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { ProtectedRoutesParamList } from "../../../Navigation/ProtectedNavigator";
import { ArrowRight } from "lucide-react-native";
import useGetStory from "../../../hooks/tanstack/queryHooks/useGetStory";
import LoadingOverlay from "../../../components/LoadingOverlay";
import { KidsSetupNavigatorParamList } from "../../../Navigation/KidsSetupNavigator";

type Props = NativeStackScreenProps<
  KidsSetupNavigatorParamList,
  "storyInteraction"
>;

export type StoryImage = {
  url: string;
  caption: string;
};

export type StoryBranch = {
  prompt: string;
  optionA: string;
  optionB: string;
  nextA: string;
  nextB: string;
};

export type KidStory = {
  id: string;
  title: string;
  description: string;
  language: string;
  themeIds: string[];
  categoryIds: string[];
  coverImageUrl: string;
  audioUrl?: string | null;
  isInteractive: boolean;
  ageMin: number;
  ageMax: number;
  images: StoryImage[];
  branches?: StoryBranch[]; // only applies for interactive stories
};

// Simple local mock: replace this with real data fetching or context
const MOCK_STORIES = [
  {
    id: "1",
    title: "Life of PI",
    // image: require("../assets/kite.png"),
    content:
      "Once upon a time a little kite wanted to touch the clouds. It learned to fly with the wind and made a new friend along the way.",
    description:
      "Pi learns how to survive on the ocean, make peace with the tiger and find his way back to safety.",
    ageMin: 1,
    ageMax: 4,
    duration: "8-10 mins",
    pages: 16,
  },
  {
    id: "2",
    title: "Moonlight Picnic",
    // image: require("../assets/moon-picnic.png"),
    content:
      "On a clear night, siblings packed a picnic and discovered that the moon likes sandwiches too. They laughed and told stories until sunrise.",
  },
];

const StoryInteractionScreen: React.FC<Props> = ({ route, navigation }) => {
  const { storyId } = route.params;
  //   const { data: story, isLoading, error } = useGetStory(storyId);

  const [story, setStory] = useState<(typeof MOCK_STORIES)[0] | null>(null);

  useEffect(() => {
    // Replace with API call or context lookup if you have one
    const found = MOCK_STORIES.find((s) => s.id === storyId) || null;
    setStory(found);
  }, [storyId]);

  if (!story) {
    return (
      <View className="flex-1 items-center justify-center bg-[#FAF4F2] p-4">
        <Text className="text-center mb-4">No story found.</Text>
        <Pressable
          className="bg-blue-500 px-4 py-2 rounded-md"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-white">Go back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView className="relative bg-[#FAF4F2]">
      <Pressable
        className="absolute top-8 left-2 w-12 h-12 z-20"
        onPress={() => navigation.goBack()}
      >
        <Image
          source={require("../../../assets/story-home.png")}
          className="w-12 h-12"
          resizeMode="contain"
        />
      </Pressable>
      <View className="relative w-full">
        <Image
          source={require("../../../assets/life-of-pi.png")}
          className="w-full h-[450px]"
          resizeMode="cover"
        />
      </View>
      <View className="px-4">
        <Text className="text-2xl text-[#212121] font-[quilka] text-center mt-4">
          {story.title}
        </Text>
        <Text className="text-center text-[#212121] font-[abeezee] text-lg mt-4">
          {story.description}
        </Text>
      </View>

      <View className="flex-row mt-5 w-full gap-3 px-4">
        <View className="bg-white p-4 rounded-xl w-1/3 items-center justify-center">
          <Text className="text-lg font-[quilka] text-center">Age range</Text>
          <Text className="text-[#212121] font-[abeezee]">
            {story.ageMin} - {story.ageMax} years
          </Text>
        </View>
        <View className="bg-white p-4 rounded-xl w-1/3 items-center justify-center">
          <Text className="text-lg font-[quilka] text-center">Duration</Text>
          <Text className="text-[#212121] font-[abeezee]">
            {story.duration}
          </Text>
        </View>
        <View className="bg-white p-4 rounded-xl w-1/3 items-center justify-center">
          <Text className="text-lg font-[quilka] text-center">Pages</Text>
          <Text className="text-[#212121] font-[abeezee]">{story.pages}</Text>
        </View>
      </View>

      <View style={{ height: 40 }} />
      <Pressable
        className="bg-[#866EFF] p-4 py-3 flex-row gap-4 items-center justify-center border-b-4 border-[#5942CC] mx-4 mb-4 rounded-full"
        onPress={() => navigation.navigate("storyModeSelector", { storyId })}
      >
        <Text className="font-[quilka] text-3xl text-white">Start reading</Text>
        <Image
          source={require("../../../assets/story/forward.png")}
          className="w-12 h-12"
          resizeMode="contain"
        />
      </Pressable>
    </ScrollView>
  );
};

export default StoryInteractionScreen;
