import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import {
  Alert,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import ChildButton from "../../../components/UI/ChildButton";
import {
  PersonalizeKidNavigatorParamList,
  PersonalizeKidsNavigatorProps,
} from "../../../Navigation/PersonalizeKidNavigator";
import Icon from "../../../components/Icon";
import colours from "../../../colours";
import useCreateStory from "../../../hooks/tanstack/mutationHooks/useCreateStory";
import LoadingOverlay from "../../../components/LoadingOverlay";
import useCustomizeStory from "../../../contexts/CustomizeStoryContext";

type RoutePropTypes = RouteProp<
  PersonalizeKidNavigatorParamList,
  "previewScreen"
>;

const CustomizeKidsStoryPreviewScreen = () => {
  const { params } = useRoute<RoutePropTypes>();
  const navigator = useNavigation<PersonalizeKidsNavigatorProps>();
  const { storyTheme, themeImage, heroName } = useCustomizeStory();
  const { mutate, isPending } = useCreateStory({
    kidId: params.childId,
    onSuccess: () => {
      Alert.alert("Story created successfully");
    },
  });
  return (
    <View className="flex flex-1 bg-bgLight pb-5">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerClassName="min-h-full"
      >
        <ImageBackground
          source={require("../../../assets/images/story-generation-bg.png")}
          resizeMode="cover"
          className="flex-1"
        >
          <View className="flex flex-col items-center mx-4">
            <Text className="text-center py-3 text-white font-[quilka] text-2xl">
              Personalize
            </Text>
            <View className="bg-white border border-black/5 rounded-2xl mx-4 w-full mt-8 py-9 px-6">
              <View className="bg-white px-4 rounded-2xl flex flex-col  py-4">
                <Text className="text-text text-base font-[abeezee]">
                  Hero's name
                </Text>
                <View className="relative flex flex-row items-center">
                  <Text className="rounded-full flex-1 text-black  text-3xl font-[quilka]">
                    {heroName}
                  </Text>
                </View>
              </View>
              <View className="px-4 py-6 flex flex-col mb-12 gap-y-5 border border-black/10 rounded-2xl">
                <Text className="text-text text-base font-[abeezee]">
                  Story Theme
                </Text>
                <View className="bg-purple/20 border-4 border-purple rounded-2xl flex flex-col justify-center items-center py-9">
                  <Image source={themeImage} className="size-[100px]" />
                </View>
                <View className="bg-[#ECC607] rounded-2xl p-4 flex flex-row gap-x-6 items-center">
                  <Icon name="OctagonAlert" />
                  <Text className="font-[abeezee] text-xs flex-1">
                    The hero name in every story will be automatically changed
                    to {heroName}.
                  </Text>
                </View>
              </View>
              <Pressable
                onPress={() => navigator.goBack()}
                className="flex flex-row justify-center items-center gap-x-6"
              >
                <Text className="text-link font-[abeezee]">
                  Change story theme
                </Text>
                <Icon name="Pencil" color={colours.link} />
              </Pressable>
            </View>
          </View>
        </ImageBackground>
        <ChildButton
          onPress={() =>
            mutate({
              theme: storyTheme,
            })
          }
          disabled={false}
          icon="ArrowRight"
          text="See sample story"
        />
      </ScrollView>
      <LoadingOverlay visible={isPending} label="Creating your story..." />
    </View>
  );
};

export default CustomizeKidsStoryPreviewScreen;
