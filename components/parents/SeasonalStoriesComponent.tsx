import { useNavigation } from "@react-navigation/native";
import { useSuspenseQuery } from "@tanstack/react-query";
import { queryRecommendedStories } from "../../hooks/tanstack/queryHooks/useGetRecommendedStories";
import { ParntHomeNavigatorProp } from "../../Navigation/ParentHomeNavigator";
import ErrorComponent from "../ErrorComponent";
import HomepageStoriesContainer from "../HomepageStoriesContainer";

const SeasonalStoriesComponent = () => {
  const navigator = useNavigation<ParntHomeNavigatorProp>();
  const { data, error, refetch } = useSuspenseQuery(queryRecommendedStories());

  if (error)
    return <ErrorComponent refetch={refetch} message={error.message} />;
  return (
    <HomepageStoriesContainer
      title="Seasonal stories"
      onViewAll={() => navigator.navigate("seasonalStories")}
      stories={data}
    />
  );
};

export default SeasonalStoriesComponent;
