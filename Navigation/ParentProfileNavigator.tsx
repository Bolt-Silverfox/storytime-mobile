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
import EditParentImage from "../screens/parents/profile/EditParentImage";
import ManagePassword from "../screens/parents/profile/ManagePassword";
import ResetParentPassword from "../screens/parents/profile/ResetParentPassword";
import ResetPasswordSuccess from "../screens/parents/profile/ResetPasswordSuccessFul";
import SetPin from "../screens/parents/profile/SetPin";
import EnableBiometrics from "../screens/parents/profile/EnableBiometrics";
import HelpAndSupport from "../screens/parents/profile/HelpAndSupport";
import FAQ from "../screens/parents/profile/FAQ";
import Feedback from "../screens/parents/profile/FeedBack";
import FeedBackMessageSuccess from "../screens/parents/profile/FeedBackMessageSuccessful";
import ContactUs from "../screens/parents/profile/ContactUs";
import TermsAndConditions from "../screens/parents/profile/TermsAndConditions";

type ParentProfileNavigatorParamList = {
  indexPage: undefined;
  editParentImage: undefined;
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

  managePassword: undefined;
  resetParentPassword: undefined;
  resetPasswordSuccessful: undefined;
  setPin: undefined;
  enableBiometrics: undefined;

  helpAndSupport: undefined;
  FAQ: undefined;
  feedBack: undefined;
  feedBackMessageSuccessful: undefined;
  contactUs: undefined;
  termsAndConditions: undefined;

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
      <Stack.Screen name="editParentImage" component={EditParentImage} />

      <Stack.Screen
        name="manageChildProfiles"
        component={ManageChildProfilesScreen}
      />

      <Stack.Screen name="managePassword" component={ManagePassword} />
      <Stack.Screen
        name="resetParentPassword"
        component={ResetParentPassword}
      />
      <Stack.Screen
        name="resetPasswordSuccessful"
        component={ResetPasswordSuccess}
      />
      <Stack.Screen name="setPin" component={SetPin} />
      <Stack.Screen name="enableBiometrics" component={EnableBiometrics} />

      <Stack.Screen name="editChildProfile" component={EditChildProfile} />
      <Stack.Screen name="addChild" component={AddChildScreen} />
      <Stack.Screen name="deleteProfileSucessful" component={DeleteSuccess} />

      <Stack.Screen name="helpAndSupport" component={HelpAndSupport} />
      <Stack.Screen name="FAQ" component={FAQ} />
      <Stack.Screen name="feedBack" component={Feedback} />
      <Stack.Screen
        name="feedBackMessageSuccessful"
        component={FeedBackMessageSuccess}
      />
      <Stack.Screen name="contactUs" component={ContactUs} />
      <Stack.Screen name="termsAndConditions" component={TermsAndConditions} />

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
