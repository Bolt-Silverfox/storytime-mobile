import { ScrollView, View } from "react-native";
import StoryItemSkeleton from "./StoryItemSeleton";

const StoryCarouselSkeleton = () => {
  return (
    <View className="flex bg-pink-400">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="mb-3 flex-row gap-x-3"
      >
        {Array.from({ length: 10 }).map((_, index) => (
          <StoryItemSkeleton key={index} />
        ))}
      </ScrollView>
    </View>
  );
};

export default StoryCarouselSkeleton;
