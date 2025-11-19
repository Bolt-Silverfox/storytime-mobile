import { Button, StyleSheet, Text, View } from "react-native";
import useAuth from "../contexts/AuthContext";

const HomeScree = () => {
  const { logout, isLoading } = useAuth();
  return (
    <View style={styles.screen}>
      <Text>HomeScree</Text>
      <Button title={isLoading ? "loading..." : "logout"} onPress={logout} />
    </View>
  );
};

export default HomeScree;

const styles = StyleSheet.create({
  screen: { flex: 1 },
});
