import { useQuery } from "@tanstack/react-query";
import GroupedStoriesContainer from "../../../components/GroupedStoriesContainer";
import { queryRecommendedStories } from "../../../hooks/tanstack/queryHooks/useGetRecommendedStories";

const ParentsTopRecommendationsScreen = () => {
  const { isPending, error, refetch, data } = useQuery(
    queryRecommendedStories()
  );

  return (
    <GroupedStoriesContainer
      stories={data}
      error={error}
      refetch={refetch}
      isPending={isPending}
      imageSource={require("../../../assets/images/top-recommendations.jpg")}
      description="Top recommendations"
      title="Stories recommended based on your preferred categories"
    />
  );
};

export default ParentsTopRecommendationsScreen;
