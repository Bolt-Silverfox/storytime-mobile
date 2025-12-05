import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  PersonalizeKidNavigatorParamList,
  PersonalizeKidsNavigatorProps,
  useCustomizeStory,
} from "../../../Navigation/PersonalizeKidNavigator";
import colours from "../../../colours";
import Icon from "../../../components/Icon";
import PageTitle from "../../../components/PageTitle";
import ChildButton from "../../../components/UI/ChildButton";

const themes = [
  {
    name: "castle",
    imageUrl: require("../../../assets/images/castle.png"),
  },
  {
    name: "space",
    imageUrl: require("../../../assets/images/space.png"),
  },
  {
    name: "dinosaur",
    imageUrl: require("../../../assets/images/dinosaur.png"),
  },
  {
    name: "fairytale",
    imageUrl: require("../../../assets/images/fairytale.png"),
  },
  {
    name: "forest",
    imageUrl: require("../../../assets/images/forest.png"),
  },
  {
    name: "ocean",
    imageUrl: require("../../../assets/images/ocean.png"),
  },
] as const;

export type ThemeTypes = (typeof themes)[number]["name"];

type RoutePropTypes = RouteProp<
  PersonalizeKidNavigatorParamList,
  "customizeStory"
>;
const CustomizeKidStory = () => {
  const { params } = useRoute<RoutePropTypes>();
  const navigator = useNavigation<PersonalizeKidsNavigatorProps>();
  const { heroName, setHeroName, storyTheme, setStoryTheme } =
    useCustomizeStory();
  return (
    <View className="flex-1 flex bg-bgLight pb-5">
      <PageTitle title="Customize Story" goBack={() => navigator.goBack()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex flex-1 py-5 mx-4"
        contentContainerClassName="min-h-full  pb-48"
      >
        <View className="bg-white  border border-black/10 px-4 rounded-2xl flex flex-col  py-4">
          <Text className="text-text text-base font-[abeezee]">
            Hero's name
          </Text>
          <Pressable className="relative flex flex-row items-center">
            <TextInput
              value={heroName}
              onChangeText={setHeroName}
              cursorColor={colours.primary}
              className="rounded-full flex-1 text-black  text-3xl font-[quilka]  border-black/20 px-4"
            />
            <Pressable className="absolute top-4 right-4">
              <Icon name="Pen" />
            </Pressable>
          </Pressable>
        </View>
        <View className="mt-10">
          <Text className="text-xl font-[quilka] text-black">Pick a Theme</Text>
          <Text className="text-text font-[abeezee] text-base">
            What kind of story do you want?
          </Text>
          <View className="flex flex-row mt-4 flex-wrap gap-4 justify-center">
            {themes.map((theme) => (
              <Pressable
                key={theme.name}
                onPress={() => setStoryTheme(theme.name)}
                className={`border-4 w-[47%] rounded-lg px-3 py-5 ${storyTheme === theme.name ? "border-purple bg-purple/20" : "border-black/10"}`}
              >
                <Image
                  className="max-h-[172px] min-h-[150px] min-w-[150px] max-w-[180px]"
                  source={theme.imageUrl}
                />
                <Text className="text-xl font-[quilka] capitalize text-center">
                  {theme.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
      <ChildButton
        onPress={() =>
          navigator.navigate("previewScreen", {
            childId: params.childId,
          })
        }
        disabled={!storyTheme}
        text="Create theme"
        icon="ArrowRight"
      />
    </View>
  );
};

export default CustomizeKidStory;
