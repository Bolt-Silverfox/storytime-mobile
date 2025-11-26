import { Pressable, Text } from "react-native";

const CustomButton = ({
  text,
  onPress,
  disabled,
  color
}: {
  text: string;
  disabled?: boolean;
  onPress?: () => void;
  color?: string;
}) => {
  return (
    <Pressable
      style={{ backgroundColor: color }}
      onPress={onPress}
      className={`${disabled ? "bg-primary/20" : "bg-primary"} mx-5 max-sm:max-w-sm  w-full py-4 rounded-full mt-4 md:max-w-screen-sm sm:mx-auto`}
    >
      <Text className="text-center text-white font-[abeezee]">{text}</Text>
    </Pressable>
  );
};

export default CustomButton;
