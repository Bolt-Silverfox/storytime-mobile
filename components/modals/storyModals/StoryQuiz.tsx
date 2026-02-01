import { Dispatch, SetStateAction, useState } from "react";
import { Alert, Image, Pressable, Text, View } from "react-native";
import CustomButton from "../../UI/CustomButton";
import { Story } from "../../../types";

type StoryQuizProps = {
  isOpen: boolean;
  onClose: () => void;
  questions: Story["questions"];
  setQuizResults: Dispatch<SetStateAction<Array<boolean | null>>>;
};
const StoryQuiz = ({
  isOpen,
  onClose,
  questions,
  setQuizResults,
}: StoryQuizProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [results, setResults] = useState<Array<boolean | null>>(
    new Array(questions.length).fill(null)
  );

  const isLastQuestion = activeTab === questions.length - 1;
  const currentQuestion = questions[activeTab];

  const handleNext = () => {
    if (selectedOption === null) {
      Alert.alert("Select a valid option");
      return;
    }

    if (isLastQuestion) {
      setActiveTab(0);
      setSelectedOption(null);
      onClose();
      setQuizResults(results);
      return;
    }
    setActiveTab((a) => a + 1);
    setSelectedOption(null);
  };

  if (!isOpen) return null;

  return (
    <View className="flex flex-col gap-y-5 rounded-3xl bg-white p-4">
      <View className="flex flex-row items-center justify-between">
        <Text className="font-[abeezee] text-base text-black">Question</Text>
        <Text className="font-[quilka] text-xl text-black">
          {activeTab + 1} / {questions.length}
        </Text>
      </View>
      <Image
        source={require("../../../assets/images/grin_sweating_emoji.png")}
        className="size-[105px]"
        alt="Grinning face emoji"
      />
      <Text className="font-[quilka] text-xl text-black">
        {activeTab + 1}. {currentQuestion.question}
      </Text>
      <View className="flex flex-col gap-y-4">
        {currentQuestion.options.map((option, index) => {
          const isSelected = index === selectedOption;
          return (
            <View className="flex flex-col gap-y-4" key={option}>
              <Pressable
                key={option}
                onPress={() => {
                  setSelectedOption(index);
                  setResults((result) =>
                    result.map((r, idx) => {
                      if (idx !== activeTab) return r;
                      return index === currentQuestion.correctOption
                        ? true
                        : false;
                    })
                  );
                }}
                className="flex-row items-center gap-x-5 rounded-2xl px-4 py-1"
              >
                <View
                  className={`flex h-6 w-6 items-center justify-center rounded-full border-2 p-[1px] ${isSelected ? "border-yellow" : "border-gray-300"}`}
                >
                  {isSelected && (
                    <View className="h-full w-full rounded-full bg-yellow" />
                  )}
                </View>
                <View className="flex w-full flex-row items-center gap-x-3">
                  <Text className="flex-1 font-[abeezee] text-base capitalize text-text">
                    {option}
                  </Text>
                </View>
              </Pressable>
            </View>
          );
        })}
      </View>
      <CustomButton
        onPress={handleNext}
        text={!isLastQuestion ? "Next" : "Complete test"}
        transparent
      />
    </View>
  );
};

export default StoryQuiz;
