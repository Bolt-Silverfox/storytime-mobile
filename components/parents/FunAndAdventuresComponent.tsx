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
      category: "54f4d851-f796-4ce2-ba85-31082dfd7c63",
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
        stories={data!}
      />
    </HomeScreenCarouselComponent>
  );
};

export default FunAndAdventuresComponent;
