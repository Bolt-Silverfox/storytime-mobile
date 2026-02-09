import { ScrollView, View } from "react-native";
import FunAndAdventuresComponent from "../../../components/parents/FunAndAdventuresComponent";
import ParentsHomeScreenHeader from "../../../components/parents/ParentsHomeScreenHeader";
import TodaysTopPicksComponent from "../../../components/parents/TodaysTopPicksComponent";
import ParentsTopRecommendations from "../../../components/parents/ParentTopRecommendations";
import SeasonalStoriesComponent from "../../../components/parents/SeasonalStoriesComponent";
import StoriesByAgeComponent from "../../../components/parents/StoriesByAgeComponent";
import StoryCategoriesList from "../../../components/parents/StoryCategoriesList";
import SafeAreaWrapper from "../../../components/UI/SafeAreaWrapper";

const ParentHomeScreen = () => {
  return (
    <SafeAreaWrapper variant="solid">
      <View className="flex flex-1 bg-bgLight px-4">
        <ParentsHomeScreenHeader />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName=" flex flex-col gap-y-8"
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
