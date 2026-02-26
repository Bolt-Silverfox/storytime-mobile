import { Dispatch, SetStateAction, useCallback, useMemo } from "react";
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from "react-native";
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

  const stories = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
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
    <FlatList
      data={stories}
      keyExtractor={(item) => item.id}
      contentContainerClassName="flex flex-col gap-y-6 px-4 pb-5"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      renderItem={({ item: story }) => (
        <LibraryStoryItem story={story} setActiveStory={setActiveStory} />
      )}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingNextPage ? (
          <ActivityIndicator size="small" style={{ paddingVertical: 16 }} />
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

export default LibraryStories;
