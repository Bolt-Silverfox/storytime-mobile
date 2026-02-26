import { BlurView } from "expo-blur";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Pressable, Text, View, ViewStyle } from "react-native";
import Animated, { AnimatedStyle } from "react-native-reanimated";
import { CONTROLS_FADE_MS } from "../constants";
import { Story } from "../types";
import Icon from "./Icon";
import StoryAudioPlayer from "./StoryAudioPlayer";
import ProgressBar from "./UI/ProgressBar";
import EndOfQuizMessage from "./modals/storyModals/EndOfQuizMessage";
import EndOfStoryMessage from "./modals/storyModals/EndOfStoryMessage";
import StoryQuiz from "./modals/storyModals/StoryQuiz";
import { splitByWordCountPreservingSentences } from "../utils/utils";

type PropTypes = {
  story: Story;
  isInteractive: boolean;
  activeParagraph: number;
  selectedVoice: string | null;
  setActiveParagraph: Dispatch<SetStateAction<number>>;
  onProgress: (progress: number, completed: boolean) => void;
  controlsInteractive: boolean;
  controlsVisible: boolean;
  animatedControlsStyle: AnimatedStyle<ViewStyle>;
  isTTSDegraded: boolean;
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
  onProgress,
  selectedVoice,
  controlsInteractive,
  controlsVisible,
  animatedControlsStyle,
  isTTSDegraded,
}: PropTypes) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentlyDisplayed, setCurrentlyDisplayed] =
    useState<DisplayOptions>("story");
  // Collapse control layout after fade-out so text drops to bottom
  const [controlsInLayout, setControlsInLayout] = useState(true);

  useEffect(() => {
    if (controlsVisible) {
      // Restore layout immediately before fade-in starts
      setControlsInLayout(true);
    } else {
      // Remove from layout after fade-out completes + small buffer
      const timer = setTimeout(
        () => setControlsInLayout(false),
        CONTROLS_FADE_MS + 20,
      );
      return () => clearTimeout(timer);
    }
  }, [controlsVisible]);
  const [quizResults, setQuizResults] = useState<Array<boolean | null>>(
    new Array(story.questions.length).fill(null)
  );
  const isAdvancingRef = useRef(false);
  const activeParagraphRef = useRef(activeParagraph);

  // Keep ref in sync so the stable callback always sees the latest value
  useEffect(() => {
    activeParagraphRef.current = activeParagraph;
    // Reset the advancing guard once React has committed the new page
    isAdvancingRef.current = false;
  }, [activeParagraph]);

  const paragraphs = useMemo(
    () => splitByWordCountPreservingSentences(story.textContent, 30),
    [story.textContent]
  );

  const storyLength = paragraphs.length - 1;
  const isLastParagraph = activeParagraph === storyLength;
  const isFirstParagraph = activeParagraph === 0;

  useEffect(() => {
    if (isLastParagraph) {
      onProgress(paragraphs.length, true);
    }
  }, [isLastParagraph, paragraphs.length, onProgress]);

  const readAgain = () => {
    setCurrentlyDisplayed("story");
    setActiveParagraph(0);
  };

  // Stable callback — no dependencies that change per page.
  // Uses refs to read the latest activeParagraph, and a guard to prevent double-firing.
  const handlePageAudioFinished = useCallback(() => {
    // Prevent double-advance if the listener fires twice before React re-renders
    if (isAdvancingRef.current) return;

    const current = activeParagraphRef.current;
    if (current >= storyLength) {
      setIsPlaying(false);
      return;
    }

    isAdvancingRef.current = true;
    const next = current + 1;
    setActiveParagraph(next);
    onProgress(next + 1, false);
    setIsPlaying(true);
  }, [storyLength, setActiveParagraph, onProgress]);

  const handleManualNavigation = (direction: "next" | "prev") => {
    // Manual navigation pauses audio
    if (isPlaying) {
      setIsPlaying(false);
    }

    if (direction === "next") {
      if (isLastParagraph) {
        setCurrentlyDisplayed("endOfStoryMessage");
        onProgress(paragraphs.length, true);
        return;
      }
      setActiveParagraph((a) => {
        const next = a + 1;
        onProgress(next + 1, false);
        return next;
      });
    } else {
      setActiveParagraph((a) => a - 1);
    }
  };

  return (
    <View className="flex flex-1 flex-col justify-end gap-y-3">
      {currentlyDisplayed === "story" && (
        <View
          style={
            !controlsInLayout ? { height: 0, overflow: "hidden" } : undefined
          }
        >
          <Animated.View
            style={animatedControlsStyle}
            pointerEvents={controlsInteractive ? "auto" : "none"}
          >
            <StoryAudioPlayer
              textContent={paragraphs[activeParagraph]}
              nextPageContent={
                activeParagraph < storyLength
                  ? paragraphs[activeParagraph + 1]
                  : null
              }
              selectedVoice={selectedVoice}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              onPageFinished={handlePageAudioFinished}
              storyId={story.id}
            />
          </Animated.View>
          {isTTSDegraded && (
            <View className="mt-2 flex flex-row items-center gap-x-2 rounded-lg bg-amber-500/90 px-3 py-2">
              <Icon name="TriangleAlert" size={16} color="white" />
              <Text className="flex-1 font-[abeezee] text-xs text-white">
                Audio quality may be reduced due to service issues.
              </Text>
            </View>
          )}
        </View>
      )}
      {currentlyDisplayed === "story" && (
        <View>
          <BlurView
            intensity={60}
            tint="systemMaterialDark"
            className="overflow-hidden rounded-lg px-4 py-8 backdrop-blur-md"
          >
            <Text className="font-[quilka] text-xl text-white">
              {paragraphs[activeParagraph]}
            </Text>
          </BlurView>
        </View>
      )}
      {currentlyDisplayed === "story" && controlsInLayout && (
        <Animated.View
          style={animatedControlsStyle}
          pointerEvents={controlsInteractive ? "auto" : "none"}
          className="flex flex-col gap-y-3"
        >
          <View className="flex flex-row items-center justify-between">
            <Pressable
              onPress={
                !isFirstParagraph
                  ? (e) => {
                      e.stopPropagation();
                      handleManualNavigation("prev");
                    }
                  : undefined
              }
              className={`flex size-12 items-center justify-center rounded-full ${isFirstParagraph ? "bg-transparent" : "bg-blue"}`}
            >
              {!isFirstParagraph && <Icon name="SkipBack" color="white" />}
            </Pressable>
            {!isLastParagraph ? (
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  handleManualNavigation("next");
                }}
                className="flex size-12 items-center justify-center rounded-full bg-blue"
              >
                <Icon name="SkipForward" color="white" />
              </Pressable>
            ) : (
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  setCurrentlyDisplayed("endOfStoryMessage");
                  onProgress(paragraphs.length, true);
                }}
                className="flex h-12 items-center justify-center rounded-full bg-blue px-6"
              >
                <Text className="font-[abeezee] text-sm text-white">
                  Finish story
                </Text>
              </Pressable>
            )}
          </View>
          <View className="rounded-2xl bg-white p-4">
            <ProgressBar
              backgroundColor="#4807EC"
              currentStep={activeParagraph + 1}
              label="Page"
              totalSteps={paragraphs.length}
              height={11}
            />
          </View>
        </Animated.View>
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
    </View>
  );
};

export default StoryContentContainer;
