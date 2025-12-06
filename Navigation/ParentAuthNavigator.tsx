import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import VerifyPinScreen from "../screens/parents/auth/VerifyPinScreen";
import VerifyTokenScreen from "../screens/parents/auth/VerifyTokenScreen";
import ResetPinScreen from "../screens/parents/auth/ResetPinScreen";

type ParentAuthNavigatorParamList = {
  verifyPin: undefined;
  verifyToken: undefined;
  resetPin: { otp: string };
};

type ParentAuthNavigatorProps =
  NativeStackNavigationProp<ParentAuthNavigatorParamList>;
const Stack = createNativeStackNavigator<ParentAuthNavigatorParamList>();

const ParentAuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="verifyPin" component={VerifyPinScreen} />
      <Stack.Screen name="verifyToken" component={VerifyTokenScreen} />
      <Stack.Screen name="resetPin" component={ResetPinScreen} />
    </Stack.Navigator>
  );
};

export type { ParentAuthNavigatorProps, ParentAuthNavigatorParamList };
export default ParentAuthNavigator;
