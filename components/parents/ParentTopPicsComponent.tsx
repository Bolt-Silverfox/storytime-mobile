import { useNavigation } from "@react-navigation/native";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ParntHomeNavigatorProp } from "../../Navigation/ParentHomeNavigator";
import ErrorComponent from "../ErrorComponent";
import HomepageStoriesContainer from "../HomepageStoriesContainer";
import useAuth from "../../contexts/AuthContext";
import { queryRecommendedStories } from "../../hooks/tanstack/queryHooks/useGetRecommendedStories";

const ParentsTopPicksComponent = () => {
  const navigator = useNavigation<ParntHomeNavigatorProp>();
  const { user } = useAuth();
  const { data, error, refetch } = useSuspenseQuery(
    queryRecommendedStories(user?.id)
  );

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
