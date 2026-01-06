import { lazy } from "react";
import { Text, View } from "react-native";
import SuspenseWrapper from "../../components/supsense/SuspenseWrapper";
import useKidNavigator from "../../contexts/KidNavigatorContext";
import { useSuspenseQuery } from "@tanstack/react-query";
import { queryGetKidById } from "../../hooks/tanstack/queryHooks/useGetKidById";

const KidsHomeScreenStories = lazy(
  () => import("../../components/KidsHomeScreenStories")
);
const KidsHomeScreenHeader = lazy(
  () => import("../../components/KidsHomeScreenHeader")
);

const KidHomeScreen = () => {
  const { childId } = useKidNavigator();
  const { data } = useSuspenseQuery(queryGetKidById(childId!));

  return (
    <View className="flex-1 flex flex-col gap-y-5 bg-bgLight">
      <SuspenseWrapper>
        <KidsHomeScreenHeader childId={childId!} />
      </SuspenseWrapper>
      <View className="bg-blue rounded-3xl p-4 mx-4 flex flex-row">
        <View className="flex flex-col">
          <Text className="text-white font-[quilka] text-xl">
            Daily challenge for {data.name}
          </Text>
          <Text className="text-white font-[abeezee] text-sm">
            Complete your daily challenge to win amazing prices today{" "}
          </Text>
        </View>
        <View className="flex flex-col"></View>
      </View>
      <SuspenseWrapper>
        <KidsHomeScreenStories kidId={childId!} />
      </SuspenseWrapper>
    </View>
  );
};

export default KidHomeScreen;
