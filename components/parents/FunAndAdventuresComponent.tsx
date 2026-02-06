import { useNavigation } from "@react-navigation/native";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ParntHomeNavigatorProp } from "../../Navigation/ParentHomeNavigator";
import useAuth from "../../contexts/AuthContext";
import { queryRecommendedStories } from "../../hooks/tanstack/queryHooks/useGetRecommendedStories";
import ErrorComponent from "../ErrorComponent";
import HomepageStoriesContainer from "../HomepageStoriesContainer";

const FunAndAdventuresComponent = () => {
  const navigator = useNavigation<ParntHomeNavigatorProp>();
  const { user } = useAuth();
  const { data, error, refetch } = useSuspenseQuery(
    queryRecommendedStories(user?.id)
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
