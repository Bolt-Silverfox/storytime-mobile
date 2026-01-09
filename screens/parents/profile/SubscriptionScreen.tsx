import { useNavigation } from "@react-navigation/native";
import { ParentProfileNavigatorProp } from "../../../Navigation/ParentProfileNavigator";
import SubscriptionComponent from "../../../components/screens/SubscriptionScreen";

const SubscriptionScreen = () => {
  const navigator = useNavigation<ParentProfileNavigatorProp>();
  return <SubscriptionComponent goBack={() => navigator.goBack()} />;
};

export default SubscriptionScreen;
