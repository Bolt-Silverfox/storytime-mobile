import { Image, Pressable, ScrollView, Text, View } from "react-native";
import useAuth from "../../../contexts/AuthContext";
import Icon from "../../../components/Icon";
import colours from "../../../colours";
import ComingSoon from "../../../components/ComingSoon";
import { ParentProfileNavigatorProp } from "../../../Navigation/ParentProfileNavigator";
import { useNavigation } from "@react-navigation/native";

const ParentsProfileIndexScreen = () => {
  const { user, isLoading, logout } = useAuth();
  const navigator = useNavigation<ParentProfileNavigatorProp>();

  if (isLoading)
    return (
      <Text className="font-[quilka] text-primary text-3xl text-center">
        Loading...
      </Text>
    );

  return (
    <ScrollView contentContainerClassName="flex flex-col gap-y-6 py-8">
      <Text className="text-2xl font-[quilka] text-center">Profile</Text>

      <View className="flex flex-col gap-y-3 items-center">
        <Image
          source={require("../../../assets/placeholder-pfp.png")}
          className="size-[70px]"
        />
        <Text className="text-2xl font-[quilka] text-center">{user?.name}</Text>
        <Text className="text-base font-[abeezee] text-center">
          {user?.email}
        </Text>
      </View>
      <View className="mx-6 p-4 rounded-xl bg-white">
        <Pressable
          onPress={() => navigator.navigate("manageChildProfiles")}
          className="border-b-text border-b pb-4 pt-12 flex flex-row gap-x-4 items-center"
        >
          <Icon name="Users" color={colours.primary} />
          <Text className="font-[abeezee] flex-1 text-[18px]">
            Manage Child Profiles
          </Text>
          <Icon name="ChevronRight" color="black" />
        </Pressable>
      </View>
      <ComingSoon title="User profile" />
    </ScrollView>
  );
};

export default ParentsProfileIndexScreen;
