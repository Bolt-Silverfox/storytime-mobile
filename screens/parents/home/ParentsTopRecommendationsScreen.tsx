import { useQuery } from "@tanstack/react-query";
import GroupedStoriesContainer from "../../../components/GroupedStoriesContainer";
import { queryRecommendedStories } from "../../../hooks/tanstack/queryHooks/useGetRecommendedStories";
import useAuth from "../../../contexts/AuthContext";

const ParentsTopRecommendationsScreen = () => {
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
        uri: "https://res.cloudinary.com/billmal/image/upload/v1769762826/storytime/assets/generate_an_children_story_book_image_for_the_theme__Mystery_problem_solving__5_1_b0bhz1.jpg",
      }}
      description="Top recommendations"
      title="Stories recommended based on your preferred categories"
    />
  );
};

export default ParentsTopRecommendationsScreen;
