import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { lazy, Suspense, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import ErrorComponent from "../../components/ErrorComponent";
import Icon from "../../components/Icon";
import LoadingOverlay from "../../components/LoadingOverlay";
import useGetKidById from "../../hooks/tanstack/queryHooks/useGetKidById";
import {
  KidsSetupNavigatorParamList,
  KidsSetupProp,
} from "../../Navigation/KidsSetupNavigator";
import useSetStoryBuddy from "../../hooks/tanstack/mutationHooks/useSetStoryBuddy";

const BuddySelectionComponent = lazy(
  () => import("../../components/BuddySelectionComponent")
);

type RouteProps = RouteProp<KidsSetupNavigatorParamList, "welcomeScreen">;

const BuddySelectionScreen = () => {
  const { params } = useRoute<RouteProps>();
  const navigator = useNavigation<KidsSetupProp>();

  const [selected, setSelected] = useState<string>("");

  const { isPending, data, error, refetch } = useGetKidById(params.childId);

  const { mutate, isPending: isUpdating } = useSetStoryBuddy({
    kidId: params.childId,
    id: selected,
    onSuccess: () => {
      navigator.getParent()?.navigate("index", {
        childId: params.childId,
      });
    },
  });


  useEffect(() => {
    if (data?.storyBuddyId) {
      navigator.getParent()?.navigate("index", {
        childId: params.childId,
      });
      return;
    }

    setSelected(data?.storyBuddyId ?? "");
  }, [data]);

  if (error)
    return <ErrorComponent refetch={refetch} message={error.message} />;

  return (
    <View className="flex flex-col gap-y-10 py-10 flex-1 max-w-screen-md mx-auto w-full">
      <Text className="text-center font-[quilka] text-2xl">
        Hi, {data?.name ?? "User"}
      </Text>
      <Text className="text-center font-[abeezee]">Choose your Storytime Buddy</Text>

      <Suspense fallback={<ActivityIndicator size={"large"} />}>
        <BuddySelectionComponent selected={selected} setSelected={setSelected} />
      </Suspense>

      <Pressable
        disabled={!selected}
        onPress={() => mutate()}
        className={`mx-5 flex flex-row justify-center items-center gap-x-4 sm:w-full py-4 rounded-full mt-4 max-w-screen-sm sm:mx-auto ${
          !selected ? "bg-purple/20" : "bg-purple"
        }`}
      >
        <Text className="text-center text-white font-[quilka] text-2xl">
          Continue
        </Text>
        <Icon name="ArrowRight" color="white" />
      </Pressable>

      <LoadingOverlay visible={isPending || isUpdating} />
    </View>
  );
};

export default BuddySelectionScreen;
