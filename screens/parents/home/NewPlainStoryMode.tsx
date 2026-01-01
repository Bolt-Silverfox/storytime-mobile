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
import InStoryOptionsModal from "../../../components/modals/storyModals/InStoryOptionsModal";

const NewPlainStoryMode = () => {
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);

  return (
    <ScrollView contentContainerClassName="flex min-h-full">
      <ImageBackground
        // source={require("../../../assets/images/recommended_stories/the_bear_and_his_friends.jpg")}
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
          </BlurView>
        </View>
      </ImageBackground>
      <InStoryOptionsModal
        isOptionsModalOpen={isOptionsModalOpen}
        setIsOptionsModalOpen={setIsOptionsModalOpen}
      />
      <SelectReadingVoiceModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
      />
    </ScrollView>
  );
};

export default NewPlainStoryMode;
