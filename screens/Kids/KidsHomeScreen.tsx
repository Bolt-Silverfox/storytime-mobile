import { useSuspenseQuery } from "@tanstack/react-query";
import { lazy } from "react";
import { Image, Pressable, Text, View } from "react-native";
import Icon from "../../components/Icon";
import SuspenseWrapper from "../../components/supsense/SuspenseWrapper";
import useKidNavigator from "../../contexts/KidNavigatorContext";
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
      <View className="bg-blue rounded-3xl p-4 mx-4 flex gap-x-3 flex-row">
        <View className="flex flex-col flex-1 gap-y-3">
          <Text className="text-white font-[quilka] text-xl">
            Daily challenge for {data.name}
          </Text>
          <Pressable className="rounded-full bg-[#3D06C7] px-4 h-10 flex justify-center items-center">
            <Text className="text-sm font-[quilka] text-[#FFE46E]">
              03hr:11min:09sec
            </Text>
          </Pressable>
          <Text className="font-[abeezee] mt-auto text-sm text-white">
            Complete your daily challenge to win amazing prices today
          </Text>
        </View>
        <View className="flex flex-col justify-center flex-1">
          <Image
            source={require("../../assets/images/cup.png")}
            className="h-[141px] w-[144px] self-end"
          />
          <Pressable className="flex rounded-full flex-row justify-between items-center px-4 h-10 gap-x-4 bg-white">
            <Text className="font-[abeezee] text-sm text-black">Start</Text>
            <Icon name="ArrowRight" />
          </Pressable>
        </View>
      </View>
      <SuspenseWrapper>
        <KidsHomeScreenStories kidId={childId!} />
      </SuspenseWrapper>
    </View>
  );
};

export default KidHomeScreen;
