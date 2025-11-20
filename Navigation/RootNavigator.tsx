import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import AuthNavigator, { AuthNavigatorParamList } from "./AuthNavigator";
import useAuth from "../contexts/AuthContext";
import HomeScree from "../screens/HomeScree";
import CustomSplashScreen from "../components/CustomSplashScreen";
import { NavigatorScreenParams } from "@react-navigation/native";
import { useEffect } from "react";
import { setLogoutCallBack } from "../apiFetch";
import { View } from "react-native";
import ParentsTabNavigator from "./ParentsNavigator";

type RootNavigatorParamList = {
  auth: NavigatorScreenParams<AuthNavigatorParamList>;
  home: undefined;
  completeProfile: undefined;
  parents: undefined;
};
type RootNavigatorProp = NativeStackNavigationProp<RootNavigatorParamList>;
const Stack = createNativeStackNavigator<RootNavigatorParamList>();

const RootNavigator = () => {
  const { user, logout } = useAuth();

  useEffect(() => {
    setLogoutCallBack(logout);
  }, [logout]);
  if (user === undefined) return <CustomSplashScreen />;
  const isProfileComplete = true;

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
          name="home"
          component={HomeScree}
        />
      )}
    </Stack.Navigator>
  );
};

export type { RootNavigatorProp };
export default RootNavigator;
