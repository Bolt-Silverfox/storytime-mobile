import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import queryGetStories from "../../hooks/tanstack/queryHooks/queryGetStories";
import { ParntHomeNavigatorProp } from "../../Navigation/ParentHomeNavigator";
import HomepageStoriesContainer from "../HomepageStoriesContainer";
import HomeScreenCarouselComponent from "./HomeScreenCarouselComponent";

/**
 * Home screen component displaying today's top story picks in a horizontal carousel.
 * Provides a "View All" button that navigates to the full TodaysTopPicksScreen.
 *
 * @returns The Today's Top Picks carousel component for the home screen
 */
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
