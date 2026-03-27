import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { ParntHomeNavigatorProp } from "../../Navigation/ParentHomeNavigator";
import queryGetStories from "../../hooks/tanstack/queryHooks/queryGetStories";
import HomepageStoriesContainer from "../HomepageStoriesContainer";
import HomeScreenCarouselComponent from "./HomeScreenCarouselComponent";
import ErrorComponent from "../ErrorComponent";

const ParentsTopRecommendations = () => {
  const navigator = useNavigation<ParntHomeNavigatorProp>();
  const { data, error, refetch, isPending } = useQuery(
    queryGetStories({ isMostLiked: true, shuffle: true })
  );
  return (
    <HomeScreenCarouselComponent
      isPending={isPending}
      error={error}
      refetch={refetch}
      hasData={!!data}
    >
      <HomepageStoriesContainer
        title="Top recommendations"
        onViewAll={() => navigator.navigate("topRecommendations")}
        stories={data ?? []}
        error={error}
        isPending={isPending}
      />
    </HomeScreenCarouselComponent>
  );
};
export default ParentsTopRecommendations;
