import { Text, View } from "react-native";
import { Story } from "../types";
import StoryCarousel from "./StoryCarousel";

type PropTypes = {
  stories: Story[];
  title: string;
  onViewAll: () => void;
};

const HomepageStoriesContainer = ({ title, stories, onViewAll }: PropTypes) => {
  return (
    <View className="flex flex-col gap-y-4 border-b border-b-border-light pb-8">
      <View className="flex flex-row max-w-screen-md mx-auto w-full justify-between items-center">
        <Text className="font-[abeezee]  text-base text-black leading-5">
          {title}
        </Text>
        <Text
          onPress={onViewAll}
          className="font-[abeezee]  text-base text-[#0731EC] leading-5"
        >
          View all
        </Text>
      </View>
      <StoryCarousel stories={stories} />
    </View>
  );
};

export default HomepageStoriesContainer;
