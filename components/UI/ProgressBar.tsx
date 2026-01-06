import { DimensionValue, StyleSheet, Text, View } from "react-native";

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
  backgroundColor = "#000",
  label = "Steps",
}: ProgressBarProps) => {
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
          },
        ]}
      >
        <View
          style={{
            height,
            borderRadius: height / 2,
            backgroundColor,
            width: calculateWidth(),
            overflow: "hidden",
          }}
        />
      </View>

      <View className="flex flex-row justify-between items-center">
        <Text className="text-xs text-text font-[abeezee]">{label}:</Text>
        <Text className="text-xs text-text font-[abeezee]">
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
    backgroundColor: "rgba(0,0,0,0.2)",
    overflow: "hidden",
  },

  fill: {
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
});
