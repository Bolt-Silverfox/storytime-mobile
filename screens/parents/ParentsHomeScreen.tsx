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
import ParentImg from '../../assets/avatars/parent.png'
import MissNettles from '../../assets/images/miss-nettles.png'
import LifeOfPi from '../../assets/images/pi.png'
import { StoryId, CategoryId } from '../../types/parents.types';

const ParentsHomeScreen: React.FC<{ navigation: NavigationProp<ParamListBase> }> = ({ navigation }) => {
  // data fetching 
  const [userData, setUserData] = useState({
    name: 'Mrs Luke',
    avatar: ParentImg,
  });

  const [stories, setStories] = useState([
    {
      id: 1,
      title: 'Little Miss Nettle',
      category: 'Adventure',
      progress: 26,
      color: '#7B5FFF',
      backgroundColor: '#0731EC1A',
      coverColor: '#7B5FFF',
      image: MissNettles,
      childName: 'Jacob',
      progBackgroundColor: '#4E6FFF',
    },
    {
      id: 2,
      title: 'Life of Pi',
      category: 'Mystery',
      progress: 13,
       color: '#07CAEC',
      backgroundColor: '#07CAEC1A',
      coverColor: '#07CAEC',
      image: LifeOfPi,
      childName: 'Solomon',
      progBackgroundColor: '#07CAEC',
    },
  ]);

  const [categories, setCategories] = useState([
    { id: 1, name: 'Adventure', color: '#CDFBD7', textColor: '#039222' },
    { id: 2, name: 'Coming of Age', color: '#FBE5CD', textColor: '#925403' },
    { id: 3, name: 'Courage/Bravery', color: '#FBF9CD', textColor: '#926903' },
    { id: 4, name: 'Good vs Evil', color: '#CDFBF7', textColor: '#008D81'},
    { id: 5, name: 'Fantasy', color: '#EFCDFB' , textColor: '#5B007C'},
    { id: 6, name: 'Love & Family', color: '#CDFBD7', textColor: '#039222' },
    { id: 7, name: 'Transformation', color: '#FBE5CD', textColor: '#925403' },
    { id: 8, name: 'Honesty', color: '#FBF9CD', textColor: '#926903' },
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
              source={userData.avatar}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.greeting}>{userData.name}</Text>
              <Text style={styles.subGreeting}>Good morning ⛅</Text>
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
    
  },
  greeting: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
     fontFamily: "ABeeZee",
     lineHeight: 22,
  },
  subGreeting: {
    fontSize: 12,
    color: '#999',
     fontFamily: "ABeeZee",
     fontWeight: '400',
  },
  notificationIcon: {
    padding: 8,
  },
});

export default ParentsHomeScreen;






