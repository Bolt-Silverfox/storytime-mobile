import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  Pressable,
  Image,
  ActivityIndicator,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import VoiceSelectModal from "../../../components/modals/VoiceSelectModal";
import { SafeAreaView } from "react-native-safe-area-context";
import { KidsSetupNavigatorParamList } from "../../../Navigation/KidsSetupNavigator";
import StoryCompletionModal from "../../../components/modals/StoryCompletionModal";
import { LinearGradient } from "expo-linear-gradient";
import useGetStory from "../../../hooks/tanstack/queryHooks/useGetStory";
import useGenerateStoryAudio from "../../../hooks/tanstack/mutationHooks/useGenerateStoryAudio";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import useGetStoryProgress from "../../../hooks/tanstack/queryHooks/useGetStoryProgress";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useSetStoryProgress from "../../../hooks/tanstack/mutationHooks/UseSetStoryProgress";
import LoadingOverlay from "../../../components/LoadingOverlay";

type Props = NativeStackScreenProps<KidsSetupNavigatorParamList, "storyReader">;
type Mode = "readAlong" | "listen";

const StoryReaderScreen: React.FC<Props> = ({ route, navigation }) => {
  const { storyId, mode: incomingMode } = route.params as {
    storyId: string;
    mode?: Mode;
  };
  const storyQuery = useGetStory(storyId);
  const story = storyQuery?.data ?? null;

  const paragraphs =
    story?.textContent
      ?.split(/\n\s*\n/) // split on blank lines
      .map((p) => p.trim())
      .filter(Boolean) ?? [];

  const pages = useMemo(() => paragraphs, [paragraphs]);
  const total = pages.length;

  const [mode] = useState<Mode>(incomingMode ?? "readAlong");
  const [pageIndex, setPageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [voiceModalVisible, setVoiceModalVisible] = useState(false);
  const [completionVisible, setCompletionVisible] = useState(false);
  const [currentKidId, setCurrentKidId] = useState<string | null>("");

  let sessionStartTime = Date.now();
  let currentPage = 0;

  const { data: storyProgress } = useGetStoryProgress(currentKidId!, storyId);
  const { mutateAsync: setProgress, data } = useSetStoryProgress({
    kidId: currentKidId!,
    storyId,
  });

  console.log("progress", storyProgress?.progress, currentKidId, storyId);

  const [audioUri, setAudioUri] = useState<string | null>(null);
  const generateAudio = useGenerateStoryAudio({
    onSuccess: (data) => {
      setAudioUri(data.path);
    },
  });

  const [imageLoading, setImageLoading] = useState(true);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    const loadKid = async () => {
      const id = await AsyncStorage.getItem("currentKid");
      console.log("id", id);
      setCurrentKidId(id);
    };

    loadKid();
  }, []);

  useEffect(() => {
    if (storyProgress === null) {
      console.log("null");
    }
    if (!currentKidId) return; // wait for kid
    if (!storyProgress) return; // wait for progress
    if (total === 0) return; // wait for pages to parse
    console.log("s", storyProgress.progress);
    const page = Math.round((storyProgress.progress / 100) * total) - 1;

    setPageIndex(Math.max(0, page));

    if (!isPlaying) return undefined;
    const interval = setInterval(() => {
      setPageIndex((p) => {
        if (p + 1 >= total) {
          setIsPlaying(false);
          return p;
        }
        return p + 1;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [isPlaying, total, currentKidId, storyProgress?.progress]);

  const goPrev = () => {
    setPageIndex((prev) => {
      const newIndex = Math.max(0, prev - 1);

      setIsPlaying(false);

      setProgress({
        progress: ((newIndex + 1) / total) * 100,
        completed: completionVisible,
        time: sessionStartTime,
      });
      console.log(((newIndex + 1) / total) * 100);
      return newIndex;
    });
  };

  
  const goNext = () => {
    setPageIndex((prev) => {
      const newIndex = Math.min(total - 1, prev + 1);

      setIsPlaying(false);

      setProgress({
        progress: ((newIndex + 1) / total) * 100,
        completed: completionVisible,
        time: sessionStartTime,
      });
      console.log(((newIndex + 1) / total) * 100);
      return newIndex;
    });
  };

  const handleSaveVoice = (voiceId: string) => {
    setVoiceModalVisible(false);
    setDropdownVisible(false);
    generateAudio.mutate({
      content: story?.textContent ?? "",
      voiceType: voiceId.toUpperCase(),
    });
  };

  const handleFinish = () => {
    setCompletionVisible(true);
    setProgress({
      progress: ((pageIndex + 1) / total) * 100,
      completed: true,
      time: sessionStartTime,
    });
  };

  const handleCompletionPrimary = () => {
    setCompletionVisible(false);
    navigation.navigate("challenge", { storyId });
  };

  const coverSource = story?.coverImageUrl
    ? { uri: story.coverImageUrl }
    : require("../../../assets/life-of-pi.png");

  const isReady = currentKidId && storyProgress !== undefined && total > 0;

  if (!isReady) {
    console.log("ready");
    return <LoadingOverlay visible={!isReady} />;
  }

  // --- Move BottomContent declaration BEFORE return ---
  const BottomContent = (
    <>
      {/* Safe header */}
      <SafeAreaView className="flex-row items-center justify-between px-4 z-20">
        <Pressable onPress={() => navigation.goBack()}>
          <Image
            source={require("../../../assets/story/close.png")}
            className="w-12 h-12"
            resizeMode="contain"
          />
        </Pressable>

        {mode !== "listen" && (
          <View className="px-3 py-1">
            <Text className="text-white font-[quilka] text-xl">{`${pageIndex + 1}/${total}`}</Text>
          </View>
        )}

        <View className="flex-col items-end">
          <Pressable onPress={() => setDropdownVisible((v) => !v)}>
            <Image
              source={require("../../../assets/story/more.png")}
              className="w-12 h-12"
              resizeMode="contain"
            />
          </Pressable>

          {dropdownVisible && (
            <View className="mt-4 flex-col gap-4">
              <Pressable onPress={() => setVoiceModalVisible(true)}>
                <Image
                  source={require("../../../assets/story/read-mode.png")}
                  className="w-12 h-12"
                  resizeMode="contain"
                />
              </Pressable>

              <Pressable
                onPress={() => {
                  setPageIndex(0);
                  setDropdownVisible(false);
                }}
              >
                <Image
                  source={require("../../../assets/story/listen-mode.png")}
                  className="w-12 h-12"
                  resizeMode="contain"
                />
              </Pressable>
            </View>
          )}
        </View>
      </SafeAreaView>

      {/* on listen mode visual */}
      {mode === "listen" && (
        <View className="flex-1 justify-end">
          <Image
            source={require("../../../assets/story/sound-waves.png")}
            className="w-28 h-28 mx-auto"
            resizeMode="contain"
          />
        </View>
      )}

      {/* main area that pushes content to the bottom */}
      <View className="flex-1 justify-end">
        {mode !== "listen" && (
          <View className=" bg-white py-4 px-6 rounded-2xl mx-4 mb-4 items-center justify-center">
            <Text
              accessible
              accessibilityRole="text"
              className="text-[#424242] text-lg leading-relaxed font-[abeezee]"
              style={{ minHeight: 40 }}
            >
              {pages[pageIndex]}
            </Text>
          </View>
        )}

        <View className="px-6 pb-8 mt-12">
          <View className="flex-row items-center justify-between">
            {pageIndex > 0 ? (
              <Pressable onPress={goPrev}>
                <Image
                  source={require("../../../assets/story/prev.png")}
                  className="w-12 h-12"
                  resizeMode="contain"
                />
              </Pressable>
            ) : (
              <View className="w-12 h-12" />
            )}

            <Pressable
              onPress={() => setIsPlaying((s) => !s)}
              className="rounded-full flex-row items-center gap-2"
            >
              <Image
                source={require("../../../assets/story/audio.png")}
                className="w-12 h-12"
                resizeMode="contain"
              />
            </Pressable>

            {pageIndex + 1 >= total ? (
              <Pressable
                onPress={handleFinish}
                className="bg-[#866EFF] px-4 py-3 rounded-full items-center justify-center"
                accessibilityRole="button"
              >
                <Text className="text-white font-[abeezee]">Finish story</Text>
              </Pressable>
            ) : (
              <Pressable onPress={goNext}>
                <Image
                  source={require("../../../assets/story/next.png")}
                  className="w-12 h-12"
                  resizeMode="contain"
                />
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </>
  );

  return (
    <View className="flex-1">
      {/* Back button always on top */}
      <Pressable className="absolute top-8 left-4 z-30" onPress={() => navigation.goBack()}>
        <Image
          source={require("../../../assets/story/close.png")}
          className="w-12 h-12"
          resizeMode="contain"
        />
      </Pressable>

      {/* ImageBackground branch */}
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
            console.warn("Cover image failed:", story?.coverImageUrl, e);
            setImageFailed(true);
            setImageLoading(false);
          }}
        >
          {/* loading placeholder */}
          {imageLoading && (
            <View className="absolute inset-0 bg-[#f0f0f0] items-center justify-center">
              <ActivityIndicator size="large" color="#866EFF" />
            </View>
          )}

          {/* same gradient overlay */}
          <LinearGradient
            colors={[
              "rgba(88, 53, 180, 0)",
              "rgba(88, 53, 180, 0.55)",
              "rgba(88, 53, 180, 0.75)",
              "rgba(38, 23, 78, 0.55)",
              "rgba(38, 23, 78, 0.95)",
              "rgba(38, 23, 78, 1)",
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{ position: "absolute", inset: 0 }}
          />

          {/* render shared bottom content */}
          {BottomContent}
        </ImageBackground>
      ) : (
        // purple fallback branch
        <View className="flex-1 bg-[#866EFF]">
          {/* gradient still applied so visual matches */}
          <LinearGradient
            colors={[
              "rgba(88, 53, 180, 0)",
              "rgba(88, 53, 180, 0.55)",
              "rgba(88, 53, 180, 0.75)",
              "rgba(38, 23, 78, 0.55)",
              "rgba(38, 23, 78, 0.95)",
              "rgba(38, 23, 78, 1)",
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{ position: "absolute", inset: 0 }}
          />

          {/* show bottom content over gradient */}
          {BottomContent}
        </View>
      )}

      {/* modals */}
      <VoiceSelectModal
        visible={voiceModalVisible}
        onClose={() => setVoiceModalVisible(false)}
        onSave={handleSaveVoice}
      />
      <StoryCompletionModal
        visible={completionVisible}
        onClose={() => setCompletionVisible(false)}
        onPrimaryPress={handleCompletionPrimary}
        title="Yayyyy!!!!!!!"
        subtitle="You did it !"
        message="You’ve completed your first story!"
      />
    </View>
  );
};

export default StoryReaderScreen;
