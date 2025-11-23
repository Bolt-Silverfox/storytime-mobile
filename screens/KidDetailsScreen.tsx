import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Image, ScrollView, Text, View } from "react-native";
import {
  ProtectedRoutesNavigationProp,
  ProtectedRoutesParamList,
} from "../Navigation/ProtectedNavigator";
import ErrorComponent from "../components/ErrorComponent";
import LoadingOverlay from "../components/LoadingOverlay";
import { childDetailsData } from "../data";
import useGetUserKids from "../hooks/tanstack/queryHooks/useGetUserKids";

type KidsDetailsRouteProp = RouteProp<ProtectedRoutesParamList, "kidDetails">;

const KidDetailsScreen = () => {
  const { params } = useRoute<KidsDetailsRouteProp>();
  const { isPending, error, data, refetch } = useGetUserKids();
  const navigation = useNavigation<ProtectedRoutesNavigationProp>();

  if (isPending) return <LoadingOverlay visible={isPending} />;
  if (error)
    return <ErrorComponent message={error.message} refetch={refetch} />;
  if (!data)
    return (
      <ErrorComponent
        message="You have no kids yet"
        refetch={() => navigation.goBack()}
      />
    );
  const kid = data.find((kid) => kid.id === params.kidId);
  if (!kid)
    return (
      <ErrorComponent
        message="Kid not found"
        refetch={() => navigation.goBack()}
      />
    );

  return (
    <ScrollView contentContainerClassName="p-5 max-w-screen-md mx-auto w-full">
      <View className="flex flex-row items-center gap-x-3">
        <Image
          source={require("../assets/placeholder-pfp.png")}
          className="size-[50px]"
        />
        <Text className="text-xl font-[abeezee] flex-1">Hello, {kid.name}</Text>
        <Image
          source={require("../assets/robot.png")}
          className="size-[50px]"
        />
      </View>
      <View className="flex flex-row flex-wrap justify-around gap-6 mt-6">
        {childDetailsData.map((data) => (
          <View key={data.id}>
            <Image source={data.source} className="h-[228px] w-[187px]" />
          </View>
        ))}
      </View>

      <LoadingOverlay visible={isPending} />
    </ScrollView>
  );
};

export default KidDetailsScreen;
