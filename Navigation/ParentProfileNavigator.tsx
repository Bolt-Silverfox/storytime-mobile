import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import DeleteAccount from "../screens/parents/profile/DeleteAccount";
import DeleteAccountConfirmation from "../screens/parents/profile/DeleteAccountConfirmation";
import EditParentImage from "../screens/parents/profile/EditParentImage";
import { NavigatorScreenParams } from "@react-navigation/native";
import NotificationSettingsScreen from "../screens/parents/profile/NotificationSettingsScreen";
import ProfileScreen from "../screens/parents/profile/ProfileScreen";
import ResetParentPassword from "../screens/parents/profile/ResetParentPassword";
import SubscriptionScreen from "../screens/parents/profile/SubscriptionScreen";
import HelpAndSupportNavigator, {
  HelpAndSupportNavigatorParamList,
} from "./HelpAndSupportNavigator";

type ParentProfileNavigatorParamList = {
  indexPage: undefined;
  notificationSettings: undefined;
  resetParentPassword: undefined;
  subscription: undefined;
  helpAndSupport: NavigatorScreenParams<HelpAndSupportNavigatorParamList>;
  deleteAccount: undefined;
  deleteAccountConfirmation: undefined;
  editParentImage: undefined;
};

type ParentProfileNavigatorProp =
  NativeStackNavigationProp<ParentProfileNavigatorParamList>;
const Stack = createNativeStackNavigator<ParentProfileNavigatorParamList>();

const ParentProfileNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="indexPage" component={ProfileScreen} />
      <Stack.Screen
        name="notificationSettings"
        component={NotificationSettingsScreen}
      />
      <Stack.Screen
        name="resetParentPassword"
        component={ResetParentPassword}
      />
      <Stack.Screen name="subscription" component={SubscriptionScreen} />
      <Stack.Screen name="helpAndSupport" component={HelpAndSupportNavigator} />
      <Stack.Screen name="deleteAccount" component={DeleteAccount} />
      <Stack.Screen
        name="deleteAccountConfirmation"
        component={DeleteAccountConfirmation}
      />
      <Stack.Screen name="editParentImage" component={EditParentImage} />
    </Stack.Navigator>
  );
};

export type { ParentProfileNavigatorParamList, ParentProfileNavigatorProp };
export default ParentProfileNavigator;
