import { memo, useMemo } from "react";
import { ScrollView, View } from "react-native";
import { sortStoriesByReadStatus } from "../utils/sortStories";
import { Story } from "../types";
import StoryItem from "./parents/StoryItem";

type PropTypes = {
  stories: Story[];
};
const StoryCarousel = memo(({ stories }: PropTypes) => {
  const sorted = useMemo(() => sortStoriesByReadStatus(stories), [stories]);

  return (
    <View className="mx-auto w-full max-w-screen-md">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="flex bg-bg-light flex-row gap-x-3"
      >
        {sorted.map((story) => (
          <StoryItem key={story.id} story={story} />
        ))}
      </ScrollView>
    </View>
  );
});

export default StoryCarousel;
