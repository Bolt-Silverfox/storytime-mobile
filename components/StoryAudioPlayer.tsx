import Ionicons from "@expo/vector-icons/Ionicons";
import { useAudioPlayer } from "expo-audio";
import { Pressable, Switch, Text, View } from "react-native";

const StoryAudioPlayer = ({ audioUrl }: { audioUrl: string }) => {
  const player = useAudioPlayer(audioUrl);
  return (
    <View className="bg-white rounded-full h-20 flex flex-row justify-between items-center px-2">
      <View className="flex flex-row gap-x-2 items-center">
        <Pressable className="bg-blue size-12 rounded-full flex flex-col justify-center items-center">
          <Ionicons name="volume-medium-outline" size={24} color="white" />
        </Pressable>
        <Text className="font-[quilka] text-xl">Mute Voice</Text>
      </View>
      <Pressable onPress={() => player.play()}>
        <Switch value={true} />
      </Pressable>
    </View>
  );
};

export default StoryAudioPlayer;
