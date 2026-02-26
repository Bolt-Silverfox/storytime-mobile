import { useNavigation } from "@react-navigation/native";
import { Dispatch, SetStateAction, useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import useInfiniteStories, {
  InfiniteStoriesParam,
} from "../hooks/tanstack/queryHooks/useInfiniteStories";
import { ProtectedRoutesNavigationProp } from "../Navigation/ProtectedNavigator";
import { AgeGroupType } from "../types";
import useRefreshControl from "../hooks/others/useRefreshControl";
import ErrorComponent from "./ErrorComponent";
import StoryItem from "./parents/StoryItem";
import StoryCarouselSkeleton from "./skeletons/StoryCarouselSkeleton";
import AgeSelectionComponent from "./UI/AgeSelectionComponent";
import CustomButton from "./UI/CustomButton";

type PropTypes = {
  showAges: boolean;
  setSelectedAgeGroup: Dispatch<SetStateAction<AgeGroupType>>;
  selectedAgeGroup: AgeGroupType;
  params: InfiniteStoriesParam;
};
const GroupedStoriesStoryCarousel = ({
  showAges,
  selectedAgeGroup,
  setSelectedAgeGroup,
  params,
}: PropTypes) => {
  const navigator = useNavigation<ProtectedRoutesNavigationProp>();
  const {
    data,
    isPending,
    refetch,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteStories({ ...params, ageGroup: selectedAgeGroup });

  const { refreshing, onRefresh } = useRefreshControl(refetch);

  const stories = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data]
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isPending) return <StoryCarouselSkeleton variant="vertical" />;
  if (error)
    return <ErrorComponent message={error.message} refetch={refetch} />;

  if (!stories.length) {
    const isFilterDefault = selectedAgeGroup === "All";
    return (
      <View className="flex flex-1 flex-col items-center justify-center gap-y-3 bg-bgLight px-5">
        <Text className="font-[abeezee] text-xl text-black">
          No stories in this category yet
        </Text>
        {isFilterDefault ? (
          <CustomButton
            text="Go Back"
            onPress={() => navigator.canGoBack() && navigator.goBack()}
          />
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
    <FlatList
      data={stories}
      keyExtractor={(item) => item.id}
      className="-mt-4 rounded-t-3xl bg-white pt-5"
      contentContainerClassName="flex flex-col px-4 pt-6 pb-5"
      showsVerticalScrollIndicator={false}
      numColumns={2}
      columnWrapperClassName="gap-x-3 mb-6"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListHeaderComponent={
        showAges ? (
          <AgeSelectionComponent
            selectedGroupProp={selectedAgeGroup}
            setSelectedCallback={setSelectedAgeGroup}
          />
        ) : null
      }
      renderItem={({ item: story }) => (
        <View className="flex-1" style={styles.columnItem}>
          <StoryItem story={story} isGrouped />
        </View>
      )}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingNextPage ? (
          <ActivityIndicator size="small" style={styles.footer} />
        ) : null
      }
    />
  );
};

export default GroupedStoriesStoryCarousel;

const styles = StyleSheet.create({
  columnItem: { maxWidth: "50%" },
  footer: { paddingVertical: 16 },
});
