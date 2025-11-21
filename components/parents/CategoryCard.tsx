import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Category } from '../../types/parents.types';

interface CategoryCardProps {
  category: Category;
  onPress: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> =  ({ category, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.categoryCard, { backgroundColor: category.color }]}
      onPress={onPress}
    >
      <Text style={[styles.categoryText, {
        color: category.textColor, fontFamily: 'ABeeZee', fontSize: 16, lineHeight: 22
      }]}
      
      
      >{category.name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  categoryCard: {
    width: 193,
    height: 91,
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});

export default CategoryCard;