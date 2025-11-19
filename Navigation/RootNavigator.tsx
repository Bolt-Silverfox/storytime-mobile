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

type RootNavigatorParamList = {
  auth: NavigatorScreenParams<AuthNavigatorParamList>;
  home: undefined;
  completeProfile: undefined;
};
type RootNavigatorProp = NativeStackNavigationProp<RootNavigatorParamList>;
const Stack = createNativeStackNavigator<RootNavigatorParamList>();

const RootNavigator = () => {
  const { user, logout } = useAuth();

  useEffect(() => {
    setLogoutCallBack(logout);
  }, [logout]);
  if (user === undefined) return <CustomSplashScreen />;

  return (
    <Stack.Navigator>
      {!user ? (
        <Stack.Screen
          name="auth"
          component={AuthNavigator}
          options={{ headerShown: false }}
        />
      ) : (
        <Stack.Screen name="home" component={HomeScree} />
      )}
    </Stack.Navigator>
  );
};

export type { RootNavigatorProp };
export default RootNavigator;
