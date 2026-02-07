import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../contexts/AuthContext";
import { queryRecommendedStories } from "../../hooks/tanstack/queryHooks/useGetRecommendedStories";
import { ParntHomeNavigatorProp } from "../../Navigation/ParentHomeNavigator";
import HomepageStoriesContainer from "../HomepageStoriesContainer";
import HomeScreenCarouselComponent from "./HomeScreenCarouselComponent";

const ParentsTopPicksComponent = () => {
  const navigator = useNavigation<ParntHomeNavigatorProp>();
  const { user } = useAuth();
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
        title="Top picks from parents"
        onViewAll={() => navigator.navigate("parentsTopPicks")}
        stories={data!}
      />
    </HomeScreenCarouselComponent>
  );
};
export default ParentsTopPicksComponent;
