import { BlurView } from "expo-blur";
import { useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import Icon from "../../../components/Icon";
import SelectReadingVoiceModal from "../../../components/modals/SelectReadingVoiceModal";
import EndOfQuizMessage from "../../../components/modals/storyModals/EndOfQuizMessage";
import EndOfStoryMessage from "../../../components/modals/storyModals/EndOfStoryMessage";
import InStoryOptionsModal from "../../../components/modals/storyModals/InStoryOptionsModal";
import QuestionTabs from "../../../components/modals/storyModals/QuestionsTabs";
import CustomButton from "../../../components/UI/CustomButton";

// EXTRACT TO REDUCERS LATER
const NewInteractiveStoryModeScreen = () => {
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [showQuizMessage, setShowQuizMessage] = useState(false);
  const [showEndOfStoryMessage, setShowEndOfStoryMessage] = useState(false);

  return (
    <ScrollView contentContainerClassName="flex min-h-full">
      <ImageBackground
        source={require("../../../assets/images/recommended_stories/the_bear_and_his_friends.jpg")}
        resizeMode="cover"
        className="p-4 flex-1 flex flex-col "
      >
        <Pressable
          onPress={() => setIsOptionsModalOpen(true)}
          className="size-10 self-end rounded-full border border-[#5E4404] flex justify-center items-center"
        >
          <Icon color="#5E4404" name="EllipsisVertical" />
        </Pressable>
        <Text className="font-[quilka] text-[#5E4404] text-2xl">
          The bear and his friends in the forest
        </Text>
        <View className="flex justify-end flex-1 flex-col gap-y-3">
          <View className="bg-white rounded-full h-20 flex flex-row justify-between items-center px-2">
            <View className="flex flex-row gap-x-2 items-center">
              <Text className="font-[quilka] text-xl">Fanice</Text>
              <Icon
                name="SquarePen"
                size={20}
                onPress={() => setIsVoiceModalOpen(true)}
              />
            </View>
            <Image
              source={require("../../../assets/recording-in-progress.png")}
              className="h-12 w-12"
            />
          </View>
          <BlurView
            intensity={60}
            tint="systemMaterialDark"
            className="rounded-lg overflow-hidden backdrop-blur-md py-8 px-4"
          >
            <Text className="text-xl font-[quilka] text-white">
              Once upon a time, in a bright green forest full of tall trees and
              singing birds. there lived a kind, fluffy bear named Bobo. Bobo
              loved the forest. He loved the soft grass, the sweet berries and
              most of all--his friends
            </Text>
            <CustomButton
              text="Finish story"
              onPress={() => setShowEndOfStoryMessage(true)}
            />
          </BlurView>
          <EndOfStoryMessage
            isOpen={showEndOfStoryMessage}
            onTestKnowledge={() => {
              setShowEndOfStoryMessage(false);
              setShowQuestions(true);
            }}
            storyTitle="The bear nad his friends in the forest"
          />
          <EndOfQuizMessage
            isOpen={showQuizMessage}
            onClose={() => setShowQuizMessage(false)}
            storyTitle="The bear and his fiends in the forest"
          />
          <QuestionTabs
            isOpen={showQuestions}
            onClose={() => setShowQuestions(false)}
            handleOpenSuccessMessage={() => setShowQuizMessage(true)}
          />
        </View>
      </ImageBackground>
      <SelectReadingVoiceModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
      />
      <InStoryOptionsModal
        isOptionsModalOpen={isOptionsModalOpen}
        setIsOptionsModalOpen={setIsOptionsModalOpen}
      />
    </ScrollView>
  );
};

export default NewInteractiveStoryModeScreen;
