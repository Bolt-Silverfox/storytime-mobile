import { NavigatorScreenParams } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import DeleteAccount from "../screens/parents/profile/DeleteAccount";
import DeleteAccountConfirmation from "../screens/parents/profile/DeleteAccountConfirmation";
import EditParentImage from "../screens/parents/profile/EditParentImage";
import NotificationSettingsScreen from "../screens/parents/profile/NotificationSettingsScreen";
import ProfileScreen from "../screens/parents/profile/ProfileScreen";
import RedeemCouponScreen from "../screens/parents/profile/RedeemCouponScreen";
import LinkedAccountsScreen from "../screens/parents/profile/LinkedAccountsScreen";
import DefaultVoiceScreen from "../screens/parents/profile/DefaultVoiceScreen";
import HelpAndSupportNavigator, {
  HelpAndSupportNavigatorParamList,
} from "./HelpAndSupportNavigator";
import ChangePasswordScreen from "../screens/parents/profile/ChangePasswordScreen";
import SendResetTokenScreen from "../screens/parents/profile/SendResetTokenScreen";
import ResetPasswordScreen from "../screens/parents/profile/ResetPasswordScreen";

type ParentProfileNavigatorParamList = {
  indexPage: undefined;
  notificationSettings: undefined;
  redeemCoupon: undefined;
  helpAndSupport: NavigatorScreenParams<HelpAndSupportNavigatorParamList>;
  deleteAccount: undefined;
  deleteAccountConfirmation: undefined;
  editParentImage: undefined;
  linkedAccounts: undefined;
  defaultVoice: undefined;
  changePassword: undefined;
  sendResetToken: undefined;
  resetPassword: undefined;
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
      <Stack.Screen name="changePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="helpAndSupport" component={HelpAndSupportNavigator} />
      <Stack.Screen name="deleteAccount" component={DeleteAccount} />
      <Stack.Screen
        name="deleteAccountConfirmation"
        component={DeleteAccountConfirmation}
      />
      <Stack.Screen name="editParentImage" component={EditParentImage} />
      <Stack.Screen name="redeemCoupon" component={RedeemCouponScreen} />
      <Stack.Screen name="linkedAccounts" component={LinkedAccountsScreen} />
      <Stack.Screen name="defaultVoice" component={DefaultVoiceScreen} />
      <Stack.Screen name="sendResetToken" component={SendResetTokenScreen} />
      <Stack.Screen name="resetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
};

export type { ParentProfileNavigatorParamList, ParentProfileNavigatorProp };
export default ParentProfileNavigator;
