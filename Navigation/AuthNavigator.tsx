import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import ConfirmResetPasswordTokenScreen from "../screens/auth/ConfirmResetPasswordToken";
import InputNewPassword from "../screens/auth/InputNewPassword";
import LoginScreen from "../screens/auth/LoginScreen";
import OnBoardingScreen from "../screens/auth/OnBoardingScreen";
import PrivacyScreen from "../screens/auth/PrivacyScreen";
import RequestEmailVerification from "../screens/auth/RequestEmailVerification";
import ResetPasswordScreen from "../screens/auth/ResetPassword";
import SignupScreen from "../screens/auth/SignupScreen";
import TermsOfServiceScreen from "../screens/auth/TermsOfServiceScreen";
import VerifyEmailScreen from "../screens/auth/VerifyEmailScreen";

type AuthNavigatorParamList = {
  onBoarding: undefined;
  signUp: undefined;
  login: undefined;
  resetPassword: undefined;
  requestEmailVerification: undefined;
  createNewPassword: undefined;
  verifyEmail: { email: string };
  privacyScreen: undefined;
  termsOfService: undefined;
  confirmResetPasswordToken: { email: string };
  inputNewPassword: { email: string; token: string };
};

type AuthNavigatorProp = NativeStackNavigationProp<AuthNavigatorParamList>;
const Stack = createNativeStackNavigator<AuthNavigatorParamList>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="onBoarding" component={OnBoardingScreen} />
      <Stack.Screen name="signUp" component={SignupScreen} />
      <Stack.Screen name="login" component={LoginScreen} />
      <Stack.Screen name="resetPassword" component={ResetPasswordScreen} />
      <Stack.Screen
        name="requestEmailVerification"
        component={RequestEmailVerification}
      />
      <Stack.Screen name="verifyEmail" component={VerifyEmailScreen} />
      <Stack.Screen name="privacyScreen" component={PrivacyScreen} />
      <Stack.Screen name="termsOfService" component={TermsOfServiceScreen} />
      <Stack.Screen
        name="confirmResetPasswordToken"
        component={ConfirmResetPasswordTokenScreen}
      />
      <Stack.Screen name="inputNewPassword" component={InputNewPassword} />
    </Stack.Navigator>
  );
};

export type { AuthNavigatorParamList, AuthNavigatorProp };
export default AuthNavigator;
