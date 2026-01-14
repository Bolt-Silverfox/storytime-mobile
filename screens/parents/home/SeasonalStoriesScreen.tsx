import { useQuery } from "@tanstack/react-query";
import GroupedStoriesContainer from "../../../components/GroupedStoriesContainer";
import { queryRecommendedStories } from "../../../hooks/tanstack/queryHooks/useGetRecommendedStories";

const SeasonalStoriesScreen = () => {
  const { isPending, error, refetch, data } = useQuery(
    queryRecommendedStories()
  );

  return (
    <GroupedStoriesContainer
      stories={data}
      error={error}
      refetch={refetch}
      isPending={isPending}
      imageSource={require("../../../assets/images/seasonal-stories.jpg")}
      description="These are seasonal stories from Christmas, to Easter, to Halloween and so much more"
      title="Seasonal stories"
    />
  );
};

export default SeasonalStoriesScreen;
