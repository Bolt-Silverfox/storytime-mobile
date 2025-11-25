import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Pressable, ScrollView, Switch, Text, View } from "react-native";
import {
  ParentControlNavigatorParamList,
  ParentControlNavigatorProp,
} from "../../../Navigation/ParentControlsNavigator";
import PageTitle from "../../../components/PageTitle";
import CustomButton from "../../../components/UI/CustomButton";
import { useState } from "react";

type ContentFilterPropList = RouteProp<
  ParentControlNavigatorParamList,
  "contentFilter"
>;

type AgeFilter = "1 - 4" | "5 - 8" | "9 - 12";

const CATEGORIES = [
  "Adventure",
  "Bedtime",
  "Friendship",
  "Family",
  "Animals",
  "Fairytales",
  "Fantasy",
  "Mystery",
  "Folktale",
  "Morales",
  "Courage and Faith",
];

const ContentFilter = () => {
  const navigator = useNavigation<ParentControlNavigatorProp>();
  const [filterByAge, setFilterByAge] = useState<AgeFilter>("1 - 4");
  const { params } = useRoute<ContentFilterPropList>();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="min-h-full max-w-screen-md mx-auto w-full "
    >
      <PageTitle title="Content Filters" goBack={() => navigator.goBack()} />

      <Text className="text-base font-[abeezee] my-5 text-center">
        Select the stories your child can read
      </Text>
      <View className="flex flex-col mx-5 rounded-3xl p-4 bg-white">
        <Text className="text-[18px] font-[abeezee] my-3">FILTER BY AGE</Text>

        <Pressable
          className="flex py-4 border-b border-b-black/10 flex-row items-center gap-x-10"
          onPress={() => setFilterByAge("1 - 4")}
        >
          <Text className="flex-1 text-base text-black font-[abeezee]">
            1 – 4 years
          </Text>
          <Switch
            value={filterByAge === "1 - 4"}
            onValueChange={() => setFilterByAge("1 - 4")}
          />
        </Pressable>

        <Pressable
          className="flex py-4 border-b border-b-black/10 flex-row items-center gap-x-10"
          onPress={() => setFilterByAge("5 - 8")}
        >
          <Text className="flex-1 text-base text-black font-[abeezee]">
            5 – 8 years
          </Text>
          <Switch
            value={filterByAge === "5 - 8"}
            onValueChange={() => setFilterByAge("5 - 8")}
          />
        </Pressable>

        <Pressable
          className="flex py-4 flex-row items-center gap-x-10"
          onPress={() => setFilterByAge("9 - 12")}
        >
          <Text className="flex-1 text-base text-black font-[abeezee]">
            9+ years
          </Text>
          <Switch
            value={filterByAge === "9 - 12"}
            onValueChange={() => setFilterByAge("9 - 12")}
          />
        </Pressable>
      </View>

      <View className="flex flex-col mx-5 rounded-3xl p-4 bg-white mt-6">
        <Text className="text-[18px] font-[abeezee] my-3">
          FILTER BY CATEGORY
        </Text>

        {CATEGORIES.map((category) => (
          <Pressable
            key={category}
            className="flex py-4 border-b border-b-black/10 flex-row items-center gap-x-10"
            onPress={() => toggleCategory(category)}
          >
            <Text className="flex-1 text-base text-black font-[abeezee]">
              {category}
            </Text>
            <Switch
              value={selectedCategories.includes(category)}
              onValueChange={() => toggleCategory(category)}
            />
          </Pressable>
        ))}
      </View>
      <View className="m-10">
        <CustomButton text="Save Changes" />
      </View>
    </ScrollView>
  );
};
export default ContentFilter;
