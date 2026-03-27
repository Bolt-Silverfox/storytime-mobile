import { NavigatorScreenParams } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GetPremiumScreen from "../screens/parents/home/GetPremiumScreen";
import GuestTabNavigator, { GuestTabParamList } from "./GuestTabNavigator";
import StoryNavigator, { StoryNavigatorParamList } from "./StoryNavigator";
import LoginScreen from "../screens/auth/LoginScreen";
import SignupScreen from "../screens/auth/SignupScreen";
import UnauthPaywallScreen from "../screens/auth/UnauthPaywallScreen";

type GuestNavigatorParamList = {
  guestTabs: NavigatorScreenParams<GuestTabParamList>;
  stories: NavigatorScreenParams<StoryNavigatorParamList>;
  getPremium: undefined;
  signUp: undefined;
  login: undefined;
  unauthPaywall: undefined;
};

type GuestNavigatorProp = NativeStackNavigationProp<GuestNavigatorParamList>;

const Stack = createNativeStackNavigator<GuestNavigatorParamList>();

const GuestNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="guestTabs" component={GuestTabNavigator} />
      <Stack.Screen name="stories" component={StoryNavigator} />
      <Stack.Screen name="getPremium" component={GetPremiumScreen} />
      <Stack.Screen name="signUp" component={SignupScreen} />
      <Stack.Screen name="login" component={LoginScreen} />
      <Stack.Screen name="unauthPaywall" component={UnauthPaywallScreen} />
    </Stack.Navigator>
  );
};

export type { GuestNavigatorParamList, GuestNavigatorProp };
export default GuestNavigator;
