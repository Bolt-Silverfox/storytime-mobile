import { useNavigation } from "@react-navigation/native";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { ParentProfileNavigatorProp } from "../../../Navigation/ParentProfileNavigator";
import ErrorComponent from "../../../components/ErrorComponent";
import Icon from "../../../components/Icon";
import useGetUserKids from "../../../hooks/tanstack/queryHooks/useGetUserKids";
import LoadingOverlay from "../../../components/LoadingOverlay";

const ManageChildProfilesScreen = () => {
  const navigator = useNavigation<ParentProfileNavigatorProp>();
  const { data, isPending, error, refetch } = useGetUserKids();

  if (isPending)
    return <LoadingOverlay visible={isPending} label="Loading..." />;

  if (!data?.length)
    return (
      <View className="flex flex-col gap-y-3 flex-1 justify-center items-center">
        <Text className="font-[quilka] text-primary text-3xl text-center">
          No child yet{" "}
        </Text>
        <Pressable
          className="bg-primary py-4 w-full max-w-96 rounded-full mx-auto"
          onPress={() => navigator.navigate("addChild")}
        >
          <Text className="text-white font-[abeezee] text-center text-base">
            Add child
          </Text>
        </Pressable>
      </View>
    );
  if (error)
    return <ErrorComponent message={error.message} refetch={refetch} />;

  return (
    <ScrollView contentContainerClassName="flex flex-col gap-y-12 px-2">
      <View className="flex flex-row bg-white py-5">
        <Pressable onPress={() => navigator.goBack()}>
          <Icon name="ChevronLeft" />
        </Pressable>
        <Text className="text-center flex-1  text-[18px] font-[abeezee]">
          Manage Child Profiles
        </Text>
      </View>
      <View className="flex flex-col gap-y-4 mx-4">
        {data.map((kid) => (
          <View
            key={kid.id}
            className="flex bg-white px-3 py-3.5 rounded-xl items-center flex-row gap-x-2.5"
          >
            <Image
              source={require("../../../assets/placeholder-pfp.png")}
              className="size-[60px]"
            />
            <View className="flex flex-1 flex-col gap-y-2.5">
              <Text className="font-[quilka] text-xl capitalize">
                {kid.name}
              </Text>
              <Text className="text-sm font-[abeezee]">
                Age {kid.ageRange} Years
              </Text>
            </View>
            <View className="flex flex-row gap-x-3">
              <Pressable
                onPress={() =>
                  navigator.navigate("editChildProfile", {
                    ageRange: kid.ageRange,
                    name: kid.name,
                    imageUrl: kid.avatar,
                    id: kid.id,
                  })
                }
              >
                <Icon name="Pen" />
              </Pressable>
              <Icon name="EllipsisVertical" />
            </View>
          </View>
        ))}
      </View>
      <Pressable
        className="bg-primary py-4 w-full max-w-96 rounded-full mx-auto"
        onPress={() => navigator.navigate("addChild")}
      >
        <Text className="text-white font-[abeezee] text-center text-base">
          Add Child
        </Text>
      </Pressable>
    </ScrollView>
  );
};

export default ManageChildProfilesScreen;
