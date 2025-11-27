import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Pressable,
  Switch,
} from "react-native";
import Icon from "./Icon";
import CustomButton from "./UI/CustomButton";
import { useAudioPlayer } from "../hooks/others/useAudioPlayer";
import useSetPreferredVoice from "../hooks/tanstack/mutationHooks/useSetPreferredVoice";
import ErrorComponent from "./ErrorComponent";
import useGetVoices from "../hooks/tanstack/queryHooks/useGetVoices";
import { useState } from "react";
import useUpdateKids from "../hooks/tanstack/mutationHooks/useUpdateKids";

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
  const { play, isLoading } = useAudioPlayer();
  const { isPending: isSaving, mutate } = useUpdateKids({ id: childId });
  const { error, data, refetch } = useGetVoices();

  if (error)
    return <ErrorComponent message={error.message} refetch={refetch} />;
  return (
    <View className="flex flex-1 flex-col  mx-2">
      <FlatList
        data={data}
        contentContainerClassName="flex flex-row gap-4 flex-wrap"
        keyExtractor={(data) => data.voice_id}
        renderItem={({ item }) => (
          <View className="bg-white rounded-3xl flex flex-col gap-y-4 px-2 py-4  w-[180px]">
            <Text className="text-black text-center font-[quilka] text-xl">
              {item.name}
            </Text>
            <Text className="text-text w-full text-center font-[abeezee]">
              {item.description}
            </Text>
            <View className="flex flex-row justify-between items-center">
              <Pressable
                onPress={() => {
                  setCurrentlyPlayingId(item.voice_id);
                  play(item.preview_url);
                }}
                className="border px-4 py-2 rounded-full border-black/60"
              >
                <Icon name="Volume2" size={17} />
              </Pressable>
              <Switch
                value={selectedVoice === item.voice_id}
                onValueChange={() => setSelectedVoice(item.voice_id)}
              />
            </View>
            {isLoading && currentlyPlayingId === item.voice_id && (
              <Text className="text-center font-[abeezee]">Loading...</Text>
            )}
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

const styles = StyleSheet.create({
  screen: { flex: 1 },
});
