import { ActivityIndicator, Pressable } from "react-native";
import Icon from "./Icon";

const SoundItem = ({
  onPlay,
  isLoading,
}: {
  onPlay: () => void;
  isLoading: boolean;
}) => {
  return (
    <Pressable
      onPress={onPlay}
      className="border px-4 py-2 rounded-full border-black/60"
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#000" />
      ) : (
        <Icon name="Volume2" size={17} />
      )}
    </Pressable>
  );
};

export default SoundItem;
