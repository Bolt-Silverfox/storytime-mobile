import { NavigatorScreenParams } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { StoryModeProvider } from "../contexts/StoryModeContext";
import CategoriesListScreen from "../screens/parents/home/CategoriesList";
import ChallengeTracker from "../screens/parents/home/ChallengeTracker";
import ChildStoryDetails from "../screens/parents/home/ChildStoryDetails";
import DailyChallengeScreen from "../screens/parents/home/DailyChallengeScreen";
import InteractiveStoriesScreen from "../screens/parents/home/InteractiveStoriesScreen";
import NewInteractiveStoryModeScreen from "../screens/parents/home/NewInteractiveStoryModeScreen";
import NewPlainStoryMode from "../screens/parents/home/NewPlainStoryMode";
import ParentHomeScreen from "../screens/parents/home/ParentHomeScreen";
import ParentsTopPicksScreen from "../screens/parents/home/ParentsTopPicksScreen";
import ParentsTopRecommendationsScreen from "../screens/parents/home/ParentsTopRecommendationsScreen";
import PlainStoriesScreen from "../screens/parents/home/PlainStoriesScreen";
import StoriesByCategoryScreen from "../screens/parents/home/StoriesByCategoryScreen";
import StoriesListScreen from "../screens/parents/home/StoriesListScreen";
import ChallengeTrackerNavigator, {
  ChallengeTrackerNavigatorParamList,
} from "./ChallengeTrackerNavigator";
import TrackStoriesScreen from "../screens/parents/home/TrackStoriesScreen";

type ParentHomeNavigatorParamList = {
  childStoryDetails: { storyId: string };
  newPlainStoryMode: { storyId: string };
  newInteractiveStoryMode: { storyId: string };
  storiesByCategory: { category: string };
  testScreen: undefined;
  topRecommendations: undefined;
  trackChallenge: NavigatorScreenParams<ChallengeTrackerNavigatorParamList>;
  trackStories: undefined;

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
};

type ParntHomeNavigatorProp =
  NativeStackNavigationProp<ParentHomeNavigatorParamList>;
const Stack = createNativeStackNavigator<ParentHomeNavigatorParamList>();

const ParentHomeNavigator = () => {
  return (
    <StoryModeProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="homePage"
          component={ParentHomeScreen}
          options={{}}
        />
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
        <Stack.Screen
          name="parentsTopPicks"
          component={ParentsTopPicksScreen}
        />

        <Stack.Screen
          name="newInteractiveStoryMode"
          component={NewInteractiveStoryModeScreen}
        />
        <Stack.Screen name="newPlainStoryMode" component={NewPlainStoryMode} />
        <Stack.Screen
          name="storiesByCategory"
          component={StoriesByCategoryScreen}
        />
        <Stack.Screen
          name="topRecommendations"
          component={ParentsTopRecommendationsScreen}
          options={{
            presentation: "formSheet",
            headerTitle: "Test screen",
            sheetCornerRadius: 30,
            sheetGrabberVisible: true,
          }}
        />
        <Stack.Screen
          name="trackChallenge"
          component={ChallengeTrackerNavigator}
        />
        <Stack.Screen name="trackStories" component={TrackStoriesScreen} />
      </Stack.Navigator>
    </StoryModeProvider>
  );
};

export type { ParentHomeNavigatorParamList, ParntHomeNavigatorProp };
export default ParentHomeNavigator;
