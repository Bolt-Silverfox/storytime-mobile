import { Pressable, Text } from "react-native";

const CustomButton = ({
  text,
  onPress,
  disabled,
  color,
  className,
}: {
  text: string;
  disabled?: boolean;
  onPress?: () => void;
  color?: string;
  className?: string;
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        color ? { backgroundColor: color } : null,
        disabled && { opacity: 0.5 },
      ]}
      className={`bg-primary w-full py-4 rounded-full ${className || ""}`}
    >
      <Text className="text-center text-white font-[abeezee]">{text}</Text>
    </Pressable>
  );
};

export default CustomButton;
