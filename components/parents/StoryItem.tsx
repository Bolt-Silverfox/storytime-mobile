import {
  Image,
  ImageSourcePropType,
  Pressable,
  Text,
  View,
} from "react-native";
import { ageRange } from "../../data";
import Icon from "../Icon";

const getColor = (category: string) => {
  const lowerCaseCat = category.toLowerCase();
  if (lowerCaseCat === "adventure") {
    return "#0731EC";
  } else if (lowerCaseCat === "mystery") {
    return "#07A92A";
  } else if (lowerCaseCat === "honesty" || lowerCaseCat === "fantasy") {
    return "#EC0794";
  } else if (lowerCaseCat === "folk tales" || lowerCaseCat === "bedtime") {
    return "#EC4007";
  } else return "black";
};

type Proptypes = {
  onNavigate: () => void;
  story: {
    id: string;
    category: string;
    imageUrl: ImageSourcePropType;
    duration: number;
    name: string;
    ageRange: (typeof ageRange)[number];
  };
};

const StoryItem = ({ onNavigate, story }: Proptypes) => {
  return (
    <Pressable
      onPress={onNavigate}
      key={story.id}
      className="flex flex-col w-52 gap-y-1.5 border-border-light p-1 rounded-2xl bg-white border "
    >
      <Image
        source={story.imageUrl}
        className="w-full h-[192px] rounded-xl bg-cover"
      />
      <View className="flex flex-row justify-between items-center">
        <View className="flex flex-row items-center">
          <Icon name="Dot" color={getColor(story.category)} />
          <Text
            className="font-[abeezee] capitalize text-xs"
            style={{
              color: getColor(story.category),
            }}
          >
            {story.category}
          </Text>
        </View>
        <View className="flex flex-row gap-x-2 items-center">
          <Icon size={12} name="Clock" color="#616161" />
          <Text className="font-[abeezee] text-text capitalize text-xs">
            {story.duration} mins
          </Text>
        </View>
      </View>
      <Text className="font-[abeezee] w-full text-wrap text-base text-black leading-5">
        {story.name}
      </Text>
      <Text className="font-[abeezee]   text-text text-xs">
        {story.ageRange} years
      </Text>
    </Pressable>
  );
};

export default StoryItem;
