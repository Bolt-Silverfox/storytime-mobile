import AsyncStorage from "@react-native-async-storage/async-storage";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { lazy, Suspense } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";
import {
  KidsTabNavigatorParamList,
  KidsTabNavigatorProp,
} from "../../Navigation/KidsTabNavigator";
import ErrorComponent from "../../components/ErrorComponent";
import LoadingOverlay from "../../components/LoadingOverlay";
import useGetKidById from "../../hooks/tanstack/queryHooks/useGetKidById";

const KidStories = lazy(() => import("../../components/KidStories"));
type RotuteProps = RouteProp<KidsTabNavigatorParamList, "library">;

const KidsLibraryScreen = () => {
  const { params } = useRoute<RotuteProps>();
  const { isPending, error, data, refetch } = useGetKidById(params.childId);

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
    <View className="flex-1" style={{ padding: 20 }}>
      <View className="flex flex-row items-center gap-x-3 pb-4">
        <Image
          source={require("../../assets/placeholder-pfp.png")}
          className="size-[50px]"
        />
        <Text className="text-xl font-[abeezee] flex-1">
          Hello, {data.name}
        </Text>
        <Image
          source={require("../../assets/robot.png")}
          className="size-[50px]"
        />
      </View>
      <Suspense fallback={<ActivityIndicator size={"large"} />}>
        <KidStories id={params.childId} />
      </Suspense>

      <LoadingOverlay visible={isPending} />
    </View>
  );
};

export default KidsLibraryScreen;

const getCurrentKid = async () => {
  return await AsyncStorage.getItem("currentKid");
};

export { getCurrentKid };
