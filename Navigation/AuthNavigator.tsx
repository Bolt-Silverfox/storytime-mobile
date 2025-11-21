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
import ImageUploadScreen from "../screens/auth/ImageUploadScreen";
import KidsDetailsUploadScreen from "../screens/auth/KidsDetailsUploadScreen";
import OnBoardingScreen from "../screens/auth/OnBoardingScreen";
import KidsInfoFormScreen from "../screens/auth/KidsInfoFormScreen";
import AvatarScreen from "../screens/auth/SelectAvatarScreen";
import CompleteProfileScreen from "../screens/auth/CompleteProfileScreen";
import HomeScree from "../screens/HomeScree";
import ConfirmResetPasswordTokenScreen from "../screens/auth/ConfirmResetPasswordToken";
import PrivacyScreen from "../screens/auth/PrivacyScreen";
import TermsOfServiceScreen from "../screens/auth/TermsOfServiceScreen";
import EmailResetSuccessfulScreen from "../screens/auth/EmailResetSuccessfulScreen";
import RequestEmailVerification from "../screens/auth/RequestEmailVerification";

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
  privacyScreen: undefined;
  termsOfService: undefined;
  emailVerificationSuccessful: undefined;
  requestEmailVerification: undefined;
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
      <Stack.Screen name="home" component={HomeScree} />
      <Stack.Screen name="kidsInfoForm" component={KidsInfoFormScreen} />
      <Stack.Screen name="avatarScreen" component={AvatarScreen} />
      <Stack.Screen name="privacyScreen" component={PrivacyScreen} />
      <Stack.Screen name="termsOfService" component={TermsOfServiceScreen} />
      <Stack.Screen name="profileScreen" component={ProfileScreen} />
      <Stack.Screen
        name="emailVerificationSuccessful"
        component={EmailResetSuccessfulScreen}
      />
      <Stack.Screen
        name="confirmResetPasswordToken"
        component={ConfirmResetPasswordTokenScreen}
      />
    </Stack.Navigator>
  );
};

export type { AuthNavigatorParamList, AuthNavigatorProp };
export default AuthNavigator;
