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
  ariaLabel,
}: {
  text: string;
  disabled?: boolean;
  onPress?: () => void;
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
  borderWidth?: number;
  transparent?: boolean;
  ariaLabel?: string;
}) => {
  if (transparent) {
    return (
      <Pressable
        aria-labelledby={ariaLabel}
        onPress={onPress}
        className="border flex w-full flex-row justify-center items-center h-[46px] rounded-full"
      >
        <Text className="font-[abeezee] text-black text-base">{text}</Text>
      </Pressable>
    );
  }
  return (
    <Pressable
      aria-labelledby={ariaLabel}
      onPress={onPress}
      disabled={disabled}
      style={[
        bgColor ? { backgroundColor: bgColor } : null,
        borderColor ? { borderColor } : null,
        borderWidth ? { borderWidth } : null,
        disabled && { opacity: 0.5 },
      ]}
      className="self-center mx-5 w-full flex justify-center items-center h-[46px] rounded-full mt-4  sm:mx-auto bg-primary"
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
