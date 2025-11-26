import { Pressable, Text } from "react-native";

const CustomButton = ({
  text,
  onPress,
  color,
}: {
  text: string;
  onPress?: () => void;
  color?: string;
}) => {
  return (
    <Pressable
      style={{ backgroundColor: color }}
      onPress={onPress}
      className="bg-primary mx-5 sm:w-full py-4 rounded-full mt-4 max-w-screen-sm sm:mx-auto"
    >
      <Text className="text-center text-white font-[abeezee]">{text}</Text>
    </Pressable>
  );
};

export default CustomButton;
