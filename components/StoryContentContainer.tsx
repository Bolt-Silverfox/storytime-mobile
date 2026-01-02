import { BlurView } from "expo-blur";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Story } from "../types";
import Icon from "./Icon";
import CustomButton from "./UI/CustomButton";
import EndOfQuizMessage from "./modals/storyModals/EndOfQuizMessage";
import EndOfStoryMessage from "./modals/storyModals/EndOfStoryMessage";
import StoryQuiz from "./modals/storyModals/StoryQuiz";

type PropTypes = {
  story: Story;
  isInteractive?: boolean;
};

type DisplayOptions =
  | "story"
  | "endOfStoryMessage"
  | "quiz"
  | "endOfQuizMessage";

const StoryContentContainer = ({ story, isInteractive = false }: PropTypes) => {
  const paragraphs = story.textContent.split(/\n\s*\n/);
  const [activeParagraph, setActiveParagraph] = useState(0);
  const [currentlyDisplayed, setCurrentlyDisplayed] =
    useState<DisplayOptions>("story");
  const [quizResults, setQuizResults] = useState<Array<boolean | null>>(
    new Array().fill(story.questions.length)
  );

  const storyLength = paragraphs.length - 1;
  const isLastStory = activeParagraph === storyLength;
  const isFirstStory = activeParagraph === 0;

  const readAgain = () => {
    setCurrentlyDisplayed("story");
    setActiveParagraph(0);
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
          <View className="flex flex-row justify-between items-center">
            <Pressable
              disabled={isFirstStory}
              onPress={() => setActiveParagraph((a) => a - 1)}
              className={`size-10 rounded-full justify-center flex items-center ${isFirstStory ? "bg-white/30" : "bg-white"}`}
            >
              <Icon name="ChevronLeft" />
            </Pressable>
            <Pressable
              disabled={isLastStory}
              onPress={() => setActiveParagraph((a) => a + 1)}
              className={`size-10 rounded-full justify-center flex items-center ${isLastStory ? "bg-white/30" : "bg-white"}`}
            >
              <Icon name="ChevronRight" />
            </Pressable>
          </View>
          {isLastStory && isInteractive && (
            <CustomButton
              text="Finish"
              onPress={() => setCurrentlyDisplayed("endOfStoryMessage")}
            />
          )}
        </BlurView>
      )}
      <EndOfStoryMessage
        isOpen={currentlyDisplayed === "endOfStoryMessage"}
        onTestKnowledge={() => setCurrentlyDisplayed("quiz")}
        readAgain={readAgain}
        storyTitle="The bear nad his friends in the forest"
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
        storyTitle="The bear and his fiends in the forest"
      />
    </View>
  );
};

export default StoryContentContainer;
