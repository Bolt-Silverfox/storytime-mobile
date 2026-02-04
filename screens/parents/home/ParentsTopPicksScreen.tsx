import { useQuery } from "@tanstack/react-query";
import GroupedStoriesContainer from "../../../components/GroupedStoriesContainer";
import useAuth from "../../../contexts/AuthContext";
import { queryRecommendedStories } from "../../../hooks/tanstack/queryHooks/useGetRecommendedStories";

const ParentsTopPicksScreen = () => {
  const { user } = useAuth();
  const { isPending, error, refetch, data } = useQuery(
    queryRecommendedStories(user?.id!)
  );

  return (
    <GroupedStoriesContainer
      stories={data}
      error={error}
      refetch={refetch}
      isPending={isPending}
      imageSource={{
        uri: "https://res.cloudinary.com/billmal/image/upload/v1769762827/storytime/assets/generate_an_children_story_book_image_for_the_theme__Mystery_problem_solving__4_1_wx1rwq.jpg",
      }}
      description="These are the top recommendations from parents to their kids"
      title="Top picks by other parents"
    />
  );
};

export default ParentsTopPicksScreen;
