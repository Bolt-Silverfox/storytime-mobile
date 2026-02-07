import { useNavigation } from "@react-navigation/native";
import { Dispatch, SetStateAction } from "react";
import { ScrollView, Text, View } from "react-native";
import { ProtectedRoutesNavigationProp } from "../Navigation/ProtectedNavigator";
import { AgeGroupType, Story } from "../types";
import ErrorComponent from "./ErrorComponent";
import StoryItem from "./parents/StoryItem";
import StoryCarouselSkeleton from "./skeletons/StoryCarouselSkeleton";
import AgeSelectionComponent from "./UI/AgeSelectionComponent";
import CustomButton from "./UI/CustomButton";

type PropTypes = {
  showAges: boolean;
  isPending: boolean;
  error: Error | null;
  stories: Story[] | undefined;
  selectedAgeGroup?: AgeGroupType;
  setSelectedAgeGroup?: Dispatch<SetStateAction<AgeGroupType>>;
  refetch: () => void;
};

const GroupedStoriesStoryCarousel = ({
  showAges,
  selectedAgeGroup,
  setSelectedAgeGroup,
  isPending,
  error,
  refetch,
  stories,
}: PropTypes) => {
  const navigator = useNavigation<ProtectedRoutesNavigationProp>();

  if (isPending) return <StoryCarouselSkeleton variant="vertical" />;
  if (error)
    return <ErrorComponent message={error.message} refetch={refetch} />;

  if (!stories?.length) {
    return (
      <View className="flex flex-1 flex-col items-center justify-center gap-y-3 bg-bgLight px-5">
        <Text className="font-[abeezee] text-xl text-black">
          No stories in this category yet
        </Text>
        <CustomButton text="Go Back" onPress={() => navigator.goBack()} />
      </View>
    );
  }

  return (
    <ScrollView
      className="-mt-4 rounded-t-3xl bg-white pt-5"
      contentContainerClassName="flex flex-col px-4 pb-5"
      showsVerticalScrollIndicator={false}
    >
      {showAges && selectedAgeGroup && (
        <AgeSelectionComponent
          selectedGroupProp={selectedAgeGroup}
          setSelectedCallback={setSelectedAgeGroup}
        />
      )}
      <View className="flex flex-row flex-wrap gap-x-3 gap-y-6 rounded-t-3xl py-6">
        {stories.map((story, index) => (
          <StoryItem
            index={index}
            key={story.id}
            onNavigate={() => {
              navigator.navigate("stories", {
                screen: "childStoryDetails",
                params: { storyId: story.id },
              });
            }}
            story={story}
            isGrouped
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default GroupedStoriesStoryCarousel;
