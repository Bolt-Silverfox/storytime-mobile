import { StyleSheet, View, Text, Button } from "react-native";
import useAuth from "../contexts/AuthContext";

const HomeScree = () => {
  const { logout, isLoading, errorMessage } = useAuth();
  return (
    <View style={styles.screen}>
      <Text>HomeScree</Text>
      <Button title={isLoading ? "Loading..." : "logout"} onPress={logout} />
      {Array.isArray(errorMessage) && errorMessage.length ? (
        errorMessage.map((message) => (
          <Text key={message} className="text-red-600 text-sm">
            {message}
          </Text>
        ))
      ) : (
        <Text className="text-red-600 text-sm">{errorMessage}</Text>
      )}
    </View>
  );
};

export default HomeScree;

const styles = StyleSheet.create({
  screen: { flex: 1 },
});
