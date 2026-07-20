import { NavigatorScreenParams } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GetPremiumScreen from "../screens/parents/home/GetPremiumScreen";
import GuestTabNavigator, { GuestTabParamList } from "./GuestTabNavigator";
import StoryNavigator, { StoryNavigatorParamList } from "./StoryNavigator";
import LoginScreen from "../screens/auth/LoginScreen";
import SignupScreen from "../screens/auth/SignupScreen";
import UnauthPaywallScreen from "../screens/auth/UnauthPaywallScreen";
import PrivacyScreen from "../screens/auth/PrivacyScreen";
import TermsOfServiceScreen from "../screens/auth/TermsOfServiceScreen";
import ResetPasswordScreen from "../screens/auth/ResetPassword";
import RequestEmailVerification from "../screens/auth/RequestEmailVerification";
import VerifyEmailScreen from "../screens/auth/VerifyEmailScreen";
import ConfirmResetPasswordTokenScreen from "../screens/auth/ConfirmResetPasswordToken";
import InputNewPassword from "../screens/auth/InputNewPassword";

type GuestNavigatorParamList = {
  guestTabs: NavigatorScreenParams<GuestTabParamList>;
  stories: NavigatorScreenParams<StoryNavigatorParamList>;
  getPremium: undefined;
  signUp: undefined;
  login: undefined;
  unauthPaywall: undefined;
  privacyScreen: undefined;
  termsOfService: undefined;
  resetPassword: undefined;
  requestEmailVerification: undefined;
  verifyEmail: { email: string };
  confirmResetPasswordToken: { email: string };
  inputNewPassword: { email: string; token: string };
};

type GuestNavigatorProp = NativeStackNavigationProp<GuestNavigatorParamList>;

const Stack = createNativeStackNavigator<GuestNavigatorParamList>();

const GuestNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="guestTabs" component={GuestTabNavigator} />
      <Stack.Screen name="stories" component={StoryNavigator} />
      <Stack.Screen name="getPremium" component={GetPremiumScreen} />
      <Stack.Screen name="signUp" component={SignupScreen} />
      <Stack.Screen name="login" component={LoginScreen} />
      <Stack.Screen name="unauthPaywall" component={UnauthPaywallScreen} />
      <Stack.Screen name="privacyScreen" component={PrivacyScreen} />
      <Stack.Screen name="termsOfService" component={TermsOfServiceScreen} />
      <Stack.Screen name="resetPassword" component={ResetPasswordScreen} />
      <Stack.Screen
        name="requestEmailVerification"
        component={RequestEmailVerification}
      />
      <Stack.Screen name="verifyEmail" component={VerifyEmailScreen} />
      <Stack.Screen
        name="confirmResetPasswordToken"
        component={ConfirmResetPasswordTokenScreen}
      />
      <Stack.Screen name="inputNewPassword" component={InputNewPassword} />
    </Stack.Navigator>
  );
};

export type { GuestNavigatorParamList, GuestNavigatorProp };
export default GuestNavigator;
