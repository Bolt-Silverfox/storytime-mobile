import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorProp } from "../../Navigation/AuthNavigator";
import TermsAndConditionsScreenComponent from "../../components/screens/TermsAndConditionsScreenComponent";

const TermsOfServiceScreen = () => {
  const navigator = useNavigation<AuthNavigatorProp>();
  return (
    <TermsAndConditionsScreenComponent goBack={() => navigator.goBack()} />
  );
};

export default TermsOfServiceScreen;
