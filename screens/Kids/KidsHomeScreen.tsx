import { RouteProp, useRoute } from "@react-navigation/native";
import { lazy } from "react";
import { KidsTabNavigatorParamList } from "../../Navigation/KidsTabNavigator";
import ComingSoon from "../../components/ComingSoon";

const KidStories = lazy(() => import("../../components/KidStories"));
type RouteProps = RouteProp<KidsTabNavigatorParamList, "home">;

const KidHomeScreen = () => {
  const { params } = useRoute<RouteProps>();

  return (
    // <ScrollView
    //   className="flex-1"
    //   contentContainerClassName="flex min-h-full"
    //   stickyHeaderIndices={[0]}
    //   contentContainerStyle={{ padding: 20 }}
    // >
    <ComingSoon title="Kids home" />
    // </ScrollView>
  );
};

export default KidHomeScreen;
