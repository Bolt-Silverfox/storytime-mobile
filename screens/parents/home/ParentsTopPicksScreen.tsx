import { useQuery } from "@tanstack/react-query";
import GroupedStoriesContainer from "../../../components/GroupedStoriesContainer";
import queryGetStories from "../../../hooks/tanstack/queryHooks/queryGetStories";

const ParentsTopPicksScreen = () => {
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
        uri: "https://res.cloudinary.com/billmal/image/upload/v1769762827/storytime/assets/generate_an_children_story_book_image_for_the_theme__Mystery_problem_solving__4_1_wx1rwq.jpg",
      }}
      description="These are the top picks for today"
      title="Top picks from us"
    />
  );
};

export default ParentsTopPicksScreen;
