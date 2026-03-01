import { memo, useCallback } from "react";
import { FlatList, View } from "react-native";
import { Story } from "../types";
import StoryItem from "./parents/StoryItem";

type PropTypes = {
  stories: Story[];
};
const keyExtractor = (item: Story) => item.id;

const StoryCarousel = memo(({ stories }: PropTypes) => {
  const filtered = stories.filter((story) => story?.id);

  const renderItem = useCallback(
    ({ item }: { item: Story }) => <StoryItem story={item} />,
    []
  );

  return (
    <View className="mx-auto w-full max-w-screen-md">
      <FlatList
        horizontal
        data={filtered}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: 12,
          paddingVertical: 4,
        }}
        removeClippedSubviews={false}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={7}
      />
    </View>
  );
});

export default StoryCarousel;
