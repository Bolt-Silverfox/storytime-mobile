import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  ImageBackground,
  Image,
} from "react-native";
import Icon from "../../../components/Icon";
import { useState } from "react";
import { BlurView } from "expo-blur";
import SelectReadingVoiceModal from "../../../components/modals/SelectReadingVoiceModal";

const NewPlainStoryMode = () => {
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  return (
    <ScrollView contentContainerClassName="flex min-h-full bg-purple">
      <ImageBackground
        source={require("../../../assets/images/recommended_stories/the_bear_and_his_friends.jpg")}
        resizeMode="cover"
        className="p-4 flex-1 flex flex-col "
      >
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
      <SelectReadingVoiceModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
      />
    </ScrollView>
  );
};

export default NewPlainStoryMode;

const styles = StyleSheet.create({
  screen: { flex: 1 },
});
