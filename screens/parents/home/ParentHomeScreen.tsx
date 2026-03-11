import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import NotificationPermissionBanner from "../../../components/NotificationPermissionBanner";
import FreeStoriesBanner from "../../../components/parents/FreeStoriesBanner";
import FunAndAdventuresComponent from "../../../components/parents/FunAndAdventuresComponent";
import ParentsHomeScreenHeader from "../../../components/parents/ParentsHomeScreenHeader";
import TodaysTopPicksComponent from "../../../components/parents/TodaysTopPicksComponent";
import ParentsTopRecommendations from "../../../components/parents/ParentTopRecommendations";
import SeasonalStoriesComponent from "../../../components/parents/SeasonalStoriesComponent";
import StoriesByAgeComponent from "../../../components/parents/StoriesByAgeComponent";
import StoryCategoriesList from "../../../components/parents/StoryCategoriesList";
import SafeAreaWrapper from "../../../components/UI/SafeAreaWrapper";
import useNotificationBanner from "../../../hooks/useNotificationBanner";
import useRefreshControl from "../../../hooks/others/useRefreshControl";

type SectionKey =
  | "freeStoriesBanner"
  | "storiesByAge"
  | "topRecommendations"
  | "todaysTopPicks"
  | "seasonalStories"
  | "funAndAdventures"
  | "storyCategoriesList";

type SectionItem = { key: SectionKey };

const sectionKeyExtractor = (item: SectionItem) => item.key;

const SECTIONS: SectionItem[] = [
  { key: "freeStoriesBanner" },
  { key: "storiesByAge" },
  { key: "topRecommendations" },
  { key: "todaysTopPicks" },
  { key: "seasonalStories" },
  { key: "funAndAdventures" },
  { key: "storyCategoriesList" },
];

const ParentHomeScreen = () => {
  const {
    showBanner,
    permissionStatus,
    handleDismiss,
    handlePermissionGranted,
  } = useNotificationBanner();

  const queryClient = useQueryClient();
  const invalidateAll = useCallback(
    () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["stories"] }),
        queryClient.invalidateQueries({ queryKey: ["storyCategories"] }),
        queryClient.invalidateQueries({ queryKey: ["storyQuota"] }),
        queryClient.invalidateQueries({ queryKey: ["parentsFavourites"] }),
      ]),
    [queryClient]
  );
  const { refreshing, onRefresh } = useRefreshControl(invalidateAll);

  const renderSection = useCallback(({ item }: { item: SectionItem }) => {
    switch (item.key) {
      case "freeStoriesBanner":
        return <FreeStoriesBanner />;
      case "storiesByAge":
        return <StoriesByAgeComponent />;
      case "topRecommendations":
        return <ParentsTopRecommendations />;
      case "todaysTopPicks":
        return <TodaysTopPicksComponent />;
      case "seasonalStories":
        return <SeasonalStoriesComponent />;
      case "funAndAdventures":
        return <FunAndAdventuresComponent />;
      case "storyCategoriesList":
        return <StoryCategoriesList />;
    }
  }, []);

  const listHeader = useMemo(
    () =>
      showBanner ? (
        <NotificationPermissionBanner
          permissionStatus={permissionStatus}
          onDismiss={handleDismiss}
          onPermissionGranted={handlePermissionGranted}
        />
      ) : null,
    [showBanner, permissionStatus, handleDismiss, handlePermissionGranted]
  );

  return (
    <SafeAreaWrapper variant="solid">
      <View className="flex-1 bg-bgLight px-4">
        <ParentsHomeScreenHeader />
        <FlatList
          data={SECTIONS}
          keyExtractor={sectionKeyExtractor}
          renderItem={renderSection}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          removeClippedSubviews={false}
          initialNumToRender={4}
          maxToRenderPerBatch={3}
          windowSize={10}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListHeaderComponent={listHeader}
        />
      </View>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  listContent: { gap: 32, paddingBottom: 32 },
});

export default ParentHomeScreen;
