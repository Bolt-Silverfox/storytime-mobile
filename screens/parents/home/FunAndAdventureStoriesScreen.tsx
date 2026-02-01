import { useQuery } from "@tanstack/react-query";
import GroupedStoriesContainer from "../../../components/GroupedStoriesContainer";
import { useQueryRecommendedStories } from "../../../hooks/tanstack/queryHooks/useGetRecommendedStories";

const FunAndADventureStoriesScreen = () => {
  const { isPending, error, refetch, data } = useQuery(
    useQueryRecommendedStories()
  );

  return (
    <GroupedStoriesContainer
      stories={data}
      error={error}
      refetch={refetch}
      isPending={isPending}
      imageSource={require("../../../assets/images/fun-and-adventure-stories.jpg")}
      description="Enjoy fun and adventurous stories."
      title="Fun and Adventurous stories."
    />
  );
};

export default FunAndADventureStoriesScreen;
