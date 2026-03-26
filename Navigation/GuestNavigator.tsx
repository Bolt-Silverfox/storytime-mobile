import { NavigatorScreenParams } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GetPremiumScreen from "../screens/parents/home/GetPremiumScreen";
import GuestTabNavigator, { GuestTabParamList } from "./GuestTabNavigator";
import StoryNavigator, { StoryNavigatorParamList } from "./StoryNavigator";

type GuestNavigatorParamList = {
  guestTabs: NavigatorScreenParams<GuestTabParamList>;
  stories: NavigatorScreenParams<StoryNavigatorParamList>;
  getPremium: undefined;
};

type GuestNavigatorProp = NativeStackNavigationProp<GuestNavigatorParamList>;

const Stack = createNativeStackNavigator<GuestNavigatorParamList>();

const GuestNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="guestTabs" component={GuestTabNavigator} />
      <Stack.Screen name="stories" component={StoryNavigator} />
      <Stack.Screen name="getPremium" component={GetPremiumScreen} />
    </Stack.Navigator>
  );
};

export type { GuestNavigatorParamList, GuestNavigatorProp };
export default GuestNavigator;
