import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  Pressable,
  ActivityIndicator,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ArrowRight, Heart } from "lucide-react-native";
import LoadingOverlay from "../../../components/LoadingOverlay";
import { KidsSetupNavigatorParamList } from "../../../Navigation/KidsSetupNavigator";
import useGetStory from "../../../hooks/tanstack/queryHooks/useGetStory";
import ErrorComponent from "../../../components/ErrorComponent";

type Props = NativeStackScreenProps<
  KidsSetupNavigatorParamList,
  "storyInteraction"
>;

const StoryInteractionScreen: React.FC<Props> = ({ route, navigation }) => {
  const { storyId } = route.params;
  const storyQuery = useGetStory(storyId);
  const story = storyQuery?.data ?? null;

  const [imageLoading, setImageLoading] = useState(true);
  const [imageFailed, setImageFailed] = useState(false);

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
      ?.split(/\n\s*\n/)
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

  const coverSource = story?.coverImageUrl ? { uri: story.coverImageUrl } : null;

  const BottomSheet = (
    <View
      className="bg-white rounded-2xl p-4 absolute bottom-0 w-full shadow-lg"
      style={{ borderTopRightRadius: 32, borderTopLeftRadius: 32 }}
    >
      <View className="px-4">
        <Text className="text-2xl text-[#212121] font-[quilka] text-center mt-4">
          {story.title}
        </Text>
        <Text className="text-center text-[#212121] font-[abeezee] text-lg mt-4">
          {story.description}
        </Text>
      </View>

      <View className="flex-row mt-5 w-full items-center justify-center">
        <View className="flex-1 bg-white p-4 rounded-xl gap-2 items-center justify-center">
          <Text className="text-base font-[quilka] text-center">Age range</Text>
          <Text className="text-[#212121] font-[abeezee] text-center">
            {story.ageMin} - {story.ageMax} years
          </Text>
        </View>

        <View
          style={{
            width: 1,
            backgroundColor: "#E0E0E0",
            height: 56,
            marginHorizontal: 8,
          }}
        />

        <View className="flex-1 bg-white p-4 rounded-xl gap-2 items-center justify-center">
          <Text className="text-base font-[quilka] text-center">Duration</Text>
          <Text className="text-[#212121] font-[abeezee]">
            {durationLabel}
          </Text>
        </View>

        <View
          style={{
            width: 1,
            backgroundColor: "#E0E0E0",
            height: 56,
            marginHorizontal: 8,
          }}
        />

        <View className="flex-1 bg-white p-4 rounded-xl gap-2 items-center justify-center">
          <Text className="text-base font-[quilka] text-center">Pages</Text>
          <Text className="text-[#212121] font-[abeezee]">{pages}</Text>
        </View>
      </View>

      <View style={{ height: 40 }} />
      <Pressable
        className="bg-[#866EFF] p-4 flex-row gap-4 items-center justify-center border-b-4 border-[#5942CC] mx-4 mb-4 rounded-full"
        onPress={() => navigation.navigate("storyModeSelector", { storyId })}
      >
        <Text className="font-[quilka] text-3xl text-white">Start reading</Text>
        <ArrowRight size={36} color="#fff" />
      </Pressable>
    </View>
  );

  return (
    <View className="flex-1">
      {/* Back & Heart buttons always on top */}
      <Pressable
        className="absolute top-8 left-2 w-12 h-12 z-30"
        onPress={() => navigation.goBack()}
      >
        <Image
          source={require("../../../assets/story-home.png")}
          className="w-12 h-12"
          resizeMode="contain"
        />
      </Pressable>
      <Pressable
        className="absolute top-8 right-2 w-12 h-12 z-30"
        onPress={() => navigation.goBack()}
      >
        <Heart color="#fff" size={24} />
      </Pressable>

      {/* ImageBackground or purple fallback */}
      {!imageFailed && coverSource ? (
        <ImageBackground
          source={coverSource}
          className="flex-1"
          resizeMode="cover"
          onLoadStart={() => {
            setImageLoading(true);
            setImageFailed(false);
          }}
          onLoadEnd={() => setImageLoading(false)}
          onError={(e) => {
            console.warn("Cover image failed:", story.coverImageUrl, e);
            setImageFailed(true);
            setImageLoading(false);
          }}
        >
          {/* loading placeholder while image loads */}
          {imageLoading && (
            <View className="absolute inset-0 bg-[#f0f0f0] items-center justify-center">
              <ActivityIndicator size="large" color="#866EFF" />
            </View>
          )}

          {/* dim overlay */}
          <View className="absolute inset-0 bg-black/70" />

          {BottomSheet}
        </ImageBackground>
      ) : (
        // Purple fallback background
        <View className="flex-1 bg-purple">
          <View className="absolute inset-0 bg-black/70" />
          {BottomSheet}
        </View>
      )}
    </View>
  );
};

export default StoryInteractionScreen;
