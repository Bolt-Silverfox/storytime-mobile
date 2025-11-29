import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { lazy, Suspense } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";
import ErrorComponent from "../../components/ErrorComponent";
import LoadingOverlay from "../../components/LoadingOverlay";
import useGetUserKids from "../../hooks/tanstack/queryHooks/useGetUserKids";
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
  const { isPending, error, data, refetch } = useGetUserKids();
  const navigation = useNavigation<KidsTabNavigatorProp>();

  if (error)
    return <ErrorComponent message={error.message} refetch={refetch} />;
  if (!data)
    return (
      <ErrorComponent
        message="You have no kids yet"
        refetch={() => navigation.goBack()}
      />
    );
  const kid = data.find((kid) => kid.id === params.childId);
  if (!kid)
    return (
      <ErrorComponent
        message="Kid not found"
        refetch={() => navigation.goBack()}
      />
    );

  return (
    <View style={{ padding: 20 }} className="flex-1">
      <View className="flex flex-row pb-4  items-center gap-x-3">
        <Image
          source={require("../../assets/placeholder-pfp.png")}
          className="size-[50px]"
        />
        <Text className="text-xl font-[abeezee] flex-1">Hello, {kid.name}</Text>
        <Image
          source={require("../../assets/robot.png")}
          className="size-[50px]"
        />
      </View>
      <Suspense fallback={<ActivityIndicator size={"large"} />}>
        <KidsHomeScreenStories id={params.childId} />
      </Suspense>

      <LoadingOverlay visible={isPending} />
    </View>
  );
};

export default KidHomeScreen;
