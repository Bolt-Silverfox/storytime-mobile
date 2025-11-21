
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import StoryCard from './StoryCard';
import { Story } from '../../types/parents.types';



type StoryTrackerProps = {
  stories: Story[];
  onStoryPress: (id: number) => void;
  onViewAll: () => void;
};

const StoryTracker: React.FC<StoryTrackerProps> = ({ stories, onStoryPress, onViewAll }) => {
  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Child's Story Tracker</Text>
        <TouchableOpacity onPress={onViewAll}>
          <Text style={styles.viewAll}>View all</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {stories.map((story) => (
          <StoryCard
            key={story.id}
            story={story}
            onPress={() => onStoryPress(story.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212121',
    fontFamily: "Qilkabold",
    
  },
  viewAll: {
    fontSize: 16,
    color: '#0731EC',
    fontWeight: '400',
    fontFamily: "ABeeZee",
  },
  scrollContent: {
    paddingLeft: 16,
    paddingRight: 4,
  },
});

export default StoryTracker;
