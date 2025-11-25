import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import ParentsTabNavigator from "./ParentsNavigator";
import KidSelectionScreen from "../screens/KidSelectionScreen";
import KidDetailsScreen from "../screens/KidDetailsScreen";
import AddChildScreen from "../screens/AddChild";

type ProtectedRoutesParamList = {
  selection: undefined;
  parents: undefined;
  kidDetails: { kidId: string };
  addChild: undefined;
};

type ProtectedRoutesNavigationProp =
  NativeStackNavigationProp<ProtectedRoutesParamList>;

const Stack = createNativeStackNavigator<ProtectedRoutesParamList>();

const ProtectedRoutesNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* <Stack.Screen name="selection" component={KidSelectionScreen} /> */}
      <Stack.Screen name="parents" component={ParentsTabNavigator} />
      <Stack.Screen name="kidDetails" component={KidDetailsScreen} />
      <Stack.Screen name="addChild" component={AddChildScreen} />
    </Stack.Navigator>
  );
};

export type { ProtectedRoutesNavigationProp, ProtectedRoutesParamList };
export default ProtectedRoutesNavigator;
