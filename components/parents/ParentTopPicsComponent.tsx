import { useNavigation } from "@react-navigation/native";
import { ImageSourcePropType, ScrollView, Text, View } from "react-native";
import { ParntHomeNavigatorProp } from "../../Navigation/ParentHomeNavigator";
import { ageRange } from "../../data";
import StoryItem from "./StoryItem";

const ParentsTopPicksComponent = () => {
  const navigator = useNavigation<ParntHomeNavigatorProp>();
  const dummyStories: {
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
      imageUrl: require("../../assets/images/recommended_stories/boy_whose_writing_comes_to_life.png"),
      id: "1",
    },
    {
      name: "The bear and his friends in the forest",
      ageRange: "5 - 8",
      category: "mystery",
      duration: 32,
      imageUrl: require("../../assets/images/recommended_stories/the_bear_and_his_friends.png"),
      id: "2",
    },
    {
      name: "The boy whose writing comes to life",
      ageRange: "1 - 4",
      category: "adventure",
      duration: 10,
      imageUrl: require("../../assets/images/recommended_stories/boy_whose_writing_comes_to_life.png"),
      id: "3",
    },
    {
      name: "The bear and his friends in the forest",
      ageRange: "5 - 8",
      category: "mystery",
      duration: 32,
      imageUrl: require("../../assets/images/recommended_stories/the_bear_and_his_friends.png"),
      id: "4",
    },
  ];
  return (
    <View className="flex flex-col gap-y-4 border-b border-b-border-light pb-8">
      <View className="flex flex-row justify-between items-center">
        <Text className="font-[abeezee]  text-base text-black leading-5">
          Top picks from parents
        </Text>
        <Text
          onPress={() => navigator.navigate("parentsTopPicks")}
          className="font-[abeezee]  text-base text-[#0731EC] leading-5"
        >
          View all
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="flex bg-bgLight flex-row gap-x-3"
      >
        {dummyStories.map((story) => (
          <StoryItem
            key={story.id}
            onNavigate={() => navigator.navigate("parentsTopPicks")}
            story={story}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default ParentsTopPicksComponent;
