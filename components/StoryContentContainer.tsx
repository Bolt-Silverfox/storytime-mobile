import { BlurView } from "expo-blur";
import { Dispatch, SetStateAction, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SUBSCRIPTION_STATUS, USER_ROLES } from "../constants/ui";
import useGetUserProfile from "../hooks/tanstack/queryHooks/useGetUserProfile";
import { Story } from "../types";
import Icon from "./Icon";
import StoryAudioPlayer from "./StoryAudioPlayer";
import CustomButton from "./UI/CustomButton";
import ProgressBar from "./UI/ProgressBar";
import EndOfQuizMessage from "./modals/storyModals/EndOfQuizMessage";
import EndOfStoryMessage from "./modals/storyModals/EndOfStoryMessage";
import StoryQuiz from "./modals/storyModals/StoryQuiz";
import SubscriptionModal from "./modals/SubscriptionModal";

type PropTypes = {
  story: Story;
  isInteractive: boolean;
  paragraphs: string[];
  activeParagraph: number;
  selectedVoice: string | null;
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
  selectedVoice,
}: PropTypes) => {
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [currentlyDisplayed, setCurrentlyDisplayed] =
    useState<DisplayOptions>("story");
  const [quizResults, setQuizResults] = useState<Array<boolean | null>>(
    new Array(story.questions.length).fill(null)
  );
  const { data } = useGetUserProfile();

  const isSubscribed =
    data?.subscriptionStatus === SUBSCRIPTION_STATUS.active ||
    data?.role === USER_ROLES.admin;

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
    <View className="flex flex-1 flex-col justify-end gap-y-3">
      {currentlyDisplayed === "story" && (
        <StoryAudioPlayer
          audioUrl={story.audioUrl}
          textContent={story.textContent}
          selectedVoice={selectedVoice}
          isSubscribed={isSubscribed}
          setIsSubscriptionModalOpen={setIsSubscriptionModalOpen}
        />
      )}
      {currentlyDisplayed === "story" && (
        <BlurView
          intensity={60}
          tint="systemMaterialDark"
          className="overflow-hidden rounded-lg px-4 py-8 backdrop-blur-md"
        >
          <Text className="font-[quilka] text-xl text-white">
            {paragraphs[activeParagraph]}
          </Text>
          <View className="mt-4 flex flex-row items-center justify-between">
            <Pressable
              onPress={
                !isFirstParagraph
                  ? () => setActiveParagraph((a) => a - 1)
                  : null
              }
              className={`flex size-12 items-center justify-center rounded-full ${isFirstParagraph ? "bg-inherit" : "bg-blue"}`}
            >
              {!isFirstParagraph && <Icon name="SkipBack" color="white" />}
            </Pressable>
            <Pressable
              onPress={handleNextParagraph}
              className={`flex items-center justify-center ${isLastParagraph ? "rounded-xl" : isSubscribed ? "size-12 rounded-full bg-blue" : "size-12 rounded-full bg-blue/50"}`}
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
      {currentlyDisplayed === "story" && (
        <View className="rounded-2xl bg-white p-4">
          <ProgressBar
            backgroundColor="#4807EC"
            currentStep={activeParagraph + 1}
            label="Page"
            totalSteps={paragraphs.length}
            height={11}
          />
        </View>
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
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
      />
    </View>
  );
};

export default StoryContentContainer;
