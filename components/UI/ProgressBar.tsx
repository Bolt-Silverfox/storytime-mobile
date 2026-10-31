import { DimensionValue, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../theme/ThemeContext";

type ProgressBarProps = {
  currentStep: number;
  totalSteps: number;
  height?: number;
  label?: string;
  backgroundColor?: string;
};

const ProgressBar = ({
  currentStep,
  totalSteps,
  height = 20,
  backgroundColor,
  label = "Steps",
}: ProgressBarProps) => {
  const { tokens, isDark } = useTheme();
  const calculateWidth = (): DimensionValue => {
    const calculatedWidth = (currentStep / totalSteps) * 100;
    return `${calculatedWidth}%`;
  };
  return (
    <View className="w-full gap-2">
      <View
        style={[
          styles.track,
          {
            height,
            borderRadius: height / 2,
            backgroundColor: isDark ? tokens.border : "rgba(0,0,0,0.2)",
          },
        ]}
      >
        <View
          style={[
            styles.progress,
            {
              height,
              borderRadius: height / 2,
              backgroundColor:
                backgroundColor ?? (isDark ? tokens.textStrong : "#000"),
              width: calculateWidth(),
            },
          ]}
        />
      </View>

      <View className="flex flex-row items-center justify-between">
        <Text className="font-[abeezee] text-xs text-body">{label}:</Text>
        <Text className="font-[abeezee] text-xs text-body">
          {currentStep} / {totalSteps}
        </Text>
      </View>
    </View>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({
  track: {
    width: "100%",
    overflow: "hidden",
  },
  progress: {
    overflow: "hidden",
  },
});
