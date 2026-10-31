import { useTheme } from "../theme/ThemeContext";
import { Pressable, StyleSheet, Text, View } from "react-native";

type RadioButton = {
  value: string;
  label?: string;
  selected: string;
  onSelect: React.Dispatch<React.SetStateAction<string>>;
};

export const RadioButton = ({
  value,
  label,
  selected,
  onSelect,
}: RadioButton) => {
  const { tokens } = useTheme();
  return (
    <Pressable style={styles.radioContainer} onPress={() => onSelect(value)}>
      <View style={[styles.radioCircle, { borderColor: tokens.blueAccent }]}>
        {selected === value && (
          <View
            style={[styles.selectedRb, { backgroundColor: tokens.blueAccent }]}
          />
        )}
      </View>
      <Text style={[styles.radioText, { color: tokens.textStrong }]}>
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  radioContainer: {
    // flexDirection: "row",
    // alignItems: "center",
    // marginBottom: 15,
  },
  radioCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    // marginRight: 10,
  },
  selectedRb: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  radioText: {
    fontSize: 16,
  },
});
