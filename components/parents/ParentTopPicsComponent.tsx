import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import queryGetStories from "../../hooks/tanstack/queryHooks/queryGetStories";
import { ParntHomeNavigatorProp } from "../../Navigation/ParentHomeNavigator";
import HomepageStoriesContainer from "../HomepageStoriesContainer";
import HomeScreenCarouselComponent from "./HomeScreenCarouselComponent";

const ParentsTopPicksComponent = () => {
  const navigator = useNavigation<ParntHomeNavigatorProp>();
  const { data, error, refetch, isPending } = useQuery(
    queryGetStories({ isMostLiked: true })
  );
  return (
    <HomeScreenCarouselComponent
      isPending={isPending}
      error={error}
      refetch={refetch}
    >
      <HomepageStoriesContainer
        title="Today's top picks"
        onViewAll={() => navigator.navigate("parentsTopPicks")}
        stories={data ?? []}
      />
    </HomeScreenCarouselComponent>
  );
};
export default ParentsTopPicksComponent;
