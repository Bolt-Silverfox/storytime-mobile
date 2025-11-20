import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Story } from '../../types/parents.types';

interface StoryCardProps {
  story: Story;
  onPress: () => void;
}

const StoryCard: React.FC<StoryCardProps> = ({ story, onPress }) => {
  return (
    <TouchableOpacity style={styles.storyCard} onPress={onPress}>
      <View style={[styles.storyCover, { backgroundColor: story.coverColor }]}>
        <Text style={styles.storyEmoji}>{story.image}</Text>
        <Text style={styles.storyTitleOnCover}>{story.title}</Text>
      </View>

      <View style={styles.storyInfo}>
        <Text style={styles.storyCategory}>{story.category}</Text>
        <Text style={styles.storyTitle}>{story.title}</Text>
        <Text style={styles.progressText}>{story.childName}'s progress</Text>
        <Text style={styles.progressPercent}>{story.progress}%</Text>

        <View style={styles.progressBarBg}>
          <View
            style={[styles.progressBarFill, { width: `${story.progress}%` }]}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  storyCard: {
    width: 160,
    marginRight: 12,
    backgroundColor: '#FFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  storyCover: {
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  storyEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  storyTitleOnCover: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
  },
  storyInfo: {
    padding: 12,
  },
  storyCategory: {
    fontSize: 10,
    color: '#7B5FFF',
    fontWeight: '600',
    marginBottom: 4,
  },
  storyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 11,
    color: '#999',
    marginBottom: 2,
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#7B5FFF',
    borderRadius: 3,
  },
});

export default StoryCard;
