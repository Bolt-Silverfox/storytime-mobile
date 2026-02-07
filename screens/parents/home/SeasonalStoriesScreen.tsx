import { useSuspenseQuery } from "@tanstack/react-query";
import GroupedStoriesContainer from "../../../components/GroupedStoriesContainer";
import queryGetStories from "../../../hooks/tanstack/queryHooks/queryGetStories";

const SeasonalStoriesScreen = () => {
  const { data, error, refetch, isPending } = useSuspenseQuery(
    queryGetStories({
      limit: 10,
      isSeasonal: true,
    })
  );

  return (
    <GroupedStoriesContainer
      stories={data}
      error={error}
      refetch={refetch}
      isPending={isPending}
      imageSource={{
        uri: "https://res.cloudinary.com/billmal/image/upload/v1769762827/storytime/assets/generate_an_children_story_book_image_for_the_theme__Mystery_problem_solving__1_1_bczg3t.jpg",
      }}
      description="These are seasonal stories from Christmas, to Easter, to Halloween and so much more"
      title="Seasonal stories"
    />
  );
};

export default SeasonalStoriesScreen;
