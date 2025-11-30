import React, { useEffect, useRef, useState } from "react";
import { View, Text, FlatList, Switch, ActivityIndicator } from "react-native";
import { useAudioPlayer } from "expo-audio";
import useGetVoices from "../hooks/tanstack/queryHooks/useGetVoices";
import ErrorComponent from "./ErrorComponent";
import SoundItem from "./SoundItem";

type VoiceItem = {
  voice_id: string;
  name: string;
  description?: string;
  preview_url?: string;
};

type Props = {
  currentlyActiveVoiceId?: string | null;
  onSelectVoice?: (id: string | null, name?: string | null) => void;
};

export default function StoryTellerVoice({
  currentlyActiveVoiceId,
  onSelectVoice,
}: Props) {
  const { data = [], error, refetch, isPending } = useGetVoices();
  const [selectedVoice, setSelectedVoice] = useState<string | null>(
    currentlyActiveVoiceId ?? null
  );

  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(
    null
  );
  const [isBuffering, setIsBuffering] = useState(false);

  const player = useAudioPlayer();
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    const subscription = player.addListener(
      "playbackStatusUpdate",
      (status) => {
        if (!mounted.current) return;
        setIsBuffering(Boolean(status.isBuffering));
        if (status.didJustFinish) setCurrentlyPlayingId(null);
      }
    );
    return () => {
      mounted.current = false;
      subscription.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player]);

  useEffect(() => {
    setSelectedVoice(currentlyActiveVoiceId ?? null);
  }, [currentlyActiveVoiceId]);

  const handlePlayVoice = async (voiceId: string, voiceSrc?: string) => {
    try {
      if (currentlyPlayingId === voiceId) {
        await player.seekTo(0);
        await player.play();
        return;
      }
      await player.pause();
      if (voiceSrc) {
        await player.replace(voiceSrc);
        setCurrentlyPlayingId(voiceId);
        await player.play();
      } else {
        setCurrentlyPlayingId(null);
      }
    } catch (err) {
      console.warn("voice playback error:", err);
      setCurrentlyPlayingId(null);
    }
  };

  const handleToggleSelect = (voiceId: string) => {
    const newSelected = selectedVoice === voiceId ? null : voiceId;
    setSelectedVoice(newSelected);

    const selectedItem = (data as VoiceItem[]).find(
      (v) => v.voice_id === newSelected
    );
    if (onSelectVoice) {
      if (newSelected === null) onSelectVoice(null, null);
      else onSelectVoice(newSelected, selectedItem?.name ?? null);
    }
  };

  if (isPending) {
    return (
      <View className="flex-1 items-center justify-center py-8">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return <ErrorComponent message={error.message} refetch={refetch} />;
  }

  return (
    <View className="px-1 flex-1 h-[250px]">
      <FlatList
        data={data as VoiceItem[]}
        keyExtractor={(v) => v.voice_id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 8, gap: 12 }}
        renderItem={({ item }) => {
          const playing = currentlyPlayingId === item.voice_id;
          const selected = selectedVoice === item.voice_id;

          return (
            <View
              className={`w-[48%] mx-1 bg-white rounded-3xl flex-col justify-between ${selected ? "border border-primary px-3 py-6" : "px-3 py-6 "}`}
              style={{ minHeight: 120 }}
            >
              <Text className="text-lg font-[quilka] text-black text-center mb-4">
                {item.name}
              </Text>

              <View className="flex-row items-center justify-between">
                <SoundItem
                  onPlay={() =>
                    handlePlayVoice(item.voice_id, item.preview_url)
                  }
                  isLoading={isBuffering && playing}
                />

                <View className="flex-row items-center gap-2">
                  <Switch
                    value={selected}
                    trackColor={{ false: "#d4d4d4", true: "#4f46e5" }}
                    thumbColor={selected ? "#fff" : "#f4f4f4"}
                    onValueChange={() => handleToggleSelect(item.voice_id)}
                  />
                </View>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}
