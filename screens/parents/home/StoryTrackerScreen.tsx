import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import ProgressBar from "../../../components/parents/ProgressBar"; // adjust path
import useAddFavorites from "../../../hooks/tanstack/mutationHooks/useAddFavorites";
import { Pause, Play } from "lucide-react-native";

type Story = {
  id: string;
  title?: string;
  coverUrl?: string | null;
  content?: string;
  progress?: number; // 0..1 or 0..100
  isFavorited?: boolean;
};

const DEFAULT_COVER = "https://placehold.co/1200x720?text=No+Cover";

const clampProgress = (p?: number) => {
  if (typeof p !== "number") return 0;
  if (p > 1) return Math.min(p / 100, 1);
  return Math.max(0, Math.min(p, 1));
};

const StoryTrackerScreen: React.FC<{
  story: Story;
  kidId: string;
  onPlaybackChange?: (playing: boolean) => void;
}> = ({ story, kidId, onPlaybackChange }) => {
  const [isFavorited, setIsFavorited] = useState<boolean>(!!story.isFavorited);

  const [playing, setPlaying] = useState<boolean>(true);
  const [pendingAction, setPendingAction] = useState<"pause" | "play" | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [actionInProgress, setActionInProgress] = useState(false);

  const progress = clampProgress(story.progress);

  const onToggleRequested = (nextAction: "pause" | "play") => {
    setPendingAction(nextAction);
    setModalVisible(true);
  };

  const confirmAction = useCallback(async () => {
    if (!pendingAction) return;
    setActionInProgress(true);
    try {
      const willPlay = pendingAction === "play";
      setPlaying(willPlay);
      onPlaybackChange?.(willPlay);
      setModalVisible(false);
      setPendingAction(null);
    } catch (err) {
      console.error("Playback action failed", err);
      Alert.alert("Error", "Unable to perform action.");
    } finally {
      setActionInProgress(false);
    }
  }, [pendingAction, onPlaybackChange]);

  const cancelAction = () => {
    setPendingAction(null);
    setModalVisible(false);
  };


  return (
    <View className="flex-1 p-4 bg-white">
      {/* Cover image */}
      <View className="relative">
        <Image
          source={{ uri: story.coverUrl ?? DEFAULT_COVER }}
          className="w-full h-56 rounded-lg bg-gray-200"
          resizeMode="cover"
        />

        {/* Favorite button */}
      </View>

      {/* Title */}
      {story.title ? (
        <Text className="text-xl font-semibold mt-4 text-gray-900">{story.title}</Text>
      ) : null}

      {/* Story text - show up to 7 lines */}
      <Text className="mt-3 text-base leading-6 text-gray-700" numberOfLines={7}>
        {story.content ?? ""}
      </Text>

      {/* Progress bar */}
      <View className="mt-4">
        <ProgressBar progress={progress} />
        <Text className="mt-2 text-sm text-gray-500">{Math.round(progress * 100)}% complete</Text>
      </View>

      {/* Play / Pause controls */}
      <View className="flex-row items-center mt-5">
        <TouchableOpacity
          onPress={() => onToggleRequested(playing ? "pause" : "play")}
          className="p-3 rounded-md bg-black"
          style={{ shadowColor: "#000", shadowOpacity: 0.12, shadowRadius: 2, elevation: 2 }}
          accessibilityLabel={playing ? "Pause" : "Play"}
        >
          {playing ? <Pause size={20} color="#fff" /> : <Play size={20} color="#fff" />}
        </TouchableOpacity>

        <Text className="ml-4 text-base text-gray-800">{playing ? "Playing" : "Paused"}</Text>
      </View>

      {/* Confirmation Modal */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={cancelAction}>
        <View className="flex-1 bg-black/40 justify-center items-center px-4">
          <View className="w-full max-w-md bg-white rounded-lg p-5">
            <Text className="text-lg font-semibold text-gray-900 mb-2">Confirm</Text>
            <Text className="text-gray-700 mb-4">
              Are you sure you want to {pendingAction === "pause" ? "pause" : "play"} this story?
            </Text>

            <View className="flex-row justify-end space-x-3">
              <Pressable onPress={cancelAction} className="px-3 py-2">
                <Text className="text-gray-600">Cancel</Text>
              </Pressable>

              <Pressable
                onPress={confirmAction}
                className="px-3 py-2"
                disabled={actionInProgress}
              >
                {actionInProgress ? (
                  <ActivityIndicator />
                ) : (
                  <Text className="font-semibold text-blue-600">Yes</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default StoryTrackerScreen;
