import { useNavigation } from "@react-navigation/native";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import useGetStories from "../hooks/tanstack/queryHooks/useGetStories";
import { KidsLibraryNavigatorProps } from "../Navigation/KidsLibraryNavigator";
import ErrorComponent from "./ErrorComponent";
import LoadingOverlay from "./LoadingOverlay";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const KidStories = ({ id }: { id: string }) => {
  const [currentKidId, setCurrentKidId] = useState<string | null>("");
  const { isPending, error, refetch, data } = useGetStories(id);

  useEffect(() => {
    const loadKid = async () => {
      const id = await AsyncStorage.getItem("currentKid");
      console.log("id", id);
      setCurrentKidId(id);
    };

    loadKid();
  }, []);

  if (!data) return <EmptyState />;
  if (isPending) return <LoadingOverlay visible={isPending} />;
  if (error) return <ErrorComponent refetch={refetch} />;
  const navigator = useNavigation<KidsLibraryNavigatorProps>();
  return (
    <FlatList
      data={data}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <Pressable
          // onPress={() => navigator.navigate("bookDetails", { bookId: item.id })}
          onPress={() =>
            navigator.navigate("setup" as any, {
              screen: "storyInteraction",
              params: { storyId: item.id },
            })
          }
          key={item.id}
          className="border-b gap-x-5 flex flex-row border-b-black/10 py-5"
        >
          <Image
            source={{ uri: item.coverImageUrl }}
            className="h-[150px] w-[120px] rounded-xl"
          />
          <View className="flex-1">
            <Text className="font-[abeezee] text-xl">{item.title}</Text>
            <Text className="font-[abeezee] text-base">{item.description}</Text>
          </View>
        </Pressable>
      )}
    />
  );
};

const EmptyState = () => {
  return (
    <View className="flex flex-1 w-full flex-wrap mx-3 justify-center items-center">
      <Text>No stories yet, come again tomorrow</Text>
    </View>
  );
};
export default KidStories;
