import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { ParntHomeNavigatorProp } from "../../Navigation/ParentHomeNavigator";
import queryGetStories from "../../hooks/tanstack/queryHooks/queryGetStories";
import queryStoryCategories from "../../hooks/tanstack/queryHooks/useGetsStoryCategories";
import HomepageStoriesContainer from "../HomepageStoriesContainer";
import HomeScreenCarouselComponent from "./HomeScreenCarouselComponent";

const FunAndAdventuresComponent = () => {
  const navigator = useNavigation<ParntHomeNavigatorProp>();
  const {
    data: categories,
    isPending: categoriesPending,
    error: categoriesError,
    refetch: refetchCategories,
  } = useQuery(queryStoryCategories());

  const category = categories?.[0];

  const { data, isPending, error, refetch } = useQuery({
    ...queryGetStories({ category: category?.id }),
    enabled: !!category?.id,
  });

  if (categoriesPending || categoriesError) {
    return (
      <HomeScreenCarouselComponent
        isPending={categoriesPending}
        error={categoriesError}
        refetch={refetchCategories}
      >
        {null}
      </HomeScreenCarouselComponent>
    );
  }

  if (!category) return null;

  return (
    <HomeScreenCarouselComponent
      isPending={isPending}
      error={error}
      refetch={refetch}
    >
      <HomepageStoriesContainer
        title={category.name}
        onViewAll={() =>
          navigator.navigate("storiesByCategory", {
            category: category.name,
            id: category.id,
            imageUrl: category.image,
          })
        }
        stories={data ?? []}
      />
    </HomeScreenCarouselComponent>
  );
};

export default FunAndAdventuresComponent;
