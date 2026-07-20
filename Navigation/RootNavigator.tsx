import { NavigatorScreenParams } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { useEffect } from "react";
import { setLogoutCallBack } from "../apiFetch";
import CustomSplashScreen from "../components/CustomSplashScreen";
import useAuth from "../contexts/AuthContext";
import AuthNavigator, { AuthNavigatorParamList } from "./AuthNavigator";
import GuestNavigator, { GuestNavigatorParamList } from "./GuestNavigator";
import ProtectedRoutesNavigator from "./ProtectedNavigator";

type RootNavigatorParamList = {
  auth: NavigatorScreenParams<AuthNavigatorParamList>;
  guest: NavigatorScreenParams<GuestNavigatorParamList>;
  protected: undefined;
};

type RootNavigatorProp = NativeStackNavigationProp<RootNavigatorParamList>;
const Stack = createNativeStackNavigator<RootNavigatorParamList>();

const RootNavigator = () => {
  const { user, isGuest, logout } = useAuth();

  useEffect(() => {
    setLogoutCallBack(logout);
  }, [logout]);

  if (user === undefined) return <CustomSplashScreen />;
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="protected" component={ProtectedRoutesNavigator} />
      ) : isGuest ? (
        <Stack.Screen name="guest" component={GuestNavigator} />
      ) : (
        <Stack.Screen name="auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export type { RootNavigatorParamList, RootNavigatorProp };
export default RootNavigator;
