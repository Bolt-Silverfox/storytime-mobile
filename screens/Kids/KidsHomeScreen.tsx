import { RouteProp, useRoute } from "@react-navigation/native";
import { lazy } from "react";
import { View } from "react-native";
import SuspenseWrapper from "../../components/supsense/SuspenseWrapper";
import { KidsTabNavigatorParamList } from "../../Navigation/KidsTabNavigator";

const KidsHomeScreenStories = lazy(
  () => import("../../components/KidsHomeScreenStories")
);
const KidsHomeScreenHeader = lazy(
  () => import("../../components/KidsHomeScreenHeader")
);
type RouteProps = RouteProp<KidsTabNavigatorParamList, "home">;

const KidHomeScreen = () => {
  const { params } = useRoute<RouteProps>();

  return (
    <View style={{ padding: 20 }} className="flex-1">
      <SuspenseWrapper>
        <KidsHomeScreenHeader childId={params.childId} />
      </SuspenseWrapper>
      <SuspenseWrapper>
        <KidsHomeScreenStories kidId={params.childId} />
      </SuspenseWrapper>
    </View>
  );
};

export default KidHomeScreen;
