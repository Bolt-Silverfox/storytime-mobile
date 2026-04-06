import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import useAuth from "../../../contexts/AuthContext";
import {
  setGuestMode,
  setGuestSessionId,
  setGuestDeviceId,
} from "../../../apiFetch";

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
  const { isGuest } = useAuth();
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

  const handleClearGuestSession = async () => {
    try {
      // Clear all guest-related AsyncStorage keys
      await AsyncStorage.multiRemove([
        "guestSessionId",
        "guestSessionCreatedAt",
        "guestMode",
        "guestDeviceId",
        "guestStoriesRead", // Local quota tracking
        "REACT_QUERY_OFFLINE_CACHE", // Clear React Query offline cache
      ]);
      // Clear React Query cache in memory
      queryClient.clear();
      // Reset guest mode state
      setGuestMode(false);
      setGuestSessionId(null);
      setGuestDeviceId(null);
      Alert.alert(
        "Success",
        "Guest session cleared. Please refresh the app to test as a new guest."
      );
    } catch (error) {
      Alert.alert("Error", "Failed to clear guest session.");
    }
  };

  const renderSection = useCallback(
    ({ item }: { item: SectionItem }) => {
      switch (item.key) {
        case "freeStoriesBanner":
          return isGuest ? null : <FreeStoriesBanner />;
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
    },
    [isGuest]
  );

  const listHeader = useMemo(
    () =>
      showBanner && !isGuest ? (
        <NotificationPermissionBanner
          permissionStatus={permissionStatus}
          onDismiss={handleDismiss}
          onPermissionGranted={handlePermissionGranted}
        />
      ) : null,
    [
      showBanner,
      isGuest,
      permissionStatus,
      handleDismiss,
      handlePermissionGranted,
    ]
  );

  return (
    <SafeAreaWrapper variant="solid">
      <View className="flex-1 bg-bgLight px-4">
        <ParentsHomeScreenHeader />
        {__DEV__ && isGuest && (
          <TouchableOpacity
            onPress={handleClearGuestSession}
            className="mb-4 self-end rounded-full bg-red-100 px-4 py-2"
          >
            <Text className="font-[abeezee] text-xs text-red-600">
              Clear Guest Session (Debug)
            </Text>
          </TouchableOpacity>
        )}
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
