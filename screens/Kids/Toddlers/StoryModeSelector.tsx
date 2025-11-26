// screens/StoryStartScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import VoiceSelectModal from "../../../components/modals/VoiceSelectModal";
import { KidsSetupNavigatorParamList } from "../../../Navigation/KidsSetupNavigator";

type Props = NativeStackScreenProps<KidsSetupNavigatorParamList, "storyModeSelector">;

const MOCK_STORIES = [
  {
    id: "1",
    title: "Life of PI",
    content:
      "Once upon a time a little kite wanted to touch the clouds. It learned to fly with the wind and made a new friend along the way.",
    description:
      "Pi learns how to survive on the ocean, make peace with the tiger and find his way back to safety.",
    ageMin: 1,
    ageMax: 4,
    duration: "8-10 mins",
    pages: 16,
    coverImageUrl: undefined,
  },
  {
    id: "2",
    title: "Moonlight Picnic",
    content:
      "On a clear night, siblings packed a picnic and discovered that the moon likes sandwiches too. They laughed and told stories until sunrise.",
    coverImageUrl: undefined,
  },
];

const StoryModeSelector: React.FC<Props> = ({ route, navigation }) => {
  const { storyId } = route.params;
  const [voiceModalVisible, setVoiceModalVisible] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);

  // If you later use the real hook, replace this lookup with the hook and loading/error handling.
  // const { data: story, isLoading, error } = useGetStory(storyId);
  const story =
    MOCK_STORIES.find((s) => s.id === String(storyId)) ?? MOCK_STORIES[0];

  const coverSource = story?.coverImageUrl
    ? { uri: story.coverImageUrl }
    : require("../../../assets/life-of-pi.png");

  const onReadAlong = () => {
    setVoiceModalVisible(true);
  };

  // Save voice and navigate to reader with chosen voice
  const handleSaveVoice = (voiceId: string) => {
    setSelectedVoice(voiceId);
    setVoiceModalVisible(false);
    navigation.navigate("storyReader", {
      storyId: story.id,
      mode: "readalong",
      voice: voiceId,
    } as any);
  };

  const onListenPress = () => {
    navigation.navigate("storyInteraction", {
      storyId: story.id,
      mode: "narration",
    } as any);
  };

  return (
    <ImageBackground source={coverSource} className="flex-1" resizeMode="cover">
      <Pressable
        className="absolute top-8 left-4 z-20 rounded-full p-2 bg-black/50"
        onPress={() => navigation.goBack()}
      >
        <Image
          source={require("../../../assets/story/close.png")}
          className="w-12 h-12"
          resizeMode="contain"
        />
      </Pressable>

      <View className="absolute inset-0 bg-black/30" />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-6">
        <View className="flex-1 justify-center items-center">
          <View className="flex-col items-center gap-3 w-full">
            <Pressable
              onPress={onReadAlong}
              className="flex-row bg-[#866EFF] rounded-full p-3 w-[90%] gap-2 items-center justify-center"
            >
              <Image
                source={require("../../../assets/story/book-open.png")}
                className="w-8 h-8"
                resizeMode="contain"
              />
              <Text className="text-white text-lg font-[quilka]">
                Read Along
              </Text>
            </Pressable>

            <Pressable
              onPress={onListenPress}
              className="flex-row bg-[#866EFF] rounded-full p-3 w-[90%] gap-3 items-center justify-center"
            >
              <Image
                source={require("../../../assets/story/headphones.png")}
                className="w-8 h-8"
                resizeMode="contain"
              />
              <Text className="text-white text-lg font-[quilka]">Listen</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
      {/* Voice selection modal */}
      <VoiceSelectModal
        visible={voiceModalVisible}
        initialVoiceId={selectedVoice}
        onClose={() => setVoiceModalVisible(false)}
        onSave={handleSaveVoice}
      />
    </ImageBackground>
  );
};

export default StoryModeSelector;
