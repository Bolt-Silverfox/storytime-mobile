import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoadingOverlay from "../components/LoadingOverlay";
import useAuth from "../contexts/AuthContext";
import useGetUserProfile from "../hooks/tanstack/queryHooks/useGetUserProfile";
import ParentsTabNavigator from "./ParentsNavigator";

type ProtectedRoutesParamList = {
  parents: undefined;
};

type ProtectedRoutesNavigationProp =
  NativeStackNavigationProp<ProtectedRoutesParamList>;

const Stack = createNativeStackNavigator<ProtectedRoutesParamList>();

const ProtectedRoutesNavigator = () => {
  const { data, isPending, error } = useGetUserProfile();
  const { logout } = useAuth();

  if (isPending)
    return (
      <LoadingOverlay
        visible={isPending}
        label="Loading authentication data..."
      />
    );
  if (error) {
    logout();
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="parents" component={ParentsTabNavigator} />
    </Stack.Navigator>
  );
};

export type { ProtectedRoutesNavigationProp, ProtectedRoutesParamList };
export default ProtectedRoutesNavigator;
