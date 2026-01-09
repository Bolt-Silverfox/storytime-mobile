import { lazy, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
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

const ParentHomeScreen = () => {
  const [selectedGroup, setSelectedGroup] = useState<selectedGroupType>("1-2");
  return (
    <View className="flex flex-1 px-4 bg-bgLight pb-5">
      <ParentsHomeScreenHeader />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="flex flex-row gap-x-2 items-center pt-8 pb-6 h-full"
      >
        {ageGroups.map((age) => (
          <Pressable
            key={age}
            onPress={() => setSelectedGroup(age)}
            className={`h-10 w-[126px] flex flex-row justify-center items-center rounded-full ${age === selectedGroup ? "bg-blue" : "bg-white border "}`}
          >
            <Text
              className={`font-[abeezee] text-base ${age === selectedGroup ? "text-white" : "text-text"}`}
            >
              {age}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName=" flex min-h-full flex-col gap-y-8"
      >
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

const ageGroups = ["1-2", "3-4", "5-6", "7-8", "9-12"] as const;
type selectedGroupType = (typeof ageGroups)[number];
