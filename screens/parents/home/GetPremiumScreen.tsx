import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import SubscriptionScreen from "../../../components/screens/SubscriptionScreen";
import { ParentsNavigatorProp } from "../../../Navigation/ParentsNavigator";
import {
  ProtectedRoutesNavigationProp,
  ProtectedRoutesParamList,
} from "../../../Navigation/ProtectedNavigator";

type RoutePropTypes = RouteProp<ProtectedRoutesParamList, "getPremium">;

const GetPremiumScreen = () => {
  const { params } = useRoute<RoutePropTypes>();
  const navigator = useNavigation<ProtectedRoutesNavigationProp>();

  return (
    <SubscriptionScreen
      selected={params.selected}
      goBack={() => navigator.goBack()}
    />
  );
};

export default GetPremiumScreen;
