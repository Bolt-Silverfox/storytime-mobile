import { RouteProp, useRoute } from "@react-navigation/native";
import { StyleSheet, View, Text } from "react-native";
import { KidsLibraryNavigatorParamList } from "../../Navigation/KidsLibraryNavigator";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Story } from "../../hooks/tanstack/queryHooks/useGetStories";

type RouteProps = RouteProp<KidsLibraryNavigatorParamList, "bookDetails">;

const BookDetailsScreen = () => {
  const { params } = useRoute<RouteProps>();
  const [currentKid, setCurrentKid] = useState<string | null>("");

  const queryClient = useQueryClient();
  useEffect(() => {
    const loadKid = async () => {
      const id = await AsyncStorage.getItem("currentKid");
      setCurrentKid(id);
    };

    loadKid();
  }, []);
  const cachedStories: Story | undefined = queryClient.getQueryData([
    "getStories",
    currentKid,
  ]);
  console.log("cached id", currentKid);

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
