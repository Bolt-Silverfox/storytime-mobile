import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { lazy, Suspense } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";
import ErrorComponent from "../../components/ErrorComponent";
import LoadingOverlay from "../../components/LoadingOverlay";
import useGetKidById from "../../hooks/tanstack/queryHooks/useGetKidById";
import useGetStoryBuddyById from "../../hooks/tanstack/queryHooks/useGetStoryBuddyById";
import {
  KidsTabNavigatorParamList,
  KidsTabNavigatorProp,
} from "../../Navigation/KidsTabNavigator";
const KidsHomeScreenStories = lazy(
  () => import("../../components/KidsHomeScreenStories")
);

type RouteProps = RouteProp<KidsTabNavigatorParamList, "home">;

const KidHomeScreen = () => {
  const { params } = useRoute<RouteProps>();
  const { isPending, error, data, refetch } = useGetKidById(params.childId);
  const {
    data: buddyData,
    error: buddyError,
    refetch: refetchBuddy,
  } = useGetStoryBuddyById(data?.storyBuddyId!);
  const navigation = useNavigation<KidsTabNavigatorProp>();

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
        <Image
          source={
            data.avatar?.url
              ? { uri: data.avatar?.url }
              : require("../../assets/avatars/Avatars-3.png")
          }
          className="size-[50px]"
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
      {/* <Text>{buddyData?.profileAvatarUrl}</Text> */}
      <Suspense fallback={<ActivityIndicator size={"large"} />}>
        <KidsHomeScreenStories id={params.childId} />
      </Suspense>

      <LoadingOverlay visible={isPending} />
    </View>
  );
};

export default KidHomeScreen;
