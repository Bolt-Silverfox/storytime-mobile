import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet,Image } from 'react-native';
import { Story } from '../../types/parents.types';

interface StoryCardProps {
  story: Story;
  onPress: () => void;
}

const StoryCard: React.FC<StoryCardProps> = ({ story, onPress }) => {
  return (
    <TouchableOpacity style={styles.storyCard} onPress={onPress}>
      {/* cover dynamic background */}
      <View style={[styles.storyCover, { backgroundColor: story.backgroundColor }]}>
        <Image
          source={typeof story.image === 'string' ? { uri: story.image } : story.image}
          style={styles.image}
        />
        <Text style={styles.storyTitleOnCover}>{story.title}</Text>
      </View>

      {/* Info section */}
      <View style={styles.storyInfo}>
        <Text
          style={[
            styles.storyCategory,
            { color: story.color, backgroundColor: story.backgroundColor } 
          ]}
        >
          {story.category}
        </Text>

        <Text style={styles.storyTitle}>{story.title}</Text>
        <Text style={styles.progressText}>{story.childName}'s progress</Text>
        <Text style={styles.progressPercent}>{story.progress}%</Text>

        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${story.progress}%`, backgroundColor: story.progBackgroundColor } 
            ]}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  storyCard: {
  width: 240,
  height: 399,
  marginRight: 12,
  backgroundColor: '#FFF',
  borderRadius: 24,
  overflow: 'hidden',
  
  // iOS shadow
  shadowColor: '#0e0e0e',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
  
  // android
  elevation: 5,
},
  storyCover: {
    height: 182,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  image:{
      width: 240,
      height: 182,
  },
  storyTitleOnCover: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
  },
  storyInfo: {
    padding: 12,
    marginTop: 10 ,
  },

  storyCategory: {
    fontSize: 10,
    
    fontWeight: '600',
    marginBottom: 12,
    fontFamily: "ABeeZee",
    borderRadius: 99,
    padding: 8,
    width: 101,
    height: 28,
    textAlign: 'center',

  },
  storyTitle: {
    fontSize: 22,
    fontWeight: '400',
    color: '#333',
    marginBottom: 12,
    lineHeight: 22,
    fontFamily: "ABeeZee",
  },
  progressText: {
    fontSize: 14,
    color: '#616161',
    marginBottom: 2,
    fontFamily: "ABeeZee",
    lineHeight: 22,

  },
  progressPercent: {
    fontSize: 12,
    fontWeight: '600',
    color: '#616161',
     fontFamily: "ABeeZee",
    marginBottom: 12,
  },
  progressBarBg: {
    height: 25,
    backgroundColor: '#E0E0E0',
    borderRadius: 99,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    
    borderRadius: 99,
  },
});

export default StoryCard;
