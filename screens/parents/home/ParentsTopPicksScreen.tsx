import { StyleSheet, View } from "react-native";
import ComingSoon from "../../../components/ComingSoon";

const ParentsTopPicksScreen = () => {
  return (
    <View style={styles.screen}>
      <ComingSoon title="Parent top picks" />
    </View>
  );
};

export default ParentsTopPicksScreen;

const styles = StyleSheet.create({
  screen: { flex: 1 },
});
