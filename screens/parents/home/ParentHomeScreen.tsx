import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
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

  return (
    <SafeAreaWrapper variant="solid">
      <View className="flex flex-1 bg-bgLight px-4">
        <ParentsHomeScreenHeader />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName=" flex flex-col gap-y-8"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {showBanner && (
            <NotificationPermissionBanner
              permissionStatus={permissionStatus}
              onDismiss={handleDismiss}
              onPermissionGranted={handlePermissionGranted}
            />
          )}
          <FreeStoriesBanner />
          <StoriesByAgeComponent />
          <ParentsTopRecommendations />
          <TodaysTopPicksComponent />
          <SeasonalStoriesComponent />
          <FunAndAdventuresComponent />
          <StoryCategoriesList />
        </ScrollView>
      </View>
    </SafeAreaWrapper>
  );
};

export default ParentHomeScreen;
