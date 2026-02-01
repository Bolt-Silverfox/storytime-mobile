import { useNavigation } from "@react-navigation/native";
import { Image, Pressable, Text, View } from "react-native";
import { ProtectedRoutesNavigationProp } from "../../../Navigation/ProtectedNavigator";
import Icon from "../../Icon";
import CustomButton from "../../UI/CustomButton";

type PropTypes = {
  isOpen: boolean;
  readAgain: () => void;
  storyTitle: string;
  results: Array<boolean | null>;
};
const EndOfQuizMessage = ({
  readAgain,
  isOpen,
  storyTitle,
  results,
}: PropTypes) => {
  const navigator = useNavigation<ProtectedRoutesNavigationProp>();
  if (!isOpen) return null;
  return (
    <View className="flex flex-col gap-y-5 rounded-3xl bg-white p-4">
      <Image
        source={require("../../../assets/images/medal_emoji.png")}
        className="size-[105px] self-center"
        alt="Congratulations emoji"
      />
      <Text className="text-center font-[quilka] text-xl">
        Congratulations on successfully completing a story
      </Text>
      <Text className="text-center font-[abeezee] text-base text-text">
        You have walked through the eye of the needle and successfully completed
        "{storyTitle}" and answered the questions.
      </Text>
      <View className="border-y border-y-border-light py-5">
        <View className="flex flex-col gap-y-4 rounded-3xl bg-blue p-5">
          <Text className="font-[abeezee] text-base text-white">
            Your test result
          </Text>
          <View className="flex flex-row flex-wrap justify-center gap-4">
            {results.map((result, idx) => (
              <View key={idx} className="flex flex-col items-center gap-y-2">
                <Text className="text-center font-[abeezee] text-base text-[#B89DFD]">
                  Question
                </Text>
                <Text className="text-center font-[abeezee] text-base text-[#B89DFD]">
                  {idx + 1}
                </Text>
                <Pressable
                  className={`flex size-10 items-center justify-center rounded-full ${result ? "bg-white" : "bg-red-600"}`}
                >
                  <Icon
                    name={result ? "Check" : "X"}
                    color={result ? "#4807EC" : "white"}
                  />
                </Pressable>
              </View>
            ))}
          </View>
        </View>
      </View>
      <View className="flex flex-col gap-y-3">
        <CustomButton
          text="Go home"
          onPress={() =>
            navigator.replace("parents", {
              screen: "home",
              params: { screen: "homePage" },
            })
          }
        />
        <CustomButton text="Read story again" transparent onPress={readAgain} />
      </View>
    </View>
  );
};

export default EndOfQuizMessage;
