import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { Pressable, Text, View } from "react-native";
import { storyCategoriesColours } from "../../data";
import queryStoryCategories from "../../hooks/tanstack/queryHooks/useGetsStoryCategories";
import { ParntHomeNavigatorProp } from "../../Navigation/ParentHomeNavigator";
import { getCategoryColourIndex } from "../../utils/utils";
import ErrorComponent from "../ErrorComponent";
import StoryCarouselSkeleton from "../skeletons/StoryCarouselSkeleton";
import HomeScreenCarouselComponent from "./HomeScreenCarouselComponent";

const StoryCategoriesList = () => {
  const { error, refetch, data, isPending } = useQuery(queryStoryCategories());
  if (isPending) return <StoryCarouselSkeleton />;
  if (error)
    return <ErrorComponent refetch={refetch} message={error.message} />;

  return (
    <HomeScreenCarouselComponent
      isPending={isPending}
      error={error}
      refetch={refetch}
    >
      <View className="flex flex-col gap-y-4 pb-5">
        <View className="mx-auto flex w-full max-w-screen-md flex-col gap-y-1.5">
          <Text className="font-[abeezee] text-[18px] text-black">
            All categories
          </Text>
          <Text className="font-[abeezee] text-sm text-text">
            Gain access to all our stories
          </Text>
        </View>
        <View className="mx-auto w-full max-w-screen-md flex-1">
          <View className="flex flex-row flex-wrap items-center justify-center gap-x-2.5 gap-y-4">
            {data.map((category) => (
              <Item
                imageUrl={
                  category.image ??
                  "https://images.unsplash.com/photo-1502082553048-f009c37129b9"
                }
                category={category.name}
                id={category.id}
                key={category.id}
              />
            ))}
          </View>
        </View>
      </View>
    </HomeScreenCarouselComponent>
  );
};

export default StoryCategoriesList;

const Item = ({
  category,
  id,
  imageUrl,
}: {
  category: string;
  id: string;
  imageUrl: string;
}) => {
  const colour =
    storyCategoriesColours[
      getCategoryColourIndex(id, storyCategoriesColours.length)
    ];
  const navigator = useNavigation<ParntHomeNavigatorProp>();

  return (
    <Pressable
      onPress={() =>
        navigator.navigate("storiesByCategory", { category, id, imageUrl })
      }
      className="br flex h-16 w-[47%] items-center justify-center rounded-xl px-5"
      style={{
        backgroundColor: `${colour}33`,
        borderBottomColor: `${colour}33`,
        borderBottomWidth: 2,
      }}
    >
      <Text
        key={category}
        style={{
          color: colour,
        }}
        className="rounded-lg  font-[abeezee] text-sm"
      >
        {category}
      </Text>
    </Pressable>
  );
};
