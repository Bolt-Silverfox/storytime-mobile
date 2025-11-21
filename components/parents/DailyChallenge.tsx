import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import CheckIcon from "../../assets/icons/check-circle.png";

interface DailyChallengeSingleProps {
  childName: string;
  backgroundColor?: string;
}

const DailyChallenge = ({
  childName,
  backgroundColor,
}: DailyChallengeSingleProps) => {
  const [selectedDay, setSelectedDay] = useState(0);
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <View
      style={[
        styles.challengeCard,
        { backgroundColor: backgroundColor || "#5720E3D9" },
      ]}
    >
      <Text style={styles.challengeTitle}>Daily Challenge for {childName}</Text>
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
            {selectedDay === index && (
              <Image source={CheckIcon} style={styles.checkIcon} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

interface DailyChallengeProps {
  childNames: string[];
}

const colors = ["#5720E3D9", "#EC4007D9"];
const DailyChallengeContainer: React.FC<DailyChallengeProps> = ({
  childNames,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scrollContainer}
    >
      {childNames.map((childName, index) => (
        <DailyChallenge
          key={index}
          childName={childName}
          backgroundColor={colors[index % colors.length]}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexDirection: "row",
  },
  challengeCard: {
    backgroundColor: "#5720E3D9",
    width: 361,
    height: 225,
    margin: 16,
    marginRight: 0,
    padding: 20,
    borderRadius: 10,
  },
  challengeTitle: {
    fontWeight: "700",
    color: "#FFF",
    textAlign: "center",

    fontFamily: "Qilkabold",
    fontSize: 24,
    lineHeight: 32,
    marginBottom: 20,
  },
  challengeSubtitle: {
    fontSize: 14,
    fontWeight: "400",
    color: "#FFF",
    textAlign: "center",
    fontFamily: "ABeeZee",
    opacity: 0.9,
    lineHeight: 20,
    marginBottom: 30,
    width: 262,
    alignSelf: "center",
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: 283,
    height: 74,
    gap: 10,
    alignSelf: "center",
  },
  checkIcon: {
    width: 14,
    height: 14,
    marginLeft: 6,
    resizeMode: "contain",
  },

  dayButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "transparent",
    borderColor: "#FFFFFF",
    borderWidth: 0.9,
  },

  dayButtonActive: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
  },
  dayText: {
    color: "#FFF",
    fontFamily: "ABeeZee",
    fontSize: 12,
    fontWeight: "600",
  },
  dayTextActive: {
    color: "#7B5FFF",
  },
});

export default DailyChallengeContainer;
