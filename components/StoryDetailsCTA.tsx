import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Dispatch, SetStateAction, useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { useToggleFavourites } from "../hooks/tanstack/mutationHooks/useToggleFavourites";
import useQueryParentsFavourites from "../hooks/tanstack/queryHooks/queryParentFavourites";
import { FavouriteStory } from "../types";
import Icon from "./Icon";

type PropTypes = {
  story: FavouriteStory;
  setShowShareModal: Dispatch<SetStateAction<boolean>>;
};
const StoryDetailsCTA = ({ story, setShowShareModal }: PropTypes) => {
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
        onPress={() => setShowShareModal(true)}
        className="flex h-11 flex-1 flex-row items-center justify-center gap-x-1.5 rounded-full border border-border-light"
      >
        <Icon name="Share2" />
        <Text className="font-[abeezee] text-base text-black">Share</Text>
      </Pressable>
      <Pressable
        onPress={() => onToggle()}
        className="flex h-11 flex-1 flex-row items-center justify-center gap-x-1.5 rounded-full border border-border-light"
      >
        {isLiked ? (
          <FontAwesome name="heart" size={24} color="red" />
        ) : (
          <FontAwesome name="heart-o" size={24} color="black" />
        )}
        <Text className="font-[abeezee] text-base text-black">Favourite</Text>
      </Pressable>
    </View>
  );
};

export default StoryDetailsCTA;
