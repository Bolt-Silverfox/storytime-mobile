import { Image, ImageSourcePropType, Text, View } from "react-native";
import CustomButton from "../UI/CustomButton";

type PropTypes = {
  message: string;
  onPress?: () => void;
  buttonText?: string;
  url?: ImageSourcePropType;
  secondaryMessage?: string;
};
const CustomEmptyState = ({
  message,
  onPress,
  buttonText,
  url,
  secondaryMessage,
}: PropTypes) => {
  return (
    <View className="flex flex-1 justify-center items-center gap-y-4">
      {url && <Image source={url} className="h-[156px] w-[156px]" />}
      <Text className="font-[abeezee] text-xl text-center text-black">
        {message}
      </Text>
      {secondaryMessage && (
        <Text className="font-[abeezee] text-text text-sm">
          {secondaryMessage}
        </Text>
      )}
      {buttonText && onPress && (
        <CustomButton text={buttonText} onPress={onPress} />
      )}
    </View>
  );
};

export default CustomEmptyState;
