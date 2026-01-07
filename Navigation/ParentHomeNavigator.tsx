import { NavigatorScreenParams } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { StoryModeProvider } from "../contexts/StoryModeContext";
import ChildStoryDetails from "../screens/parents/home/ChildStoryDetails";
import FunAndADventureStoriesScreen from "../screens/parents/home/FunAndAdventureStoriesScreen";
import NewInteractiveStoryModeScreen from "../screens/parents/home/NewInteractiveStoryModeScreen";
import NewPlainStoryMode from "../screens/parents/home/NewPlainStoryMode";
import ParentHomeScreen from "../screens/parents/home/ParentHomeScreen";
import ParentsTopPicksScreen from "../screens/parents/home/ParentsTopPicksScreen";
import ParentsTopRecommendationsScreen from "../screens/parents/home/ParentsTopRecommendationsScreen";
import SeasonalStoriesScreen from "../screens/parents/home/SeasonalStoriesScreen";
import StoriesByAgeScreen from "../screens/parents/home/StoriesByAgeScreen";
import StoriesByCategoryScreen from "../screens/parents/home/StoriesByCategoryScreen";
import TrackChildStoryScreen from "../screens/parents/home/TrackChildStoryScreen";
import TrackStoriesScreen from "../screens/parents/home/TrackStoriesScreen";
import ChallengeTrackerNavigator, {
  ChallengeTrackerNavigatorParamList,
} from "./ChallengeTrackerNavigator";

type ParentHomeNavigatorParamList = {
  homePage: undefined;
  childStoryDetails: { storyId: string };
  newInteractiveStoryMode: { storyId: string };
  newPlainStoryMode: { storyId: string };
  storiesByCategory: { category: string; id: string };
  topRecommendations: undefined;
  trackChallenge: NavigatorScreenParams<ChallengeTrackerNavigatorParamList>;
  trackStories: undefined;
  trackChildStory: { childId: string };
  seasonalStories: undefined;
  funAndAdventureStories: undefined;
  storiesByAge: undefined;
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
        <Stack.Screen name="childStoryDetails" component={ChildStoryDetails} />
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
        />
        <Stack.Screen
          name="trackChallenge"
          component={ChallengeTrackerNavigator}
        />
        <Stack.Screen name="trackStories" component={TrackStoriesScreen} />
        <Stack.Screen
          name="trackChildStory"
          component={TrackChildStoryScreen}
        />
        <Stack.Screen
          name="seasonalStories"
          component={SeasonalStoriesScreen}
        />
        <Stack.Screen name="storiesByAge" component={StoriesByAgeScreen} />
        <Stack.Screen
          name="funAndAdventureStories"
          component={FunAndADventureStoriesScreen}
        />
      </Stack.Navigator>
    </StoryModeProvider>
  );
};

export type { ParentHomeNavigatorParamList, ParntHomeNavigatorProp };
export default ParentHomeNavigator;
