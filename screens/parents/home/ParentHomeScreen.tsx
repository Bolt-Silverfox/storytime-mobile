import { lazy } from "react";
import { ScrollView, View } from "react-native";
import ParentsHomeScreenHeader from "../../../components/parents/ParentsHomeScreenHeader";
import StoryCarouselSkeleton from "../../../components/skeletons/StoryCarouselSkeleton";
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
    <View className="flex flex-1 bg-bgLight px-4">
      <ParentsHomeScreenHeader />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName=" flex min-h-full flex-col gap-y-8"
      >
        <SuspenseWrapper fallbackUI={<StoryCarouselSkeleton />}>
          <StoriesByAgeComponent />
        </SuspenseWrapper>
        <SuspenseWrapper fallbackUI={<StoryCarouselSkeleton />}>
          <ParentsTopRecommendations />
        </SuspenseWrapper>
        <SuspenseWrapper fallbackUI={<StoryCarouselSkeleton />}>
          <ParentsTopPicksComponent />
        </SuspenseWrapper>
        <SuspenseWrapper fallbackUI={<StoryCarouselSkeleton />}>
          <SeasonalStoriesComponent />
        </SuspenseWrapper>
        <SuspenseWrapper fallbackUI={<StoryCarouselSkeleton />}>
          <FunAndAdventuresComponent />
        </SuspenseWrapper>
        <SuspenseWrapper fallbackUI={<StoryCarouselSkeleton />}>
          <StoryCategoriesList />
        </SuspenseWrapper>
      </ScrollView>
    </View>
  );
};

export default ParentHomeScreen;
