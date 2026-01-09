import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import BlockedStoriesScreen from "../screens/parents/profile/BlockedStoriesScreen";
import DeleteAccount from "../screens/parents/profile/DeleteAccount";
import DeleteAccountConfirmation from "../screens/parents/profile/DeleteAccountConfirmation";
import EditParentImage from "../screens/parents/profile/EditParentImage";
import EnableBiometrics from "../screens/parents/profile/EnableBiometrics";
import { NavigatorScreenParams } from "@react-navigation/native";
import ManagePassword from "../screens/parents/profile/ManagePassword";
import NotificationSettingsScreen from "../screens/parents/profile/NotificationSettingsScreen";
import ProfileScreen from "../screens/parents/profile/ProfileScreen";
import ResetParentPassword from "../screens/parents/profile/ResetParentPassword";
import SetPin from "../screens/parents/profile/SetPin";
import SubscriptionScreen from "../screens/parents/profile/SubscriptionScreen";
import UpdateInAppPin from "../screens/parents/profile/UpdateInAppPin";
import HelpAndSupportNavigator, {
  HelpAndSupportNavigatorParamList,
} from "./HelpAndSupportNavigator";
import ManageChildProfilesNavigator, {
  ManageChildProfilesNavigatorParamList,
} from "./ManageChildProfilesNavigator";

type ParentProfileNavigatorParamList = {
  indexPage: undefined;
  editParentImage: undefined;
  manageChildProfiles: NavigatorScreenParams<ManageChildProfilesNavigatorParamList>;
  notificationSettings: undefined;
  blockedStories: undefined;
  managePassword: undefined;
  enableBiometrics: undefined;
  subscription: undefined;
  helpAndSupport: NavigatorScreenParams<HelpAndSupportNavigatorParamList>;
  resetParentPassword: undefined;
  setPin: undefined;
  updatePin: undefined;
  deleteAccount: undefined;
  deleteAccountConfirmation: undefined;
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
        component={ManageChildProfilesNavigator}
      />
      <Stack.Screen
        name="notificationSettings"
        component={NotificationSettingsScreen}
      />
      <Stack.Screen name="blockedStories" component={BlockedStoriesScreen} />
      <Stack.Screen name="managePassword" component={ManagePassword} />
      <Stack.Screen name="enableBiometrics" component={EnableBiometrics} />
      <Stack.Screen name="subscription" component={SubscriptionScreen} />
      <Stack.Screen name="helpAndSupport" component={HelpAndSupportNavigator} />
      <Stack.Screen
        name="resetParentPassword"
        component={ResetParentPassword}
      />
      <Stack.Screen name="setPin" component={SetPin} />
      <Stack.Screen name="updatePin" component={UpdateInAppPin} />
      <Stack.Screen name="deleteAccount" component={DeleteAccount} />
      <Stack.Screen
        name="deleteAccountConfirmation"
        component={DeleteAccountConfirmation}
      />
    </Stack.Navigator>
  );
};

export type { ParentProfileNavigatorParamList, ParentProfileNavigatorProp };
export default ParentProfileNavigator;
