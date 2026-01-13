import { Dispatch, SetStateAction } from "react";
import { FavouriteStory } from "../types";
import { Image, Text, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const FavouriteStoryItem = ({
  story,
  setActiveStory,
}: {
  story: FavouriteStory;
  setActiveStory: Dispatch<SetStateAction<null | FavouriteStory>>;
}) => {
  return (
    <View className="flex flex-row p-2 gap-x-2 bg-white border border-border-lighter rounded-3xl">
      <Image
        source={{ uri: story.coverImageUrl }}
        height={171}
        width={186}
        className="rounded-3xl"
      />
      <View className="flex flex-col gap-y-2 flex-1">
        <Text className="font-[abeezee] text-black text-sm">{story.title}</Text>
        <Text className="font-[abeezee] text-text text-sm">
          {story.description}
        </Text>
        <Text className="font-[abeezee] text-text text-sm">
          {story.ageMin} - {story.ageMax}
        </Text>
        <FontAwesome
          onPress={() => setActiveStory(story)}
          name="heart"
          className="self-end"
          size={24}
          color="red"
        />
      </View>
    </View>
  );
};

export default FavouriteStoryItem;
