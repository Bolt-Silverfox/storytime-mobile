import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { lazy, Suspense } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  View,
  Pressable,
  ScrollView,
} from "react-native";
import ErrorComponent from "../../components/ErrorComponent";
import LoadingOverlay from "../../components/LoadingOverlay";
import useGetKidById from "../../hooks/tanstack/queryHooks/useGetKidById";
import useGetStoryBuddyById from "../../hooks/tanstack/queryHooks/useGetStoryBuddyById";
import useGetRecommendedStory from "../../hooks/tanstack/queryHooks/useGetRecommendedStory";
import {
  KidsTabNavigatorParamList,
  KidsTabNavigatorProp,
} from "../../Navigation/KidsTabNavigator";
import { ProtectedRoutesNavigationProp } from "../../Navigation/ProtectedNavigator";
import KidAvatar from "../../components/KidAvatar";
const KidsHomeScreenStories = lazy(
  () => import("../../components/KidsHomeScreenStories")
);

type RouteProps = RouteProp<KidsTabNavigatorParamList, "home">;

const KidHomeScreen = () => {
  const { params } = useRoute<RouteProps>();
  const parentNav = useNavigation<ProtectedRoutesNavigationProp>();

  const { isPending, error, data, refetch } = useGetKidById(params.childId);
  const {
    data: buddyData,
    error: buddyError,
    refetch: refetchBuddy,
  } = useGetStoryBuddyById(data?.storyBuddyId!);
  const {
    data: recommendedData,
    isLoading: recommendedLoading,
    error: recommendedError,
  } = useGetRecommendedStory(params.childId);

  const navigation = useNavigation<any>();


  if (isPending) return <LoadingOverlay visible label="Loading kid..." />;

  
  if (error)
    return <ErrorComponent message={error.message} refetch={refetch} />;

  
  if (!data)
    return (
      <ErrorComponent
        message="Kid not found"
        refetch={() => navigation.goBack()}
      />
    );

  
  if (buddyError)
    return (
      <ErrorComponent
        message={buddyError.message ?? "Buddy not found"}
        refetch={refetchBuddy}
      />
    );
  return (
    <View style={{ padding: 20 }} className="flex-1">
      <View className="flex flex-row pb-4  items-center gap-x-3">
        <KidAvatar
          uri={data.avatar?.url}
          size={50}
          onPress={() =>
            parentNav.reset({ index: 0, routes: [{ name: "selection" }] })
          }
        />

        <Text className="text-xl font-[abeezee] flex-1">
          Hello, {data.name}
        </Text>

        <Image
          source={
            buddyData?.name === "lumina"
              ? require("../../assets/avatars/lumina.png")
              : require("../../assets/avatars/zylo.png")
          }
          className="size-[50px]"
        />
      </View>

      <Suspense fallback={<ActivityIndicator size={"large"} />}>
        <KidsHomeScreenStories
          id={params.childId}
          recommendedStories={recommendedData?.data ?? []}
        />
      </Suspense>

      <LoadingOverlay visible={isPending} />
    </View>
  );
};

export default KidHomeScreen;
