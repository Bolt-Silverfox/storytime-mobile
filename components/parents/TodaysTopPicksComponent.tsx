import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import queryGetStories from "../../hooks/tanstack/queryHooks/queryGetStories";
import { ParntHomeNavigatorProp } from "../../Navigation/ParentHomeNavigator";
import HomepageStoriesContainer from "../HomepageStoriesContainer";
import HomeScreenCarouselComponent from "./HomeScreenCarouselComponent";

const TodaysTopPicksComponent = () => {
  const navigator = useNavigation<ParntHomeNavigatorProp>();
  const { data, error, refetch, isPending } = useQuery(
    queryGetStories({ topPicksFromUs: true })
  );
  return (
    <HomeScreenCarouselComponent
      isPending={isPending}
      error={error}
      refetch={refetch}
    >
      <HomepageStoriesContainer
        title="Today's top picks"
        onViewAll={() => navigator.navigate("todaysTopPicks")}
        stories={data ?? []}
      />
    </HomeScreenCarouselComponent>
  );
};
export default TodaysTopPicksComponent;
