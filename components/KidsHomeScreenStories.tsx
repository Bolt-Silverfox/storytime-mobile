import { useNavigation } from "@react-navigation/native";
import { FlatList, Image, Pressable, Text } from "react-native";
import useGetStories, { Story } from "../hooks/tanstack/queryHooks/useGetStories";
import { KidsTabNavigatorProp } from "../Navigation/KidsTabNavigator";
import ErrorComponent from "./ErrorComponent";

const KidsHomeScreenStories = ({ id }: { id: string }) => {
  const navigation = useNavigation<KidsTabNavigatorProp>();
  const { isPending, error, refetch, data } = useGetStories(id);

    const stories: Story[] = (() => {
    const r: any = data;
    if (Array.isArray(r)) return r;
    if (Array.isArray(r?.data)) return r.data;
    if (Array.isArray(r?.data?.data)) return r.data.data;
    console.warn("useGetStories: unexpected shape ->", r);
    return [];
  })();

  console.log("Normalized stories length:", stories.length);

  if (error)
    return (
      <ErrorComponent
        refetch={refetch}
        message={error.message ?? "Unexpected error"}
      />
    );
  return (
    <FlatList
      data={stories}
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
