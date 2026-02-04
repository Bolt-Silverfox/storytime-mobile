import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Image, Pressable, Text, View } from "react-native";
import { storyCategoriesColours } from "../../data";
import { useToggleFavourites } from "../../hooks/tanstack/mutationHooks/useToggleFavourites";
import queryParentsFavourites from "../../hooks/tanstack/queryHooks/queryParentFavourites";
import { Story } from "../../types";
import { getRandomNumber, secondsToMinutes } from "../../utils/utils";
import Icon from "../Icon";
import CustomImage from "../UI/CustomImage";

type Proptypes = {
  onNavigate: () => void;
  story: Story;
  isPremium?: boolean;
  index: number;
  isGrouped?: boolean;
};

const StoryItem = ({
  onNavigate,
  story,
  index,
  isPremium = false,
  isGrouped = false,
}: Proptypes) => {
  const { data } = useSuspenseQuery(queryParentsFavourites());
  const { mutate: onToggle, isPending } = useToggleFavourites({
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

  const categoryColour = storyCategoriesColours[getRandomNumber()];
  return (
    <Pressable
      onPress={navigate}
      key={story.id}
      className={`flex flex-col ${isGrouped ? "max-sm:w-[47.5%]" : "w-48 max-w-52"} gap-y-1.5 rounded-2xl  border border-border-light bg-white p-1`}
    >
      <View
        className={`relative h-full w-full flex-1 rounded-2xl ${isLocked ? "bg-[#4807EC66]" : null}`}
      >
        <CustomImage
          className=" -z-10 h-[150px] w-full rounded-xl bg-cover"
          source={{ uri: story.coverImageUrl }}
          height={150}
        />
        <Pressable
          disabled={isPending}
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
            <Icon name="Dot" color={categoryColour} />
            <Text
              className="flex-1 text-wrap font-[abeezee] text-xs capitalize"
              style={{
                color: categoryColour,
              }}
            >
              {story.categories[0].name.length > 15
                ? story.categories[0].name.split("").slice(0, 14).join("") +
                  "..."
                : story.categories[0].name}
            </Text>
          </View>
          <View className="flex flex-row items-center gap-x-1">
            <Icon size={12} name="Clock" color="#616161" />
            <Text className="font-[abeezee] text-xs capitalize text-text">
              {duration > 0 ? duration : "<1"} {duration > 1 ? "mins" : "min"}
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
