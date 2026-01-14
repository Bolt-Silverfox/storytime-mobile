import { useQuery } from "@tanstack/react-query";
import GroupedStoriesContainer from "../../../components/GroupedStoriesContainer";
import { queryRecommendedStories } from "../../../hooks/tanstack/queryHooks/useGetRecommendedStories";

const ParentsTopPicksScreen = () => {
  const { isPending, error, refetch, data } = useQuery(
    queryRecommendedStories()
  );

  return (
    <GroupedStoriesContainer
      stories={data}
      error={error}
      refetch={refetch}
      isPending={isPending}
      imageSource={require("../../../assets/images/parents-top-picks.jpg")}
      description="These are the top recommendations from parents to their kids"
      title="Top picks by other parents"
    />
  );
};

export default ParentsTopPicksScreen;
