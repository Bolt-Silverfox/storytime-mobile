import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { Pressable, Text, View } from "react-native";
import { storyCategoriesColours } from "../../data";
import { useToggleFavourites } from "../../hooks/tanstack/mutationHooks/useToggleFavourites";
import queryParentsFavourites from "../../hooks/tanstack/queryHooks/queryParentFavourites";
import { ProtectedRoutesNavigationProp } from "../../Navigation/ProtectedNavigator";
import { Story } from "../../types";
import { getRandomNumber, secondsToMinutes } from "../../utils/utils";
import Icon from "../Icon";
import CustomImage from "../UI/CustomImage";

type Proptypes = {
  story: Story;
  isGrouped?: boolean;
};

const StoryItem = ({ story, isGrouped = false }: Proptypes) => {
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

  const isStoryLiked = (storyId: string) => {
    if (!data) return false;
    return data.some((stories) => stories.storyId === storyId);
  };

  const duration = secondsToMinutes(durationSeconds);

  const categoryColour = storyCategoriesColours[getRandomNumber()];
  const categoryName = categories?.[0]?.name ?? "Uncategorized";
  const categoryLabel =
    categoryName.length > 15 ? `${categoryName.slice(0, 14)}...` : categoryName;

  return (
    <Pressable
      onPress={navigate}
      key={id}
      className={`flex min-h-[230px] flex-col ${isGrouped ? "max-sm:w-[47.5%]" : "w-52 min-w-52"} gap-y-1.5 rounded-2xl  border border-border-light bg-white p-1`}
    >
      <View className={`relative h-full w-full flex-1 rounded-2xl`}>
        <CustomImage
          className=" -z-10 h-[150px] w-full min-w-full rounded-xl bg-cover"
          source={{ uri: coverImageUrl }}
          height={150}
        />
        <Pressable
          disabled={isPending}
          onPress={() => onToggle()}
          className="absolute right-2 top-2 flex size-11 items-center justify-center rounded-full bg-black/40"
        >
          {isStoryLiked(id) ? (
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
              {duration > 0 ? duration : "<1"} {duration > 1 ? "mins" : "min"}
            </Text>
          </View>
        </View>
        <Text className="w-full text-wrap px-0.5 font-[abeezee] text-base leading-5 text-black">
          {title}
        </Text>
        <Text className="px-1 font-[abeezee] text-xs text-text">
          {ageMin} - {ageMax} years
        </Text>
      </View>
    </Pressable>
  );
};

export default StoryItem;
