// lucide-react-native v1 dropped the `icons` map from the package root;
// the icon components now live behind the ./icons subpath export.
import * as icons from "lucide-react-native/icons";
import { useTheme } from "../theme/ThemeContext";

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
  const { tokens } = useTheme();
  const LucideIcon = icons[name];
  return (
    <LucideIcon
      onPress={onPress}
      color={color ?? tokens.textStrong}
      size={size}
    />
  );
};

export default Icon;
