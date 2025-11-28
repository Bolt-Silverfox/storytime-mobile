import { View, Text, StyleSheet } from "react-native";
import React from "react";

type ReportScoreProps = {
  icon: any;
  score: number;
  color: string;
  title: string;
};

export default function ReportScore({
  icon,
  score,
  color,
  title,
}: ReportScoreProps) {
  return (
    <View
      style={styles.container}
      className="gap-4 px-[18] w-[160] py-[31] items-center rounded-[20px] bg-white"
    >
      <View
        style={{ backgroundColor: color }}
        className="rounded-full  p-[19] "
      >
        {icon}
      </View>
      <Text className="font-[quilka]  text-[20px]">{score}</Text>
      <Text className="font-[abeezee] text-[#616161] ">{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});
