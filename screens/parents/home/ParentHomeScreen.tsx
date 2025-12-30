import { ScrollView, View } from "react-native";
import ChildrenActivitiesComponent from "../../../components/parents/ChildrenActivitiesComponent";
import FunAndAdventuresComponent from "../../../components/parents/FunAndAdventuresComponent";
import IncompleteProfileBanner from "../../../components/parents/IncompleteProfileBanner";
import ParentsTopPicksComponent from "../../../components/parents/ParentTopPicsComponent";
import ParentsTopRecommendations from "../../../components/parents/ParentTopRecommendations";
import ParentsHomeScreenHeader from "../../../components/parents/ParentsHomeScreenHeader";
import SeasonalStoriesComponent from "../../../components/parents/SeasonalStoriesComponent";
import StoriesByAgeComponent from "../../../components/parents/StoriesByAgeCompnent";
import StoryCategoriesList from "../../../components/parents/StoryCategoriesList";

const ParentHomeScreen = () => {
  return (
    <View className="flex flex-1 px-4 bg-bgLight pb-5">
      <ParentsHomeScreenHeader />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName=" flex min-h-full flex-col gap-y-8"
      >
        <IncompleteProfileBanner />
        <ParentsTopRecommendations />
        <ParentsTopPicksComponent />
        <ChildrenActivitiesComponent />
        <SeasonalStoriesComponent />
        <FunAndAdventuresComponent />
        <StoriesByAgeComponent />
        <StoryCategoriesList />
      </ScrollView>
    </View>
  );
};

export default ParentHomeScreen;
