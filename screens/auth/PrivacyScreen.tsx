import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorProp } from "../../Navigation/AuthNavigator";
import DisclaimerInformationComponent from "../../components/screens/DisclaimerInformationComponent";
import { privacyPolicyData } from "../../data";

const PrivacyScreen = () => {
  const navigator = useNavigation<AuthNavigatorProp>();
  return (
    <DisclaimerInformationComponent
      pageTitle="Privacy Policy"
      goBack={() => navigator.goBack()}
      data={privacyPolicyData}
    />
  );
};

export default PrivacyScreen;
