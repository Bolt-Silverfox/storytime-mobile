import { icons } from "lucide-react-native";
import { Pressable } from "react-native";

type IconName = keyof typeof icons;

const Icon = ({
  name,
  color,
  size,
  onPress,
}: {
  name: IconName;
  color?: string;
  size?: number;
  onPress?: () => void;
}) => {
  const LucideIcon = icons[name];
  return (
    <Pressable onPress={onPress}>
      <LucideIcon color={color} size={size} />;
    </Pressable>
  );
};

export default Icon;
