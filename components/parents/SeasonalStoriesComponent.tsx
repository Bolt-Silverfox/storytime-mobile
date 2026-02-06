import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../contexts/AuthContext";
import { queryRecommendedStories } from "../../hooks/tanstack/queryHooks/useGetRecommendedStories";
import { ParntHomeNavigatorProp } from "../../Navigation/ParentHomeNavigator";
import HomepageStoriesContainer from "../HomepageStoriesContainer";
import HomeScreenCarouselComponent from "./HomeScreenCarouselComponent";

const SeasonalStoriesComponent = () => {
  const { user } = useAuth();
  const navigator = useNavigation<ParntHomeNavigatorProp>();
  const { data, error, refetch, isPending } = useQuery(
    queryRecommendedStories(user?.id)
  );
  return (
    <HomeScreenCarouselComponent
      isPending={isPending}
      error={error}
      refetch={refetch}
    >
      <HomepageStoriesContainer
        title="Fun and adventures"
        onViewAll={() => navigator.navigate("funAndAdventureStories")}
        stories={data!}
      />
    </HomeScreenCarouselComponent>
  );
};

export default SeasonalStoriesComponent;
