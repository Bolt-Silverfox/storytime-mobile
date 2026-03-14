import { useNavigation } from "@react-navigation/native";
import { Image, Text, View } from "react-native";
import { ProtectedRoutesNavigationProp } from "../../../Navigation/ProtectedNavigator";
import CustomButton from "../../UI/CustomButton";

type Props = {
  storyTitle: string;
  onTestKnowledge: () => void;
  isOpen: boolean;
  readAgain: () => void;
  isInteractive: boolean;
};
const EndOfStoryMessage = ({
  storyTitle,
  onTestKnowledge,
  isOpen,
  readAgain,
  isInteractive,
}: Props) => {
  const navigator = useNavigation<ProtectedRoutesNavigationProp>();
  if (!isOpen) return null;
  return (
    <View className="flex flex-col gap-y-5 rounded-3xl bg-white p-4">
      <Image
        source={require("../../../assets/images/congratulations_image.png")}
        className="size-[105px]"
        alt="Congratulations emoji"
      />
      <Text className="font-[quilka] text-xl">
        Congratulations! You have successfully completed "{storyTitle}".
      </Text>
      <View className="flex flex-col gap-y-3">
        <CustomButton text="Read story again" transparent onPress={readAgain} />
        {isInteractive && (
          <CustomButton text="Test your knowledge" onPress={onTestKnowledge} />
        )}
        <CustomButton
          text="Go home"
          onPress={() =>
            navigator.replace("parents", {
              screen: "home",
              params: { screen: "homePage" },
            })
          }
        />
      </View>
    </View>
  );
};

export default EndOfStoryMessage;
