import { Image, Text, View } from "react-native";
import CustomButton from "../../UI/CustomButton";

type Props = {
  storyTitle: string;
  onTestKnowledge: () => void;
  isOpen: boolean;
};
const EndOfStoryMessage = ({ storyTitle, onTestKnowledge, isOpen }: Props) => {
  if (!isOpen) return null;
  return (
    <View className="flex flex-col p-4 gap-y-5 rounded-3xl bg-white">
      <Image
        source={require("../../../assets/images/congratulations_image.png")}
        className="size-[105px]"
        alt="Congratulations emoji"
      />
      <Text className="font-[quilka] text-xl">
        Congratulations! You have successfully completed "{storyTitle}".
      </Text>
      <Text className="font-[abeezee] text-text text-base">
        Test your knowledge on the story you just completed and see how well you
        did.
      </Text>
      <View className="flex flex-col gap-y-3">
        <CustomButton text="Test knowledge" onPress={onTestKnowledge} />
        <CustomButton text="Read story again" transparent />
      </View>
    </View>
  );
};

export default EndOfStoryMessage;
