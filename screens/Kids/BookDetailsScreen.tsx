import { useQueryClient } from "@tanstack/react-query";
import { StyleSheet, Text, View } from "react-native";
import useKidNavigator from "../../contexts/KidNavigatorContext";
import { Story } from "../../types";

const BookDetailsScreen = () => {
  const { childId } = useKidNavigator();

  const queryClient = useQueryClient();
  const cachedStories: Story | undefined = queryClient.getQueryData([
    "getStories",
    childId,
  ]);

  return (
    <View style={styles.screen}>
      <Text>BookDetailsScreen</Text>
      <Text className="text-5xl text-black">{cachedStories?.id}</Text>
    </View>
  );
};

export default BookDetailsScreen;

const styles = StyleSheet.create({
  screen: { flex: 1 },
});
