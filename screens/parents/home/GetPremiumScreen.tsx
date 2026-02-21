import { useNavigation } from "@react-navigation/native";
import SubscriptionScreen from "../../../components/screens/SubscriptionScreenComponent";
import { ProtectedRoutesNavigationProp } from "../../../Navigation/ProtectedNavigator";

const GetPremiumScreen = () => {
  const navigator = useNavigation<ProtectedRoutesNavigationProp>();

  return <SubscriptionScreen goBack={() => navigator.goBack()} />;
};

export default GetPremiumScreen;
