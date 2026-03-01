import { FlashList } from "@shopify/flash-list";
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
import useAdaptiveColumns from "../hooks/others/useAdaptiveColumns";
import useRefreshControl from "../hooks/others/useRefreshControl";
import ErrorComponent from "./ErrorComponent";
import StoryItem from "./parents/StoryItem";
import StoryCarouselSkeleton from "./skeletons/StoryCarouselSkeleton";
import AgeSelectionComponent from "./UI/AgeSelectionComponent";
import CustomButton from "./UI/CustomButton";

const storyKeyExtractor = (item: { id: string }) => item.id;

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
  const numColumns = useAdaptiveColumns();
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
      <View style={styles.columnItem}>
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
    <FlashList
      key={numColumns}
      data={stories}
      keyExtractor={storyKeyExtractor}
      className="-mt-4 flex-1 rounded-t-3xl bg-white pt-5"
      contentContainerStyle={styles.contentContainer}
      drawDistance={500}
      showsVerticalScrollIndicator={false}
      numColumns={numColumns}
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
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 20,
  },
  columnItem: { flex: 1, marginHorizontal: 6, marginBottom: 24 },
  footer: { height: 60, alignItems: "center", justifyContent: "center" },
});
