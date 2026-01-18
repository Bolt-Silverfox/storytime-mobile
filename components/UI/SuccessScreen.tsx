import { Image, Text, View } from "react-native";
import CustomButton from "./CustomButton";

type PropTypes = {
  message: string;
  onProceed: () => void;
  secondaryMessage?: string;
  visible: boolean;
};

const SuccessScreen = ({
  message,
  onProceed,
  secondaryMessage,
  visible,
}: PropTypes) => {
  if (!visible) return null;
  return (
    <View className="gap-y-6 inset-0 absolute flex flex-col justify-center p-5 items-center bg-bgLight">
      <Image
        source={require("../../assets/icons/successful-reset-illustration.png")}
      />
      <Text className="font-[quilka] mt-4 text-[28px] text-black text-center">
        {message}
      </Text>
      {secondaryMessage && (
        <Text className="font-[abeezee] mb-4 text-text text-base  text-center">
          {secondaryMessage}
        </Text>
      )}

      <CustomButton onPress={onProceed} text="Continue" />
    </View>
  );
};

export default SuccessScreen;
