import { useNavigation } from "@react-navigation/native";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Pressable, Text, View } from "react-native";
import { storyCategoriesColours } from "../../data";
import queryStoryCategories from "../../hooks/tanstack/queryHooks/useGetsStoryCategories";
import { ParntHomeNavigatorProp } from "../../Navigation/ParentHomeNavigator";
import ErrorComponent from "../ErrorComponent";

const StoryCategoriesList = () => {
  const { error, refetch, data } = useSuspenseQuery(queryStoryCategories());
  if (error)
    return <ErrorComponent refetch={refetch} message={error.message} />;

  return (
    <View className="flex flex-col gap-y-4 pb-5">
      <View className="flex max-w-screen-md mx-auto w-full flex-col gap-y-1.5">
        <Text className="font-[abeezee] text-black text-[18px]">
          All catgories
        </Text>
        <Text className="font-[abeezee] text-text text-sm">
          Gain access to all our stories
        </Text>
      </View>
      <View className="max-w-screen-md mx-auto w-full flex-1">
        <View className="flex flex-row justify-center gap-x-2.5 items-center flex-wrap gap-y-4">
          {data.map((category) => (
            <Item category={category.name} id={category.id} key={category.id} />
          ))}
        </View>
      </View>
    </View>
  );
};

export default StoryCategoriesList;

const getRandomNumber = (): number => {
  return Math.floor(Math.random() * 10 + 0);
};

const Item = ({ category, id }: { category: string; id: string }) => {
  const randomNum = getRandomNumber();
  const colour = storyCategoriesColours[randomNum];
  const navigator = useNavigation<ParntHomeNavigatorProp>();

  return (
    <Pressable
      onPress={() => navigator.navigate("storiesByCategory", { category, id })}
      className="h-16 px-5 w-[47%] flex justify-center items-center rounded-md"
      style={{
        backgroundColor: `${colour}66`,
        borderBottomColor: colour,
        borderBottomWidth: 2,
      }}
    >
      <Text
        key={category}
        style={{
          color: colour,
        }}
        className="font-[abeezee]  text-sm rounded-lg"
      >
        {category}
      </Text>
    </Pressable>
  );
};
