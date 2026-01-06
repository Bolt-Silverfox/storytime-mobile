import { useNavigation } from "@react-navigation/native";
import { useSuspenseQuery } from "@tanstack/react-query";
import React, { Suspense } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import ErrorComponent from "../../../components/ErrorComponent";
import KidAvatar from "../../../components/KidAvatar";
import KidBookItem from "../../../components/kids/KidBookItem";
import useKidNavigator from "../../../contexts/KidNavigatorContext";
import queryKidsStories from "../../../hooks/tanstack/queryHooks/queryKidsStories";
import useGetKidById from "../../../hooks/tanstack/queryHooks/useGetKidById";
import { KidsTabNavigatorProp } from "../../../Navigation/KidsTabNavigator";
import { ProtectedRoutesNavigationProp } from "../../../Navigation/ProtectedNavigator";

export default function AllStories() {
  const { childId } = useKidNavigator();
  const { data } = useGetKidById(childId!);
  const { data: stories } = useSuspenseQuery(queryKidsStories(childId!));

  const parentNav = useNavigation<ProtectedRoutesNavigationProp>();
  const navigation = useNavigation<KidsTabNavigatorProp>();

  if (!data)
    return (
      <ErrorComponent
        message="Kid not found"
        refetch={() => navigation.goBack()}
      />
    );
  return (
    <View className="bg-bg-light flex-1">
      <View className="flex flex-row  pt-[14] bg-white px-[16]   items-center gap-x-3">
        <KidAvatar
          uri={data?.avatar?.url}
          size={50}
          onPress={() =>
            parentNav.reset({ index: 0, routes: [{ name: "selection" }] })
          }
        />

        <Text className="text-xl font-[abeezee] flex-1">
          Hello, {data.name}
        </Text>
        {/* <Image source={{ uri: buddyData?.imageUrl }} className="size-[50px]" /> */}
      </View>
      <ScrollView className="pt-11">
        <Suspense fallback={<ActivityIndicator size={"large"} />}>
          <View className="flex-row flex-wrap gap-5 justify-center">
            {stories.map((story) => (
              <KidBookItem key={story.id} story={story} />
            ))}
          </View>
        </Suspense>
      </ScrollView>
    </View>
  );
}
