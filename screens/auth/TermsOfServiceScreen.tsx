import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorProp } from "../../Navigation/AuthNavigator";
import { iosTermsAndConditionsData, androidTermsAndConditionsData } from "../../data";
import DisclaimerInformationComponent from "../../components/screens/DisclaimerInformationComponent";
import { Platform } from "react-native";

const TermsOfServiceScreen = () => {
  const navigator = useNavigation<AuthNavigatorProp>();
  return (
    <DisclaimerInformationComponent
      pageTitle="Terms & Conditions"
      goBack={() => navigator.goBack()}
      data={Platform.OS === 'ios' ? iosTermsAndConditionsData : androidTermsAndConditionsData}
    />
  );
};

export default TermsOfServiceScreen;
