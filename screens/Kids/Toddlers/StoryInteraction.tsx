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
import LoadingOverlay from "../../../components/LoadingOverlay";
import { KidsSetupNavigatorParamList } from "../../../Navigation/KidsSetupNavigator";
import useGetStory from "../../../hooks/tanstack/queryHooks/useGetStory";
import ErrorComponent from "../../../components/ErrorComponent";
import ImageWithFallback from "../../../components/parents/ImageWithFallback";

type Props = NativeStackScreenProps<
  KidsSetupNavigatorParamList,
  "storyInteraction"
>;


const StoryInteractionScreen: React.FC<Props> = ({ route, navigation }) => {
  const { storyId } = route.params;
  const storyQuery = useGetStory(storyId);
  const story = storyQuery?.data ?? null;

  useEffect(() => {
    if (!storyId) navigation.goBack();
  }, [storyId]);

  if (storyQuery.isLoading)
    return <LoadingOverlay visible label="Loading story..." />;
  if (storyQuery.isError)
    return (
      <View className="flex-1 bg-white">
        <ErrorComponent
          message={String(storyQuery.error?.message ?? "Failed to load story")}
          refetch={() => storyQuery.refetch?.()}
        />
      </View>
    );

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

  const paragraphs =
    story?.textContent
      ?.split(/\n\s*\n/) // split on blank lines
      .map((p) => p.trim())
      .filter(Boolean) ?? [];
  const totalChunks = paragraphs.length;
  const chunkDuration = 15;
  const duration = totalChunks * chunkDuration;
  const pages = paragraphs.length;

  function getDurationRange(seconds: number): string {
    const min = Math.floor(seconds / 60);
    const max = Math.ceil(seconds / 60);

    if (min === max) {
      return `${min} min`;
    }

    return `${min}-${max} mins`;
  }
  const durationLabel = getDurationRange(duration);
  const FALLBACK = require("../../../assets/parents/unseen-world.jpg");

  return (
    <ScrollView className="relative bg-[#FAF4F2] flex-1">
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
        <ImageWithFallback
          sourceUri={ story.coverImageUrl }
          fallbackRequire={FALLBACK}
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

      <View className="flex-row mt-5 w-full gap-3 px-4 items-center justify-center">
        <View className="flex-1 bg-white p-4 rounded-xl items-center justify-center">
          <Text className="text-base font-[quilka] text-center">Age range</Text>
          <Text className="text-[#212121] font-[abeezee]">
            {story.ageMin} - {story.ageMax} years
          </Text>
        </View>
        <View className="flex-1 bg-white p-4 rounded-xl items-center justify-center">
          <Text className="text-base font-[quilka] text-center">Duration</Text>
          <Text className="text-[#212121] font-[abeezee]">{durationLabel}</Text>
        </View>
        <View className="flex-1 bg-white p-4 rounded-xl items-center justify-center">
          <Text className="text-base font-[quilka] text-center">Pages</Text>
          <Text className="text-[#212121] font-[abeezee]">{pages}</Text>
        </View>
      </View>

      <View style={{ height: 40 }} />
      <Pressable
        className="bg-[#866EFF] p-4 py-3 flex-row gap-4 items-center justify-center border-b-4 border-[#5942CC] mx-4 mb-4 rounded-full"
        onPress={() => navigation.navigate("storyModeSelector", { storyId })}
      >
        <Text className="font-[quilka] text-3xl text-white">Start reading</Text>
        <ArrowRight size={36} color="#fff" />
      </Pressable>
    </ScrollView>
  );
};

export default StoryInteractionScreen;
