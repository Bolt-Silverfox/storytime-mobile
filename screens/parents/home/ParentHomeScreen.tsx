import { lazy } from "react";
import { ScrollView, View } from "react-native";
import ParentsHomeScreenHeader from "../../../components/parents/ParentsHomeScreenHeader";
import SuspenseWrapper from "../../../components/supsense/SuspenseWrapper";

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
  () => import("../../../components/parents/StoriesByAgeComponent")
);

const ParentHomeScreen = () => {
  return (
    <View className="flex flex-1 px-4 bg-bgLight">
      <ParentsHomeScreenHeader />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName=" flex min-h-full flex-col gap-y-8"
      >
        <SuspenseWrapper>
          <StoriesByAgeComponent />
        </SuspenseWrapper>
        <SuspenseWrapper>
          <ParentsTopRecommendations />
        </SuspenseWrapper>
        <SuspenseWrapper>
          <ParentsTopPicksComponent />
        </SuspenseWrapper>
        <SuspenseWrapper>
          <SeasonalStoriesComponent />
        </SuspenseWrapper>
        <SuspenseWrapper>
          <FunAndAdventuresComponent />
        </SuspenseWrapper>
        <SuspenseWrapper>
          <StoryCategoriesList />
        </SuspenseWrapper>
      </ScrollView>
    </View>
  );
};

export default ParentHomeScreen;
