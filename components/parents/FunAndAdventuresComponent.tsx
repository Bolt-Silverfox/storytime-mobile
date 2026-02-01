import { useNavigation } from "@react-navigation/native";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ParntHomeNavigatorProp } from "../../Navigation/ParentHomeNavigator";
import { useQueryRecommendedStories } from "../../hooks/tanstack/queryHooks/useGetRecommendedStories";
import ErrorComponent from "../ErrorComponent";
import HomepageStoriesContainer from "../HomepageStoriesContainer";

const FunAndAdventuresComponent = () => {
  const navigator = useNavigation<ParntHomeNavigatorProp>();
  const { data, error, refetch } = useSuspenseQuery(
    useQueryRecommendedStories()
  );

  if (error)
    return <ErrorComponent refetch={refetch} message={error.message} />;

  return (
    <HomepageStoriesContainer
      title="Fun and adventures"
      onViewAll={() => navigator.navigate("funAndAdventureStories")}
      stories={data}
    />
  );
};

export default FunAndAdventuresComponent;
