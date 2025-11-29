// screens/parents/InteractiveStoryScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  ChevronLeft,
  PencilLine,
} from "lucide-react-native";
import LoadingOverlay from "../../../components/LoadingOverlay";
import ErrorComponent from "../../../components/ErrorComponent";
import Toggle from "../../../components/UI/Toggle";
import RecommendStoryModal from "../../../components/modals/RecommendStoryModal";
import CustomButton from "../../../components/UI/CustomButton";
import VoicePickerModal from "../../../components/modals/VoicePickerModal";
import useGetStory from "../../../hooks/tanstack/queryHooks/useGetStory";

export default function InteractiveStoryScreen({ route, navigation }: any) {
  const { storyId, mode } = route.params ?? {};
  const storyQuery = useGetStory(storyId);
  const story: any = storyQuery?.data ?? null;

  const [imgFailed, setImgFailed] = useState(false);
  const [on, setOn] = useState(false); // Cosmo toggle
  const [isRecommendOpen, setIsRecommendOpen] = useState(false);

  // questions from schema: story.questions is an array
  const questions: {
    id: string;
    storyId: string;
    question: string;
    options: string[];
    correctOption: number;
  }[] = Array.isArray(story?.questions) ? story.questions : [];

  const [currentIdx, setCurrentIdx] = useState(0);
  const currentQuestion = questions[currentIdx] ?? null;

  // answer UI state
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // playback / UI
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voicePickerOpen, setVoicePickerOpen] = useState(false);
  const [preferredVoiceId, setPreferredVoiceId] = useState("fanice");
  const [preferredVoiceName, setPreferredVoiceName] = useState("Fanice");

  const submitAnswer = async (questionId: string, optionIndex: number) => {
    // TODO: send to backend if you have an endpoint
    // await fetch("/api/answer", { method: "POST", body: JSON.stringify({ questionId, optionIndex }) });
    return Promise.resolve(true);
  };

  const handleSelectSubmit = async () => {
    if (!currentQuestion || selectedIndex === null) return;
    try {
      setIsSubmitting(true);

      await submitAnswer(currentQuestion.id, selectedIndex);

      // go to next question or finish
      if (currentIdx < questions.length - 1) {
        setCurrentIdx((i) => i + 1);
        setSelectedIndex(null);
      } else {
        Alert.alert("Nice!", "You’ve completed all the questions.");
        // you can navigate or do something else here
      }
    } catch (err) {
      console.warn("Submit failed", err);
      Alert.alert("Oops", "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (storyQuery.isSuccess && mode === "interactive") {
      const t = setTimeout(() => setIsPlaying(true), 200);
      return () => clearTimeout(t);
    }
  }, [storyQuery.isSuccess, mode, storyId]);

  useEffect(() => {
    // reset per question
    setSelectedIndex(null);
    setAnswered(false);
    setIsCorrect(null);
  }, [currentIdx]);

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

  const coverUri =
    story?.coverImageUrl ??
    require("../../../assets/parents/story-cover-image.png");
  const title = story?.title ?? "Untitled Story";

  const handleSelect = (idx: number) => {
    if (!currentQuestion || answered) return;
    setSelectedIndex(idx);
    const correct =
      typeof currentQuestion.correctOption === "number"
        ? currentQuestion.correctOption === idx
        : null;
    setIsCorrect(correct === true);
    setAnswered(true);

    // placeholder: submit answer to backend / analytics
    submitAnswer(currentQuestion.id, idx).catch((err) => {
      console.warn("submitAnswer failed", err);
    });
  };

  const onNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((i) => i + 1);
    } else {
      // finished interactive questions — you decide what to do
      Alert.alert("Done", "You've completed the questions for this story.");
      // optionally reset or navigate
    }
  };

  const onPlayPause = () => setIsPlaying((p) => !p);
  const onSkipBack = () => setElapsed((e) => Math.max(e - 15, 0));
  const onSkipForward = () =>
    setElapsed((e) => Math.min(story?.durationSeconds ?? 20 * 60, e + 15));

  return (
    <ScrollView className="flex-1 bg-white">
      {/* cover + top bar */}
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
        style={{ height: 300, width: "100%" }}
        className="w-full relative"
        resizeMode="cover"
        onError={() => setImgFailed(true)}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-4">
          <ChevronLeft size={34} color="#fff" />
        </TouchableOpacity>

        <Text className="text-3xl font-[quilka] text-white absolute top-1/2 left-4 right-4 text-center">
          {title}
        </Text>

        <TouchableOpacity
          onPress={() => setIsRecommendOpen(true)}
          className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-full"
        >
          <Text className="font-[abeezee]">Recommend this story</Text>
        </TouchableOpacity>
      </ImageBackground>

      <View className="px-4 pt-4">
        {/* Cosmo / Fanice row + story text */}
        <View className="rounded-2xl flex-col items-center gap-6">
          {on ? (
            <View className="w-full flex-row items-center justify-between gap-4">
              <Image
                source={require("../../../assets/parents/sound-waves.png")}
                className="w-16 h-16"
                resizeMode="contain"
              />
              <TouchableOpacity
                className="flex-row items-center bg-[#FEE3D6] px-4 py-2 rounded-full border border-[#EC4007]"
                onPress={() => setVoicePickerOpen(true)}
              >
                <Text className="text-primary font-[quilka] text-lg mr-2">
                  {preferredVoiceName}
                </Text>
                <PencilLine color="#EC4007" size={16} />
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Image
                source={require("../../../assets/parents/sound-waves.png")}
                className="w-full h-40 rounded-full"
                resizeMode="contain"
              />
              <TouchableOpacity
                className="flex-row items-center bg-[#FEE3D6] px-6 py-2 rounded-full border"
                style={{ borderColor: "#EC4007" }}
                onPress={() => setVoicePickerOpen(true)}
              >
                <Text className="text-primary font-[quilka] text-lg mr-2">
                  {preferredVoiceName}
                </Text>
                <PencilLine color="#EC4007" size={16} />
              </TouchableOpacity>
            </>
          )}

          {/* story content lines shown when Cosmo ON */}
          {on && (
            <Text
              className="text-base font-[abeezee] text-text w-full leading-6"
              numberOfLines={5}
              ellipsizeMode="tail"
            >
              {story?.textContent ??
                story?.description ??
                "No story text available yet."}
            </Text>
          )}
          {/* interactive question block (uses story.questions) */}

          {/* interactive question block */}
          <View className="pt-4 w-full">
            {currentQuestion ? (
              <View className="relative bg-[#FFFDF8] w-full">
                <Text className="text-xl font-[quilka] mb-4">
                  {currentQuestion.question}
                </Text>

                {/* options with radio inputs */}
                <View className="flex-col gap-3">
                  {currentQuestion.options.map((opt: string, i: number) => {
                    const isSelected = selectedIndex === i;

                    return (
                      <Pressable
                        key={i}
                        onPress={() => setSelectedIndex(i)}
                        className={`flex-row items-center justify-between py-3 px-4 rounded-lg`}
                      >
                        <View className="flex-row items-center gap-3 flex-1">
                          {/* radio circle */}
                          <View
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              isSelected
                                ? "border-[#4807EC]"
                                : "border-[#4A413F]"
                            }`}
                          >
                            {isSelected && (
                              <View className="w-3 h-3 rounded-full bg-[#4807EC]" />
                            )}
                          </View>

                          <Text className="text-base font-[abeezee] text-[#3A3A3A] flex-1">
                            {opt}
                          </Text>
                        </View>
                      </Pressable>
                    );
                  })}

                  {/* question progress */}
                  <View className="items-end absolute right-4 bottom-4">
                    <Text className="text-xl font-[quilka] text-primary">
                      {currentIdx + 1}/{questions.length || 1}
                    </Text>
                  </View>
                </View>

                {/* Select button */}
                <View className="mt-4">
                  <CustomButton
                    text="Select"
                    disabled={selectedIndex === null || isSubmitting}
                    onPress={handleSelectSubmit}
                  />
                </View>
              </View>
            ) : (
              <View className="mb-4">
                <Text className="text-base font-[abeezee]">
                  No questions available for this story.
                </Text>
              </View>
            )}
          </View>

          {/* read-along row with toggle */}
          <View className="flex-row items-center py-4 px-6 w-full">
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
        <View className="w-6 h-6"></View>
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

      {/* elapsed / total time (no real time in schema) */}
      <View className="flex-row justify-center items-center pb-8">
        <Text className="font-[abeezee] text-gray-600 mr-2">0:00</Text>
        <Text className="font-[abeezee] text-gray-400">/</Text>
        <Text className="font-[abeezee] text-gray-600 ml-2">20:13</Text>
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
