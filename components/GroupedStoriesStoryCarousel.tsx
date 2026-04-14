import { useNavigation } from "@react-navigation/native";
import { Dispatch, SetStateAction, useCallback, useMemo } from "react";
import {
  ActivityIndicator,
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
import {
  AdaptiveFlashList,
  adaptiveColumnItemStyle,
} from "./UI/AdaptiveFlashList";

/**
 * Key extractor function for Story items
 */
const storyKeyExtractor = (item: { id: string }) => item.id;

/**
 * Props for GroupedStoriesStoryCarousel component
 */
type PropTypes = {
  /** Whether to show the age selection filter UI */
  showAges: boolean;
  /** Callback to update the selected age group */
  setSelectedAgeGroup: Dispatch<SetStateAction<AgeGroupType>>;
  /** Currently selected age group filter */
  selectedAgeGroup: AgeGroupType;
  /** Query parameters for fetching stories */
  params: InfiniteStoriesParam;
};

/**
 * Displays an infinitely scrolling list of stories with optional age filtering
 * and responsive grid layout (2-4 columns based on screen width).
 *
 * @param props - Component properties
 * @returns The grouped stories carousel UI
 */
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

  const stories = useMemo(() => {
    const all = data?.pages.flatMap((page) => page.data) ?? [];
    const seen = new Set<string>();
    return all.filter((s) => {
      if (!s?.id || seen.has(s.id)) return false;
      seen.add(s.id);
      return true;
    });
  }, [data]);

  const renderStoryItem = useCallback(
    ({ item: story }: { item: (typeof stories)[number] }) => (
      <View style={adaptiveColumnItemStyle}>
        <StoryItem story={story} isGrouped />
      </View>
    ),
    []
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
    <AdaptiveFlashList
      data={stories}
      keyExtractor={storyKeyExtractor}
      drawDistance={500}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListHeaderComponent={
        showAges ? (
          <View style={styles.listHeader}>
            <AgeSelectionComponent
              selectedGroupProp={selectedAgeGroup}
              setSelectedCallback={setSelectedAgeGroup}
            />
          </View>
        ) : null
      }
      renderItem={renderStoryItem}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingNextPage ? (
          <View style={styles.footer}>
            <ActivityIndicator
              size="small"
              accessibilityLabel="Loading more stories"
            />
            <Text className="mt-2 text-center font-[abeezee] text-sm text-text">
              Loading more stories...
            </Text>
          </View>
        ) : null
      }
    />
  );
};

export default GroupedStoriesStoryCarousel;

const styles = StyleSheet.create({
  listHeader: { marginBottom: 16 },
  footer: { height: 60, alignItems: "center", justifyContent: "center" },
});
