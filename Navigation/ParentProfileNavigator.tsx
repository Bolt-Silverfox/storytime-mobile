import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import ActivityLog from "../screens/parents/controls/ActivityLog";
import AddVoice from "../screens/parents/controls/AddVoice";
import BedTimeMode from "../screens/parents/controls/BedTimeMode";
import CustomizeReadingVoice from "../screens/parents/controls/CustomizeReadingVoice";
import DailyLimit from "../screens/parents/controls/DailyLimit";
import HideStoriesScreen from "../screens/parents/controls/HideStoriesScreen";
import RecordVoice from "../screens/parents/controls/RecordVoice";
import RecordingDetails from "../screens/parents/controls/RecordingDetails";
import AddChildScreen from "../screens/parents/profile/AddChildScreen";
import DeleteSuccess from "../screens/parents/profile/DeleteSuccess";
import EditChildProfile from "../screens/parents/profile/EditChildProfile";
import ManageChildProfilesScreen from "../screens/parents/profile/ManageChildProfilesScreen";
import ProfileScreen from "../screens/parents/profile/ProfileScreen";

type ParentProfileNavigatorParamList = {
  indexPage: undefined;
  manageChildProfiles: undefined;
  editChildProfile: {
    name: string;
    ageRange: string;
    imageUrl: string | null;
    userName?: string;
    id: string;
  };
  addChild: undefined;
  deleteProfileSucessful: undefined;

  hideStories: undefined;
  recordVoice: undefined;
  recordingDetails: { id: string };
  customizeReadingVoice: undefined;
  addVoice: undefined;
  bedTimeMode: undefined;
  dailyLimit: undefined;
  activityLog: { childID: string };
  editChild: { childId: string };
};

type ParentProfileNavigatorProp =
  NativeStackNavigationProp<ParentProfileNavigatorParamList>;
const Stack = createNativeStackNavigator<ParentProfileNavigatorParamList>();

const ParentProfileNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="indexPage" component={ProfileScreen} />
      <Stack.Screen
        name="manageChildProfiles"
        component={ManageChildProfilesScreen}
      />
      <Stack.Screen name="editChildProfile" component={EditChildProfile} />
      <Stack.Screen name="addChild" component={AddChildScreen} />
      <Stack.Screen name="deleteProfileSucessful" component={DeleteSuccess} />

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

export type { ParentProfileNavigatorParamList, ParentProfileNavigatorProp };
export default ParentProfileNavigator;
