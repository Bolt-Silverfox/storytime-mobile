import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import queryGetStories from "../../hooks/tanstack/queryHooks/queryGetStories";
import { ParntHomeNavigatorProp } from "../../Navigation/ParentHomeNavigator";
import HomepageStoriesContainer from "../HomepageStoriesContainer";
import HomeScreenCarouselComponent from "./HomeScreenCarouselComponent";
import ErrorComponent from "../ErrorComponent";

const TodaysTopPicksComponent = () => {
  const navigator = useNavigation<ParntHomeNavigatorProp>();
  const { data, error, refetch, isPending } = useQuery(
    queryGetStories({ topPicksFromUs: true, shuffle: true })
  );
  return (
    <HomeScreenCarouselComponent
      isPending={isPending}
      error={error}
      refetch={refetch}
      hasData={!!data}
    >
      <HomepageStoriesContainer
        title="Today's top picks"
        onViewAll={() => navigator.navigate("todaysTopPicks")}
        stories={data ?? []}
        error={error}
        isPending={isPending}
      />
    </HomeScreenCarouselComponent>
  );
};
export default TodaysTopPicksComponent;
