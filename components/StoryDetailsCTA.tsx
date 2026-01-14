import { Pressable, Text, View } from "react-native";
import Icon from "./Icon";
import { Story } from "../types";
import { Dispatch, SetStateAction } from "react";
import { useToggleFavourites } from "../hooks/tanstack/mutationHooks/useParentFavourites";
import { useSuspenseQuery } from "@tanstack/react-query";
import queryParentsFavourites from "../hooks/tanstack/queryHooks/queryParentFavourites";
import FontAwesome from "@expo/vector-icons/FontAwesome";

type PropTypes = {
  story: Story;
  setShowShareModal: Dispatch<SetStateAction<boolean>>;
};
const StoryDetailsCTA = ({ story, setShowShareModal }: PropTypes) => {
  const { data } = useSuspenseQuery(queryParentsFavourites());
  const { mutate: onToggle } = useToggleFavourites({
    story: {
      id: story.id,
      storyId: story.id,
      title: story.title,
      description: story.description,
      coverImageUrl: story.coverImageUrl,
      createdAt: story.createdAt,
      ageRange: `${story.ageMin}-${story.ageMax}`,
    },
  });

  const isStoryLiked = (storyId: string) => {
    return data.some((stories) => stories.storyId === storyId);
  };

  return (
    <View className="flex px-4 flex-row gap-x-3">
      <Pressable
        onPress={() => setShowShareModal(true)}
        className="rounded-full border flex-1 border-border-light flex justify-center flex-row gap-x-1.5 items-center h-11"
      >
        <Icon name="Share2" />
        <Text className="font-[abeezee] text-base text-black">Share</Text>
      </Pressable>
      <Pressable
        onPress={() => onToggle()}
        className="rounded-full border flex-1 border-border-light flex justify-center flex-row gap-x-1.5 items-center h-11"
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
