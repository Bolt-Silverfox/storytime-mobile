import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

import HomeScreen from "../screens/HomeScree";
import ParentsHome from "../screens/parents/ParentsHome";
import ChildStoryDetails from "../screens/parents/ChildStoryDetails";
import StoriesListScreen from "../screens/parents/StoriesListScreen";
import PlainStoriesScreen from "../screens/parents/home/PlainStoriesScreen";
import InteractiveStoriesScreen from "../screens/parents/home/InteractiveStoriesScreen";
import DailyChallengeScreen from "../screens/parents/home/DailyChallengeScreen";
import ChallengeTracker from "../screens/parents/home/ChallengeTracker";
import FavouriteScreen from "../screens/parents/favourite/FavouriteScreen";
import ReportsSreen from "../screens/parents/reports/ReportsSreen";
import ReportDetailsScreen from "../screens/parents/reports/ReportDetailsScreen";
import ControlsScreen from "../screens/parents/controls/ControlsScreen";
import ContentFilterScreen from "../screens/parents/controls/ContentFilterScreen";
import HideStoriesScreen from "../screens/parents/controls/HideStoriesScreen";
import RecordVoice from "../screens/parents/controls/RecordVoice";
import RecordingDetails from "../screens/parents/controls/RecordingDetails";
import CustomizeReadingVoice from "../screens/parents/controls/CustomizeReadingVoice";
import AddVoice from "../screens/parents/controls/AddVoice";
import DailyLimit from "../screens/parents/controls/DailyLimit";
import BedTimeMode from "../screens/parents/controls/BedTimeMode";
import ActivityLog from "../screens/parents/controls/ActivityLog";

type ParentsNavigatorParamList = {
  home: undefined;
  reports: undefined;
  controls: undefined;
  favourite: undefined;
  profile: undefined;

  // home
  childStoryDetails: { storyId: string };
  storiesList: undefined;
  interactiveStories: undefined;
  plainStories: undefined;
  dailyChallenge: undefined;
  challengeTracker: undefined;

  // favourite

  // report
  reportDetails: { childId: string };

  // controls
  contentFilter: undefined;
  hideStories: undefined;
  recordVoice: undefined;
  recordingDetails: { id: string };
  customizeReadingVoice: undefined;
  addVoice: undefined;
  bedTimeMode: undefined;
  dailyLimit: undefined;
  activityLog: { childID: string };
};

type ParentsNavigatorProp = BottomTabNavigationProp<ParentsNavigatorParamList>;

const Tab = createBottomTabNavigator<ParentsNavigatorParamList>();

const ParentsTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
      }}
    >
      <Tab.Screen name="home" component={ParentsHome} />
      <Tab.Screen name="childStoryDetails" component={ChildStoryDetails} />
      <Tab.Screen name="storiesList" component={StoriesListScreen} />
      <Tab.Screen
        name="interactiveStories"
        component={InteractiveStoriesScreen}
      />
      <Tab.Screen name="plainStories" component={PlainStoriesScreen} />
      <Tab.Screen name="dailyChallenge" component={DailyChallengeScreen} />
      <Tab.Screen name="challengeTracker" component={ChallengeTracker} />

      <Tab.Screen name="favourite" component={FavouriteScreen} />

      <Tab.Screen name="reports" component={ReportsSreen} />
      <Tab.Screen name="reportDetails" component={ReportDetailsScreen} />

      <Tab.Screen name="controls" component={ControlsScreen} />
      <Tab.Screen name="contentFilter" component={ContentFilterScreen} />
      <Tab.Screen name="hideStories" component={HideStoriesScreen} />
      <Tab.Screen name="recordVoice" component={RecordVoice} />
      <Tab.Screen name="recordingDetails" component={RecordingDetails} />
      <Tab.Screen
        name="customizeReadingVoice"
        component={CustomizeReadingVoice}
      />
      <Tab.Screen name="addVoice" component={AddVoice} />
      <Tab.Screen name="bedTimeMode" component={BedTimeMode} />
      <Tab.Screen name="dailyLimit" component={DailyLimit} />
      <Tab.Screen name="activityLog" component={ActivityLog} />
    </Tab.Navigator>
  );
};

export type { ParentsNavigatorProp };
export default ParentsTabNavigator;
