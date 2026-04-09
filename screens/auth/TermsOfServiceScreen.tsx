import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorProp } from "../../Navigation/AuthNavigator";
import { termsAndConditionsData } from "../../data";
import DisclaimerInformationComponent from "../../components/screens/DisclaimerInformationComponent";

const TermsOfServiceScreen = () => {
  const navigator = useNavigation<AuthNavigatorProp>();
  return (
    <DisclaimerInformationComponent
      pageTitle="Terms & Conditions"
      goBack={() => navigator.goBack()}
      data={termsAndConditionsData}
    />
  );
};

export default TermsOfServiceScreen;
