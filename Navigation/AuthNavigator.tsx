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
import OnBoardingScreen from "../screens/auth/OnBoardingScreen";
import ChooseUser from "../screens/auth/ChooseUser";

type AuthNavigatorParamList = {
  login: undefined;
  signUp: undefined;
  resetPassword: undefined;
  createNewPassword: undefined;
  verifyEmail: undefined;
  resetSuccessful: undefined;
  onBoarding: undefined;
  chooseUser: undefined;
};

type AuthNavigatorProp = NativeStackNavigationProp<AuthNavigatorParamList>;
const Stack = createNativeStackNavigator<AuthNavigatorParamList>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="onBoarding" component={OnBoardingScreen} />
      <Stack.Screen name="chooseUser" component={ChooseUser} />
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
    </Stack.Navigator>
  );
};

export type { AuthNavigatorParamList, AuthNavigatorProp };
export default AuthNavigator;
