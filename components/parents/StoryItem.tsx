import { Image, Pressable, Text, View } from "react-native";
import { Story } from "../../types";
import Icon from "../Icon";

type Proptypes = {
  onNavigate: () => void;
  story: Story;
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
      className={`flex flex-col w-48 max-w-52 gap-y-1.5 border-border-light  p-1 rounded-2xl border bg-white`}
    >
      <View
        className={`flex-1 w-full h-full rounded-2xl relative ${isLocked ? "bg-[#4807EC66]" : null}`}
      >
        <Image
          className=" h-[150px] w-full -z-10 rounded-xl bg-cover"
          source={{ uri: story.coverImageUrl }}
          height={150}
        />
        <Pressable className="absolute size-11 justify-center items-center flex bg-black/40 right-2 top-2 rounded-full">
          <Icon name="Heart" color="white" />
        </Pressable>
        <View className="flex gap-x-2 px-0.5 flex-row justify-between items-center">
          <View className="flex flex-1 flex-row items-center">
            <Icon name="Dot" color={"#EC0794"} />
            <Text
              className="font-[abeezee] text-wrap flex-1 capitalize text-xs"
              style={{
                color: "#EC0794",
              }}
            >
              {story.categories[0].name}
            </Text>
          </View>
          <View className="flex flex-row gap-x-1 items-center">
            <Icon size={12} name="Clock" color="#616161" />
            <Text className="font-[abeezee] text-text capitalize text-xs">
              {32} mins
            </Text>
          </View>
        </View>
        <Text className="font-[abeezee] px-0.5 w-full text-wrap text-base text-black leading-5">
          {story.title}
        </Text>
        <Text className="font-[abeezee] px-1 text-text text-xs">
          {story.ageMin} - {story.ageMax} years
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
