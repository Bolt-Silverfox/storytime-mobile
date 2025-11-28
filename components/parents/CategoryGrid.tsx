import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import CategoryCard from "./CategoryCard";
import { Category } from "../../types/parents.types";

interface CategoryGridProps {
  categories: Category[];
  onCategoryPress: (categoryId: number) => void;
  onViewAll: () => void;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  onCategoryPress,
  onViewAll,
}) => {
  return (
    <View className="mt-6">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-[quilka]">Categories</Text>
        <TouchableOpacity onPress={onViewAll}>
          <Text className="font-[abeezee] text-base text-link">View all</Text>
        </TouchableOpacity>
      </View>

      {/* TWO-COLUMN GRID */}
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        nestedScrollEnabled
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: 16,
        }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <CategoryCard
            category={item}
            onPress={() => onCategoryPress(item.id)}
          />
        )}
      />
    </View>
  );
};

export default CategoryGrid;
