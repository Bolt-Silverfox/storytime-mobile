import { useNavigation } from "@react-navigation/native";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import useGetRecommendedStory, { Story } from "../hooks/tanstack/queryHooks/useGetRecommendedStory";
import { KidsTabNavigatorProp } from "../Navigation/KidsTabNavigator";
import ErrorComponent from "./ErrorComponent";
import LoadingOverlay from "./LoadingOverlay";

const KidsHomeScreenStories = ({ id }: { id: string }) => {
  const navigation = useNavigation<KidsTabNavigatorProp>();

  // >>> Use recommended story hook
  const { data, isLoading, error, refetch } = useGetRecommendedStory(id);

  // Normalize the returned stories (assuming backend returns { data: Story[] } or array)
  const stories: Story[] = (() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.data?.data)) return data.data.data;
    console.warn("useGetRecommendedStory: unexpected shape ->", data);
    return [];
  })();

  if (isLoading) return <LoadingOverlay visible label="Loading stories..." />;
  if (error)
    return (
      <ErrorComponent
        refetch={refetch}
        message={error.message ?? "Failed to load recommended stories"}
      />
    );

  return (
    <FlatList
      data={stories}
      keyExtractor={(item) => item.id}
      className="flex-1 gap-4"
      showsVerticalScrollIndicator={false}
      numColumns={2}
      columnWrapperStyle={{ gap: 10 }}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => {
            navigation.navigate("setup" as any, {
              screen: "storyInteraction",
              params: { storyId: item.id },
            });
          }}
          className="overflow-hidden rounded-lg flex-1 mb-10"
        >
          <View className="w-[167] h-[160] rounded-tl-[20] bg-[#5E3A54]"></View>
          <View className="w-[167] h-[24] rounded-bl-[20] bg-[#5E3A54] pt-[2]">
            <View className="rounded-l-[20] flex-row w-[157] self-end  h-[16] bg-[#D5D3E5]">
              <View className="rounded-l-[20] bg-[#A39FC6] h-[16] w-[16]" />
              <View className="bg-[#A39FC6] h-[6] w-[141]" />
            </View>
          </View>

          <Image
            source={{ uri: item.coverImageUrl }}
            style={{ position: "absolute", right: 0 }}
            className="h-[162px] w-[150px]"
          />
        </Pressable>
      )}
    />
  );
};

export default KidsHomeScreenStories;
