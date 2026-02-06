import { RouteProp, useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { ParentHomeNavigatorParamList } from "../../../Navigation/ParentHomeNavigator";
import GroupedStoriesContainer from "../../../components/GroupedStoriesContainer";
import queryGetStories from "../../../hooks/tanstack/queryHooks/queryGetStories";

type RoutePropTypes = RouteProp<ParentHomeNavigatorParamList, "storiesByAge">;
const StoriesByAgeScreen = () => {
  const { params } = useRoute<RoutePropTypes>();
  const { data, error, refetch, isPending } = useQuery(
    queryGetStories({
      minAge: params.ageGroup.split("-")[0],
      maxAge: params.ageGroup.split("-")[1],
    })
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
      description={`Access all stories from ages ${params.ageGroup}`}
      title={`Age ${params.ageGroup}`}
      showAges={false}
    />
  );
};

export default StoriesByAgeScreen;
