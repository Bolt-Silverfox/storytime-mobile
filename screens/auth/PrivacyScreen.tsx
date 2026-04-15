import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorProp } from "../../Navigation/AuthNavigator";
import DisclaimerInformationComponent from "../../components/screens/DisclaimerInformationComponent";
import { androidPrivacyPolicyData, iosPrivacyPolicyData } from "../../data";
import { Platform } from "react-native";

const PrivacyScreen = () => {
  const navigator = useNavigation<AuthNavigatorProp>();
  return (
    <DisclaimerInformationComponent
      pageTitle="Privacy Policy"
      goBack={() => navigator.goBack()}
      data={
        Platform.OS === "ios" ? iosPrivacyPolicyData : androidPrivacyPolicyData
      }
    />
  );
};

export default PrivacyScreen;
