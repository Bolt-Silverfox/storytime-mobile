import { useNavigation } from "@react-navigation/native";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { ProtectedRoutesNavigationProp } from "../Navigation/ProtectedNavigator";
import ErrorComponent from "../components/ErrorComponent";
import Icon from "../components/Icon";
import LoadingOverlay from "../components/LoadingOverlay";
import useAuth from "../contexts/AuthContext";
import useGetUserKids from "../hooks/tanstack/queryHooks/useGetUserKids";
import ChildrenEmptyState from "../components/emptyState/ChildrenEmptyState";
import AsyncStorage from "@react-native-async-storage/async-storage";
import KidAvatar from "../components/KidAvatar";

const KidSelectionScreen = () => {
  const { user } = useAuth();
  const { data, isPending, error, refetch } = useGetUserKids();
  console.log(data);
  const navigation = useNavigation<ProtectedRoutesNavigationProp>();
  if (isPending) return <LoadingOverlay visible={isPending} />;

  if (error)
    return <ErrorComponent message={error.message} refetch={refetch} />;

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerClassName="gap-16 p-8 min-h-full max-w-screen-md mx-auto w-full"
    >
      <View
        aria-labelledby="User information"
        className="flex flex-row gap-x-2 items-center "
      >
        <Image
          source={require("../assets/placeholder-pfp.png")}
          className="size-[50px]"
        />
        <View className="flex flex-col gap-y-1">
          <Text className="text-xs text-text">Welcome back</Text>
          <Text className="text-base font-[abeezee] capitalize">
            {user?.title} {user?.name}
          </Text>
        </View>
      </View>

      {data.length ? (
        <View className="flex flex-col gap-y-6 flex-1">
          <Text className="font-[quilka] text-[18px]">
            Whose Storytime is it?
          </Text>
          <View className="flex flex-row justify-around flex-wrap gap-y-6 gap-x-10">
            {data.map((kid) => (
              <Pressable
                onPress={async () => {
                  await AsyncStorage.setItem("currentKid", kid.id);
                  navigation.navigate("kid", {
                    screen: "setup",
                    params: {
                      screen: "buddySelectionPage",
                      params: { childId: kid.id },
                    },
                  });
                }}
                key={kid.id}
                className="flex w-[100px]  items-center flex-col gap-y-3"
              >
                <KidAvatar uri={kid.avatar?.url} size={120} />
                <View className="flex flex-col gap-y-1.5">
                  <Text className="text-2xl font-[abeezee] text-center">
                    {kid.name.split(" ").at(0)}
                  </Text>
                  <Text className="text-base font-[abeezee] text-center">
                    {kid.ageRange} years
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      ) : (
        <ChildrenEmptyState navigate={() => navigation.navigate("addChild")} />
      )}

      <View className="px-6 py-3 rounded-2xl bg-[#EEE8FF]  flex flex-row items-center gap-3">
        <View className="flex flex-col flex-1 gap-y-2">
          <Text className="font-[abeezee] text-2xl">Access Parent Account</Text>
          <Text className="text-base font-[abeezee]">
            Create and manage your child's storytelling world.
          </Text>
        </View>
        <Pressable onPress={() => navigation.navigate("parents")}>
          <Icon color="black" name="ChevronRight" />
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default KidSelectionScreen;
