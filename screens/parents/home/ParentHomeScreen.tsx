import React from "react";
import { ScrollView, View } from "react-native";
import ChildrenActivitiesComponent from "../../../components/parents/ChildrenActivitiesComponent";
import FunAndAdventuresComponent from "../../../components/parents/FunAndAdventuresComponent";
import IncompleteProfileBanner from "../../../components/parents/IncompleteProfileBanner";
import ParentFooter from "../../../components/parents/ParentFooter";
import ParentsTopPicksComponent from "../../../components/parents/ParentTopPicsComponent";
import ParentsHomeScreenHeader from "../../../components/parents/ParentsHomeScreenHeader";
import SeasonalStoriesComponent from "../../../components/parents/SeasonalStoriesComponent";
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
        <ParentsTopPicksComponent />
        <ChildrenActivitiesComponent />
        <SeasonalStoriesComponent />
        <FunAndAdventuresComponent />
        <StoryCategoriesList />
        <ParentFooter />
      </ScrollView>
    </View>
  );
};

export default ParentHomeScreen;
