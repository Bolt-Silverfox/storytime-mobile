import {
  View,
  Text,
  Image,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { Suspense } from "react";
import KidAvatar from "../../../components/KidAvatar";
import useGetStoryBuddyById from "../../../hooks/tanstack/queryHooks/useGetStoryBuddyById";
import { Book, RotuteProps } from "./KidsLibraryScreen";
import { useNavigation, useRoute } from "@react-navigation/native";
import useGetKidById from "../../../hooks/tanstack/queryHooks/useGetKidById";
import ErrorComponent from "../../../components/ErrorComponent";
import { KidsTabNavigatorProp } from "../../../Navigation/KidsTabNavigator";
import { KidsLibraryNavigatorProps } from "../../../Navigation/KidsLibraryNavigator";
import { ProtectedRoutesNavigationProp } from "../../../Navigation/ProtectedNavigator";
import defaultStyles from "../../../styles";
import useGetStories from "../../../hooks/tanstack/queryHooks/useGetStories";

export default function AllStories() {
  const { params } = useRoute<RotuteProps>();

  const { isPending, error, data, refetch } = useGetKidById(params.childId);
  const {
    isPending: storiesIsPending,
    error: storiesError,
    refetch: refetchStories,
    data: stories,
  } = useGetStories(params.childId);
  const parentNav = useNavigation<ProtectedRoutesNavigationProp>();
  const navigation = useNavigation<KidsTabNavigatorProp>();
  //   const libNav = useNavigation<KidsLibraryNavigatorProps>();

  if (error)
    return <ErrorComponent message={error.message} refetch={refetch} />;
  if (!data)
    return (
      <ErrorComponent
        message="Kid not found"
        refetch={() => navigation.goBack()}
      />
    );
  //   if (buddyError)
  //     return (
  //       <ErrorComponent
  //         message={buddyError.message ?? "Buddy not found"}
  //         refetch={refetchBuddy}
  //       />
  //     );
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
              <Book key={story.id} story={story} />
            ))}
          </View>
        </Suspense>
      </ScrollView>
    </View>
  );
}
