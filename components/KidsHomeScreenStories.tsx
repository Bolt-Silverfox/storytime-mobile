import { useNavigation } from "@react-navigation/native";
import { useSuspenseQuery } from "@tanstack/react-query";
import { FlatList, Pressable, View } from "react-native";
import { KidsTabNavigatorProp } from "../Navigation/KidsTabNavigator";
import ErrorComponent from "./ErrorComponent";
import ImageWithFallback from "./parents/ImageWithFallback";
import CustomEmptyState from "./emptyState/CustomEmptyState";
import queryKidsStories from "../hooks/tanstack/queryHooks/queryKidsStories";

interface KidsHomeScreenStoriesProps {
  kidId: string;
}

const KidsHomeScreenStories = ({ kidId }: KidsHomeScreenStoriesProps) => {
  const navigator = useNavigation<KidsTabNavigatorProp>();
  const { error, refetch, data } = useSuspenseQuery(queryKidsStories(kidId));
  const FALLBACK = require("../assets/parents/unseen-world.jpg");

  if (error)
    return (
      <ErrorComponent
        refetch={refetch}
        message={error.message ?? "Unexpected error"}
      />
    );

  if (!data.length) return <CustomEmptyState message="No stories yet" />;
  return (
    <FlatList
      data={data}
      className="flex-1 gap-4 mx-4"
      contentContainerClassName=""
      showsVerticalScrollIndicator={false}
      numColumns={2}
      columnWrapperStyle={{ gap: 10 }}
      renderItem={({ item }) => (
        <Pressable
          key={item.id}
          onPress={() => {
            navigator.navigate("storyInteraction", { storyId: item.id });
          }}
          className="overflow-hidden rounded-lg flex-1 mb-10"
        >
          <View className="w-[167] h-[160] rounded-tl-[20] bg-[#5E3A54]"></View>
          <View className="w-[167] h-[24] rounded-bl-[20] bg-[#5E3A54] pt-[2]">
            <View className="rounded-l-[20] flex-row w-[157] self-end  h-[16] bg-[#D5D3E5]">
              <View className="rounded-l-[20] bg-[#A39FC6] h-[16] w-[16]" />
              <View className="bg-[#A39FC6] h-[6] w-[141]">
                {/* <Bookmark color={"#C5240B"} className="bg-red-400" /> */}
              </View>
            </View>
          </View>

          <ImageWithFallback
            sourceUri={item.coverImageUrl}
            fallbackRequire={FALLBACK}
            style={{ position: "absolute", right: 0 }}
            className="h-[162px] w-[150px]"
          />
        </Pressable>
      )}
    />
  );
};

export default KidsHomeScreenStories;
