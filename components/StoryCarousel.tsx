import { FlashList } from "@shopify/flash-list";
import { memo, useCallback } from "react";
import { StyleSheet, View } from "react-native";
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
    <View className="mx-auto w-full max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl">
      <FlashList
        horizontal
        data={filtered}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        drawDistance={500}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        ItemSeparatorComponent={HorizontalSeparator}
      />
    </View>
  );
});

const HorizontalSeparator = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  separator: { width: 12 },
  contentContainer: { paddingVertical: 4 },
});

export default StoryCarousel;
