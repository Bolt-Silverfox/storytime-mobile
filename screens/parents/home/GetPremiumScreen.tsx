import { useNavigation } from "@react-navigation/native";
import SubscriptionScreen from "../../../components/screens/SubscriptionScreen";
import { ParentsNavigatorProp } from "../../../Navigation/ParentsNavigator";

const GetPremiumScreen = () => {
  const navigator = useNavigation<ParentsNavigatorProp>();

  return <SubscriptionScreen goBack={() => navigator.goBack()} />;
};

export default GetPremiumScreen;
