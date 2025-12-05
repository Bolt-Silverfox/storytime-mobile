import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect } from "react";
import {
  Image,
  ImageBackground,
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
import ErrorComponent from "../../../components/ErrorComponent";
import LoadingOverlay from "../../../components/LoadingOverlay";
import ChildButton from "../../../components/UI/ChildButton";
import useGetKidById from "../../../hooks/tanstack/queryHooks/useGetKidById";

type RoutePropTypes = RouteProp<PersonalizeKidNavigatorParamList, "index">;
const PersonalizeStoriesIndex = () => {
  const navigator = useNavigation<PersonalizeKidsNavigatorProps>();
  const { params } = useRoute<RoutePropTypes>();
  const { data, isLoading, error, refetch } = useGetKidById(params.childId);
  const {
    setAvatarSource,
    avatarSource,
    heroName,
    setHeroName,
    setHeroGender,
    heroGender,
  } = useCustomizeStory();

  if (isLoading) return <LoadingOverlay visible={isLoading} />;
  if (error)
    return <ErrorComponent message={error.message} refetch={refetch} />;
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
          className=" pb-20"
        >
          <View className="flex flex-col items-center mx-4">
            <Text className="text-center py-3 text-white font-[quilka] text-2xl">
              Personalize
            </Text>
            <Image
              className="h-[172px] w-[180px] mt-8 mb-4"
              source={
                data?.storyBuddyId === "one"
                  ? require("../../../assets/avatars/lumina.png")
                  : require("../../../assets/avatars/zylo.png")
              }
            />
            <View className="flex flex-col items-center gap-y-1.5">
              <Text className="font-[quilka] text-[30px] leading-[125%] text-white">
                Hey! {data?.name}
              </Text>
              <Text className="font-[abeezee] text-center text-base text-white">
                Go ahead and personalize your stories to fit your own reality, I
                am rooting for you big time!
              </Text>
            </View>
          </View>
          <View className="bg-white rounded-2xl px-6 py-9 mt-8 mb-4 flex-col mx-4 gap-y-3">
            <Text className="font-[abeezee] text-sm">
              What will your Hero's name be?
            </Text>
            <TextInput
              value={heroName}
              onChangeText={setHeroName}
              cursorColor={colours.primary}
              className="border rounded-full text-black text-3xl font-[quilka]  border-black/20 px-4"
            />
          </View>
        </ImageBackground>
        <View className=" bg-white border -translate-y-14 mt-2 flex flex-col gap-y-4 border-black/10  mx-4  rounded-2xl px-6 py-9">
          <Text className="font-[abeezee] text-sm">
            Select your hero's Gender
          </Text>
          <View className="flex items-center justify-center flex-wrap flex-row gap-4 mb-9">
            <Pressable
              onPress={() => {
                setHeroGender("me");
                setAvatarSource({ uri: data?.avatar?.url });
              }}
              className={`border-4 rounded-lg w-[47%]  ${heroGender === "me" ? "border-purple bg-purple/20" : "border-black/10"}`}
            >
              <Image
                className="max-h-[172px] min-h-[150px] min-w-[150px] max-w-[150px]"
                source={
                  data?.avatar?.url
                    ? { uri: data.avatar.url }
                    : require("../../../assets/avatars/Avatars-3.png")
                }
              />
              <Text className="text-xl font-[quilka] text-center">Me</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                setAvatarSource(require("../../../assets/images/boy.png"));
                setHeroGender("boy");
              }}
              className={`border-4 rounded-lg w-[47%]  ${heroGender === "boy" ? "border-purple bg-purple/20" : "border-black/10"}`}
            >
              <Image
                className="max-h-[172px] min-h-[150px] min-w-[150px] max-w-[150px]"
                source={require("../../../assets/images/boy.png")}
              />
              <Text className="text-xl font-[quilka] text-center">Boy</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                require("../../../assets/images/girl.png");
                setHeroGender("girl");
              }}
              className={`border-4 rounded-lg w-[47%]  ${heroGender === "girl" ? "border-purple bg-purple/20" : "border-black/10"}`}
            >
              <Image
                className="max-h-[172px] min-h-[150px] min-w-[150px] max-w-[150px]"
                source={require("../../../assets/images/girl.png")}
              />
              <Text className="text-xl font-[quilka] text-center">Girl</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                require("../../../assets/images/animal.png");
                setHeroGender("animal");
              }}
              className={`border-4 rounded-lg w-[47%]  ${heroGender === "animal" ? "border-purple bg-purple/20" : "border-black/10"}`}
            >
              <Image
                className="max-h-[172px] min-h-[150px] min-w-[150px] max-w-[150px]"
                source={require("../../../assets/images/animal.png")}
              />
              <Text className="text-xl font-[quilka] text-center">Animal</Text>
            </Pressable>
          </View>
        </View>
        <ChildButton
          onPress={() =>
            navigator.navigate("customizeStory", {
              childId: params.childId,
            })
          }
          disabled={!heroName.length || !avatarSource}
          icon="ArrowRight"
          text="Proceed"
        />
      </ScrollView>
    </View>
  );
};

export default PersonalizeStoriesIndex;
