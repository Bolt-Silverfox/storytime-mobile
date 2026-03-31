import { useNavigation } from "@react-navigation/native";
import { Image, Text, View } from "react-native";
import { ProtectedRoutesNavigationProp } from "../../../Navigation/ProtectedNavigator";
import { GuestNavigatorProp } from "../../../Navigation/GuestNavigator";
import CustomButton from "../../UI/CustomButton";
import useAuth from "../../../contexts/AuthContext";

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
  const navigator = useNavigation<ProtectedRoutesNavigationProp | GuestNavigatorProp>();
  const { isGuest } = useAuth();

  const handleGoHome = () => {
    if (isGuest) {
      (navigator as GuestNavigatorProp).reset({
        index: 0,
        routes: [{ name: "guestTabs" }],
      });
    } else {
      (navigator as ProtectedRoutesNavigationProp).replace("parents", {
        screen: "home",
        params: { screen: "homePage" },
      });
    }
  };

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
          onPress={handleGoHome}
        />
      </View>
    </View>
  );
};

export default EndOfStoryMessage;
