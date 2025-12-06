import { useNavigation } from "@react-navigation/native";
import { Pressable, ScrollView, Text, View } from "react-native";
import { ProtectedRoutesNavigationProp } from "../Navigation/ProtectedNavigator";
import Avatar from "../components/Avatar";
import ErrorComponent from "../components/ErrorComponent";
import Icon from "../components/Icon";
import LoadingOverlay from "../components/LoadingOverlay";
import UserKids from "../components/UserKids";
import useGetUserProfile from "../hooks/tanstack/queryHooks/useGetUserProfile";
import defaultStyles from "../styles";

const KidSelectionScreen = () => {
  const { data, isPending, error, refetch } = useGetUserProfile();
  const navigator = useNavigation<ProtectedRoutesNavigationProp>();
  if (isPending) return <LoadingOverlay visible={isPending} />;

  if (error)
    return <ErrorComponent message={error.message} refetch={refetch} />;

  const navigate = () => {
    if (data?.pinSet) {
      navigator.navigate("parentAuth");
      return;
    }
    navigator.navigate("parents");
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ flex: 1 }}
      contentContainerClassName="gap-14 p-8 min-h-full max-w-screen-md mx-auto w-full"
    >
      <View
        aria-labelledby="User information"
        className="flex flex-row gap-x-2 items-center "
      >
        <Avatar size={50} />
        <View className="flex flex-col gap-y-1 ">
          <Text
            style={[defaultStyles.defaultText, { fontSize: 15 }]}
            className=" text-text"
          >
            Welcome back 👋🏾
          </Text>
          <Text className="text-base font-[abeezee] capitalize">
            {data?.title} {data?.name}
          </Text>
        </View>
      </View>

      <View className="flex flex-col gap-y-6 flex-1">
        <Text className="font-[quilka] text-[18px]">
          Whose Storytime is it?
        </Text>
        <UserKids />
      </View>

      <Pressable
        onPress={navigate}
        className="px-6 py-3 rounded-2xl bg-[#EEE8FF]  flex flex-row items-center gap-3"
      >
        <View className="flex flex-col flex-1 gap-y-2">
          <Text className="font-[abeezee] text-2xl">Access Parent Account</Text>
          <Text className="text-base font-[abeezee]">
            Create and manage your child's storytelling world.
          </Text>
        </View>
        <Icon color="black" name="ChevronRight" />
      </Pressable>
    </ScrollView>
  );
};

export default KidSelectionScreen;
