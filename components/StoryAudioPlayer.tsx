import Ionicons from "@expo/vector-icons/Ionicons";
import { useAudioPlayer } from "expo-audio";
import { ActivityIndicator, Pressable, Switch, Text, View } from "react-native";
import useTextToAudio from "../hooks/tanstack/mutationHooks/useTextToAudio";
import { useEffect, useState } from "react";

const StoryAudioPlayer = ({
  audioUrl,
  textContent,
  selectedVoice,
}: {
  audioUrl: string;
  textContent: string;
  selectedVoice: string;
}) => {
  const [generatedAudio, setGeneratedAudio] = useState<string | undefined>(
    undefined,
  );
  const { isPending, mutate } = useTextToAudio({ setGeneratedAudio });
  const player = useAudioPlayer(generatedAudio ?? audioUrl);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    player.pause();
    setIsPlaying(false);
    mutate({ content: textContent, voiceType: selectedVoice });
  }, [selectedVoice]);

  const playAudio = () => {
    if (isPlaying) {
      setIsPlaying(false);
      player.pause();
      return;
    }
    setIsPlaying(true);
    player.play();
  };

  return (
    <View className="bg-white rounded-full h-20 flex flex-row justify-between items-center px-2">
      <View className="flex flex-row gap-x-2 items-center">
        <Pressable className="bg-blue size-12 rounded-full flex flex-col justify-center items-center">
          <Ionicons name="volume-medium-outline" size={24} color="white" />
        </Pressable>
        <Text className="font-[quilka] text-xl">Mute Voice</Text>
      </View>
      {isPending ? (
        <ActivityIndicator size={"large"} />
      ) : (
        <Switch value={isPlaying} onValueChange={playAudio} />
      )}
    </View>
  );
};

export default StoryAudioPlayer;
