import { useNavigation } from "@react-navigation/native";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ParntHomeNavigatorProp } from "../../Navigation/ParentHomeNavigator";
import { queryRecommendedStories } from "../../hooks/tanstack/queryHooks/useGetRecommendedStories";
import ErrorComponent from "../ErrorComponent";
import HomepageStoriesContainer from "../HomepageStoriesContainer";

const ParentsTopPicksComponent = () => {
  const navigator = useNavigation<ParntHomeNavigatorProp>();
  const { data, error, refetch } = useSuspenseQuery(queryRecommendedStories());

  if (error)
    return <ErrorComponent refetch={refetch} message={error.message} />;
  return (
    <HomepageStoriesContainer
      title="Top picks from parents"
      onViewAll={() => navigator.navigate("parentsTopPicks")}
      stories={data}
    />
  );
};
export default ParentsTopPicksComponent;
