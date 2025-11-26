import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Image, ScrollView, Text, TextInput, View } from "react-native";
import { KidsNavigatorProp } from "../../Navigation/KidsNavigator";
import ChildButton from "../../components/UI/ChildButton";

const ChooseHero = () => {
  const navigator = useNavigation<KidsNavigatorProp>();
  const [heroName, setHeroName] = useState("");
  return (
    <View className="bg-[#f4f4f4] pt-5 flex-1 gap-5 flex flex-col pb-10">
      <Text className="font-[quilka] text-xl text-center">
        Choose Your Hero
      </Text>
      <View className="flex flex-col gap-y-3 mx-4">
        <Text className="font-[abeezee]">Hero's Name</Text>
        <TextInput
          className="rounded-md bg-white border border-black/20 py-3 px-4"
          onChangeText={setHeroName}
          value={heroName}
        />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="w-full min-h-full flex flex-col  gap-6 mt-4  flex-wrap"
      >
        <View className="w-full flex flex-row gap-4 justify-center items-center flex-wrap">
          {avatarSelections.map((avatar) => (
            <View
              key={avatar.name}
              className="bg-white rounded-3xl flex flex-col items-center justify-center w-[146px] h-[104px]"
            >
              <Image
                className="size-10"
                alt="Avatar image"
                source={avatar.imageurl}
              />
              <Text className="text-center font-[quilka] texxl">
                {avatar.name}
              </Text>
            </View>
          ))}
        </View>
        <View className="flex flex-col gap-y-3 m-4">
          <Text className="font-[quilka] text-xl">Pick a theme</Text>
          <Text className="font-[abeezee] text-text">
            What kind of adventure do you want?
          </Text>
          <View className="flex flex-row gap-x-4 mt-3 justify-center gap-y-6 flex-wrap w-full">
            {themes.map((theme) => (
              <View
                key={theme.name}
                className="bg-white  rounded-3xl  flex flex-col items-center justify-center w-[190px] h-[136px]"
              >
                <Image
                  className="size-20"
                  alt="theme image"
                  source={theme.imageUrl}
                />
                <Text className="text-center font-[quilka] texxl">
                  {theme.name}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      {/* <ChildButton
        icon="ArrowRight"
        disabled={!heroName}
        onPress={() => navigator.navigate("index", { screen : 'home', {
            params : 
        } })}
      /> */}
    </View>
  );
};

export default ChooseHero;

const avatarSelections = [
  {
    name: "Me",
    imageurl: require("../../assets/avatars/tim.png"),
  },
  {
    name: "Boy",
    imageurl: require("../../assets/avatars/boy.png"),
  },
  {
    name: "Girl",
    imageurl: require("../../assets/avatars/girl.png"),
  },
];

const themes = [
  {
    name: "Space",
    imageUrl: require("../../assets/themes/space.png"),
  },
  {
    name: "Castle",
    imageUrl: require("../../assets/themes/castle.png"),
  },
  {
    name: "Ocean",
    imageUrl: require("../../assets/themes/ocean.png"),
  },
  {
    name: "Fairytale",
    imageUrl: require("../../assets/themes/fairytale.png"),
  },
  {
    name: "Forest",
    imageUrl: require("../../assets/themes/forest.png"),
  },
  {
    name: "Dinosaur",
    imageUrl: require("../../assets/themes/dinosaur.png"),
  },
];
