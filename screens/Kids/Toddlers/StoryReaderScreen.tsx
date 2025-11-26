// screens/StoryReaderScreen.tsx
import React from "react";
import {
  View,
  Text,
  ImageBackground,
  Pressable,
  Modal,
  FlatList,
  Image,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import VoiceSelectModal from "../../../components/modals/VoiceSelectModal";
import { KidStory } from "./StoryInteraction";
import { SafeAreaView } from "react-native-safe-area-context";
import { KidsSetupNavigatorParamList } from "../../../Navigation/KidsSetupNavigator";

type Props = NativeStackScreenProps<
  KidsSetupNavigatorParamList,
  "storyReader"
>;

/**
 * Lightweight reader with page highlighting & controls.
 * Replace MOCK_PAGES with story.pages (API) when ready.
 */
const MOCK_PAGES = [
  "Once upon a time, far far away there lived a young boy called Pi.",
  "On the second page Pi learns how to make a raft and survive alone at sea.",
  "The tiger and Pi form a fragile truce as days turn into nights.",
  "Pi learns to fish and collect rainwater using clever tricks.",
  "One night a storm tests Pi's courage and his cleverness.",
  "He remembers home and sings quietly to keep hope alive.",
  "The ocean teaches Pi patience and respect for nature.",
  "Pi marks days by the stars and the sun on his raft.",
  "A friend appears, and then disappears; Pi learns about letting go.",
  "Pi finds land — new challenges and new friends await.",
  "He walks through markets and remembers the smell of spices.",
  "Pi grows into a storyteller, telling children about the sea.",
  "Time softens the fear but never the wonder inside Pi.",
  "He holds the tiger's memory like a warm stone in his chest.",
  "Years later Pi tells his tale and listens to others' tales.",
  "And so the story ends — but the sea keeps its secrets.",
];

const StoryReaderScreen: React.FC<Props> = ({ route, navigation }) => {
  // accept either story object or storyId (we fallback to mock pages for now)
  const passedStory = (route.params as any)?.story as KidStory | undefined;
  const storyId = (route.params as any)?.storyId as string | undefined;

  // If you have story.pages from API, use that. For now: use MOCK_PAGES
  const pages = React.useMemo(() => {
    // Example: if passedStory?.images or passedStory.pages exists, use them
    // e.g. return passedStory?.pagesText ?? MOCK_PAGES;
    return passedStory?.branches ? MOCK_PAGES : MOCK_PAGES;
  }, [passedStory]);

  const total = pages.length;
  const [pageIndex, setPageIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [dropdownVisible, setDropdownVisible] = React.useState(false);
  const [voiceModalVisible, setVoiceModalVisible] = React.useState(false);

  // auto-advance simulation — advances a page every X ms while playing
  React.useEffect(() => {
    if (!isPlaying) return undefined;
    const interval = setInterval(() => {
      setPageIndex((p) => {
        if (p + 1 >= total) {
          setIsPlaying(false); // stop at end
          return p;
        }
        return p + 1;
      });
    }, 4000); // 4s per page — replace with TTS progress sync if available
    return () => clearInterval(interval);
  }, [isPlaying, total]);

  const goPrev = () => {
    setPageIndex((p) => Math.max(0, p - 1));
    setIsPlaying(false);
  };
  const goNext = () => {
    setPageIndex((p) => Math.min(total - 1, p + 1));
    setIsPlaying(false);
  };

  const handleSaveVoice = (voiceId: string) => {
    setVoiceModalVisible(false);
    setDropdownVisible(false);
    // persist voice if needed
    // navigation passes voice to subsequent screens if required
  };

  const coverSource = passedStory?.coverImageUrl
    ? { uri: passedStory.coverImageUrl }
    : require("../../../assets/life-of-pi.png");

  return (
    <ImageBackground source={coverSource} className="flex-1" resizeMode="cover">
      {/* dim overlay so text is readable */}
      <View className="absolute inset-0 bg-black/50" />

      {/* Safe header */}
      <SafeAreaView className="flex-row items-center justify-between px-4 py-2 z-20 mt-4">
        <Pressable
          className="absolute top-8 left-4 z-20"
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require("../../../assets/story/close.png")}
            className="w-12 h-12"
            resizeMode="contain"
          />
        </Pressable>

        {/* page indicator */}
        <View className="px-3 py-1 rounded-md bg-black/30 absolute top-8 left-1/2 z-20">
          <Text className="text-white font-[quilka]">{`${pageIndex + 1}/${total}`}</Text>
        </View>

        {/* dropdown */}
        <Pressable
          onPress={() => setDropdownVisible((v) => !v)}
          className="absolute top-8 right-4 z-30"
        >
          <Image
            source={require("../../../assets/story/more.png")}
            className="w-12 h-12"
            resizeMode="contain"
          />
        </Pressable>
      </SafeAreaView>

      {/* main area that pushes content to the bottom */}
      <View className="flex-1 justify-end">
        {/* story box occupying bottom third */}
        <View className="h-1/5 bg-white py-4 px-6 rounded-2xl mx-4 mb-4 items-center justify-center">
          <Text
            accessible
            accessibilityRole="text"
            className="text-[18px] text-[#424242] leading-relaxed font-[abeezee]"
            style={{ minHeight: 40 }}
          >
            {pages[pageIndex]}
          </Text>
        </View>

        {/* controls sit just under the story box */}
        <View className="px-6 pb-8 mt-12">
          <View className="flex-row items-center justify-between">
            <Pressable onPress={goPrev}>
              <Image
                source={require("../../../assets/story/prev.png")}
                className="w-12 h-12"
                resizeMode="contain"
              />
            </Pressable>

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

            <Pressable onPress={goNext}>
              <Image
                source={require("../../../assets/story/next.png")}
                className="w-12 h-12"
                resizeMode="contain"
              />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Dropdown modal */}
      <Modal
        visible={dropdownVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <Pressable
          className="absolute inset-0 bg-black/40"
          onPress={() => setDropdownVisible(false)}
        />
        <View className="absolute top-28 right-1.5 flex-col gap-2">
          <Pressable
            className="py-2 px-3"
            onPress={() => {
              setVoiceModalVisible(true);
            }}
          >
            <Image
              source={require("../../../assets/story/read-mode.png")}
              className="w-12 h-12"
              resizeMode="contain"
            />
          </Pressable>
          <Pressable
            className="py-2 px-3"
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
      </Modal>

      {/* Voice modal */}
      <VoiceSelectModal
        visible={voiceModalVisible}
        onClose={() => setVoiceModalVisible(false)}
        onSave={handleSaveVoice}
      />
    </ImageBackground>
  );
};

export default StoryReaderScreen;
