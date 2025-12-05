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
  Switch,
} from "react-native";
import { Play, Pause, ChevronLeft, PencilLine } from "lucide-react-native";
import LoadingOverlay from "../../../components/LoadingOverlay";
import ErrorComponent from "../../../components/ErrorComponent";
import RecommendStoryModal from "../../../components/modals/RecommendStoryModal";
import useGetStory from "../../../hooks/tanstack/queryHooks/useGetStory";
import VoicePickerModal from "../../../components/modals/VoicePickerModal";
import useRecommendStory from "../../../hooks/tanstack/queryHooks/useRecommendStory";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const COVER_HEIGHT = SCREEN_HEIGHT * 0.4; // 40%

export default function PlainStoryScreen({ route, navigation }: any) {
  const { storyId, mode } = route.params ?? {};
  const storyQuery = useGetStory(storyId);
  const story = storyQuery?.data ?? null;
  const [on, setOn] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const [isRecommendOpen, setIsRecommendOpen] = useState(false);
  const { mutate: recommendStory } = useRecommendStory();

  const coverUri =
    story?.coverImageUrl ??
    require("../../../assets/parents/story-cover-image.png");
  const title = story?.title ?? "Untitled Story";

  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const [voicePickerOpen, setVoicePickerOpen] = useState(false);
  const [preferredVoiceId, setPreferredVoiceId] = useState("fanice");
  const [preferredVoiceName, setPreferredVoiceName] = useState("Fanice");
  const [chunkIndex, setChunkIndex] = useState(0);

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

  const paragraphs =
    story?.textContent
      ?.split(/\n\s*\n/) // split on blank lines
      .map((p) => p.trim())
      .filter(Boolean) ?? [];
  const totalChunks = paragraphs.length;
  const chunkDuration = 15;
  const duration = totalChunks * chunkDuration;

  const currentChunk = paragraphs[chunkIndex] ?? "";
  // total duration (seconds) from API or fallback
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
      return now;
    });
  };

  const onNextChunk = () => {
    setChunkIndex((i) => Math.min(i + 1, paragraphs.length - 1));
  };
  const onPrevChunk = () => {
    setChunkIndex((i) => Math.max(i - 1, 0));
  };

  const onSkipBack = () => {
    // rewind 15s
    setElapsed((e) => Math.max(e - 15, 0));
    // go to previous text chunk
    onPrevChunk();
  };

  const onSkipForward = () => {
    // forward 15s (cap at story duration if available)
    setElapsed((e) => Math.min(e + 15, duration));
    // go to next text chunk
    onNextChunk();
  };

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
                activeOpacity={0.85}
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
            <Text className="text-lg font-[abeezee] text-text w-full leading-6">
              {currentChunk}
            </Text>
          )}

          {/* Read-along row with toggle (unchanged) */}
          <View className="flex-row items-center py-4 px-6 w-full mt-8">
            <Text className="text-lg font-[abeezee] flex-1">
              Read along with Cosmo
            </Text>
            <Switch
              value={on}
              onValueChange={setOn}
              trackColor={{ false: "#d4d4d4", true: "#4f46e5" }}
              thumbColor={on ? "#fff" : "#f4f4f4"}
            />
          </View>
        </View>
      </View>
      <View className="flex-1" />
      {/* player */}
      <View className="px-4 pt-3 pb-3 bg-white flex-row items-center justify-center gap-6">
        <View className="w-6 h-3"></View>
        <View className="flex-row gap-4 justify-center items-center mt-4">
          <TouchableOpacity onPress={onSkipBack} activeOpacity={0.85}>
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

          <TouchableOpacity onPress={onSkipForward} activeOpacity={0.85}>
            <Image
              source={require("../../../assets/icons/forward.png")}
              className="w-8 h-8 rounded-full ml-2"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={onSkipForward} className="mt-2">
          <Text className="text-[abeezee]">5xp</Text>
        </TouchableOpacity>
      </View>
      {/* elapsed / total time row */}
      <View className="flex-row justify-center items-center pb-8">
        <Text className="font-[abeezee] text-gray-600 mr-2">
          {fmt(elapsed)}
        </Text>
        <Text className="font-[abeezee] text-gray-400">/</Text>
        <Text className="font-[abeezee] text-gray-600 ml-2">
          {" "}
          {fmt(duration)}
        </Text>
      </View>

    <RecommendStoryModal
      visible={isRecommendOpen}
      onClose={() => setIsRecommendOpen(false)}
      storyId={storyId}
      handleRecommend={(sId, kidId) => {
        if (!sId || !kidId) return;
        recommendStory(
          { storyId: sId, kidId }, // ✅ payload
          {
            onSuccess: () => alert("Story recommended successfully!"),
            onError: (err) => alert(err.message),
            }
          );
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
