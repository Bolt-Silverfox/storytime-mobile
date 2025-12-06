import { useNavigation } from "@react-navigation/native";
import { FlatList, Image, Pressable, Text } from "react-native";
import useGetStories, {
  Story,
} from "../hooks/tanstack/queryHooks/useGetStories";
import { KidsTabNavigatorProp } from "../Navigation/KidsTabNavigator";
import ErrorComponent from "./ErrorComponent";
import ImageWithFallback from "./parents/ImageWithFallback";

interface KidsHomeScreenStoriesProps {
  id: string;
  recommendedStories?: any[]; // optional
}

const KidsHomeScreenStories = ({
  id,
  recommendedStories = [],
}: KidsHomeScreenStoriesProps) => {
  const navigation = useNavigation<KidsTabNavigatorProp>();
  const { isPending, error, refetch, data } = useGetStories(id);
  const FALLBACK = require("../assets/parents/unseen-world.jpg");

  const stories: Story[] = (() => {
    const r: any = data;
    if (Array.isArray(r)) return r;
    if (Array.isArray(r?.data)) return r.data;
    if (Array.isArray(r?.data?.data)) return r.data.data;
    console.warn("useGetStories: unexpected shape ->", r);
    return [];
  })();
  // Merge recommended stories with regular stories (no duplicates)
  const mergedStories = [
    ...recommendedStories.map((rec) => rec.story), // recommended stories
    ...stories.filter(
      (s) => !recommendedStories.some((rec) => rec.story.id === s.id)
    ), // regular stories that aren't already in recommended
  ];

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
      data={mergedStories}
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
          <ImageWithFallback
            sourceUri={item.coverImageUrl}
            fallbackRequire={FALLBACK}
            className="w-full h-[250px] rounded-2xl"
            resizeMode="cover"
          />
        </Pressable>
      )}
    />
  );
};

export default KidsHomeScreenStories;
