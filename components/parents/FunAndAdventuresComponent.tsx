import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { ParntHomeNavigatorProp } from "../../Navigation/ParentHomeNavigator";
import queryGetStories from "../../hooks/tanstack/queryHooks/queryGetStories";
import HomepageStoriesContainer from "../HomepageStoriesContainer";
import HomeScreenCarouselComponent from "./HomeScreenCarouselComponent";

const FunAndAdventuresComponent = () => {
  const navigator = useNavigation<ParntHomeNavigatorProp>();
  const { data, isPending, error, refetch } = useQuery(
    queryGetStories({
      category: "82a7bc74-8e3d-40f5-ab44-33f738615753",
    })
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
        stories={data ?? []}
      />
    </HomeScreenCarouselComponent>
  );
};

export default FunAndAdventuresComponent;
