import { Image, Pressable, Text } from "react-native";
import { View } from "react-native";
import CustomButton from "../../UI/CustomButton";
import { useNavigation } from "@react-navigation/native";
import { ParntHomeNavigatorProp } from "../../../Navigation/ParentHomeNavigator";
import Icon from "../../Icon";

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
  const navigator = useNavigation<ParntHomeNavigatorProp>();
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
        "{storyTitle}" and answered the questions.
      </Text>
      <View className="py-5 border-y border-y-border-light">
        <View className="bg-blue rounded-3xl p-5 flex flex-col gap-y-4">
          <Text className="font-[abeezee] text-white text-base">
            Your test result
          </Text>
          <View className="flex flex-row justify-center gap-4 flex-wrap">
            {results.map((result, idx) => (
              <View key={idx} className="flex items-center flex-col gap-y-2">
                <Text className="font-[abeezee] text-center text-[#B89DFD] text-base">
                  Question
                </Text>
                <Text className="font-[abeezee] text-center text-[#B89DFD] text-base">
                  {idx + 1}
                </Text>
                <Pressable
                  className={`size-10 rounded-full flex justify-center items-center ${result ? "bg-white" : "bg-red-600"}`}
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
          onPress={() => navigator.replace("homePage")}
        />
        <CustomButton text="Read story again" transparent onPress={readAgain} />
      </View>
    </View>
  );
};

export default EndOfQuizMessage;
