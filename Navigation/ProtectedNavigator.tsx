import { NavigatorScreenParams } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import ParentsTabNavigator, {
  ParentsNavigatorParamList,
} from "./ParentsNavigator";
import CompleteProfileScreen from "../screens/auth/CompleteProfileScreen";
import TestComponent from "../screens/auth/TestComponent";

type ProtectedScreensNavigatorParamList = {
  profile: undefined;
  parentHome: NavigatorScreenParams<ParentsNavigatorParamList>;
};

type ProtectedScreensNavigatorProp =
  NativeStackNavigationProp<ProtectedScreensNavigatorParamList>;
const Stack = createNativeStackNavigator<ProtectedScreensNavigatorParamList>();

const ProtectedScreensNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="parentHome" component={ParentsTabNavigator} />
      <Stack.Screen name="profile" component={TestComponent} />
    </Stack.Navigator>
  );
};

export type {
  ProtectedScreensNavigatorProp,
  ProtectedScreensNavigatorParamList,
};
export default ProtectedScreensNavigator;
