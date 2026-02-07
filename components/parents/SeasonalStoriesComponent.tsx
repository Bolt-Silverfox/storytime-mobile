import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import queryGetStories from "../../hooks/tanstack/queryHooks/queryGetStories";
import { ParntHomeNavigatorProp } from "../../Navigation/ParentHomeNavigator";
import HomepageStoriesContainer from "../HomepageStoriesContainer";
import HomeScreenCarouselComponent from "./HomeScreenCarouselComponent";

const SeasonalStoriesComponent = () => {
  const navigator = useNavigation<ParntHomeNavigatorProp>();
  const { data, error, refetch, isPending } = useQuery(
    queryGetStories({
      isSeasonal: true,
    })
  );

  return (
    <HomeScreenCarouselComponent
      isPending={isPending}
      error={error}
      refetch={refetch}
    >
      <HomepageStoriesContainer
        title="Seasonal stories"
        onViewAll={() => navigator.navigate("seasonalStories")}
        stories={data!}
      />
    </HomeScreenCarouselComponent>
  );
};

export default SeasonalStoriesComponent;
