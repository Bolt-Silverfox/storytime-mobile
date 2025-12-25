import { Pressable, Text, View } from "react-native";
import { storyCategories, storyCategoriesColours } from "../../data";

const StoryCategoriesList = () => {
  return (
    <View className="flex flex-col gap-y-4">
      <View className="flex flex-col gap-y-1.5">
        <Text className="font-[abeezee] text-black text-[18px]">
          All catgories
        </Text>
        <Text className="font-[abeezee] text-text text-sm">
          Gain access to all our stories
        </Text>
      </View>
      <View className="flex flex-row gap-x-2.5 items-center juify-center flex-wrap gap-y-4">
        {storyCategories.map((category) => (
          <Item category={category} key={category} />
        ))}
      </View>
    </View>
  );
};

export default StoryCategoriesList;

const getRandomNumber = (): number => {
  return Math.floor(Math.random() * 10 + 0);
};

const Item = ({ category }: { category: string }) => {
  const randomNum = getRandomNumber();
  const colour = storyCategoriesColours[randomNum];

  return (
    <Pressable
      onPress={() => {}}
      className="py-5  px-5 flex justify-center items-center rounded-md"
      style={{
        backgroundColor: colour,
        opacity: 0.4,
        borderBottomColor: colour,
        borderBottomWidth: 2,
      }}
    >
      <Text
        key={category}
        style={{
          color: colour,
        }}
        className="font-[abeezee]  text-sm rounded-lg"
      >
        {category}
      </Text>
    </Pressable>
  );
};
