import { NavigatorScreenParams } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { useEffect } from "react";
import { setLogoutCallBack } from "../apiFetch";
import CustomSplashScreen from "../components/CustomSplashScreen";
import useAuth from "../contexts/AuthContext";
import useGetUserProfile from "../hooks/tanstack/queryHooks/useGetUserProfile";
import AuthNavigator, { AuthNavigatorParamList } from "./AuthNavigator";
import ParentsTabNavigator from "./ParentsNavigator";
import ProfileNavigator, {
  ProfileNavigatorParamList,
} from "./ProfileNavigator";

type RootNavigatorParamList = {
  auth: NavigatorScreenParams<AuthNavigatorParamList>;
  completeProfile: NavigatorScreenParams<ProfileNavigatorParamList>;
  parents: undefined;
};
type RootNavigatorProp = NativeStackNavigationProp<RootNavigatorParamList>;
const Stack = createNativeStackNavigator<RootNavigatorParamList>();

const RootNavigator = () => {
  const { user, logout } = useAuth();
  const { data, isPending, error } = useGetUserProfile();

  useEffect(() => {
    setLogoutCallBack(logout);
  }, [logout]);
  // if (user === undefined || isPending) return <CustomSplashScreen />;
  if (user === undefined) return <CustomSplashScreen />;
  const isProfileComplete = true;
  // const user = true;

  return (
    <Stack.Navigator>
      {!user ? (
        <Stack.Screen
          name="auth"
          component={AuthNavigator}
          options={{ headerShown: false }}
        />
      ) : isProfileComplete ? (
        <Stack.Screen
          options={{ headerShown: false }}
          name="parents"
          component={ParentsTabNavigator}
        />
      ) : (
        <Stack.Screen
          options={{ headerShown: false }}
          name="completeProfile"
          component={ProfileNavigator}
        />
      )}
    </Stack.Navigator>
  );
};

export type { RootNavigatorParamList, RootNavigatorProp };
export default RootNavigator;
