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
      imageSource={{
        uri: "https://res.cloudinary.com/billmal/image/upload/v1769762827/storytime/assets/generate_an_children_story_book_image_for_the_theme__Mystery_problem_solving__3_1_b57i6x.jpg",
      }}
      description="Enjoy fun and adventurous stories."
      title="Fun and Adventurous stories."
    />
  );
};

export default FunAndADventureStoriesScreen;
