import Ionicons from "@expo/vector-icons/Ionicons";
import { useAudioPlayer } from "expo-audio";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Switch, Text, View } from "react-native";
import useTextToAudio from "../hooks/tanstack/mutationHooks/useTextToAudio";

const StoryAudioPlayer = ({
  audioUrl,
  textContent,
  selectedVoice,
  isSubscribed,
  setIsSubscriptionModalOpen,
}: {
  audioUrl: string;
  textContent: string;
  selectedVoice: string;
  isSubscribed: boolean;
  setIsSubscriptionModalOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { data, isPending } = useTextToAudio({
    content: textContent,
    voiceId: selectedVoice,
  });
  const player = useAudioPlayer(data?.audioUrl ?? audioUrl);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    player.pause();
    setIsPlaying(false);
  }, [selectedVoice]);

  const playAudio = () => {
    if (!isSubscribed) {
      setIsSubscriptionModalOpen(true);
      return;
    }
    if (isPlaying) {
      setIsPlaying(false);
      player.pause();
      return;
    }
    setIsPlaying(true);
    player.play();
  };

  return (
    <Pressable
      disabled={isPending}
      onPress={playAudio}
      className={`${isPending || !isSubscribed ? "bg-white/50" : " bg-white"} rounded-full h-20 flex flex-row justify-between items-center px-2`}
    >
      <View className="flex flex-row gap-x-2 items-center">
        <View
          className={`size-12 rounded-full flex flex-col justify-center items-center ${isSubscribed ? "bg-blue" : "bg-blue/70"}`}
        >
          <Ionicons name="volume-medium-outline" size={24} color="white" />
        </View>
        <Text
          className={`font-[quilka] text-xl ${!isSubscribed ? "text-black/60" : "text-black"}`}
        >
          {isPending
            ? "Loading voice"
            : isPlaying
              ? "Mute Voice"
              : "Play Voice"}
        </Text>
      </View>
      <View className="flex flex-row gap-x-3 items-center">
        <View className="bg-[#FFF8D2] h-6 px-3 flex justify-center items-center rounded-full">
          <Text className="font-[abeezee] text-xs text-center text-black">
            Premium
          </Text>
        </View>
        {isPending ? (
          <ActivityIndicator size={"large"} />
        ) : (
          <Switch value={isPlaying} onValueChange={playAudio} />
        )}
      </View>
    </Pressable>
  );
};

export default StoryAudioPlayer;
