import { ScrollView, View } from "react-native";
import StoryItemSkeleton from "./StoryItemSeleton";

type PropTypes = {
  variant?: "vertical" | "horizontal";
};

const StoryCarouselSkeleton = ({ variant }: PropTypes) => {
  if (variant === "vertical")
    return (
      <View className="flex">
        <ScrollView
          className="-mt-4 rounded-t-3xl bg-white pt-5"
          contentContainerClassName="flex flex-col px-4 pb-5"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex flex-row flex-wrap gap-x-3 gap-y-6 rounded-t-3xl py-6">
            {Array.from({ length: 10 }).map((_, index) => (
              <StoryItemSkeleton isGrouped key={index} />
            ))}
          </View>
        </ScrollView>
      </View>
    );

  return (
    <View className="flex">
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
