import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import {
  KidsTabNavigatorParamList,
  KidsTabNavigatorProp,
} from "../../Navigation/KidsTabNavigator";
import useGetUserKids from "../../hooks/tanstack/queryHooks/useGetUserKids";
import ErrorComponent from "../../components/ErrorComponent";
import LoadingOverlay from "../../components/LoadingOverlay";
import { childDetailsData } from "../../data";
import {
  KidsSetupNavigatorParamList,
  KidsSetupProp,
} from "../../Navigation/KidsSetupNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";


type RouteProps = RouteProp<KidsTabNavigatorParamList, "home">;

const KidHomeScreen = () => {
  const { params } = useRoute<RouteProps>();
  const { isPending, error, data, refetch } = useGetUserKids();
  const navigation = useNavigation<KidsTabNavigatorProp>();
  const navigator = useNavigation<KidsSetupProp>();

  const parent =
    navigation.getParent<
      NativeStackNavigationProp<KidsSetupNavigatorParamList>
    >();

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
      <View className="flex flex-row flex-wrap justify-around gap-6 mt-6">
        {childDetailsData.map((data) => (
          <Pressable
            key={data.id}
            onPress={() => {
              // always pass id = "1" for testing
              // change to { storyId: data.id } when real ids are available
              navigation.navigate("setup" as any, {
                screen: "storyInteraction",
                params: { storyId: "1" },
              });
            }}
            className="overflow-hidden rounded-lg"
          >
            <Image source={data.source} className="h-[228px] w-[187px]" />
          </Pressable>
        ))}
      </View>

      <LoadingOverlay visible={isPending} />
    </ScrollView>

  );
};

export default KidHomeScreen;
