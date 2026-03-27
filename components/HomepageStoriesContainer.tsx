import { ActivityIndicator, Text, View } from "react-native";
import { Story } from "../types";
import StoryCarousel from "./StoryCarousel";

type PropTypes = {
  stories: Story[];
  title: string;
  onViewAll: () => void;
  error?: Error | null;
  isPending?: boolean;
};

const HomepageStoriesContainer = ({
  title,
  stories,
  onViewAll,
  error,
  isPending = false,
}: PropTypes) => {
  if (isPending) {
    return (
      <View className="flex flex-1 items-center justify-center py-8">
        <ActivityIndicator size="large" color="#866EFF" />
      </View>
    );
  }

  if (error && (!stories || stories.length === 0)) {
    return (
      <View className="flex flex-1 items-center justify-center py-8">
        <Text className="text-center font-[abeezee] text-text">
          Failed to load stories. Please try again.
        </Text>
      </View>
    );
  }

  if (!stories || stories.length === 0) {
    return (
      <View className="flex flex-1 items-center justify-center py-8">
        <Text className="mb-2 text-center font-[quilka] text-2xl text-black">
          No stories found
        </Text>
        <Text className="text-center font-[abeezee] text-text">
          Try a different category
        </Text>
      </View>
    );
  }

  return (
    <View className="flex flex-col gap-y-4 border-b border-b-border-light pb-8">
      <View className="mx-auto flex w-full max-w-screen-md flex-row items-center justify-between lg:max-w-screen-lg xl:max-w-screen-xl">
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
