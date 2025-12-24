import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import CompleteProfileNewScreen from "../screens/auth/CompleteProfileNewScreen";
import SetUserPinScreen from "../screens/auth/SetUserPinScreen";
import KidsSetupScreen from "../screens/auth/KidsSetupScreen";

type ParentProfileSetupParamList = {
  index: undefined;
  setPin: undefined;
  kidSetup: undefined;
};

type ParentProfileSetupProp =
  NativeStackNavigationProp<ParentProfileSetupParamList>;
const Stack = createNativeStackNavigator<ParentProfileSetupParamList>();

const ParentProfileSetupNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" component={CompleteProfileNewScreen} />
      <Stack.Screen name="setPin" component={SetUserPinScreen} />
      <Stack.Screen name="kidSetup" component={KidsSetupScreen} />
    </Stack.Navigator>
  );
};

export type { ParentProfileSetupParamList, ParentProfileSetupProp };
export default ParentProfileSetupNavigator;
