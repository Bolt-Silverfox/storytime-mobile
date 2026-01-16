import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { Dispatch, SetStateAction } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { ParentsNavigatorProp } from "../Navigation/ParentsNavigator";
import { FavouriteStory } from "../types";

const FavouriteStoryItem = ({
  story,
  setActiveStory,
}: {
  story: FavouriteStory;
  setActiveStory: Dispatch<SetStateAction<null | FavouriteStory>>;
}) => {
  const navigator = useNavigation<ParentsNavigatorProp>();

  const onNavigate = () => {
    navigator.navigate("story", {
      screen: "childStoryDetails",
      params: { storyId: story.storyId },
    });
  };
  return (
    <Pressable
      onPress={onNavigate}
      className="flex flex-row p-2 gap-x-2 bg-white border border-border-lighter rounded-3xl"
    >
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
          {story.ageRange} years
        </Text>
        <Pressable className="size-11 self-end bg-black/5 flex justify-center items-center rounded-full">
          <FontAwesome
            onPress={() => setActiveStory(story)}
            name="heart"
            size={24}
            color="red"
          />
        </Pressable>
      </View>
    </Pressable>
  );
};

export default FavouriteStoryItem;
