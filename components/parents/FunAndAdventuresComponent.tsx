import { useNavigation } from "@react-navigation/native";
import { ImageSourcePropType, ScrollView, Text, View } from "react-native";
import { ParntHomeNavigatorProp } from "../../Navigation/ParentHomeNavigator";
import { ageRange } from "../../data";
import StoryItem from "./StoryItem";

const FunAndAdventuresComponent = () => {
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
      name: "Aily searching for her true purpose",
      ageRange: "9 - 12",
      category: "folk tales",
      duration: 10,
      imageUrl: require("../../assets/images/recommended_stories/aily_and_her_purpose.jpg"),
      id: "1",
    },
    {
      name: "The secrets of the world beyond",
      ageRange: "9 - 12",
      category: "bedtime",
      duration: 32,
      imageUrl: require("../../assets/images/recommended_stories/the_secrets_of_the_world_beyond.jpg"),
      id: "2",
    },
    {
      name: "Aily searching for her true purpose",
      ageRange: "9 - 12",
      category: "folk tales",
      duration: 10,
      imageUrl: require("../../assets/images/recommended_stories/aily_and_her_purpose.jpg"),
      id: "3",
    },
    {
      name: "The secrets of the world beyond",
      ageRange: "9 - 12",
      category: "bedtime",
      duration: 32,
      imageUrl: require("../../assets/images/recommended_stories/the_secrets_of_the_world_beyond.jpg"),
      id: "4",
    },
    {
      name: "The secrets of the world beyond",
      ageRange: "9 - 12",
      category: "bedtime",
      duration: 32,
      imageUrl: require("../../assets/images/recommended_stories/the_secrets_of_the_world_beyond.jpg"),
      id: "5",
    },
    {
      name: "Aily searching for her true purpose",
      ageRange: "9 - 12",
      category: "folk tales",
      duration: 10,
      imageUrl: require("../../assets/images/recommended_stories/aily_and_her_purpose.jpg"),
      id: "6",
    },
    {
      name: "The secrets of the world beyond",
      ageRange: "9 - 12",
      category: "bedtime",
      duration: 32,
      imageUrl: require("../../assets/images/recommended_stories/the_secrets_of_the_world_beyond.jpg"),
      id: "7",
    },
  ];
  return (
    <View className="flex max-w-screen-md mx-auto w-full flex-col gap-y-4 border-b border-b-border-light pb-8">
      <View className="flex flex-row justify-between items-center">
        <Text className="font-[abeezee]  text-base text-black leading-5">
          Fun and adventures
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
  );
};

export default FunAndAdventuresComponent;
