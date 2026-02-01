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
      <View className="mx-auto flex w-full max-w-screen-md flex-row items-center justify-between">
        <Text className="font-[abeezee]  text-base leading-5 text-black">
          {title}
        </Text>
        <Text
          onPress={onViewAll}
          className="font-[abeezee]  text-base leading-5 text-[#0731EC]"
        >
          View all
        </Text>
      </View>
      <StoryCarousel stories={stories} />
    </View>
  );
};

export default HomepageStoriesContainer;
