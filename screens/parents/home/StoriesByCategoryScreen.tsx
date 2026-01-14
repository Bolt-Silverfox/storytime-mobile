import { RouteProp, useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { ParentHomeNavigatorParamList } from "../../../Navigation/ParentHomeNavigator";
import GroupedStoriesContainer from "../../../components/GroupedStoriesContainer";
import { queryStoryByCategory } from "../../../hooks/tanstack/queryHooks/useGetStoriesByCategory";

type RouteProps = RouteProp<ParentHomeNavigatorParamList, "storiesByCategory">;
const StoriesByCategoryScreen = () => {
  const { params } = useRoute<RouteProps>();
  const { isPending, data, refetch, error } = useQuery(
    queryStoryByCategory(params.id)
  );

  return (
    <GroupedStoriesContainer
      stories={data}
      error={error}
      refetch={refetch}
      isPending={isPending}
      description={`Read great and amazing stories on ${params.category}`}
      title={params.category}
    />
  );
};

export default StoriesByCategoryScreen;
