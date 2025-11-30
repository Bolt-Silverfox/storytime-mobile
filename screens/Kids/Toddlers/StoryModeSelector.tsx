import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import VoiceSelectModal from "../../../components/modals/VoiceSelectModal";
import { KidsSetupNavigatorParamList } from "../../../Navigation/KidsSetupNavigator";
import useGetStory from "../../../hooks/tanstack/queryHooks/useGetStory";

type Props = NativeStackScreenProps<
  KidsSetupNavigatorParamList,
  "storyModeSelector"
>;

const StoryModeSelector: React.FC<Props> = ({ route, navigation }) => {
  const { storyId } = route.params;
  const [voiceModalVisible, setVoiceModalVisible] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);

  // If you later use the real hook, replace this lookup with the hook and loading/error handling.
  const { data: story } = useGetStory(storyId);

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
      storyId: storyId,
      mode: "readalong",
      voice: voiceId,
    } as any);
  };

  const onListenPress = () => {
    navigation.navigate("storyInteraction", {
      storyId: storyId,
      mode: "narration",
    } as any);
  };

  return (
    <ImageBackground
      source={coverSource}
      className="flex-1"
      resizeMode="cover"
      onLoadStart={() => setImageLoading(true)}
      onLoadEnd={() => setImageLoading(false)}
    >
      {imageLoading && (
        <View className="absolute inset-0 bg-[#f0f0f0] items-center justify-center">
          <ActivityIndicator size="large" color="#866EFF" />
        </View>
      )}

      <Pressable
        className="absolute top-8 left-4 z-20 rounded-full"
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
