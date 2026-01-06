import { useNavigation } from "@react-navigation/native";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Image, Text, View } from "react-native";
import { ProtectedRoutesNavigationProp } from "../Navigation/ProtectedNavigator";
import { queryGetKidById } from "../hooks/tanstack/queryHooks/useGetKidById";
import queryStoryBuddyById from "../hooks/tanstack/queryHooks/useGetStoryBuddyById";
import ErrorComponent from "./ErrorComponent";
import KidAvatar from "./KidAvatar";

const KidsHomeScreenHeader = ({ childId }: { childId: string }) => {
  const navigator = useNavigation<ProtectedRoutesNavigationProp>();
  const { error, data, refetch } = useSuspenseQuery(queryGetKidById(childId));
  const {
    data: buddyData,
    error: buddyError,
    refetch: refetchBuddy,
  } = useSuspenseQuery(queryStoryBuddyById(data?.storyBuddyId!));

  if (error) {
    return <ErrorComponent message={error.message} refetch={refetch} />;
  }
  if (buddyError) {
    return (
      <ErrorComponent
        message={buddyError.message ?? "Buddy not found"}
        refetch={refetchBuddy}
      />
    );
  }

  return (
    <View className="flex bg-white border-b px-4 py-5 border-b-border-lighter flex-row pb-4 items-center gap-x-3">
      <KidAvatar
        uri={data.avatar?.url}
        size={50}
        onPress={() =>
          navigator.reset({ index: 0, routes: [{ name: "selection" }] })
        }
      />
      <Text className="text-xl font-[abeezee] flex-1">Hello, {data.name}</Text>
      <Image
        source={
          buddyData?.name === "lumina"
            ? require("../assets/avatars/lumina.png")
            : require("../assets/avatars/zylo.png")
        }
        // source={{ uri: buddyData.profileAvatarUrl }}
        className="size-[50px]"
      />
    </View>
  );
};

export default KidsHomeScreenHeader;
