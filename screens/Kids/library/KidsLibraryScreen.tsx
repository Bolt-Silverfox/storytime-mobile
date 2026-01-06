import { RouteProp, useNavigation } from "@react-navigation/native";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { KidsLibraryNavigatorParamList } from "../../../Navigation/KidsLibraryNavigator";
import { KidsTabNavigatorProp } from "../../../Navigation/KidsTabNavigator";
import KidBookItem from "../../../components/kids/KidBookItem";
import useKidNavigator from "../../../contexts/KidNavigatorContext";
import queryKidsStories from "../../../hooks/tanstack/queryHooks/queryKidsStories";
import { queryGetKidById } from "../../../hooks/tanstack/queryHooks/useGetKidById";
import queryStoryBuddyById from "../../../hooks/tanstack/queryHooks/useGetStoryBuddyById";
import defaultStyles from "../../../styles";
export type KidsLibraryNavigatorRouteProp = RouteProp<
  KidsLibraryNavigatorParamList,
  "indexPage"
>;

const KidsLibraryScreen = () => {
  const { childId } = useKidNavigator();
  const { data, isPending } = useSuspenseQuery(queryGetKidById(childId!));
  const { data: buddyData, isPending: isLoadingBuddyData } = useSuspenseQuery(
    queryStoryBuddyById(data?.storyBuddyId!)
  );
  const { data: stories, isPending: isLoadingStories } = useSuspenseQuery(
    queryKidsStories(childId!)
  );
  const navigation = useNavigation<KidsTabNavigatorProp>();

  return (
    <ScrollView className="flex-1 bg-bg-light">
      <ImageBackground
        source={require("../../../assets/images/story-generation-bg.png")}
        className=" bg-contain  w-full "
        resizeMode="cover"
      >
        <View className="flex   items-center gap-x-3 pb-4 h-[60vh]">
          <Text
            style={[defaultStyles.heading, { fontSize: 24, color: "#fff" }]}
            className="mt-3 mb-11"
          >
            Library
          </Text>
          <Image
            source={{ uri: buddyData?.imageUrl }}
            className=""
            style={{ width: 180, height: 172 }}
          />
          <Text
            style={[defaultStyles.heading, { fontSize: 30, color: "#fff" }]}
            className="mb-[6px] mt-[16px]"
          >
            Hey! {data.name}
          </Text>
          <Text
            style={[defaultStyles.defaultText, { color: "#fff", fontSize: 16 }]}
            className="max-w-[286px] text-center"
          >
            I am here to help you out. Pick a story below and I will save it for
            you.
          </Text>
        </View>
      </ImageBackground>

      <View style={{ position: "relative", top: -150, marginBottom: -140 }}>
        <View className="flex-row flex-wrap gap-5 justify-center">
          {stories.slice(0, 4).map((story) => (
            <KidBookItem key={story.id} story={story} />
          ))}
        </View>
        <Pressable
          onPress={() => navigation.navigate("home")}
          className="bg-[#866EFF] mt-[60] py-[18] px-[10] rounded-[60] mx-[16]"
        >
          <Text
            style={[defaultStyles.heading, { fontSize: 24, color: "#fff" }]}
          >
            View all stories
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default KidsLibraryScreen;
