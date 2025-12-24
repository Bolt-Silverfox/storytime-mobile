import { NavigatorScreenParams } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import useGetUserProfile from "../hooks/tanstack/queryHooks/useGetUserProfile";
import AddChildScreen from "../screens/AddChild";
import KidSelectionScreen from "../screens/KidSelectionScreen";
import KidsNavigator, { KidsNavigatorParamList } from "./KidsNavigator";
import KidsSetupNavigator, {
  KidsSetupNavigatorParamList,
} from "./KidsSetupNavigator";
import ParentAuthNavigator from "./ParentAuthNavigator";
import ParentProfileSetupNavigator, {
  ParentProfileSetupParamList,
} from "./ParentProfileSetupNavigator";
import ParentsTabNavigator from "./ParentsNavigator";
import ProfileNavigator, {
  ProfileNavigatorParamList,
} from "./ProfileNavigator";
import LoadingOverlay from "../components/LoadingOverlay";
import useAuth from "../contexts/AuthContext";

type ProtectedRoutesParamList = {
  selection: undefined;
  parents: undefined;
  kid: NavigatorScreenParams<KidsNavigatorParamList>;
  addChild: undefined;
  userProfile: NavigatorScreenParams<ProfileNavigatorParamList>;
  kidsSetup: NavigatorScreenParams<KidsSetupNavigatorParamList>;
  parentAuth: undefined;
  parentProfileSetup: NavigatorScreenParams<ParentProfileSetupParamList>;
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
  const isUserProfileSetupComplete = data?.profile.language && data?.pinSet;
  // i removed the number of kids criteria cos it's not necessary
  // && data?.numberOfKids > 0;

  // RESET THE NAVIGATION WHEN YOU SKIP THE PAERENT PROFILE SETUP

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={
        isUserProfileSetupComplete ? "selection" : "parentProfileSetup"
      }
    >
      <Stack.Screen name="selection" component={KidSelectionScreen} />
      <Stack.Screen name="parents" component={ParentsTabNavigator} />
      <Stack.Screen name="addChild" component={AddChildScreen} />
      <Stack.Screen name="kid" component={KidsNavigator} />
      <Stack.Screen name="userProfile" component={ProfileNavigator} />
      <Stack.Screen name="kidsSetup" component={KidsSetupNavigator} />
      <Stack.Screen name="parentAuth" component={ParentAuthNavigator} />
      <Stack.Screen
        name="parentProfileSetup"
        component={ParentProfileSetupNavigator}
      />
    </Stack.Navigator>
  );
};

export type { ProtectedRoutesNavigationProp, ProtectedRoutesParamList };
export default ProtectedRoutesNavigator;
