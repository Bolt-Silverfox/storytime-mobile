import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { Dispatch, SetStateAction } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { ProtectedRoutesNavigationProp } from "../Navigation/ProtectedNavigator";
import { FavouriteStory } from "../types";

const FavouriteStoryItem = ({
  story,
  setActiveStory,
}: {
  story: FavouriteStory;
  setActiveStory: Dispatch<SetStateAction<null | FavouriteStory>>;
}) => {
  const protectedNavigator = useNavigation<ProtectedRoutesNavigationProp>();
  const [ageMin, ageMax] = story.ageRange.split("-");

  const onNavigate = () => {
    protectedNavigator.navigate("stories", {
      screen: "childStoryDetails",
      params: {
        story: {
          ageMin: Number(ageMin),
          ageMax: Number(ageMax),
          categories: story.categories,
          coverImageUrl: story.coverImageUrl,
          description: story.description,
          durationSeconds: story.durationSeconds,
          title: story.title,
          id: story.storyId,
          createdAt: story.createdAt,
        },
      },
    });
  };

  return (
    <Pressable
      onPress={onNavigate}
      className="border-line-soft bg-surface flex flex-row gap-x-2 rounded-3xl border p-2"
    >
      <Image
        source={{ uri: story.coverImageUrl }}
        height={171}
        width={186}
        className="rounded-3xl"
      />
      <View className="flex flex-1 flex-col gap-y-2">
        <Text className="text-fg font-[abeezee] text-lg">{story.title}</Text>
        <Text className="text-body font-[abeezee] text-sm">
          {story.description}
        </Text>
        <Text className="text-body font-[abeezee] text-sm">
          {story.ageRange} years
        </Text>
        <Pressable
          onPress={() => setActiveStory(story)}
          accessibilityRole="button"
          accessibilityLabel="Remove from favourites"
          className="flex size-11 items-center justify-center self-end rounded-full bg-black/5"
        >
          <FontAwesome name="heart" size={24} color="red" />
        </Pressable>
      </View>
    </Pressable>
  );
};

export default FavouriteStoryItem;
