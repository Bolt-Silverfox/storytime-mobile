import { Pressable, Text } from "react-native";

const CustomButton = ({
  text,
  onPress,
  disabled,
  bgColor,
  textColor,
  borderColor,
  borderWidth,
}: {
  text: string;
  disabled?: boolean;
  onPress?: () => void;
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
  borderWidth?: number;
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        bgColor ? { backgroundColor: bgColor } : null,
        borderColor ? { borderColor } : null,
        borderWidth ? { borderWidth } : null,
        disabled && { opacity: 0.5 },
      ]}
      className="self-center mx-5 max-sm:max-w-sm w-full py-4 rounded-full mt-4 md:max-w-screen-sm sm:mx-auto bg-primary"
    >
      <Text
        className="text-center font-[abeezee]"
        style={{ color: textColor || "white" }}
      >
        {text}
      </Text>
    </Pressable>
  );
};

export default CustomButton;
