import { icons } from "lucide-react-native";

export type IconName = keyof typeof icons;

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
  return <LucideIcon onPress={onPress} color={color} size={size} />;
};

export default Icon;
