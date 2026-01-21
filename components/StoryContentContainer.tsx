import { BlurView } from "expo-blur";
import { Dispatch, SetStateAction, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Story } from "../types";
import Icon from "./Icon";
import CustomButton from "./UI/CustomButton";
import EndOfQuizMessage from "./modals/storyModals/EndOfQuizMessage";
import EndOfStoryMessage from "./modals/storyModals/EndOfStoryMessage";
import StoryQuiz from "./modals/storyModals/StoryQuiz";
import SubscriptionModal from "./modals/SubscriptionModal";

type PropTypes = {
  story: Story;
  isInteractive: boolean;
  paragraphs: string[];
  activeParagraph: number;
  setActiveParagraph: Dispatch<SetStateAction<number>>;
  onProgress: (progress: number, completed: boolean) => void;
};

type DisplayOptions =
  | "story"
  | "endOfStoryMessage"
  | "quiz"
  | "endOfQuizMessage";

const StoryContentContainer = ({
  story,
  isInteractive,
  setActiveParagraph,
  activeParagraph,
  paragraphs,
  onProgress,
}: PropTypes) => {
  const [isSubsriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [currentlyDisplayed, setCurrentlyDisplayed] =
    useState<DisplayOptions>("story");
  const [quizResults, setQuizResults] = useState<Array<boolean | null>>(
    new Array().fill(story.questions.length)
  );

  const isSubscribed = true;

  const storyLength = paragraphs.length - 1;
  const isLastParagraph = activeParagraph === storyLength;
  const isFirstParagraph = activeParagraph === 0;

  const readAgain = () => {
    setCurrentlyDisplayed("story");
    setActiveParagraph(0);
  };

  const handleNextParagraph = () => {
    if (isLastParagraph) {
      setCurrentlyDisplayed("endOfStoryMessage");
      return;
    }
    if (isSubscribed) {
      setActiveParagraph((a) => {
        const next = a + 1;
        onProgress(next + 1, false);
        return next;
      });
      return;
    }
    setIsSubscriptionModalOpen(true);
  };

  return (
    <View>
      {currentlyDisplayed === "story" && (
        <BlurView
          intensity={60}
          tint="systemMaterialDark"
          className="rounded-lg overflow-hidden backdrop-blur-md py-8 px-4"
        >
          <Text className="text-xl font-[quilka] text-white">
            {paragraphs[activeParagraph]}
          </Text>
          <View className="flex flex-row mt-4 justify-between items-center">
            <Pressable
              onPress={
                !isFirstParagraph
                  ? () => setActiveParagraph((a) => a - 1)
                  : null
              }
              className={`size-12 rounded-full justify-center flex items-center ${isFirstParagraph ? "bg-inherit" : "bg-blue"}`}
            >
              {!isFirstParagraph && <Icon name="SkipBack" color="white" />}
            </Pressable>
            <Pressable
              onPress={handleNextParagraph}
              className={`justify-center flex items-center ${isLastParagraph ? "rounded-xl" : "rounded-full bg-blue size-12"}`}
            >
              {!isLastParagraph ? (
                <Icon name="SkipForward" color="white" />
              ) : (
                <CustomButton
                  text="Finish story"
                  bgColor="#4807EC"
                  onPress={() => {
                    setCurrentlyDisplayed("endOfStoryMessage");
                    onProgress(paragraphs.length, true);
                  }}
                />
              )}
            </Pressable>
          </View>
        </BlurView>
      )}
      <EndOfStoryMessage
        isInteractive={isInteractive}
        isOpen={currentlyDisplayed === "endOfStoryMessage"}
        onTestKnowledge={() => setCurrentlyDisplayed("quiz")}
        readAgain={readAgain}
        storyTitle={story.title}
      />
      <StoryQuiz
        isOpen={currentlyDisplayed === "quiz"}
        onClose={() => setCurrentlyDisplayed("endOfQuizMessage")}
        questions={story.questions}
        setQuizResults={setQuizResults}
      />
      <EndOfQuizMessage
        results={quizResults}
        isOpen={currentlyDisplayed === "endOfQuizMessage"}
        readAgain={readAgain}
        storyTitle={story.title}
      />
      <SubscriptionModal
        isOpen={isSubsriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
      />
    </View>
  );
};

export default StoryContentContainer;
