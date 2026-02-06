import { useQuery } from "@tanstack/react-query";
import GroupedStoriesContainer from "../../../components/GroupedStoriesContainer";
import useAuth from "../../../contexts/AuthContext";
import { queryRecommendedStories } from "../../../hooks/tanstack/queryHooks/useGetRecommendedStories";

const FunAndAdventureStoriesScreen = () => {
  const { user } = useAuth();
  const { isPending, error, refetch, data } = useQuery(
    queryRecommendedStories(user?.id)
  );

  return (
    <GroupedStoriesContainer
      stories={data}
      error={error}
      refetch={refetch}
      isPending={isPending}
      imageSource={{
        uri: "https://res.cloudinary.com/billmal/image/upload/v1769762827/storytime/assets/generate_an_children_story_book_image_for_the_theme__Mystery_problem_solving__3_1_b57i6x.jpg",
      }}
      description="Enjoy fun and adventurous stories."
      title="Fun and Adventurous stories."
    />
  );
};

export default FunAndAdventureStoriesScreen;
