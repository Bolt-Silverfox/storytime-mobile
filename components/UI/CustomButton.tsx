import { Pressable, StyleSheet, Text } from "react-native";

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
        className="flex h-[46px] w-full flex-row items-center justify-center rounded-full border"
      >
        <Text className="text-center font-[abeezee] text-base text-black">
          {text}
        </Text>
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
        disabled && buttonStyles.disabled,
      ]}
      className="mx-5 mt-4 flex h-[46px] w-full items-center justify-center self-center rounded-full  bg-primary sm:mx-auto"
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

const buttonStyles = StyleSheet.create({
  disabled: {
    opacity: 0.5,
  },
});
