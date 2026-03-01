import { FlashList } from "@shopify/flash-list";
import { memo, useCallback } from "react";
import { View } from "react-native";
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
      <FlashList
        horizontal
        data={filtered}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingVertical: 4,
        }}
        ItemSeparatorComponent={HorizontalSeparator}
      />
    </View>
  );
});

const HorizontalSeparator = () => <View style={{ width: 12 }} />;

export default StoryCarousel;
