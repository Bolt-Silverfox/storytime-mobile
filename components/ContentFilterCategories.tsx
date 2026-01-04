import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
import useGetStoryCategories from "../hooks/tanstack/queryHooks/useGetsStoryCategories";
import ErrorComponent from "./ErrorComponent";
import { useSuspenseQuery } from "@tanstack/react-query";

type Props = {
  toggleCategory: (c: string) => void;
  selectedCategories: string[];
};
const ContentFilterCategories = ({
  selectedCategories,
  toggleCategory,
}: Props) => {
  const {
    data: categories,
    error: categoriesError,
    refetch: refetchCategories,
  } = useSuspenseQuery(useGetStoryCategories());

  if (categoriesError)
    return (
      <ErrorComponent
        message={categoriesError.message}
        refetch={refetchCategories}
      />
    );

  return (
    <View>
      {categories && categories.length > 0 ? (
        categories.map((category) => (
          <Pressable
            key={category.id}
            className="flex py-4 border-b border-b-black/10 flex-row items-center gap-x-10"
            onPress={() => toggleCategory(category.id)}
          >
            <Text className="flex-1 text-base text-black font-[abeezee]">
              {category.name}
            </Text>
            <Switch
              value={selectedCategories.includes(category.id)}
              onValueChange={() => toggleCategory(category.id)}
            />
          </Pressable>
        ))
      ) : (
        <Text className="text-xl font-[abeezee] text-center">
          No categories yet
        </Text>
      )}
    </View>
  );
};

export default ContentFilterCategories;

const styles = StyleSheet.create({
  screen: { flex: 1 },
});
