import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';


const DailyChallengeCard = ({ childName }: { childName: string }) => {
  const [selectedDay, setSelectedDay] = useState(0);
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <View style={styles.challengeCard}>
      <Text style={styles.challengeTitle}>
        Daily Challenge for {childName}
      </Text>
      <Text style={styles.challengeSubtitle}>
        Complete your daily challenge to win amazing prizes today
      </Text>
      <View style={styles.daysContainer}>
        {daysOfWeek.map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dayButton,
              selectedDay === index && styles.dayButtonActive,
            ]}
            onPress={() => setSelectedDay(index)}
          >
            <Text
              style={[
                styles.dayText,
                selectedDay === index && styles.dayTextActive,
              ]}
            >
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>

    
    
  );
};

const styles = StyleSheet.create({
  challengeCard: {
    backgroundColor: '#5720E3D9',
    width: 361,
    height  : 225,
    margin: 16,
    padding: 20,
    borderRadius: 10,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 8,
  },
  challengeSubtitle: {
    fontSize: 13,
    color: '#FFF',
    opacity: 0.9,
    marginBottom: 16,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  dayButtonActive: {
    backgroundColor: '#B4FF39',
  },
  dayText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  dayTextActive: {
    color: '#7B5FFF',
  },
});

export default DailyChallengeCard;
