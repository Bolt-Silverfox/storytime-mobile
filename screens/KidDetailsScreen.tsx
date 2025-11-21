import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Image, ScrollView, Text, View } from "react-native";
import {
  ProtectedRoutesNavigationProp,
  ProtectedRoutesParamList,
} from "../Navigation/ProtectedNavigator";
import ErrorComponent from "../components/ErrorComponent";
import useGetUserKids from "../hooks/tanstack/queryHooks/useGetUserKids";
import ComingSoon from "../components/ComingSoon";

type KidsDetailsRouteProp = RouteProp<ProtectedRoutesParamList, "kidDetails">;

const KidDetailsScreen = () => {
  const { params } = useRoute<KidsDetailsRouteProp>();
  const { isPending, error, data, refetch } = useGetUserKids();
  const navigation = useNavigation<ProtectedRoutesNavigationProp>();

  if (isPending)
    return (
      <Text className="text-center font-[quilka] text-primary text-2xl">
        Loading...
      </Text>
    );
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
    <ScrollView contentContainerClassName="flex flex-col gap-y-10 p-5">
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
      <ComingSoon title="Child stories" />
    </ScrollView>
  );
};

export default KidDetailsScreen;
