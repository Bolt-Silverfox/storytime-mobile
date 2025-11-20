import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
} from 'react-native';

import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { Bell } from 'lucide-react-native';
import DailyChallenge from '../../components/parents/DailyChallenge';
import StoryTracker from '../../components/parents/StoryTracker';
import CategoryGrid from '../../components/parents/CategoryGrid';


const ParentsHomeScreen: React.FC<{ navigation: NavigationProp<ParamListBase> }> = ({ navigation }) => {
  // data fetching 
  const [userData, setUserData] = useState({
    name: 'Mrs Luke',
    avatar: 'https://via.placeholder.com/40',
  });

  const [stories, setStories] = useState([
    {
      id: 1,
      title: 'Little Miss Nettle',
      category: 'Adventure',
      progress: 26,
      coverColor: '#FF6B9D',
      image: '🏠',
      childName: 'Jacob',
    },
    {
      id: 2,
      title: 'Life of Pi',
      category: 'Mystery',
      progress: 13,
      coverColor: '#4A90E2',
      image: '🌙',
      childName: 'Solomon',
    },
  ]);

  const [categories, setCategories] = useState([
    { id: 1, name: 'Adventure', color: '#B8F3D8' },
    { id: 2, name: 'Coming of Age', color: '#FFD7BE' },
    { id: 3, name: 'Courage/Bravery', color: '#FFF4B8' },
    { id: 4, name: 'Good vs Evil', color: '#B8E8F3' },
    { id: 5, name: 'Fantasy', color: '#E8D4F3' },
    { id: 6, name: 'Love & Family', color: '#B8F3E0' },
    { id: 7, name: 'Transformation', color: '#FFE4D4' },
    { id: 8, name: 'Honesty', color: '#FFF9D4' },
  ]);

  const handleNotificationPress = () => {
    navigation.navigate('Notifications');
  };


  const handleStoryPress = (storyId: StoryId): void => {
    navigation.navigate('StoryDetail', { storyId });
  };

  const handleCategoryPress = (categoryId: CategoryId) => {
    navigation.navigate('CategoryStories', { categoryId });
  };

  const handleViewAllStories = () => {
    navigation.navigate('AllStories');
  };

  const handleViewAllCategories = () => {
    navigation.navigate('AllCategories');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={{ uri: userData.avatar }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.greeting}>{userData.name}</Text>
              <Text style={styles.subGreeting}>Good morning</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.notificationIcon}
            onPress={handleNotificationPress}
          >
            <Bell size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Daily Challenge */}
       <DailyChallenge childNames={['Jacob', 'Solomon']} />

        {/* Story Tracker */}
        <StoryTracker
          stories={stories}
          onStoryPress={handleStoryPress}
          onViewAll={handleViewAllStories}
        />

        {/* Categories */}
        <CategoryGrid
          categories={categories}
          onCategoryPress={handleCategoryPress}
          onViewAll={handleViewAllCategories}
        />

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#E0E0E0',
  },
  greeting: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  subGreeting: {
    fontSize: 12,
    color: '#999',
  },
  notificationIcon: {
    padding: 8,
  },
});

export default ParentsHomeScreen;






