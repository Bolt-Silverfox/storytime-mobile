import { Pressable, Text } from "react-native";

const CustomButton = ({
  text,
  onPress,
  disabled,
  bgColor,
  textColor,
  borderColor,
  borderWidth,
  transparent = false,
}: {
  text: string;
  disabled?: boolean;
  onPress?: () => void;
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
  borderWidth?: number;
  transparent?: boolean;
}) => {
  if (transparent) {
    return (
      <Pressable
        onPress={onPress}
        className="border max-w-sm flex w-full flex-row justify-center items-center h-10 rounded-full"
      >
        <Text className="font-[abeezee] text-black text-base">{text}</Text>
      </Pressable>
    );
  }
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
      className="self-center mx-5 max-w-sm w-full py-4 rounded-full mt-4  sm:mx-auto bg-primary"
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
