import { useState } from "react";
import { Alert, Image, Pressable, Text, View } from "react-native";
import CustomButton from "../../UI/CustomButton";

type QuestionTabsProps = {
  isOpen: boolean;
  onClose: () => void;
  handleOpenSuccessMessage: () => void;
};
const QuestionTabs = ({
  isOpen,
  onClose,
  handleOpenSuccessMessage,
}: QuestionTabsProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const isLastQuestion = activeTab === questions.length - 1;
  const currentQuestion = questions[activeTab];

  const handleNext = () => {
    if (selectedOption === null) {
      Alert.alert("Select a valid option");
      return;
    }
    if (isLastQuestion) {
      onClose();
      handleOpenSuccessMessage();
      return;
    }
    setActiveTab((a) => a + 1);
    setSelectedOption(null);
  };

  if (!isOpen) return null;

  return (
    <View className="flex flex-col gap-y-5 p-4 bg-white rounded-3xl">
      <View className="flex flex-row justify-between items-center">
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
        {activeTab + 1}. {currentQuestion.title}
      </Text>
      <View className="flex flex-col gap-y-4">
        {currentQuestion.options.map((option, index) => {
          const isSelected = index === selectedOption;

          return (
            <Pressable
              key={option}
              onPress={() => setSelectedOption(index)}
              className="flex-row items-center gap-x-5 py-1 px-4 rounded-2xl"
            >
              <View
                className={`w-6 h-6 rounded-full p-[1px] border-2 flex items-center justify-center ${isSelected ? "border-yellow" : "border-gray-300"}`}
              >
                {isSelected && (
                  <View className="w-full h-full rounded-full bg-yellow" />
                )}
              </View>
              <View className="flex-row items-center gap-x-3">
                <Text className="text-base text-text capitalize font-[abeezee]">
                  {option}
                </Text>
              </View>
            </Pressable>
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

const questions: Question[] = [
  {
    title: "What is the name of the bear in the story?",
    options: ["Tiko", "Bobo", "Mimi"],
    correctAnswer: "Bobo",
    id: "1",
  },
  {
    title: "Where does Bobo live?",
    options: ["In the ocean", "In the forest", "In the city?"],
    correctAnswer: "In the ocean",
    id: "2",
  },
  {
    title: "Who is Bobo's hopping friend?",
    options: ["Tiko the Turtle", "Lulu the Rabbit", "Mimi the Bird"],
    correctAnswer: "Lulu the Rabbit",
    id: "3",
  },
  {
    title: "What did Lulu lose??",
    options: ["A shoe", "A hat", "A carrot"],
    correctAnswer: "A carrot",
    id: "4",
  },
  {
    title: "Which frieend walks very slowly?",
    options: ["Tiko the Turtle", "Lulu the Rabbit", "Mimi the Bird"],
    correctAnswer: "Tiko the Turtle",
    id: "5",
  },
];

type Question = {
  title: string;
  options: string[];
  correctAnswer: string;
  id: string;
};

export default QuestionTabs;
