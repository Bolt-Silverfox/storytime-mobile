import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import LinkChild from "../screens/parents/profile/LinkChild";
import ManageChild from "../screens/parents/profile/ManageChild";
import ContentFilterScreen from "../screens/parents/controls/ContentFilterScreen";
import HideStoriesScreen from "../screens/parents/controls/HideStoriesScreen";
import RecordVoice from "../screens/parents/controls/RecordVoice";
import RecordingDetails from "../screens/parents/controls/RecordingDetails";
import CustomizeReadingVoice from "../screens/parents/controls/CustomizeReadingVoice";
import AddVoice from "../screens/parents/controls/AddVoice";
import BedTimeMode from "../screens/parents/controls/BedTimeMode";
import DailyLimit from "../screens/parents/controls/DailyLimit";
import ActivityLog from "../screens/parents/controls/ActivityLog";
import EditChild from "../screens/parents/profile/EditChild";
import DeleteSuccess from "../screens/parents/profile/DeleteSuccess";

type ParentProfileNavigatorParamList = {
  contentFilter: undefined;
  hideStories: undefined;
  recordVoice: undefined;
  recordingDetails: { id: string };
  customizeReadingVoice: undefined;
  addVoice: undefined;
  bedTimeMode: undefined;
  dailyLimit: undefined;
  activityLog: { childID: string };
  editChild: { childId: string };
  deleteSuccess: undefined;
};

type ParentProfileNavigatorProp =
  NativeStackNavigationProp<ParentProfileNavigatorParamList>;
const Stack = createNativeStackNavigator<ParentProfileNavigatorParamList>();

const ParentProfileNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="editChild" component={EditChild} />
      <Stack.Screen name="deleteSuccess" component={DeleteSuccess} />
      <Stack.Screen name="contentFilter" component={ContentFilterScreen} />
      <Stack.Screen name="hideStories" component={HideStoriesScreen} />
      <Stack.Screen name="recordVoice" component={RecordVoice} />
      <Stack.Screen name="recordingDetails" component={RecordingDetails} />
      <Stack.Screen
        name="customizeReadingVoice"
        component={CustomizeReadingVoice}
      />
      <Stack.Screen name="addVoice" component={AddVoice} />
      <Stack.Screen name="bedTimeMode" component={BedTimeMode} />
      <Stack.Screen name="dailyLimit" component={DailyLimit} />
      <Stack.Screen name="activityLog" component={ActivityLog} />
    </Stack.Navigator>
  );
};

export type { ParentProfileNavigatorProp };
export default ParentProfileNavigator;
