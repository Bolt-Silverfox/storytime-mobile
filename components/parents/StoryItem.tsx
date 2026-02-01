import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useToggleFavourites } from "../../hooks/tanstack/mutationHooks/useToggleFavourites";
import useQueryParentsFavourites from "../../hooks/tanstack/queryHooks/queryParentFavourites";
import { Story } from "../../types";
import Icon from "../Icon";
import { secondsToMinutes } from "../../utils/utils";

type Proptypes = {
  onNavigate: () => void;
  story: Story;
  isPremium?: boolean;
  index: number;
};

const StoryItem = ({
  onNavigate,
  story,
  index,
  isPremium = false,
}: Proptypes) => {
  const { data } = useSuspenseQuery(useQueryParentsFavourites());
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

  const isLocked = isPremium && index > 0;

  const navigate = () => {
    if (isLocked) return;
    onNavigate();
  };

  const isStoryLiked = (storyId: string) => {
    return data.some((stories) => stories.storyId === storyId);
  };

  const duration = secondsToMinutes(story.durationSeconds);

  return (
    <Pressable
      onPress={navigate}
      key={story.id}
      className={`flex w-48 max-w-52 flex-col gap-y-1.5 rounded-2xl  border border-border-light bg-white p-1`}
    >
      <View
        className={`relative h-full w-full flex-1 rounded-2xl ${isLocked ? "bg-[#4807EC66]" : null}`}
      >
        <Image
          className=" -z-10 h-[150px] w-full rounded-xl bg-cover"
          source={{ uri: story.coverImageUrl }}
          height={150}
        />
        <Pressable
          onPress={() => onToggle()}
          className="absolute right-2 top-2 flex size-11 items-center justify-center rounded-full bg-black/40"
        >
          {isStoryLiked(story.id) ? (
            <FontAwesome name="heart" size={24} color="red" />
          ) : (
            <FontAwesome name="heart-o" size={24} color="white" />
          )}
        </Pressable>
        <View className="flex flex-row items-center justify-between gap-x-2 px-0.5">
          <View className="flex flex-1 flex-row items-center">
            <Icon name="Dot" color={"#EC0794"} />
            <Text
              className="flex-1 text-wrap font-[abeezee] text-xs capitalize"
              style={storyItemStyles.categoryText}
            >
              {story.categories[0].name}
            </Text>
          </View>
          <View className="flex flex-row items-center gap-x-1">
            <Icon size={12} name="Clock" color="#616161" />
            <Text className="font-[abeezee] text-xs capitalize text-text">
              {duration} {duration > 1 ? "mins" : "min"}
            </Text>
          </View>
        </View>
        <Text className="w-full text-wrap px-0.5 font-[abeezee] text-base leading-5 text-black">
          {story.title}
        </Text>
        <Text className="px-1 font-[abeezee] text-xs text-text">
          {story.ageMin} - {story.ageMax} years
        </Text>
      </View>
      {isLocked && (
        <Image
          source={require("../../assets/icons/lock-icon.png")}
          className="absolute right-20 top-28 h-[51px] w-10"
        />
      )}
    </Pressable>
  );
};

export default StoryItem;

const storyItemStyles = StyleSheet.create({
  categoryText: {
    color: "#EC0794",
  },
});
