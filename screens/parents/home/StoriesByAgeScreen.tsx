import { RouteProp, useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { ParentHomeNavigatorParamList } from "../../../Navigation/ParentHomeNavigator";
import GroupedStoriesContainer from "../../../components/GroupedStoriesContainer";
import { queryRecommendedStories } from "../../../hooks/tanstack/queryHooks/useGetRecommendedStories";

type RoutePropTypes = RouteProp<ParentHomeNavigatorParamList, "storiesByAge">;
const StoriesByAgeScreen = () => {
  const { params } = useRoute<RoutePropTypes>();
  const { isPending, error, refetch, data } = useQuery(
    queryRecommendedStories(),
  );

  return (
    <GroupedStoriesContainer
      stories={data}
      error={error}
      refetch={refetch}
      isPending={isPending}
      imageSource={require("../../../assets/images/top-recommendations.jpg")}
      description={`Access all stories from ages ${params.ageGroup}`}
      title={`Age ${params.ageGroup}`}
      showAges={false}
    />
  );
};

export default StoriesByAgeScreen;
