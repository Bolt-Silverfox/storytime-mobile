import { Image, Text, View } from "react-native";
import CustomButton from "../../UI/CustomButton";
import { useNavigation } from "@react-navigation/native";
import { ProtectedRoutesNavigationProp } from "../../../Navigation/ProtectedNavigator";

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
  if (!isOpen) return null;
  const navigator = useNavigation<ProtectedRoutesNavigationProp>();
  return (
    <View className="flex flex-col p-4 gap-y-5 mb-3 rounded-3xl bg-white">
      <Image
        source={require("../../../assets/images/congratulations_image.png")}
        className="size-[105px]"
        alt="Congratulations emoji"
      />
      <Text className="font-[quilka] text-xl">
        Congratulations! You have successfully completed "{storyTitle}".
      </Text>
      {isInteractive && (
        <Text className="font-[abeezee] text-text text-base">
          Test your knowledge on the story you just completed and see how well
          you did.
        </Text>
      )}
      <View className="flex flex-col gap-y-3">
        {!isInteractive ? (
          <CustomButton
            text="Take me home"
            onPress={() =>
              navigator.replace("parents", {
                screen: "home",
                params: { screen: "homePage" },
              })
            }
          />
        ) : (
          <CustomButton text="Test knowledge" onPress={onTestKnowledge} />
        )}
        <CustomButton text="Read story again" transparent onPress={readAgain} />
      </View>
    </View>
  );
};

export default EndOfStoryMessage;
