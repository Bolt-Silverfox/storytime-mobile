import { StyleSheet, View, Text } from "react-native";

const TestComponent = () => {
  return (
    <View style={styles.screen}>
      <Text>TestComponent</Text>
    </View>
  );
};

export default TestComponent;

const styles = StyleSheet.create({
  screen: { flex: 1 },
});
