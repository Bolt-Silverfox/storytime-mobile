import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import useGetUserKids from "../hooks/tanstack/queryHooks/useGetUserKids";
import { ProtectedRoutesNavigationProp } from "../Navigation/ProtectedNavigator";
import ChildrenEmptyState from "./emptyState/ChildrenEmptyState";
import ErrorComponent from "./ErrorComponent";
import KidAvatar from "./KidAvatar";

const UserKids = () => {
  const { data, isPending, error, refetch } = useGetUserKids();
  const navigator = useNavigation<ProtectedRoutesNavigationProp>();

  if (error)
    return <ErrorComponent refetch={refetch} message={error.message} />;
  if (isPending) return <ActivityIndicator size={"large"} />;

  const onNavigate = (kidId: string, storyBuddyId: string | null) => {
    if (storyBuddyId) {
      navigator.navigate("kid", {
        screen: "index",
        params: { screen: "home", params: { childId: kidId } },
      });
    } else {
      navigator.navigate("kid", {
        screen: "setup",
        params: {
          screen: "buddySelectionPage",
          params: { childId: kidId },
        },
      });
    }
  };
  return (
    <View className="flex flex-row justify-around flex-wrap gap-y-6 gap-x-1">
      {data?.length ? (
        data?.map((kid) => (
          <Pressable
            onPress={() => onNavigate(kid.id, kid.storyBuddyId)}
            key={kid.id}
            className="flex w-[100px] items-center flex-col gap-y-3"
          >
            <KidAvatar
              onPress={() => onNavigate(kid.id, kid.storyBuddyId)}
              uri={kid.avatar?.url}
              size={87}
            />
            <View className="flex flex-col gap-y-1.5">
              <Text className="text-2xl font-[abeezee] text-center">
                {kid.name.split(" ").at(0)}
              </Text>
              <Text className="text-base font-[abeezee] text-center">
                {kid.ageRange} years
              </Text>
            </View>
          </Pressable>
        ))
      ) : (
        <ChildrenEmptyState navigate={() => navigator.navigate("addChild")} />
      )}
    </View>
  );
};

export default UserKids;
