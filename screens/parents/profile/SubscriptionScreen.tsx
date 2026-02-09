import { useNavigation } from "@react-navigation/native";
import { ParentProfileNavigatorProp } from "../../../Navigation/ParentProfileNavigator";
import SubscriptionScreenComponent from "../../../components/screens/SubscriptionScreenComponent";

const SubscriptionScreen = () => {
  const navigator = useNavigation<ParentProfileNavigatorProp>();
  return <SubscriptionScreenComponent goBack={() => navigator.goBack()} />;
};

export default SubscriptionScreen;
