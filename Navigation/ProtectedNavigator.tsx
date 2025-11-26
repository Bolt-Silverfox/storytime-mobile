import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import ParentsTabNavigator from "./ParentsNavigator";
import KidSelectionScreen from "../screens/KidSelectionScreen";
import AddChildScreen from "../screens/AddChild";
import { NavigatorScreenParams } from "@react-navigation/native";
import KidsNavigator, { KidsNavigatorParamList } from "./KidsNavigator";

type ProtectedRoutesParamList = {
  selection: undefined;
  parents: undefined;
  kid: NavigatorScreenParams<KidsNavigatorParamList>;
  addChild: undefined;
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
    </Stack.Navigator>
  );
};

export type { ProtectedRoutesNavigationProp, ProtectedRoutesParamList };
export default ProtectedRoutesNavigator;
