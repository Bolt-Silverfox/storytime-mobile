import { Button, Image, Pressable, ScrollView, Text, View } from "react-native";
import useAuth from "../contexts/AuthContext";
import useGetUserKids from "../hooks/tanstack/queryHooks/useGetUserKids";
import ErrorComponent from "../components/ErrorComponent";
import Icon from "../components/Icon";
import { useNavigation } from "@react-navigation/native";
import { ProtectedRoutesNavigationProp } from "../Navigation/ProtectedNavigator";

const KidSelectionScreen = () => {
  const { user } = useAuth();
  const { data, isPending, error, refetch } = useGetUserKids();
  const navigation = useNavigation<ProtectedRoutesNavigationProp>();

  if (isPending)
    return (
      <Text className="font-[quilka] text-primary text-3xl text-center">
        Loading...
      </Text>
    );

  if (error)
    return <ErrorComponent message={error.message} refetch={refetch} />;

  if (!data.length)
    return (
      <View>
        <Text className="font-[quilka] text-primary text-3xl text-center">
          No kids yet...
        </Text>
        <Pressable
          onPress={() => navigation.navigate("addChild")}
          className="bg-primary py-4 w-full max-w-96 rounded-full mx-auto"
        >
          <Text className="text-white font-[abeezee] text-center text-base">
            Add child
          </Text>
        </Pressable>
      </View>
    );
  return (
    <ScrollView contentContainerClassName="flex flex-col  p-8 gap-y-16">
      <View
        aria-labelledby="User information"
        className="flex flex-row gap-x-2 items-center"
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

      <View className="flex flex-col gap-y-6 flex-1">
        <Text className="font-[quilka] text-[18px]">
          Whose Storytime is it?
        </Text>
        <View className="flex flex-row justify-around flex-wrap gap-y-6 gap-x-10">
          {data.map((kid) => (
            <Pressable
              onPress={() =>
                navigation.navigate("kidDetails", { kidId: kid.id })
              }
              key={kid.id}
              className="flex w-[100px]  items-center flex-col gap-y-3"
            >
              <Image
                source={require("../assets/placeholder-pfp.png")}
                className="size-[90px]"
              />
              <View className="flex flex-col gap-y-1.5">
                <Text className="text-2xl font-[abeezee] text-center">
                  {kid.name.split(" ").at(0)}
                </Text>
                <Text className="text-base font-[abeezee] text-center">
                  {kid.ageRnge} years
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>

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
