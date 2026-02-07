import { RouteProp, useRoute } from "@react-navigation/native";
import { ParentHomeNavigatorParamList } from "../../../Navigation/ParentHomeNavigator";
import GroupedStoriesContainer from "../../../components/GroupedStoriesContainer";

type RouteProps = RouteProp<ParentHomeNavigatorParamList, "storiesByCategory">;
const StoriesByCategoryScreen = () => {
  const { params } = useRoute<RouteProps>();

  return (
    <GroupedStoriesContainer
      params={{ category: params.id }}
      description={`Read great and amazing stories on ${params.category}`}
      title={params.category}
      imageSource={{ uri: params.imageUrl }}
    />
  );
};

export default StoriesByCategoryScreen;
