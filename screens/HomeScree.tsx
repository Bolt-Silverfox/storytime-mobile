import { useNavigation } from "@react-navigation/native";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { RootNavigatorProp } from "../Navigation/RootNavigator";
import Icon from "../components/Icon";
import useAuth from "../contexts/AuthContext";

const HomeScree = () => {
  const { user } = useAuth();
  const navigator = useNavigation<RootNavigatorProp>();
  return (
    <ScrollView contentContainerClassName="flex px-5 pt-4 pb-10 bg-white">
      <View
        aria-labelledby="user avatar container"
        className="flex flex-row items-center gap-2"
      >
        <View>
          <Image source={require("../assets/placeholder-pfp.png")} />
        </View>
        <View className="flex flex-1  flex-col gap-y-1.5">
          <Text className="font-[abeezee] text-base">
            {user?.title} {user?.name}
          </Text>
          <Text className="font-[abeezee] text-[12px] text-[#616161]">
            Good Morning
          </Text>
        </View>
        <Icon name="Bell" />
      </View>

      <View className="mt-5 mb-8 bg-[#6121AF] rounded-2xl flex justify-between items-center flex-row gap-x-2 pl-2.5">
        <Pressable
          onPress={() =>
            navigator.navigate("profile", {
              screen: "completeProfile",
            })
          }
          className="bg-white size-16 flex justify-center self-center  items-center rounded-full"
        >
          <Icon name="Plus" color="black" />
        </Pressable>
        <View className="flex flex-1  flex-col gap-y-2">
          <Text className="font-[abeezee] text-[#EEC607] text-sm">
            Add a child
          </Text>
          <Text className="font-[abeezee] leading-[130%] text-white text-[11px]">
            Add child’s profile to unlock personalized stories, safer content,
            and a calmer bedtime routine.
          </Text>
        </View>
        <Image
          className="size-[133px]"
          source={require("../assets/images/mother-and-child.png")}
        />
      </View>

      <View
        aria-labelledby="Most popular suggestinos"
        className="flex flex-col gap-y-2"
      >
        <View className="flex flex-row justify-between items-center">
          <Text className="text-xl font-[quilka]">
            Most popular suggestions
          </Text>
          <Text className="font-[abeezee] text-base text-link">View all</Text>
        </View>
        <HorizontalList />
      </View>

      <View
        aria-labelledby="Categories"
        className="flex flex-col gap-y-2 mt-10"
      >
        <View className="flex flex-row justify-between items-center">
          <Text className="text-xl font-[quilka]">Categories</Text>
          <Text className="font-[abeezee] text-base text-link">View all</Text>
        </View>
        <View className="flex flex-row flex-wrap justify-around gap-4">
          {categories.map((category) => (
            <View
              style={{
                backgroundColor: category.bg,
                opacity: 10,
                borderBottomWidth: 1,
                borderBottomRightRadius: 1,
                borderColor: category.colour,
                borderBottomEndRadius: 20,
              }}
              key={category.name}
              className={`h-[91px] w-[160px]  flex justify-center items-center rounded-3xl`}
            >
              <Text
                style={{ color: category.colour }}
                className="font-[abeezee] text-base"
              >
                {category.name}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View
        aria-labelledby="Footer information"
        className="flex flex-col gap-y-3 mt-16"
      >
        <Text className="font-[abeezee] text-xl  text-black text-center">
          You are on free mode
        </Text>
        <Text className="font-[abeezee]  text-black text-center">
          You can only access one story per day. Unlock our full library for
          unlimted stories
        </Text>
        <Pressable className="bg-primary w-full py-4 rounded-full mt-4">
          <Text className="text-center text-white font-[abeezee]">
            Subscribe to Storytime Premium
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};
export default HomeScree;

const categories = [
  {
    name: "Adventure",
    colour: "#039222",
    bg: "#99CDA5",
  },
  {
    name: "Coming of Age",
    colour: "#925403",
    bg: "#FBE5CD",
  },
  {
    name: "Courage/Bravery",
    colour: "#926903",
    bg: "#FBF9CD",
  },
  {
    name: "Good vs Evil",
    colour: "#008D81",
    bg: "#CDFBF7",
  },
  {
    name: "Fantasy",
    colour: "#5B007C",
    bg: "#EFCDFB",
  },
  {
    name: "Love & Family",
    colour: "#039222",
    bg: "#99CDA5",
  },
  {
    name: "Transformation",
    colour: "#925403",
    bg: "#FBE5CD",
  },
  {
    name: "Honesty",
    colour: "#926903",
    bg: "#FBF9CD",
  },
];

const data: { id: string; name: string }[] = [
  { id: "1", name: "Item 1" },
  { id: "2", name: "Item 2" },
  { id: "3", name: "Item 3" },
];

const HorizontalList = () => {
  return (
    <FlatList
      horizontal
      data={data}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16 }}
      renderItem={({ item }) => (
        <View
          style={{
            width: 150,
            height: 100,
            marginRight: 12,
            backgroundColor: "#6121AF",
            borderRadius: 16,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff" }}>{item.name}</Text>
        </View>
      )}
    />
  );
};
