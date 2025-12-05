import { icons } from "lucide-react-native";
import { Pressable, Text } from "react-native";
import Icon from "../Icon";

type IconName = keyof typeof icons;

type Props = {
  disabled: boolean;
  onPress: () => void;
  text?: string;
  icon?: IconName;
};

const ChildButton = ({ disabled, onPress, text, icon }: Props) => {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      className={`mx-5  flex flex-row justify-center items-center gap-x-4 sm:w-full py-4 rounded-full mt-4 max-w-screen-sm sm:mx-auto ${disabled ? "bg-purple/20" : "bg-purple"}`}
    >
      {text && (
        <Text className="text-center text-white font-[quilka] text-2xl">
          {text ? text : "Continue"}
        </Text>
      )}
      {icon && <Icon name={icon} color="white" />}
    </Pressable>
  );
};

export default ChildButton;
