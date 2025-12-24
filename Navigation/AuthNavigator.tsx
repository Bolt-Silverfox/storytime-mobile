import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import CompleteProfileScreen from "../screens/auth/CompleteProfileScreen";
import ConfirmResetPasswordTokenScreen from "../screens/auth/ConfirmResetPasswordToken";
import CreateNewPasswordScreen from "../screens/auth/CreateNewPasswordScreen";
import EmailResetSuccessfulScreen from "../screens/auth/EmailResetSuccessfulScreen";
import ImageUploadScreen from "../screens/auth/ImageUploadScreen";
import InputNewPassword from "../screens/auth/InputNewPassword";
import KidsDetailsUploadScreen from "../screens/auth/KidsDetailsUploadScreen";
import KidsInfoFormScreen from "../screens/auth/KidsInfoFormScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import OnBoardingScreen from "../screens/auth/OnBoardingScreen";
import PasswordResetSuccessfulScreen from "../screens/auth/PasswordResetSuccessfulScreen";
import PrivacyScreen from "../screens/auth/PrivacyScreen";
import RequestEmailVerification from "../screens/auth/RequestEmailVerification";
import ResetPasswordScreen from "../screens/auth/ResetPassword";
import ResetPasswordSuccessful from "../screens/auth/ResetPasswordSuccessful";
import AvatarScreen from "../screens/auth/SelectAvatarScreen";
import SignupScreen from "../screens/auth/SignupScreen";
import TermsOfServiceScreen from "../screens/auth/TermsOfServiceScreen";
import VerifyEmailScreen from "../screens/auth/VerifyEmailScreen";
import ParentProfileSetupNavigator, {
  ParentProfileSetupParamList,
} from "./ParentProfileSetupNavigator";
import { NavigatorScreenParams } from "@react-navigation/native";

type AuthNavigatorParamList = {
  login: undefined;
  signUp: undefined;
  resetPassword: undefined;
  createNewPassword: undefined;
  verifyEmail: { email: string };
  resetSuccessful: undefined;
  imageUpload: undefined;
  kidsDetailsUpload: undefined;
  onBoarding: undefined;
  completeProfile: undefined;
  home: undefined;
  kidsInfoForm: { kidsCount: number };
  avatarScreen: undefined;
  confirmResetPasswordToken: { email: string };
  inputNewPassword: { email: string; token: string };
  privacyScreen: undefined;
  termsOfService: undefined;
  emailVerificationSuccessful: undefined;
  resetPasswordSuccessful: undefined;
  requestEmailVerification: undefined;
  parentProfileSetup: NavigatorScreenParams<ParentProfileSetupParamList>;
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
      <Stack.Screen
        name="createNewPassword"
        component={CreateNewPasswordScreen}
      />
      <Stack.Screen name="verifyEmail" component={VerifyEmailScreen} />
      <Stack.Screen
        name="resetSuccessful"
        component={PasswordResetSuccessfulScreen}
      />
      <Stack.Screen name="imageUpload" component={ImageUploadScreen} />
      <Stack.Screen
        name="kidsDetailsUpload"
        component={KidsDetailsUploadScreen}
      />
      <Stack.Screen name="completeProfile" component={CompleteProfileScreen} />
      <Stack.Screen name="kidsInfoForm" component={KidsInfoFormScreen} />
      <Stack.Screen name="avatarScreen" component={AvatarScreen} />
      <Stack.Screen name="privacyScreen" component={PrivacyScreen} />
      <Stack.Screen name="termsOfService" component={TermsOfServiceScreen} />
      <Stack.Screen
        name="emailVerificationSuccessful"
        component={EmailResetSuccessfulScreen}
      />
      <Stack.Screen
        name="confirmResetPasswordToken"
        component={ConfirmResetPasswordTokenScreen}
      />
      <Stack.Screen
        name="resetPasswordSuccessful"
        component={ResetPasswordSuccessful}
      />
      <Stack.Screen name="inputNewPassword" component={InputNewPassword} />
      <Stack.Screen
        name="parentProfileSetup"
        component={ParentProfileSetupNavigator}
      />
    </Stack.Navigator>
  );
};

export type { AuthNavigatorParamList, AuthNavigatorProp };
export default AuthNavigator;
