import { NavigatorScreenParams } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CustomSplashScreen from "../components/CustomSplashScreen";
import useAuth from "../contexts/AuthContext";
import useGetUserProfile from "../hooks/tanstack/queryHooks/useGetUserProfile";
import GetPremiumScreen from "../screens/parents/home/GetPremiumScreen";
import NotificationsNavigator, {
  NotificationsNavigatorParamList,
} from "./NotificationsNavigator";
import ParentsTabNavigator, {
  ParentsNavigatorParamList,
} from "./ParentsNavigator";
import StoryNavigator, { StoryNavigatorParamList } from "./StoryNavigator";

type ProtectedRoutesParamList = {
  parents: NavigatorScreenParams<ParentsNavigatorParamList>;
  notification: NavigatorScreenParams<NotificationsNavigatorParamList>;
  getPremium: undefined;
  stories: NavigatorScreenParams<StoryNavigatorParamList>;
};

type ProtectedRoutesNavigationProp =
  NativeStackNavigationProp<ProtectedRoutesParamList>;

const Stack = createNativeStackNavigator<ProtectedRoutesParamList>();

const ProtectedRoutesNavigator = () => {
  const { isPending, error } = useGetUserProfile();
  const { logout } = useAuth();

  if (isPending) return <CustomSplashScreen />;
  if (error) {
    logout();
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="parents" component={ParentsTabNavigator} />
      <Stack.Screen name="notification" component={NotificationsNavigator} />
      <Stack.Screen name="getPremium" component={GetPremiumScreen} />
      <Stack.Screen name="stories" component={StoryNavigator} />
    </Stack.Navigator>
  );
};

export type { ProtectedRoutesNavigationProp, ProtectedRoutesParamList };
export default ProtectedRoutesNavigator;
