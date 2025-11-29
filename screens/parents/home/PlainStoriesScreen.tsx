// PlainStoryScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ScrollView,
  ImageBackground,
} from "react-native";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Heart,
  ChevronLeft,
  PencilLine,
} from "lucide-react-native";
import LoadingOverlay from "../../../components/LoadingOverlay";
import ErrorComponent from "../../../components/ErrorComponent";
import Toggle from "../../../components/UI/Toggle";
import RecommendStoryModal from "../../../components/modals/RecommendStoryModal";
import useGetStory from "../../../hooks/tanstack/queryHooks/useGetStory";
import VoicePickerModal from "../../../components/modals/VoicePickerModal";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const COVER_HEIGHT = SCREEN_HEIGHT * 0.4; // 40%

export default function PlainStoryScreen({ route, navigation }: any) {
  const { storyId, mode } = route.params ?? {};
  const storyQuery = useGetStory(storyId);
  const story = storyQuery?.data ?? null;
  const [on, setOn] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const [isRecommendOpen, setIsRecommendOpen] = useState(false);

  const coverUri =
    story?.coverImageUrl ??
    require("../../../assets/parents/story-cover-image.png");
  const title = story?.title ?? "Untitled Story";

  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const [voicePickerOpen, setVoicePickerOpen] = useState(false);
  const [preferredVoiceId, setPreferredVoiceId] = useState("fanice");
  const [preferredVoiceName, setPreferredVoiceName] = useState("Fanice");

  // auto-play when opened in plain mode
  useEffect(() => {
    if (storyQuery.isSuccess && mode === "plain") {
      const t = setTimeout(() => {
        setIsPlaying(true);
        // TODO: start real audio playback here
      }, 200);
      return () => clearTimeout(t);
    }
  }, [storyQuery.isSuccess, mode, storyId]);

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

  // total duration (seconds) from API or fallback
  const totalTime = "20:10";
  const fmt = (s: number) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const ss = Math.floor(s % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${ss}`;
  };

  const onPlayPause = () => {
    setIsPlaying((p) => {
      const now = !p;
      // TODO: integrate actual player play/pause using story.audioUrl or storyId
      return now;
    });
  };
  const onSkipBack = () => setElapsed((e) => Math.max(e - 15, 0));
  const onSkipForward = () => setElapsed((e) => Math.max(15 - e, 0));

  return (
    <ScrollView className="flex-1 bg-white">
      {/* top bar */}
      <ImageBackground
        source={
          !imgFailed && typeof coverUri === "string"
            ? {
                uri: encodeURI(
                  coverUri.replace("/upload/", "/upload/f_auto,q_auto/")
                ),
              }
            : require("../../../assets/parents/story-cover-image.png")
        }
        style={{ height: COVER_HEIGHT, width: "100%" }}
        className="w-full relative"
        resizeMode="cover"
        onError={() => setImgFailed(true)}
      >
        {/* back control */}
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-4">
          <ChevronLeft size={36} color="#fff" />
        </TouchableOpacity>
        <Text className="text-3xl font-[quilka] text-white absolute top-1/2 p-4 text-center">
          {title}
        </Text>

        {/* Right-side button */}
        <TouchableOpacity
          onPress={() => setIsRecommendOpen(true)}
          className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-full"
        >
          <Text className="font-[abeezee]">Recommend this story</Text>
        </TouchableOpacity>
      </ImageBackground>
      {/* meta */}

      <View className="px-4 pt-4 flex-1">
        <View className="rounded-2xl flex-col items-center gap-6">
          {/* when Cosmo is ON: row layout (sound waves + Fanice) */}
          {on ? (
            <View className="w-full flex-row items-center justify-between gap-4">
              {/* sound waves small */}
              <Image
                source={require("../../../assets/parents/sound-waves.png")}
                className="w-16 h-16"
                resizeMode="contain"
              />

              {/* Fanice button (compact) */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setVoicePickerOpen(true)}
                className="flex-row items-center bg-[#FEE3D6] px-4 py-2 rounded-full shadow-sm border border-primary"
              >
                <Text className="text-primary font-[quilka] text-lg mr-2">
                  {preferredVoiceName}
                </Text>
                <PencilLine color="#EC4007" size={16} />
              </TouchableOpacity>
            </View>
          ) : (
            /* when Cosmo is OFF: original vertical arrangement */
            <>
              <Image
                source={require("../../../assets/parents/sound-waves.png")}
                className="w-full h-40 rounded-full mr-3"
                resizeMode="contain"
              />

              <TouchableOpacity
                className="flex-row items-center gap-4 py-2 px-4 rounded-full border border-primary"
                style={{ backgroundColor: "rgba(254, 195, 175, 0.25)" }}
                onPress={() => setVoicePickerOpen(true)}
              >
                <Text className="text-primary font-[quilka] text-2xl">
                  {preferredVoiceName}
                </Text>
                <PencilLine color="#EC4007" size={16} />
              </TouchableOpacity>
            </>
          )}

          {/* Story text content */}
          {on && (
            <Text
              className="text-base font-[abeezee] text-text w-full leading-6"
              numberOfLines={5}
              ellipsizeMode="tail"
            >
              {story?.textContent ??
                story?.description ??
                "No story text available yet. This area will show the story content when Cosmo is turned on."}
            </Text>
          )}

          {/* Read-along row with toggle (unchanged) */}
          <View className="flex-row items-center py-4 px-6 w-full mt-8">
            <Text className="text-lg font-[abeezee] flex-1">
              Read along with Cosmo
            </Text>
            <Toggle value={on} onValueChange={setOn} />
          </View>
        </View>
      </View>
      <View className="flex-1" />
      {/* player */}
      <View className="px-4 pt-3 pb-3 bg-white flex-row items-center justify-center gap-6">
        <View className="w-4 h-4"></View>
        <View className="flex-row gap-4 justify-center items-center mt-4">
          <TouchableOpacity onPress={onSkipBack}>
            <Image
              source={require("../../../assets/icons/rewind.png")}
              className="w-8 h-8 rounded-full mr-3"
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={1}
            onPress={onPlayPause}
            className={`items-center justify-center rounded-full w-16 h-16 ${isPlaying ? "bg-[#FF5470]" : "bg-primary"} border-4 border-[#FCE2DA] shadow-lg`}
          >
            {isPlaying ? (
              <Pause size={20} color="#fff" />
            ) : (
              <Play size={20} color="#fff" />
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={onSkipForward}>
            <Image
              source={require("../../../assets/icons/forward.png")}
              className="w-8 h-8 rounded-full mr-3"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={onSkipForward} className="mt-1">
          <Text className="text-[abeezee]">5xp</Text>
        </TouchableOpacity>
      </View>
      {/* elapsed / total time row */}
      <View className="flex-row justify-center items-center pb-8">
        <Text className="font-[abeezee] text-gray-600 mr-2">
          {fmt(elapsed)}
        </Text>
        <Text className="font-[abeezee] text-gray-400">/</Text>
        <Text className="font-[abeezee] text-gray-600 ml-2">{totalTime}</Text>
      </View>

      <RecommendStoryModal
        visible={isRecommendOpen}
        onClose={() => setIsRecommendOpen(false)}
        storyId={storyId}
        handleRecommend={(sId, kidId) => {
          console.log("Recommend story", sId, "for kid", kidId);
        }}
      />

      <VoicePickerModal
        visible={voicePickerOpen}
        onClose={() => setVoicePickerOpen(false)}
        currentlyActiveVoiceId={preferredVoiceId}
        onConfirm={(selectedVoiceId, selectedVoiceName) => {
          setPreferredVoiceId(selectedVoiceId);
          setPreferredVoiceName(selectedVoiceName ?? "Fanice");
          setVoicePickerOpen(false);
        }}
      />
    </ScrollView>
  );
}
