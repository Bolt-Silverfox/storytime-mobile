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
    <View className="bg-background-soft absolute inset-0 flex flex-col items-center justify-center gap-y-6 p-5">
      <Image
        source={require("../../assets/icons/successful-reset-illustration.png")}
      />
      <Text className="text-fg mt-4 text-center font-[quilka] text-[28px]">
        {message}
      </Text>
      {secondaryMessage && (
        <Text className="text-body mb-4 text-center font-[abeezee] text-base">
          {secondaryMessage}
        </Text>
      )}

      <CustomButton onPress={onProceed} text="Continue" />
    </View>
  );
};

export default SuccessScreen;
