import { Image, Text } from "react-native";
import { View } from "react-native";
import CustomButton from "../../UI/CustomButton";

type PropTypes = {
  isOpen: boolean;
  onClose: () => void;
  storyTitle: string;
};
const EndOfQuizMessage = ({ onClose, isOpen, storyTitle }: PropTypes) => {
  const handleGoHome = () => {
    onClose();
  };

  if (!isOpen) return null;
  return (
    <View className="flex flex-col p-4 gap-y-5 rounded-3xl bg-white">
      <Image
        source={require("../../../assets/images/medal_emoji.png")}
        className="size-[105px] self-center"
        alt="Congratulations emoji"
      />
      <Text className="font-[quilka] text-xl text-center">
        Congratulations on successfully completing a story
      </Text>
      <Text className="font-[abeezee] text-center text-text text-base">
        You have walked through the eye of the needle and successfully completed
        "{storyTitle}" and answered the questions correctly.
      </Text>
      <View className="flex flex-col gap-y-3">
        <CustomButton text="Go home" onPress={handleGoHome} />
        <CustomButton text="Read story again" transparent />
      </View>
    </View>
  );
};

export default EndOfQuizMessage;
