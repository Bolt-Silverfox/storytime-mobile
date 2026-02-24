import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import queryGetStories, {
  GetStoriesParam,
} from "../hooks/tanstack/queryHooks/queryGetStories";
import { ProtectedRoutesNavigationProp } from "../Navigation/ProtectedNavigator";
import { AgeGroupType } from "../types";
import useRefreshControl from "../hooks/others/useRefreshControl";
import { sortStoriesByReadStatus } from "../utils/sortStories";
import ErrorComponent from "./ErrorComponent";
import StoryItem from "./parents/StoryItem";
import StoryCarouselSkeleton from "./skeletons/StoryCarouselSkeleton";
import AgeSelectionComponent from "./UI/AgeSelectionComponent";
import CustomButton from "./UI/CustomButton";

type PropTypes = {
  showAges: boolean;
  setSelectedAgeGroup: Dispatch<SetStateAction<AgeGroupType>>;
  selectedAgeGroup: AgeGroupType;
  params: GetStoriesParam;
};
const GroupedStoriesStoryCarousel = ({
  showAges,
  selectedAgeGroup,
  setSelectedAgeGroup,
  params,
}: PropTypes) => {
  const navigator = useNavigation<ProtectedRoutesNavigationProp>();
  const {
    data: stories,
    isPending,
    refetch,
    error,
  } = useQuery(queryGetStories({ ...params, ageGroup: selectedAgeGroup }));

  const { refreshing, onRefresh } = useRefreshControl(refetch);

  if (isPending) return <StoryCarouselSkeleton variant="vertical" />;
  if (error)
    return <ErrorComponent message={error.message} refetch={refetch} />;

  if (!stories?.length) {
    const isFilterDefault = selectedAgeGroup === "All";
    return (
      <View className="flex flex-1 flex-col items-center justify-center gap-y-3 bg-bgLight px-5">
        <Text className="font-[abeezee] text-xl text-black">
          No stories in this category yet
        </Text>
        {isFilterDefault ? (
          <CustomButton text="Go Back" onPress={() => navigator.goBack()} />
        ) : (
          <CustomButton
            transparent
            text="Reset filters"
            onPress={() => setSelectedAgeGroup("All")}
          />
        )}
      </View>
    );
  }

  return (
    <ScrollView
      className="-mt-4 rounded-t-3xl bg-white pt-5"
      contentContainerClassName="flex flex-col px-4 pb-5"
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {showAges && (
        <AgeSelectionComponent
          selectedGroupProp={selectedAgeGroup}
          setSelectedCallback={setSelectedAgeGroup}
        />
      )}
      <View className="flex flex-row flex-wrap gap-x-3 gap-y-6 rounded-t-3xl py-6">
        {sortStoriesByReadStatus(stories).map((story) => (
          <StoryItem key={story.id} story={story} isGrouped />
        ))}
      </View>
    </ScrollView>
  );
};

export default GroupedStoriesStoryCarousel;
