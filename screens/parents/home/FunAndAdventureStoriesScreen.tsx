import { useQuery } from "@tanstack/react-query";
import GroupedStoriesContainer from "../../../components/GroupedStoriesContainer";
import queryGetStories from "../../../hooks/tanstack/queryHooks/queryGetStories";

const FunAndAdventureStoriesScreen = () => {
  const { data, isPending, error, refetch } = useQuery(
    queryGetStories({
      category: "54f4d851-f796-4ce2-ba85-31082dfd7c63",
    })
  );

  return (
    <GroupedStoriesContainer
      stories={data}
      isPending={isPending}
      error={error}
      refetch={refetch}
      imageSource={{
        uri: "https://res.cloudinary.com/billmal/image/upload/v1769762827/storytime/assets/generate_an_children_story_book_image_for_the_theme__Mystery_problem_solving__3_1_b57i6x.jpg",
      }}
      description="Enjoy fun and adventurous stories."
      title="Fun and Adventurous stories."
    />
  );
};

export default FunAndAdventureStoriesScreen;
