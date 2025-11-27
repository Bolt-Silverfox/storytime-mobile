import { Pressable, Text } from "react-native";
import colours from "../../colours";

const CustomButton = ({
  text,
  onPress,
  disabled,
  color,
}: {
  text: string;
  disabled?: boolean;
  onPress?: () => void;
  color?: string;
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        color ? { backgroundColor: color } : null,
        disabled && { opacity: 0.5 },
      ]}
      className="bg-primary self-center mx-5 max-sm:max-w-sm w-full py-4 rounded-full mt-4 md:max-w-screen-sm sm:mx-auto"
    >
      <Text className="text-center text-white font-[abeezee]">{text}</Text>
    </Pressable>
  );
};

export default CustomButton;
