import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import ChildStoryDetails from "../../screens/parents/ChildStoryDetails";
import ChallengeTracker from "../../screens/parents/home/ChallengeTracker";
import DailyChallengeScreen from "../../screens/parents/home/DailyChallengeScreen";
import InteractiveStoriesScreen from "../../screens/parents/home/InteractiveStoriesScreen";
import PlainStoriesScreen from "../../screens/parents/home/PlainStoriesScreen";
import StoriesListScreen from "../../screens/parents/StoriesListScreen";
import ParentHomeScreen from "../../screens/parents/home/ParentHomeScreen";
// import ParentsHomeScreen from "../screens/parents/ParentsHomeScreen";

type ParentHomeNavigatorParamList = {
  childStoryDetails: { storyId: string };
  storiesList: undefined;
  interactiveStories: undefined;
  plainStories: undefined;
  dailyChallenge: undefined;
  challengeTracker: undefined;
  homePage: undefined;
};

type ParntHomeNavigatorProp =
  NativeStackNavigationProp<ParentHomeNavigatorParamList>;
const Stack = createNativeStackNavigator<ParentHomeNavigatorParamList>();

const ParentHomeNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="homePage" component={ParentHomeScreen} />
      <Stack.Screen name="storiesList" component={StoriesListScreen} />
      <Stack.Screen name="childStoryDetails" component={ChildStoryDetails} />
      <Stack.Screen
        name="interactiveStories"
        component={InteractiveStoriesScreen}
      />
      <Stack.Screen name="plainStories" component={PlainStoriesScreen} />
      <Stack.Screen name="dailyChallenge" component={DailyChallengeScreen} />
      <Stack.Screen name="challengeTracker" component={ChallengeTracker} />
    </Stack.Navigator>
  );
};

export type { ParntHomeNavigatorProp, ParentHomeNavigatorParamList };
export default ParentHomeNavigator;
