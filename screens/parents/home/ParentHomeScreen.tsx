import { ScrollView, View } from "react-native";
import ChildrenActivitiesComponent from "../../../components/parents/ChildrenActivitiesComponent";
import FunAndAdventuresComponent from "../../../components/parents/FunAndAdventuresComponent";
import IncompleteProfileBanner from "../../../components/parents/IncompleteProfileBanner";
import ParentsTopPicksComponent from "../../../components/parents/ParentTopPicsComponent";
import ParentsHomeScreenHeader from "../../../components/parents/ParentsHomeScreenHeader";
import SeasonalStoriesComponent from "../../../components/parents/SeasonalStoriesComponent";
import StoriesByAgeComponent from "../../../components/parents/StoriesByAgeCompnent";
import SuspenseWrapper from "../../../components/supsense/SuspenseWrapper";
import { lazy } from "react";

const StoryCategoriesList = lazy(
  () => import("../../../components/parents/StoryCategoriesList")
);
const ParentsTopRecommendations = lazy(
  () => import("../../../components/parents/ParentTopRecommendations")
);

const ParentHomeScreen = () => {
  return (
    <View className="flex flex-1 px-4 bg-bgLight pb-5">
      <ParentsHomeScreenHeader />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName=" flex min-h-full flex-col gap-y-8"
      >
        <IncompleteProfileBanner />
        <SuspenseWrapper>
          <ParentsTopRecommendations />
        </SuspenseWrapper>
        {/* <ParentsTopPicksComponent /> */}
        <ChildrenActivitiesComponent />
        {/* <SeasonalStoriesComponent /> */}
        {/* <FunAndAdventuresComponent /> */}
        {/* <StoriesByAgeComponent /> */}
        <SuspenseWrapper>
          <StoryCategoriesList />
        </SuspenseWrapper>
      </ScrollView>
    </View>
  );
};

export default ParentHomeScreen;
