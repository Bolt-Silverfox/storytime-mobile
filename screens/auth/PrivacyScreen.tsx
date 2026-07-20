import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorProp } from "../../Navigation/AuthNavigator";
import PrivacyScreenComponent from "../../components/screens/PrivacyScreenComponent";

const PrivacyScreen = () => {
  const navigator = useNavigation<AuthNavigatorProp>();

  return <PrivacyScreenComponent goBack={() => navigator.goBack()} />;
};

export default PrivacyScreen;
