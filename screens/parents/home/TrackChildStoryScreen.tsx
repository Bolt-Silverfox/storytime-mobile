import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useSuspenseQuery } from "@tanstack/react-query";
import { lazy, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import {
  ParentHomeNavigatorParamList,
  ParntHomeNavigatorProp,
} from "../../../Navigation/ParentHomeNavigator";
import PageTitle from "../../../components/PageTitle";
import { queryGetKidById } from "../../../hooks/tanstack/queryHooks/useGetKidById";
import SuspenseWrapper from "../../../components/supsense/SuspenseWrapper";
import { ChildStoryStatus } from "../../../types";

const TrackChildStoryComponent = lazy(
  () => import("../../../components/TrackChildStoryComponent")
);

type RouteProps = RouteProp<ParentHomeNavigatorParamList, "trackChildStory">;
const TrackChildStoryScreen = () => {
  const { params } = useRoute<RouteProps>();
  const navigator = useNavigation<ParntHomeNavigatorProp>();
  const { data } = useSuspenseQuery(queryGetKidById(params.childId));
  const [category, setCategory] = useState<ChildStoryStatus>("completed");

  return (
    <View className="flex-1 flex-col flex bg-bgLight gap-y-6">
      <PageTitle title="Track Stories" goBack={() => navigator.goBack()} />
      <View className="bg-white items-center border border-border-light mx-4 rounded-xl flex flex-row gap-x-2 p-4 ">
        {data.avatar?.url ? (
          <Image source={{ uri: data.avatar.url }} className="size-14" />
        ) : (
          <Image
            source={require("../../../assets/avatars/Avatars-3.png")}
            className="size-14"
          />
        )}
        <View className="flex flex-col gap-y-2">
          <Text className="text-xl font-[abeezee] text-black">{data.name}</Text>
          <Text className="text-sm font-[abeezee] text-text">
            {data.ageRange} years
          </Text>
        </View>
      </View>
      <View className="flex flex-row justify-center mx-4 items-center gap-x-3">
        <Pressable
          onPress={() => setCategory("completed")}
          className={`${category === "completed" ? "bg-purple " : "border-black border bg-white"}max-w-sm mx-auto sm:w-full rounded-full h-10 flex flex-row justify-center items-center flex-1`}
        >
          <Text
            className={`${category === "completed" ? "text-white" : "text-black"} font-[abeezee] text-base`}
          >
            Completed
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setCategory("ongoing")}
          className={`${category === "ongoing" ? "bg-purple " : "border-black border bg-white"}max-w-sm mx-auto sm:w-full rounded-full h-10 flex flex-row justify-center items-center flex-1`}
        >
          <Text
            className={`${category === "ongoing" ? "text-white" : "text-black"} font-[abeezee] text-base`}
          >
            Ongoing
          </Text>
        </Pressable>
      </View>
      <SuspenseWrapper>
        <TrackChildStoryComponent
          category={category}
          childId={params.childId}
        />
      </SuspenseWrapper>
    </View>
  );
};

export default TrackChildStoryScreen;
