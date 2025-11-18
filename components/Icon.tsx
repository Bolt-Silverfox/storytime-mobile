import { icons } from "lucide-react-native";

type IconName = keyof typeof icons;

const Icon = ({
  name,
  color,
  size,
}: {
  name: IconName;
  color?: string;
  size?: number;
}) => {
  const LucideIcon = icons[name];
  return <LucideIcon color={color} size={size} />;
};

export default Icon;
