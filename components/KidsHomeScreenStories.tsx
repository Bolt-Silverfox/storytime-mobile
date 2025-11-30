import { useNavigation } from "@react-navigation/native";
import { FlatList, Image, Pressable, Text } from "react-native";
import useGetStories from "../hooks/tanstack/queryHooks/useGetStories";
import { KidsTabNavigatorProp } from "../Navigation/KidsTabNavigator";
import ErrorComponent from "./ErrorComponent";

const KidsHomeScreenStories = ({ id }: { id: string }) => {
  const navigation = useNavigation<KidsTabNavigatorProp>();
  const { isPending, error, refetch, data } = useGetStories(id);

  if (error)
    return (
      <ErrorComponent
        refetch={refetch}
        message={error.message ?? "Unexpected error"}
      />
    );
  console.log("data from kids home stories", data);
  return (
    <FlatList
      data={data}
      className="flex-1 gap-4"
      contentContainerClassName=""
      showsVerticalScrollIndicator={false}
      numColumns={2}
      columnWrapperStyle={{ gap: 10 }}
      renderItem={({ item }) => (
        <Pressable
          key={item.id}
          onPress={() => {
            navigation.navigate("setup" as any, {
              screen: "storyInteraction",
              params: { storyId: item.id },
            });
          }}
          className="overflow-hidden rounded-lg flex-1 mb-10"
        >
          <Image
            source={{ uri: item.coverImageUrl }}
            className="h-[228px] w-full"
          />
        </Pressable>
      )}
    />
  );
};

export default KidsHomeScreenStories;
