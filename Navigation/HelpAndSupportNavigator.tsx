import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import HelpAndSupportIndexScreen from "../screens/parents/profile/helpAndSupport/HelpAndSupportIndexScreen";
import FaQScreen from "../screens/parents/profile/helpAndSupport/FAQScreen";
import SuggestionsScreen from "../screens/parents/profile/helpAndSupport/SuggestionsScreen";
import ContactUsScreen from "../screens/parents/profile/helpAndSupport/ContactUsScreen";
import TermsAndConditions from "../screens/parents/profile/helpAndSupport/TermsAndConditionsScreen";
import PrivacyAndPolicyScreen from "../screens/parents/profile/helpAndSupport/PrivacyAndPolicyScreen";

type HelpAndSupportNavigatorParamList = {
  index: undefined;
  faq: undefined;
  suggestions: undefined;
  contactUs: undefined;
  termsAndConditions: undefined;
  privacyAndPolicy: undefined;
};

type HelpAndSupportNavigatorProp =
  NativeStackNavigationProp<HelpAndSupportNavigatorParamList>;

const Stack = createNativeStackNavigator<HelpAndSupportNavigatorParamList>();

const HelpAndSupportNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" component={HelpAndSupportIndexScreen} />
      <Stack.Screen name="faq" component={FaQScreen} />
      <Stack.Screen name="suggestions" component={SuggestionsScreen} />
      <Stack.Screen name="contactUs" component={ContactUsScreen} />
      <Stack.Screen name="termsAndConditions" component={TermsAndConditions} />
      <Stack.Screen
        name="privacyAndPolicy"
        component={PrivacyAndPolicyScreen}
      />
    </Stack.Navigator>
  );
};

export type { HelpAndSupportNavigatorParamList, HelpAndSupportNavigatorProp };
export default HelpAndSupportNavigator;
