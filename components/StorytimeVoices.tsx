import { useAudioPlayer } from "expo-audio";
import { useEffect, useState } from "react";
import { FlatList, Switch, Text, View } from "react-native";
import useUpdateKids from "../hooks/tanstack/mutationHooks/useUpdateKids";
import useGetVoices from "../hooks/tanstack/queryHooks/useGetVoices";
import ErrorComponent from "./ErrorComponent";
import SoundItem from "./SoundItem";
import CustomButton from "./UI/CustomButton";

const StorytimeVoices = ({
  currentlyActiveVoiceId,
  childId,
}: {
  currentlyActiveVoiceId: string;
  childId: string;
}) => {
  const [selectedVoice, setSelectedVoice] = useState<null | string>(
    currentlyActiveVoiceId
  );
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const player = useAudioPlayer();

  const { isPending: isSaving, mutate } = useUpdateKids({ id: childId });
  const { error, data, refetch } = useGetVoices();

  useEffect(() => {
    const subscription = player.addListener(
      "playbackStatusUpdate",
      (status) => {
        setIsLoading(status.isBuffering);

        if (status.didJustFinish) {
          setCurrentlyPlayingId(null);
        }
      }
    );

    return () => subscription.remove();
  }, [player]);

  const handlePlayVoice = async (voiceId: string, voiceSrc: string) => {
    if (currentlyPlayingId === voiceId) {
      await player.seekTo(0);
      await player.play();
      return;
    }

    await player.pause();
    player.replace(voiceSrc);
    setCurrentlyPlayingId(voiceId);
    await player.play();
  };

  if (error)
    return <ErrorComponent message={error.message} refetch={refetch} />;

  return (
    <View className="flex flex-1 flex-col">
      <FlatList
        data={data}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="flex flex-row gap-4 flex-wrap justify-center mx-6"
        keyExtractor={(data) => data.voice_id}
        renderItem={({ item }) => (
          <View className="bg-white min-h-[150px] rounded-3xl flex flex-col px-2 py-4 w-[220px]">
            <Text className="text-black text-center font-[quilka] text-xl">
              {item.name}
            </Text>
            <Text className="text-text w-full text-center font-[abeezee]">
              {item.description}
            </Text>
            <View className="flex-1" />

            <View className="flex flex-row justify-between items-center">
              <SoundItem
                onPlay={() => handlePlayVoice(item.voice_id, item.preview_url)}
                isLoading={isLoading && currentlyPlayingId === item.voice_id}
              />
              <Switch
                value={selectedVoice === item.voice_id}
                onValueChange={() => setSelectedVoice(item.voice_id)}
              />
            </View>
          </View>
        )}
      />
      <CustomButton
        onPress={() => mutate({ preferredVoiceId: selectedVoice! })}
        text={isSaving ? "Saving..." : "Save"}
        disabled={isSaving || !selectedVoice}
      />
    </View>
  );
};

export default StorytimeVoices;
