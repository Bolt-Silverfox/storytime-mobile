import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import CompleteProfileNewScreen from "../screens/parentProfileSetup/CompleteProfileNewScreen";
import SetUserPinScreen from "../screens/parentProfileSetup/SetUserPinScreen";
import KidsSetupScreen from "../screens/parentProfileSetup/KidsSetupScreen";
import EnableBioMetrics from "../screens/parentProfileSetup/EnableBioMetrics";

type ParentProfileSetupParamList = {
  index: undefined;
  setPin: undefined;
  kidSetup: undefined;
  enableBiometrics: undefined;
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
      <Stack.Screen name="enableBiometrics" component={EnableBioMetrics} />
    </Stack.Navigator>
  );
};

export type { ParentProfileSetupParamList, ParentProfileSetupProp };
export default ParentProfileSetupNavigator;
