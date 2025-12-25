import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import ChildStoryDetails from "../screens/parents/ChildStoryDetails";
import ChallengeTracker from "../screens/parents/home/ChallengeTracker";
import DailyChallengeScreen from "../screens/parents/home/DailyChallengeScreen";
import InteractiveStoriesScreen from "../screens/parents/home/InteractiveStoriesScreen";
import PlainStoriesScreen from "../screens/parents/home/PlainStoriesScreen";
import StoriesListScreen from "../screens/parents/home/StoriesListScreen";
import ParentHomeScreen from "../screens/parents/home/ParentHomeScreen";
import CategoriesListScreen from "../screens/parents/home/CategoriesList";
import ParentsTopPicksScreen from "../screens/parents/home/ParentsTopPicksScreen";
import GetPremiumScreen from "../screens/parents/home/GetPremiumScreen";
import NotificationsScreen from "../screens/parents/home/NotificationsScreen";

type ParentHomeNavigatorParamList = {
  childStoryDetails: { storyId: string; mode?: string };
  storiesList: {
    categoryId?: string;
    categoryName?: string;
    kidId?: string;
    storyId?: string;
  };
  interactiveStories: { storyId: string; mode?: "interactive" } | undefined;
  plainStories: { storyId: string; mode?: "plain" } | undefined;
  dailyChallenge: undefined;
  challengeTracker: undefined;
  homePage: undefined;
  categoriesList: undefined;
  parentsTopPicks: undefined;
  getPremium: undefined;
  notifications: undefined;
};

type ParntHomeNavigatorProp =
  NativeStackNavigationProp<ParentHomeNavigatorParamList>;
const Stack = createNativeStackNavigator<ParentHomeNavigatorParamList>();

const ParentHomeNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="homePage" component={ParentHomeScreen} options={{}} />
      <Stack.Screen name="storiesList" component={StoriesListScreen} />
      <Stack.Screen name="childStoryDetails" component={ChildStoryDetails} />
      <Stack.Screen
        name="interactiveStories"
        component={InteractiveStoriesScreen}
      />
      <Stack.Screen name="plainStories" component={PlainStoriesScreen} />
      <Stack.Screen name="dailyChallenge" component={DailyChallengeScreen} />
      <Stack.Screen name="challengeTracker" component={ChallengeTracker} />
      <Stack.Screen name="categoriesList" component={CategoriesListScreen} />
      <Stack.Screen name="parentsTopPicks" component={ParentsTopPicksScreen} />
      <Stack.Screen name="getPremium" component={GetPremiumScreen} />
      <Stack.Screen name="notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
};

export type { ParntHomeNavigatorProp, ParentHomeNavigatorParamList };
export default ParentHomeNavigator;
