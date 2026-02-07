import { useQuery } from "@tanstack/react-query";
import GroupedStoriesContainer from "../../../components/GroupedStoriesContainer";
import queryGetStories from "../../../hooks/tanstack/queryHooks/queryGetStories";

const ParentsTopRecommendationsScreen = () => {
  const { data, isPending, error, refetch } = useQuery(
    queryGetStories({
      isMostLiked: true,
    })
  );

  return (
    <GroupedStoriesContainer
      stories={data}
      isPending={isPending}
      error={error}
      refetch={refetch}
      imageSource={{
        uri: "https://res.cloudinary.com/billmal/image/upload/v1769762826/storytime/assets/generate_an_children_story_book_image_for_the_theme__Mystery_problem_solving__5_1_b0bhz1.jpg",
      }}
      description="Top recommendations"
      title="Most liked stories from other users"
    />
  );
};

export default ParentsTopRecommendationsScreen;
