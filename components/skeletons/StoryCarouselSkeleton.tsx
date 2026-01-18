import { ScrollView } from "react-native";
import StoryItemSkeleton from "./StoryItemSeleton";

const StoryCarouselSkeleton = () => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="flex bg-bgLight mb-3 flex-row gap-x-3"
    >
      {Array.from({ length: 10 }).map((_, index) => (
        <StoryItemSkeleton key={index} />
      ))}
    </ScrollView>
  );
};

export default StoryCarouselSkeleton;
