import {
  Image,
  ImageSourcePropType,
  Pressable,
  Text,
  View,
} from "react-native";
import { ageRange } from "../../data";
import Icon from "../Icon";
import { getCategoryColour } from "../../utils/utils";

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
  isPremium?: boolean;
  index: number;
};

const StoryItem = ({
  onNavigate,
  story,
  index,
  isPremium = false,
}: Proptypes) => {
  const isLocked = isPremium && index > 0;

  const navigate = () => {
    if (isLocked) return;
    onNavigate();
  };

  return (
    <Pressable
      onPress={navigate}
      key={story.id}
      className={`flex flex-col w-52 gap-y-1.5 border-border-light  p-1 rounded-2xl border bg-white`}
    >
      <View
        className={`flex-1 w-full h-full rounded-2xl relative ${isLocked ? "bg-[#4807EC66]" : null}`}
      >
        <Image
          source={story.imageUrl}
          className="w-full h-[150px] -z-10 rounded-xl bg-cover"
        />
        <View className="flex px-0.5 flex-row justify-between items-center">
          <View className="flex flex-row items-center">
            <Icon name="Dot" color={getCategoryColour(story.category)} />
            <Text
              className="font-[abeezee] capitalize text-xs"
              style={{
                color: getCategoryColour(story.category),
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
        <Text className="font-[abeezee] px-0.5 w-full text-wrap text-base text-black leading-5">
          {story.name}
        </Text>
        <Text className="font-[abeezee] px-1 text-text text-xs">
          {story.ageRange} years
        </Text>
      </View>
      {isLocked && (
        <Image
          source={require("../../assets/icons/lock-icon.png")}
          className="h-[51px] w-10 absolute right-20 top-28"
        />
      )}
    </Pressable>
  );
};

export default StoryItem;
