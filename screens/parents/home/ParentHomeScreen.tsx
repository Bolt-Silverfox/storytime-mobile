import { ScrollView, View } from "react-native";
import ChildrenActivitiesComponent from "../../../components/parents/ChildrenActivitiesComponent";
import IncompleteProfileBanner from "../../../components/parents/IncompleteProfileBanner";
import ParentsHomeScreenHeader from "../../../components/parents/ParentsHomeScreenHeader";
import SuspenseWrapper from "../../../components/supsense/SuspenseWrapper";
import { lazy } from "react";

const StoryCategoriesList = lazy(
  () => import("../../../components/parents/StoryCategoriesList")
);
const ParentsTopRecommendations = lazy(
  () => import("../../../components/parents/ParentTopRecommendations")
);
const ParentsTopPicksComponent = lazy(
  () => import("../../../components/parents/ParentTopPicsComponent")
);
const SeasonalStoriesComponent = lazy(
  () => import("../../../components/parents/SeasonalStoriesComponent")
);
const FunAndAdventuresComponent = lazy(
  () => import("../../../components/parents/FunAndAdventuresComponent")
);
const StoriesByAgeComponent = lazy(
  () => import("../../../components/parents/StoriesByAgeCompnent")
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
        <SuspenseWrapper>
          <ParentsTopPicksComponent />
        </SuspenseWrapper>
        <ChildrenActivitiesComponent />
        <SuspenseWrapper>
          <SeasonalStoriesComponent />
        </SuspenseWrapper>
        <SuspenseWrapper>
          <FunAndAdventuresComponent />
        </SuspenseWrapper>
        <SuspenseWrapper>
          <StoriesByAgeComponent />
        </SuspenseWrapper>
        <SuspenseWrapper>
          <StoryCategoriesList />
        </SuspenseWrapper>
      </ScrollView>
    </View>
  );
};

export default ParentHomeScreen;
