import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import FunAndAdventuresComponent from "../../../components/parents/FunAndAdventuresComponent";
import ParentsHomeScreenHeader from "../../../components/parents/ParentsHomeScreenHeader";
import ParentsTopPicksComponent from "../../../components/parents/ParentTopPicsComponent";
import ParentsTopRecommendations from "../../../components/parents/ParentTopRecommendations";
import SeasonalStoriesComponent from "../../../components/parents/SeasonalStoriesComponent";
import StoriesByAgeComponent from "../../../components/parents/StoriesByAgeComponent";
import StoryCategoriesList from "../../../components/parents/StoryCategoriesList";
import FremiumBanner from "../../../components/UI/FremiumBanner";
import SafeAreaWrapper from "../../../components/UI/SafeAreaWrapper";
import useGetUserProfile from "../../../hooks/tanstack/queryHooks/useGetUserProfile";

const ParentHomeScreen = () => {
  const [isFremiumBannerOpen, setIsFremiumBannerOpen] = useState(false);
  const { data } = useGetUserProfile();

  const isSubscribed =
    data?.role === "admin" || data?.subscriptionStatus === "active";

  const closeBanner = async () => {
    await AsyncStorage.setItem("fremiumBanner", "removed");
    setIsFremiumBannerOpen(false);
  };

  useEffect(() => {
    const getFremiumBannerStatus = async (): Promise<boolean> => {
      const isFremiumBannerClosed = await AsyncStorage.getItem("fremiumBanner");
      return Boolean(isFremiumBannerClosed);
    };

    (async () => {
      const fremiumBannerStatus = await getFremiumBannerStatus();
      if (!fremiumBannerStatus) {
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
          <ParentsTopPicksComponent />
          <SeasonalStoriesComponent />
          <FunAndAdventuresComponent />
          <StoryCategoriesList />
        </ScrollView>
      </View>
    </SafeAreaWrapper>
  );
};

export default ParentHomeScreen;
