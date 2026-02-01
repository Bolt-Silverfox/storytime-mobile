import React from "react";
import { View, StyleSheet } from "react-native";

interface ProgressProps {
  progress: number;
  color?: string;
}

const ProgressBar: React.FC<ProgressProps> = ({
  progress = 0,
  color = "#000",
}) => {
  const clamped = Math.min(Math.max(progress, 0), 1);

  return (
    <View className="pt-4">
      {/* Background wrapper */}
      <View
        style={styles.track}
        className="h-8 w-full overflow-hidden rounded-full border-4 border-[#DAE1F1] bg-[#B0BAFF]"
      >
        {/* Filled bar */}
        <View
          style={[
            {
              width: `${clamped * 100}%`,
              backgroundColor: color, //dynamic color
            },
          ]}
          className="h-full w-full rounded-full"
        />
      </View>
    </View>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({
  track: {
    shadowColor: "#9A39FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.55,
    shadowRadius: 6,
    elevation: 5,
  },
});
