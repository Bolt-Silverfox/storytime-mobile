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
type Mode = "readAlong" | "listen";

const StoryModeSelector: React.FC<Props> = ({ route, navigation }) => {
  const { storyId, childId } = route.params;
  const [voiceModalVisible, setVoiceModalVisible] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [mode, setMode] = useState<Mode>("readAlong");
  const [imageFailed, setImageFailed] = useState(false);

  const { data: story } = useGetStory(storyId);

  const coverSource = story?.coverImageUrl
    ? { uri: story.coverImageUrl }
    : require("../../../assets/life-of-pi.png");

  const onReadAlong = () => {
    setVoiceModalVisible(true);
    setMode("readAlong");
  };

  const handleSaveVoice = (voiceId: string) => {
    setSelectedVoice(voiceId);
    setVoiceModalVisible(false);
    navigation.navigate("storyReader", {
      storyId: storyId,
      childId: childId,
      mode: mode,
      voice: voiceId,
    } as any);
  };

  const onListenPress = () => {
    setVoiceModalVisible(true);
    setMode("listen");
  };

  const Content = (
    <>
      {imageLoading && !imageFailed && (
        <View className="absolute inset-0 bg-[#f0f0f0] items-center justify-center">
          <ActivityIndicator size="large" color="#866EFF" />
        </View>
      )}

      <View className="absolute inset-0 bg-black/70" />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-6">
        <View className="flex-1 justify-center items-center">
          <View className="flex-col items-center gap-3 w-full">
            <Pressable
              className="self-start z-20 rounded-full"
              onPress={() => navigation.goBack()}
            >
              <Image
                source={require("../../../assets/story/close.png")}
                className="w-12 h-12"
                resizeMode="contain"
              />
            </Pressable>

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
    </>
  );

  return (
    <>
      {!imageFailed ? (
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
            console.warn("Cover image failed to load:", story?.coverImageUrl, e);
            setImageFailed(true);
            setImageLoading(false);
          }}
        >
          {Content}
        </ImageBackground>
      ) : (
        // full-screen blue fallback
        <View className="flex-1 bg-purple">
          {Content}
        </View>
      )}

      {/* Voice selection modal stays outside background so it's always visible */}
      <VoiceSelectModal
        visible={voiceModalVisible}
        initialVoiceId={selectedVoice}
        onClose={() => setVoiceModalVisible(false)}
        onSave={handleSaveVoice}
        mode={mode}
      />
    </>
  );
};

export default StoryModeSelector;
