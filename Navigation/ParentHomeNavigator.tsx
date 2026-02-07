import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import FunAndADventureStoriesScreen from "../screens/parents/home/FunAndAdventureStoriesScreen";
import ParentHomeScreen from "../screens/parents/home/ParentHomeScreen";
import ParentsTopPicksScreen from "../screens/parents/home/ParentsTopPicksScreen";
import ParentsTopRecommendationsScreen from "../screens/parents/home/ParentsTopRecommendationsScreen";
import SeasonalStoriesScreen from "../screens/parents/home/SeasonalStoriesScreen";
import StoriesByAgeScreen from "../screens/parents/home/StoriesByAgeScreen";
import StoriesByCategoryScreen from "../screens/parents/home/StoriesByCategoryScreen";
import { AgeGroupType } from "../types";

type ParentHomeNavigatorParamList = {
  homePage: undefined;
  storiesByCategory: { category: string; id: string; imageUrl: string };
  topRecommendations: undefined;
  seasonalStories: undefined;
  funAndAdventureStories: undefined;
  parentsTopPicks: undefined;
  storiesByAge: { ageGroup: AgeGroupType };
};

type ParntHomeNavigatorProp =
  NativeStackNavigationProp<ParentHomeNavigatorParamList>;
const Stack = createNativeStackNavigator<ParentHomeNavigatorParamList>();

const ParentHomeNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="homePage" component={ParentHomeScreen} />
      <Stack.Screen name="parentsTopPicks" component={ParentsTopPicksScreen} />
      <Stack.Screen
        name="storiesByCategory"
        component={StoriesByCategoryScreen}
      />
      <Stack.Screen
        name="topRecommendations"
        component={ParentsTopRecommendationsScreen}
      />
      <Stack.Screen name="seasonalStories" component={SeasonalStoriesScreen} />
      <Stack.Screen
        name="funAndAdventureStories"
        component={FunAndADventureStoriesScreen}
      />
      <Stack.Screen name="storiesByAge" component={StoriesByAgeScreen} />
    </Stack.Navigator>
  );
};

export type { ParentHomeNavigatorParamList, ParntHomeNavigatorProp };
export default ParentHomeNavigator;
