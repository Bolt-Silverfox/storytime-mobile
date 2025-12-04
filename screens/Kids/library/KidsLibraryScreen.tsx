import AsyncStorage from "@react-native-async-storage/async-storage";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { lazy, Suspense } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";
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

const KidStories = lazy(() => import("../../../components/KidStories"));
type RotuteProps = RouteProp<KidsTabNavigatorParamList, "library">;

const KidsLibraryScreen = () => {
  const { params } = useRoute<RotuteProps>();
  const { isPending, error, data, refetch } = useGetKidById(params.childId);
  const {
    data: buddyData,
    error: buddyError,
    refetch: refetchBuddy,
  } = useGetStoryBuddyById(data?.storyBuddyId!);
  const {
    data: stories,
    error: storiesError,
    refetch: refetchStories,
  } = useGetStory(data?.storyBuddyId!);

  // console.log("buddy data", buddyData);

  const navigation = useNavigation<KidsTabNavigatorProp>();
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
    <View className="flex-1">
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
      <View style={{position:"relative" ,top:-150}}>
        <Suspense fallback={<ActivityIndicator size={"large"} />}>
          <KidStories id={params.childId} />
        </Suspense>
      </View>

      <LoadingOverlay visible={isPending} />
    </View>
  );
};

export default KidsLibraryScreen;

const getCurrentKid = async () => {
  return await AsyncStorage.getItem("currentKid");
};

export { getCurrentKid };
