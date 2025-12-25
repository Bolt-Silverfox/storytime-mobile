import { useNavigation } from "@react-navigation/native";
import { ImageSourcePropType, ScrollView, Text, View } from "react-native";
import { ParntHomeNavigatorProp } from "../../Navigation/ParentHomeNavigator";
import { ageRange } from "../../data";
import StoryItem from "./StoryItem";

const SeasonalStoriesComponent = () => {
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
      name: "The old woman and the honest wolf",
      ageRange: "1 - 4",
      category: "honesty",
      duration: 10,
      imageUrl: require("../../assets/images/recommended_stories/the_honest_old_woman.jpg"),
      id: "1",
    },
    {
      name: "Babariga and his companions",
      ageRange: "9 - 12",
      category: "fantasy",
      duration: 32,
      imageUrl: require("../../assets/images/recommended_stories/babariga_and_his_companions.jpg"),
      id: "2",
    },
    {
      name: "The old woman and the honest wolf",
      ageRange: "1 - 4",
      category: "honesty",
      duration: 10,
      imageUrl: require("../../assets/images/recommended_stories/the_honest_old_woman.jpg"),
      id: "3",
    },
    {
      name: "Babariga and his companions",
      ageRange: "9 - 12",
      category: "fantasy",
      duration: 32,
      imageUrl: require("../../assets/images/recommended_stories/babariga_and_his_companions.jpg"),
      id: "4",
    },
    {
      name: "The old woman and the honest wolf",
      ageRange: "1 - 4",
      category: "honesty",
      duration: 10,
      imageUrl: require("../../assets/images/recommended_stories/the_honest_old_woman.jpg"),
      id: "5",
    },
    {
      name: "Babariga and his companions",
      ageRange: "9 - 12",
      category: "fantasy",
      duration: 32,
      imageUrl: require("../../assets/images/recommended_stories/babariga_and_his_companions.jpg"),
      id: "6",
    },
    {
      name: "The old woman and the honest wolf",
      ageRange: "1 - 4",
      category: "honesty",
      duration: 10,
      imageUrl: require("../../assets/images/recommended_stories/the_honest_old_woman.jpg"),
      id: "7",
    },
    {
      name: "Babariga and his companions",
      ageRange: "9 - 12",
      category: "fantasy",
      duration: 32,
      imageUrl: require("../../assets/images/recommended_stories/babariga_and_his_companions.jpg"),
      id: "8",
    },
  ];
  return (
    <View className="flex flex-col gap-y-4 border-b border-b-border-light pb-8">
      <View className="flex flex-row max-w-screen-md mx-auto w-full justify-between items-center">
        <Text className="font-[abeezee]  text-base text-black leading-5">
          Seasonal stories
        </Text>
        <Text
          onPress={() => navigator.navigate("parentsTopPicks")}
          className="font-[abeezee]  text-base text-[#0731EC] leading-5"
        >
          View all
        </Text>
      </View>

      <View className="max-w-screen-md mx-auto w-full">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="flex bg-bgLight flex-row gap-x-3"
        >
          {dummyStories.map((story, index) => (
            <StoryItem
              index={index}
              isPremium={true}
              key={story.id}
              onNavigate={() => navigator.navigate("parentsTopPicks")}
              story={story}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default SeasonalStoriesComponent;
