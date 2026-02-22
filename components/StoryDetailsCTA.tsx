import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";
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
  const { data } = useSuspenseQuery(useQueryParentsFavourites());
  const { mutate: onToggle } = useToggleFavourites({
    story,
  });

  const isStoryLiked = (storyId: string) => {
    return data.some((stories) => stories.storyId === storyId);
  };

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
        {isStoryLiked(story.id) ? (
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
