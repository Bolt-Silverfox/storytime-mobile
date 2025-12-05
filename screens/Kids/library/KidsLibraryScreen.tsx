import AsyncStorage from "@react-native-async-storage/async-storage";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { lazy, Suspense } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import {
  KidsTabNavigatorParamList,
  KidsTabNavigatorProp,
} from "../../../Navigation/KidsTabNavigator";
import ErrorComponent from "../../../components/ErrorComponent";
import LoadingOverlay from "../../../components/LoadingOverlay";
import useGetKidById from "../../../hooks/tanstack/queryHooks/useGetKidById";
import useGetStoryBuddyById from "../../../hooks/tanstack/queryHooks/useGetStoryBuddyById";
import defaultStyles from "../../../styles";
import useGetStory from "../../../hooks/tanstack/queryHooks/useGetStory";
import useGetStories, {
  Story,
} from "../../../hooks/tanstack/queryHooks/useGetStories";
import { Bookmark } from "lucide-react-native";
import {
  KidsLibraryNavigatorParamList,
  KidsLibraryNavigatorProps,
} from "../../../Navigation/KidsLibraryNavigator";

const KidStories = lazy(() => import("../../../components/KidStories"));
export type RotuteProps = RouteProp<KidsTabNavigatorParamList, "library">;

const KidsLibraryScreen = () => {
  const { params } = useRoute<RotuteProps>();
  const { isPending, error, data, refetch } = useGetKidById(params.childId);
  const {
    data: buddyData,
    error: buddyError,
    refetch: refetchBuddy,
  } = useGetStoryBuddyById(data?.storyBuddyId!);
  // const {
  //   data: stories,
  //   error: storiesError,
  //   refetch: refetchStories,
  // } = useGetStory(data?.storyBuddyId!);
  const {
    isPending: storiesIsPending,
    error: storiesError,
    refetch: refetchStories,
    data: stories,
  } = useGetStories(params.childId);

  // console.log("buddy data", buddyData);

  const navigation = useNavigation<KidsTabNavigatorProp>();
  const libNav = useNavigation<KidsLibraryNavigatorProps>();
  if (error)
    return <ErrorComponent message={error.message} refetch={refetch} />;
  if (!data && !isPending)
    return (
      <ErrorComponent
        message="You have no kids yet"
        refetch={() => navigation.goBack()}
      />
    );

  if (!data)
    return (
      <ErrorComponent
        message="Kid not found"
        refetch={() => navigation.goBack()}
      />
    );

  return (
    <ScrollView className="flex-1 bg-bg-light">
      <View className="flex bg-[#866EFF]  items-center gap-x-3 pb-4 h-[60vh]">
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
          style={[defaultStyles.heading, { fontSize: 24, color: "#fff" }]}
          className="mb-[6px] mt-[16px]"
        >
          Hey! {data.name}
        </Text>
        <Text
          style={[defaultStyles.defaultText, { color: "#fff" }]}
          className="max-w-[286px] text-center"
        >
          I am here to help you out. Pick a story below and I will save it for
          you.
        </Text>
      </View>
      <View style={{ position: "relative", top: -150 }}>
        <Suspense fallback={<ActivityIndicator size={"large"} />}>
          {/* <KidStories id={params.childId} /> */}
          <View className="flex-row flex-wrap gap-5 justify-center">
            {stories.slice(0, 4).map((story) => (
              <Book key={story.id} story={story} />
            ))}
          </View>
        </Suspense>
        <Pressable
          onPress={() =>
            libNav.navigate("allStories", { childId: params.childId! })
          }
          className="bg-[#866EFF] mt-[60] py-[18] px-[10] rounded-[60] mx-[16]"
        >
          <Text
            style={[defaultStyles.heading, { fontSize: 24, color: "#fff" }]}
          >
            View all stories
          </Text>
        </Pressable>
      </View>

      <LoadingOverlay visible={isPending} />
    </ScrollView>
  );
};

export default KidsLibraryScreen;

const getCurrentKid = async () => {
  return await AsyncStorage.getItem("currentKid");
};

export { getCurrentKid };

export const Book = ({ story }: { story: Story }) => {
  return (
    <Pressable key={story.id} className="">
      <View className="w-[167] h-[160] rounded-tl-[20] bg-[#5E3A54]"></View>
      <View className="w-[167] h-[24] rounded-bl-[20] bg-[#5E3A54] pt-[2]">
        <View className="rounded-l-[20] flex-row w-[157] self-end  h-[16] bg-[#D5D3E5]">
          <View className="rounded-l-[20] bg-[#A39FC6] h-[16] w-[16]" />
          <View className="bg-[#A39FC6] h-[6] w-[141]">
            {/* <Bookmark color={"#C5240B"} className="bg-red-400" /> */}
          </View>
        </View>
      </View>

      <Image
        source={{ uri: story.coverImageUrl }}
        style={{ position: "absolute", right: 0 }}
        className="h-[162px] w-[150px]"
      />
    </Pressable>
  );
};
