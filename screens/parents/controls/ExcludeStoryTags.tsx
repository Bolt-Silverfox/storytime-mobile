import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { ParentControlNavigatorProp } from "../../../Navigation/ParentControlsNavigator";
import Icon from "../../../components/Icon";
import PageTitle from "../../../components/PageTitle";
import CustomButton from "../../../components/UI/CustomButton";

const tags = [
  "magic",
  "spells",
  "fear",
  "superpowers",
  "villains",
  "monsters",
  "scary",
  "witch",
  "romance",
  "battle",
  "loss",
];
const ExcludeStoryTags = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const navigator = useNavigation<ParentControlNavigatorProp>();

  const updatedFilters = tags.filter((item) =>
    item.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSelect = (tag: string) => {
    setSelectedFilters((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };
  return (
    <View className="flex flex-1 flex-col gap-y-10 pb-10 max-w-screen-md mx-auto w-full ">
      <PageTitle goBack={() => navigator.goBack()} title="Exclude Story Tags" />
      <View className="mx-5 relative">
        <TextInput
          className="text-base pl-12 rounded-full font-[abeezee] border border-black/50"
          value={searchText}
          onChangeText={setSearchText}
        />
        <Pressable className="absolute left-4 top-2">
          <Icon name="Search" />
        </Pressable>
      </View>
      <View className="mx-5 flex-wrap flex-1 gap-y-7 flex flex-row gap-x-5">
        {updatedFilters.map((tag) => (
          <Pressable
            onPress={() => handleSelect(tag)}
            key={tag}
            className={`${selectedFilters.includes(tag) ? "bg-blue-600 text-white" : ""} px-9 rounded-full py-3 text-black border border-black/15`}
          >
            <Text
              className={`capitalize text-text font-[abeezee] ${selectedFilters.includes(tag) ? "text-white" : ""}`}
            >
              {tag}
            </Text>
          </Pressable>
        ))}
      </View>
      <CustomButton onPress={() => {}} text="Save" />
    </View>
  );
};

export default ExcludeStoryTags;
