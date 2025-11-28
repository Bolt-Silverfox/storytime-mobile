import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { Category } from "../../types/parents.types";

interface CategoryCardProps {
  category: Category;
  onPress: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onPress }) => {
  return (
    <TouchableOpacity
      style={[{ backgroundColor: category.bg }]}
      className="w-[48%] h-fit py-4 px-4 min-h-24 rounded-2xl items-center justify-center gap-6"
      onPress={onPress}
    >
      <Text
        style={[
          styles.categoryText,
          {
            color: category.colour,
            fontFamily: "ABeeZee",
            fontSize: 16,
            lineHeight: 22,
          },
        ]}
        className="text-center"
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // categoryCard: {
  //   width: 193,
  //   height: 91,
  //   paddingVertical: 20,
  //   borderRadius: 12,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
  },
});

export default CategoryCard;
