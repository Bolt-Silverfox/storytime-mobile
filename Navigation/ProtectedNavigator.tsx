import { NavigatorScreenParams } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AddChildScreen from "../screens/AddChild";
import KidSelectionScreen from "../screens/KidSelectionScreen";
import KidsNavigator, { KidsNavigatorParamList } from "./KidsNavigator";
import KidsSetupNavigator, {
  KidsSetupNavigatorParamList,
} from "./KidsSetupNavigator";
import ParentAuthNavigator from "./ParentAuthNavigator";
import ParentsTabNavigator from "./ParentsNavigator";
import ProfileNavigator, {
  ProfileNavigatorParamList,
} from "./ProfileNavigator";

type ProtectedRoutesParamList = {
  selection: undefined;
  parents: undefined;
  kid: NavigatorScreenParams<KidsNavigatorParamList>;
  addChild: undefined;
  userProfile: NavigatorScreenParams<ProfileNavigatorParamList>;
  kidsSetup: NavigatorScreenParams<KidsSetupNavigatorParamList>;
  parentAuth: undefined;
};

type ProtectedRoutesNavigationProp =
  NativeStackNavigationProp<ProtectedRoutesParamList>;

const Stack = createNativeStackNavigator<ProtectedRoutesParamList>();

const ProtectedRoutesNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="selection" component={KidSelectionScreen} />
      <Stack.Screen name="parents" component={ParentsTabNavigator} />
      <Stack.Screen name="addChild" component={AddChildScreen} />
      <Stack.Screen name="kid" component={KidsNavigator} />
      <Stack.Screen name="userProfile" component={ProfileNavigator} />
      <Stack.Screen name="kidsSetup" component={KidsSetupNavigator} />
      <Stack.Screen name="parentAuth" component={ParentAuthNavigator} />
    </Stack.Navigator>
  );
};

export type { ProtectedRoutesNavigationProp, ProtectedRoutesParamList };
export default ProtectedRoutesNavigator;
