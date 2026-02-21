import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import FunAndAdventuresComponent from "../../../components/parents/FunAndAdventuresComponent";
import ParentsHomeScreenHeader from "../../../components/parents/ParentsHomeScreenHeader";
import TodaysTopPicksComponent from "../../../components/parents/TodaysTopPicksComponent";
import ParentsTopRecommendations from "../../../components/parents/ParentTopRecommendations";
import SeasonalStoriesComponent from "../../../components/parents/SeasonalStoriesComponent";
import StoriesByAgeComponent from "../../../components/parents/StoriesByAgeComponent";
import StoryCategoriesList from "../../../components/parents/StoryCategoriesList";
import FremiumBanner from "../../../components/UI/FremiumBanner";
import SafeAreaWrapper from "../../../components/UI/SafeAreaWrapper";
import useGetUserProfile from "../../../hooks/tanstack/queryHooks/useGetUserProfile";
import { FREMIUM_BANNER_LS_KEY } from "../../../constants";

const ParentHomeScreen = () => {
  const [isFremiumBannerOpen, setIsFremiumBannerOpen] = useState(false);
  const { data } = useGetUserProfile();

  const isSubscribed =
    data?.role === "admin" || data?.subscriptionStatus === "active";

  const closeBanner = async () => {
    try {
      await AsyncStorage.setItem(FREMIUM_BANNER_LS_KEY, "removed");
    } catch (e) {
      console.error("Failed to persist banner", e);
    } finally {
      setIsFremiumBannerOpen(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const isFremiumBannerClosed = await AsyncStorage.getItem(
          FREMIUM_BANNER_LS_KEY
        );
        if (!isFremiumBannerClosed) {
          setIsFremiumBannerOpen(true);
        }
      } catch (e) {
        console.error("Failed to read banner status", e);
        setIsFremiumBannerOpen(true);
      }
    })();
  }, []);

  return (
    <SafeAreaWrapper variant="solid">
      <View className="flex flex-1 bg-bgLight">
        <ParentsHomeScreenHeader />
        {isFremiumBannerOpen && !isSubscribed && (
          <FremiumBanner closeBanner={closeBanner} />
        )}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName=" flex flex-col px-4 gap-y-8"
        >
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
