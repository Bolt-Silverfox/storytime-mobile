import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Image, ScrollView, Text, View } from "react-native";
import {
  KidsTabNavigatorParamList,
  KidsTabNavigatorProp,
} from "../../Navigation/KidsTabNavigator";
import useGetUserKids from "../../hooks/tanstack/queryHooks/useGetUserKids";
import ErrorComponent from "../../components/ErrorComponent";
import LoadingOverlay from "../../components/LoadingOverlay";
import { lazy, Suspense, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const KidStories = lazy(() => import("../../components/KidStories"));
// type RouteProps = RouteProp<KidsTabNavigatorParamList, "library">;

const KidsLibraryScreen = () => {
  // const { params } = useRoute<RouteProps>();
  const { isPending, error, data, refetch } = useGetUserKids();
  const [currentKidId, setCurrentKidId] = useState<string | null>(null);

  const navigation = useNavigation<KidsTabNavigatorProp>();

  useEffect(() => {
    const loadKid = async () => {
      const id = await AsyncStorage.getItem("currentKid");
      setCurrentKidId(id);
    };

    loadKid();
  }, []);

  if (error)
    return <ErrorComponent message={error.message} refetch={refetch} />;
  if (!data)
    return (
      <ErrorComponent
        message="You have no kids yet"
        refetch={() => navigation.goBack()}
      />
    );
  const kid = data.find((kid) => kid.id === currentKidId);
  if (!kid)
    return (
      <ErrorComponent
        message="Kid not found"
        refetch={() => navigation.goBack()}
      />
    );

  return (
    <ScrollView
      stickyHeaderIndices={[0]}
      contentContainerStyle={{ padding: 20 }}
    >
      <View className="flex flex-row items-center gap-x-3">
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
      <Suspense fallback={<Text>Loading kid stories</Text>}>
        <KidStories id={currentKidId!} />
      </Suspense>

      <LoadingOverlay visible={isPending} />
    </ScrollView>
  );
};

export default KidsLibraryScreen;

const getCurrentKid = async () => {
  return await AsyncStorage.getItem("currentKid");
};

export { getCurrentKid };
