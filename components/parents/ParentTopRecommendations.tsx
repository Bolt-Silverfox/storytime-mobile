import { useNavigation } from "@react-navigation/native";
import { ImageSourcePropType, ScrollView, Text, View } from "react-native";
import { ParntHomeNavigatorProp } from "../../Navigation/ParentHomeNavigator";
import { ageRange } from "../../data";
import StoryItem from "./StoryItem";
import useStoryMode from "../../contexts/StoryModeContext";
import { queryRecommendedStories } from "../../hooks/tanstack/queryHooks/useGetRecommendedStories";
import { useSuspenseQuery } from "@tanstack/react-query";
import ErrorComponent from "../ErrorComponent";

const ParentsTopRecommendations = () => {
  const navigator = useNavigation<ParntHomeNavigatorProp>();
  const { setActiveStoryId } = useStoryMode();
  const { data, error, refetch } = useSuspenseQuery(queryRecommendedStories());

  if (error)
    return <ErrorComponent refetch={refetch} message={error.message} />;
  return (
    <View className="flex flex-col gap-y-4 border-b border-b-border-light pb-8">
      <View className="flex max-w-screen-md mx-auto w-full flex-row justify-between items-center">
        <Text className="font-[abeezee]  text-base text-black leading-5">
          Top recommendations
        </Text>
        <Text
          onPress={() => navigator.navigate("topRecommendations")}
          className="font-[abeezee]  text-base text-[#0731EC] leading-5"
        >
          View all
        </Text>
      </View>

      <View className=" max-w-screen-md mx-auto w-full">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="flex bg-bgLight flex-row gap-x-3"
        >
          {data.slice(0, 6).map((story, index) => (
            <StoryItem
              isPremium={true}
              index={index}
              key={story.id}
              onNavigate={() => {
                navigator.navigate("childStoryDetails", { storyId: story.id });
                setActiveStoryId(story.id);
              }}
              story={story}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};
export default ParentsTopRecommendations;

export const dummyStories: {
  name: string;
  ageRange: (typeof ageRange)[number];
  category: string;
  duration: number;
  imageUrl: ImageSourcePropType;
  id: string;
}[] = [
  {
    name: "The boy whose writing comes to life",
    ageRange: "1 - 4",
    category: "adventure",
    duration: 10,
    imageUrl: require("../../assets/images/recommended_stories/boy_whose_writing_comes_to_life.jpg"),
    id: "1",
  },
  {
    name: "The bear and his friends in the forest",
    ageRange: "5 - 8",
    category: "mystery",
    duration: 32,
    imageUrl: require("../../assets/images/recommended_stories/the_bear_and_his_friends.jpg"),
    id: "2",
  },
  {
    name: "The boy whose writing comes to life",
    ageRange: "1 - 4",
    category: "adventure",
    duration: 10,
    imageUrl: require("../../assets/images/recommended_stories/boy_whose_writing_comes_to_life.jpg"),
    id: "3",
  },
  {
    name: "The bear and his friends in the forest",
    ageRange: "5 - 8",
    category: "mystery",
    duration: 32,
    imageUrl: require("../../assets/images/recommended_stories/the_bear_and_his_friends.jpg"),
    id: "4",
  },
  {
    name: "The bear and his friends in the forest",
    ageRange: "5 - 8",
    category: "mystery",
    duration: 32,
    imageUrl: require("../../assets/images/recommended_stories/the_bear_and_his_friends.jpg"),
    id: "5",
  },
  {
    name: "The boy whose writing comes to life",
    ageRange: "1 - 4",
    category: "adventure",
    duration: 10,
    imageUrl: require("../../assets/images/recommended_stories/boy_whose_writing_comes_to_life.jpg"),
    id: "6",
  },
  {
    name: "The bear and his friends in the forest",
    ageRange: "5 - 8",
    category: "mystery",
    duration: 32,
    imageUrl: require("../../assets/images/recommended_stories/the_bear_and_his_friends.jpg"),
    id: "7",
  },
  {
    name: "The bear and his friends in the forest",
    ageRange: "5 - 8",
    category: "mystery",
    duration: 32,
    imageUrl: require("../../assets/images/recommended_stories/the_bear_and_his_friends.jpg"),
    id: "8",
  },
];
