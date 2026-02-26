import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { memo, useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { READ_STATUS_COLORS } from "../../constants";
import { storyCategoriesColours } from "../../data";
import { useToggleFavourites } from "../../hooks/tanstack/mutationHooks/useToggleFavourites";
import queryParentsFavourites from "../../hooks/tanstack/queryHooks/queryParentFavourites";
import { ProtectedRoutesNavigationProp } from "../../Navigation/ProtectedNavigator";
import { Story } from "../../types";
import { getCategoryColourIndex, secondsToMinutes } from "../../utils/utils";
import Icon from "../Icon";
import CustomImage from "../UI/CustomImage";

type Proptypes = {
  story: Story;
  isGrouped?: boolean;
};

const readStatusStyles = {
  doneText: { color: READ_STATUS_COLORS.done },
  readingDot: { backgroundColor: READ_STATUS_COLORS.reading },
  readingText: { color: READ_STATUS_COLORS.reading },
} as const;

const StoryItem = memo(({ story, isGrouped = false }: Proptypes) => {
  const {
    id,
    title,
    description,
    coverImageUrl,
    createdAt,
    ageMin,
    ageMax,
    categories,
    durationSeconds,
  } = story;
  const navigator = useNavigation<ProtectedRoutesNavigationProp>();
  const { data } = useQuery(queryParentsFavourites());
  const { mutate: onToggle, isPending } = useToggleFavourites({
    story: {
      id,
      storyId: id,
      title: title,
      description: description,
      coverImageUrl: coverImageUrl,
      createdAt: createdAt,
      ageRange: `${ageMin}-${ageMax}`,
      categories: categories,
      durationSeconds: durationSeconds,
    },
  });

  const navigate = () => {
    navigator.navigate("stories", {
      screen: "childStoryDetails",
      params: {
        story: {
          ageMax,
          ageMin,
          categories,
          coverImageUrl,
          description,
          durationSeconds,
          id,
          title,
          createdAt,
        },
      },
    });
  };

  const isLiked = useMemo(
    () => data?.some((s) => s.storyId === id) ?? false,
    [data, id]
  );

  const duration = secondsToMinutes(durationSeconds);

  const categoryColour =
    storyCategoriesColours[
      getCategoryColourIndex(id, storyCategoriesColours.length)
    ];
  const categoryName = categories?.[0]?.name ?? "Uncategorized";
  const categoryLabel =
    categoryName.length > 15 ? `${categoryName.slice(0, 14)}...` : categoryName;

  return (
    <Pressable
      onPress={navigate}
      key={id}
      className={`flex flex-col ${isGrouped ? "flex-1" : "w-52 min-w-52"} gap-y-1.5 rounded-2xl border border-border-light bg-white p-1`}
    >
      <View className={`relative w-full flex-1 rounded-2xl`}>
        <CustomImage
          className="h-[150px] w-full min-w-full rounded-xl bg-cover"
          source={{ uri: coverImageUrl }}
          height={150}
        />
        <Pressable
          disabled={isPending}
          onPress={() => onToggle()}
          className="absolute right-2 top-2 flex size-11 items-center justify-center rounded-full bg-black/40"
        >
          {isLiked ? (
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
              {categoryLabel}
            </Text>
          </View>
          <View className="flex flex-row items-center gap-x-1">
            <Icon size={12} name="Clock" color="#616161" />
            <Text className="font-[abeezee] text-xs capitalize text-text">
              {duration > 0 ? duration : "<1"}
              {duration > 1 ? " mins" : " min"}
            </Text>
          </View>
        </View>
        <Text className="w-full flex-1 text-wrap px-0.5 font-[abeezee] text-base leading-5 text-black">
          {title}
        </Text>
        <View className="flex flex-row items-center justify-between px-1">
          <Text className="font-[abeezee] text-xs text-text">
            {ageMin} - {ageMax} years
          </Text>
          {story.readStatus === "done" && (
            <View
              accessible
              accessibilityRole="text"
              accessibilityLabel="Story already read"
              className="flex flex-row items-center gap-x-1"
            >
              <Icon
                name="CircleCheck"
                size={14}
                color={READ_STATUS_COLORS.done}
              />
              <Text
                style={readStatusStyles.doneText}
                className="font-[abeezee] text-xs font-bold"
              >
                Done
              </Text>
            </View>
          )}
          {story.readStatus === "reading" && (
            <View
              accessible
              accessibilityRole="text"
              accessibilityLabel="Story in progress"
              className="flex flex-row items-center gap-x-1"
            >
              <View
                style={readStatusStyles.readingDot}
                className="size-3 rounded-full"
              />
              <Text
                style={readStatusStyles.readingText}
                className="font-[abeezee] text-xs font-bold"
              >
                Reading
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
});

StoryItem.displayName = "StoryItem";

export default StoryItem;
