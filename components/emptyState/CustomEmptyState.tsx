import { Text, View } from "react-native";
import CustomButton from "../UI/CustomButton";

type PropTypes = {
  message: string;
  onPress?: () => void;
  buttonText?: string;
};
const CustomEmptyState = ({ message, onPress, buttonText }: PropTypes) => {
  return (
    <View className="flex flex-1 justify-center items-center gap-y-4">
      <Text className="font-[abeezee] text-xl text-center text-black">
        {message}
      </Text>
      {buttonText && onPress && (
        <CustomButton text={buttonText} onPress={onPress} />
      )}
    </View>
  );
};

export default CustomEmptyState;
