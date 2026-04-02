import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Alert, Image, Pressable, Text, View } from "react-native";
import CustomButton from "../../UI/CustomButton";
import { Story } from "../../../types";
import useSubmitQuizAnswer from "../../../hooks/tanstack/mutationHooks/useSubmitQuizAnswer";

type StoryQuizProps = {
  isOpen: boolean;
  onClose: () => void;
  storyId: string;
  questions: Story["questions"];
  setQuizResults: Dispatch<SetStateAction<Array<boolean | null>>>;
};
const StoryQuiz = ({
  isOpen,
  onClose,
  storyId,
  questions,
  setQuizResults,
}: StoryQuizProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [results, setResults] = useState<Array<boolean | null>>(
    new Array(questions?.length ?? 0).fill(null)
  );
  const { mutate: submitAnswer } = useSubmitQuizAnswer();
  const submittedRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (!isOpen) return;

    setActiveTab(0);
    setSelectedOption(null);
    setResults(new Array(questions?.length ?? 0).fill(null));
    submittedRef.current.clear();
  }, [isOpen, storyId, questions?.length]);

  const isLastQuestion = activeTab === (questions?.length ?? 0) - 1;

  const handleNext = () => {
    if (selectedOption === null) {
      Alert.alert("Select a valid option");
      return;
    }

    const questionIndex = activeTab;
    if (submittedRef.current.has(questionIndex)) return;
    submittedRef.current.add(questionIndex);

    submitAnswer(
      {
        questionId: currentQuestion?.id,
        storyId,
        selectedOption,
      },
      {
        onError: () => {
          submittedRef.current.delete(questionIndex);
        },
      }
    );

    // Compute updated results inline to avoid stale state from React batching
    const updatedResults = results.map((r, idx) =>
      idx === activeTab ? selectedOption === currentQuestion.correctOption : r
    );
    setResults(updatedResults);

    if (isLastQuestion) {
      submittedRef.current.clear();
      setActiveTab(0);
      setSelectedOption(null);
      onClose();
      setQuizResults(updatedResults);
      return;
    }
    setActiveTab((a) => a + 1);
    setSelectedOption(null);
  };

  if (!isOpen || !questions || questions.length === 0) return null;

  const currentQuestion = questions[activeTab];

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
