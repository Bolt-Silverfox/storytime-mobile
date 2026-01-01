import { useNavigation } from "@react-navigation/native";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { ParntHomeNavigatorProp } from "../Navigation/ParentHomeNavigator";
import { ProtectedRoutesNavigationProp } from "../Navigation/ProtectedNavigator";
import { queryGetUserKids } from "../hooks/tanstack/queryHooks/useGetUserKids";
import ErrorComponent from "./ErrorComponent";
import Icon from "./Icon";
import ChildrenEmptyState from "./emptyState/ChildrenEmptyState";

const TrackStoriesComponent = () => {
  const { data, error, refetch } = useSuspenseQuery(queryGetUserKids());
  const navigator = useNavigation<ProtectedRoutesNavigationProp>();
  const parentNav = useNavigation<ParntHomeNavigatorProp>();

  if (error)
    return <ErrorComponent refetch={refetch} message={error.message} />;
  if (!data.length)
    return (
      <ChildrenEmptyState navigate={() => navigator.navigate("addChild")} />
    );

  return (
    <ScrollView
      className="mx-4"
      contentContainerClassName="flex bg-white border border-border-lighter p-4 gap-y-6 rounded-2xl flex-col"
      showsVerticalScrollIndicator={false}
    >
      <Text className="font-[quilka] text-xl text-black">
        Select the child you want to want to track stories for
      </Text>
      <View className="flex-1 flex flex-col gap-y-4">
        {data.map((kid) => (
          <Pressable
            onPress={() =>
              parentNav.navigate("trackChildStory", { childId: kid.id })
            }
            key={kid.id}
            className="flex bg-white flex-row p-6 border border-border-light rounded-xl gap-2 items-center"
          >
            {kid.avatar?.url ? (
              <Image source={{ uri: kid.avatar.url }} className="size-14" />
            ) : (
              <Image
                source={require("../assets/avatars/Avatars-3.png")}
                className="size-14"
              />
            )}
            <View className="flex flex-col flex-1 gap-y-1.5">
              <Text className="font-[abeezee] text-xl text-black">
                {kid.name}
              </Text>
              <Text className="font-[abeezee] text-sm text-text">
                {kid.ageRange} years
              </Text>
            </View>
            <Icon name="ChevronRight" />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
};

export default TrackStoriesComponent;
