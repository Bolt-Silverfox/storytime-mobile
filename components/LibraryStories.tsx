import { FlashList } from "@shopify/flash-list";
import { Dispatch, SetStateAction, useCallback, useMemo } from "react";
import { ActivityIndicator, RefreshControl, Text, View } from "react-native";
import useGetLibraryStories from "../hooks/tanstack/queryHooks/useGetLibraryStories";
import useRefreshControl from "../hooks/others/useRefreshControl";
import { LibraryFilterType } from "../types";
import ErrorComponent from "./ErrorComponent";
import LibraryStoryItem from "./LibraryStoryItem";
import LoadingIcon from "./LoadingIcon";
import CustomEmptyState from "./emptyState/CustomEmptyState";

type PropTypes = {
  storyFilter: LibraryFilterType;
  setActiveStory: Dispatch<
    SetStateAction<{
      title: string;
      id: string;
    } | null>
  >;
};

const LoadingComponent = ({ storyFilter }: { storyFilter: string }) => {
  return (
    <View className="flex flex-1 flex-col items-center justify-center gap-y-4">
      <LoadingIcon />
      <Text className="text-center font-[abeezee] text-xl">
        Loading {storyFilter} stories
      </Text>
    </View>
  );
};

const LibraryStories = ({ storyFilter, setActiveStory }: PropTypes) => {
  const {
    data,
    isPending,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetLibraryStories(storyFilter);
  const { refreshing, onRefresh } = useRefreshControl(refetch);

  const stories = useMemo(() => {
    const all = data?.pages.flatMap((page) => page.data) ?? [];
    const seen = new Set<string>();
    return all.filter((s) => {
      if (!s?.id) return false;
      if (seen.has(s.id)) return false;
      seen.add(s.id);
      return true;
    });
  }, [data]);

  const renderStoryItem = useCallback(
    ({ item: story }: { item: (typeof stories)[number] }) => (
      <LibraryStoryItem story={story} setActiveStory={setActiveStory} />
    ),
    [setActiveStory]
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isPending) return <LoadingComponent storyFilter={storyFilter} />;
  if (error)
    return <ErrorComponent message={error.message} refetch={refetch} />;

  return (
    <FlashList
      data={stories}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingBottom: 20,
      }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      renderItem={renderStoryItem}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      ItemSeparatorComponent={VerticalSeparator}
      ListFooterComponent={
        isFetchingNextPage ? (
          <View
            style={{
              height: 60,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ActivityIndicator size="small" />
            <Text className="mt-2 font-[abeezee] text-sm text-text">
              Loading more stories...
            </Text>
          </View>
        ) : null
      }
      ListEmptyComponent={
        <CustomEmptyState
          url={require("../assets/images/stories-empty-state.png")}
          message={`No ${storyFilter} stories`}
          secondaryMessage={`You do not have any ${storyFilter} stories yet`}
        />
      }
    />
  );
};

const VerticalSeparator = () => <View style={{ height: 24 }} />;

export default LibraryStories;
