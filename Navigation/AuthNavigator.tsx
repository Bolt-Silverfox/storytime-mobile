import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import LoginScreen from "../screens/auth/LoginScreen";
import SignupScreen from "../screens/auth/SignupScreen";
import ResetPasswordScreen from "../screens/auth/ResetPassword";
import CreateNewPasswordScreen from "../screens/auth/CreateNewPasswordScreen";
import VerifyEmailScreen from "../screens/auth/VerifyEmailScreen";
import PasswordResetSuccessfulScreen from "../screens/auth/PasswordResetSuccessfulScreen";
import CompleteProfileScreen from "../components/CompleteProfileScreen";

type AuthNavigatorParamList = {
  login: undefined;
  signUp: undefined;
  resetPassword: undefined;
  createNewPassword: undefined;
  verifyEmail: undefined;
  resetSuccessful: undefined;
  completeProfile: undefined;
};

type AuthNavigatorProp = NativeStackNavigationProp<AuthNavigatorParamList>;
const Stack = createNativeStackNavigator<AuthNavigatorParamList>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="signUp" component={SignupScreen} />
      <Stack.Screen name="login" component={LoginScreen} />
      <Stack.Screen name="resetPassword" component={ResetPasswordScreen} />
      <Stack.Screen
        name="createNewPassword"
        component={CreateNewPasswordScreen}
      />
      <Stack.Screen name="verifyEmail" component={VerifyEmailScreen} />
      <Stack.Screen
        name="resetSuccessful"
        component={PasswordResetSuccessfulScreen}
      />
      <Stack.Screen name="completeProfile" component={CompleteProfileScreen} />
    </Stack.Navigator>
  );
};

export type { AuthNavigatorParamList, AuthNavigatorProp };
export default AuthNavigator;
