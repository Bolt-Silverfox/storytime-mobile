import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { useToggleFavourites } from "../hooks/tanstack/mutationHooks/useToggleFavourites";
import useQueryParentsFavourites from "../hooks/tanstack/queryHooks/queryParentFavourites";
import { FavouriteStory } from "../types";
import Icon from "./Icon";
import useAuth from "../contexts/AuthContext";

type PropTypes = {
  story: FavouriteStory;
  onShare: () => void;
};
const StoryDetailsCTA = ({ story, onShare }: PropTypes) => {
  const { isGuest } = useAuth();
  const { data } = useQueryParentsFavourites();

  const isLiked = useMemo(
    () =>
      data?.pages?.some((page) =>
        page.data?.some((s) => s?.storyId === story.storyId)
      ) ?? false,
    [data, story.storyId]
  );

  const { mutate: onToggle } = useToggleFavourites({
    story,
    isLiked,
  });

  return (
    <View className="flex flex-row gap-x-3 px-4">
      <Pressable
        onPress={onShare}
        className="border-line-light flex h-11 flex-1 flex-row items-center justify-center gap-x-1.5 rounded-full border"
      >
        <Icon name="Share2" />
        <Text className="text-fg font-[abeezee] text-base">Share</Text>
      </Pressable>
      {!isGuest && (
        <Pressable
          onPress={() => onToggle()}
          className="border-line-light flex h-11 flex-1 flex-row items-center justify-center gap-x-1.5 rounded-full border"
        >
          {isLiked ? (
            <FontAwesome name="heart" size={24} color="red" />
          ) : (
            <FontAwesome name="heart-o" size={24} color="black" />
          )}
          <Text className="text-fg font-[abeezee] text-base">Favourite</Text>
        </Pressable>
      )}
    </View>
  );
};

export default StoryDetailsCTA;
