import { View, Text, Pressable, FlatList, Image } from "react-native";
import React, { useState } from "react";
import { ChevronLeft } from "lucide-react-native";
import defaultStyles from "../../../styles";
import { useNavigation } from "@react-navigation/native";
import { kidsProfileNavigatorProp } from "../../../Navigation/KidsProfileNavigator";
import useKidNavigator from "../../../contexts/KidNavigatorContext";

const themes = [
  {
    id: "1",
    name: "Cloud",
    image: require("../../../assets/themes/cloud.png"),
    color: "#2196F3",
  },
  {
    id: "2",
    name: "Moon",
    image: require("../../../assets/themes/moon.png"),
    color: "#1E3A8A",
  },
  {
    id: "3",
    name: "Tree",
    image: require("../../../assets/themes/tree.png"),
    color: "#4ADE80",
  },
  {
    id: "4",
    name: "Rocket",
    image: require("../../../assets/themes/rocket.png"),
    color: "#EC4899",
  },
  {
    id: "5",
    name: "Angel",
    image: require("../../../assets/themes/angel.png"),
    color: "#F15B14",
  },
  {
    id: "6",
    name: "Castle",
    image: require("../../../assets/themes/castlewhite.png"),
    color: "#866EFF",
  },
];

export default function ChangekidTheme() {
  const [selected, setSelected] = useState<string | null>(null);
  const navigator = useNavigation<kidsProfileNavigatorProp>();
  const { childId } = useKidNavigator();

  const renderItem = ({ item }: { item: (typeof themes)[0] }) => (
    <Pressable
      onPress={() => setSelected(item.id)}
      className="flex-1 m-2 rounded-[23] justify-center items-center h-36"
      style={[
        { backgroundColor: item.color },
        selected == item.id ? { borderColor: "#FF0000", borderWidth: 2 } : {},
      ]}
    >
      <Image source={item.image} className="w-18 h-218" resizeMode="contain" />
    </Pressable>
  );

  return (
    <View className="flex-1">
      <View className="flex-row border-b-[0.5px] border-[#EAE8E8] p-4 relative gap-[10px] bg-white justify-center ">
        <Pressable
          className="absolute left-0 p-4"
          onPress={() => navigator.goBack()}
        >
          <ChevronLeft size={24} />
        </Pressable>
        <Text
          style={[defaultStyles.defaultText, { color: "black", fontSize: 18 }]}
          className="self-center text-center  "
        >
          Change Theme
        </Text>
      </View>
      <View>
        <Text style={defaultStyles.defaultText} className="mx-auto my-6">
          Select a new colour scheme
        </Text>
      </View>
      <FlatList
        data={themes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 8 }}
      />
      <View className="bg-[#866EFF4D] border-b-[5px] border-[#5942CC4D] py-[18] px-[10] rounded-[60]">
        <Text style={[defaultStyles.heading, { color: "white" }]}>Apply</Text>
      </View>
    </View>
  );
}
