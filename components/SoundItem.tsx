import { ActivityIndicator, Pressable } from "react-native";
import Icon from "./Icon";
import { useTheme } from "../theme/ThemeContext";

const SoundItem = ({
  onPlay,
  isLoading,
}: {
  onPlay: () => void;
  isLoading: boolean;
}) => {
  const { tokens } = useTheme();
  return (
    <Pressable
      onPress={onPlay}
      className="rounded-full border border-fg/60 px-4 py-2"
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={tokens.textStrong} />
      ) : (
        <Icon name="Volume2" size={17} />
      )}
    </Pressable>
  );
};

export default SoundItem;
