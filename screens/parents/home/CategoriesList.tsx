import { useNavigation } from "@react-navigation/native";
import { ChevronLeft } from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import ErrorMessageDisplay from "../../../components/ErrorMessageDisplay";
import LoadingOverlay from "../../../components/LoadingOverlay";
import CategoryCard from "../../../components/parents/CategoryCard";
import { PALETTE } from "../../../data";
import useGetStoryCategories from "../../../hooks/tanstack/queryHooks/useGetsStoryCategories";
import type { ParntHomeNavigatorProp } from "../../../Navigation/ParentHomeNavigator";
import { Category } from "../../../types/parents.types";

export default function CategoriesListScreen() {
  const nav = useNavigation<ParntHomeNavigatorProp>();
  const categoriesQuery = useGetStoryCategories();
  const isLoading = Boolean(categoriesQuery?.isLoading);
  const isError = Boolean(categoriesQuery?.isError);
  const categories = (categoriesQuery as any)?.data ?? [];

  if (isLoading)
    return <LoadingOverlay visible label="Loading categories..." />;

  if (isError) {
    return (
      <View className="flex-1 p-4 bg-white">
        <ErrorMessageDisplay
          errorMessage={
            (categoriesQuery as any)?.error?.message ??
            "Failed to load categories."
          }
        />
      </View>
    );
  }

  const apiCats = Array.isArray(categories)
    ? categories
    : ((categoriesQuery as any)?.data ?? []);
  const uiCategories = apiCats.map((c: any, i: number) => {
    const match = PALETTE.find(
      (p) => p.name.toLowerCase() === (c.name ?? "").toLowerCase()
    );
    const pick = match ?? PALETTE[i % PALETTE.length];
    return {
      id: String(c.id ?? pick.id ?? i),
      name: c.name ?? pick.name,
      colour: pick.colour,
      bg: pick.bg,
      image: (c as any).image ?? undefined,
      description: (c as any).description ?? undefined,
    } as unknown as Category;
  });

  const renderCategory = ({ item }: { item: Category }) => {
    return (
      <CategoryCard
        category={item}
        onPress={() =>
          nav.navigate("storiesList", {
            categoryId: String(item.id),
            categoryName: item.name,
          })
        }
      />
    );
  };

  return (
    <View className="flex-1 bg-white px-4 pt-4">
      <View className="flex-row items-center justify-between mb-4">
        <Pressable onPress={() => nav.goBack()}>
          <ChevronLeft size={36} />
        </Pressable>
        <Text className="text-2xl font-[abeezee]">Categories</Text>
        <View className="w-8" />
      </View>

      <FlatList
        data={uiCategories}
        keyExtractor={(c) => String(c.id)}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: 16,
        }}
        showsVerticalScrollIndicator={false}
        renderItem={renderCategory}
        contentContainerStyle={{
          paddingBottom: 20,
          paddingVertical: 24,
          backgroundColor: "#FFFCFB",
        }}
        ListEmptyComponent={() => (
          <View className="py-8 items-center">
            <ActivityIndicator />
          </View>
        )}
      />
    </View>
  );
}
