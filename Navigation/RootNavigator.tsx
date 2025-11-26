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
import ProfileNavigator, {
  ProfileNavigatorParamList,
} from "./ProfileNavigator";
import ProtectedRoutesNavigator from "./ProtectedNavigator";
import KidsNavigator from "./KidsNavigator";

type RootNavigatorParamList = {
  auth: NavigatorScreenParams<AuthNavigatorParamList>;
  profile: NavigatorScreenParams<ProfileNavigatorParamList>;
  protected: undefined;
  kids: undefined;
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
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* {!user ? (
        <Stack.Screen
          name="auth"
          component={AuthNavigator}
          options={{ headerShown: false }}
        />
      ) : user.numberOfKids > 0 ? (
        <Stack.Screen
          options={{ headerShown: false }}
          name="protected"
          component={ProtectedRoutesNavigator}
        />
      ) : (
        <Stack.Screen
          options={{ headerShown: false }}
          name="profile"
          component={ProfileNavigator}
        />
      )} */}
      <Stack.Screen name="kids" component={KidsNavigator} />
    </Stack.Navigator>
  );
};

export type { RootNavigatorParamList, RootNavigatorProp };
export default RootNavigator;
