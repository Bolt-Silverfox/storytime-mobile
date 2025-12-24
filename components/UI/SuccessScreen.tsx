import { Image, Text, View } from "react-native";
import CustomButton from "./CustomButton";

type PropTypes = {
  message: string;
  onProceed: () => void;
  secondaryMessage?: string;
};

const SuccessScreen = ({ message, onProceed, secondaryMessage }: PropTypes) => {
  return (
    <View className="flex-1 w-full gap-y-6 flex flex-col justify-center items-center bg-bgLight">
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
