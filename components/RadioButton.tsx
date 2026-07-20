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
}: RadioButton) => (
  <Pressable style={styles.radioContainer} onPress={() => onSelect(value)}>
    <View style={styles.radioCircle}>
      {selected === value && <View style={styles.selectedRb} />}
    </View>
    <Text style={styles.radioText}>{label}</Text>
  </Pressable>
);

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
    borderColor: "#4807EC",
    alignItems: "center",
    justifyContent: "center",
    // marginRight: 10,
  },
  selectedRb: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4807EC",
  },
  radioText: {
    fontSize: 16,
  },
});
