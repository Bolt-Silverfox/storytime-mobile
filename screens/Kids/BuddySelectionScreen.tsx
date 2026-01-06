import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { lazy, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import ErrorComponent from "../../components/ErrorComponent";
import Icon from "../../components/Icon";
import LoadingOverlay from "../../components/LoadingOverlay";
import SuspenseWrapper from "../../components/supsense/SuspenseWrapper";
import CustomButton from "../../components/UI/CustomButton";
import useSetStoryBuddy from "../../hooks/tanstack/mutationHooks/useSetStoryBuddy";
import useGetKidById from "../../hooks/tanstack/queryHooks/useGetKidById";
import {
  KidsSetupNavigatorParamList,
  KidsSetupProp,
} from "../../Navigation/KidsSetupNavigator";

const BuddySelectionComponent = lazy(
  () => import("../../components/BuddySelectionComponent")
);

type RouteProps = RouteProp<KidsSetupNavigatorParamList, "buddySelectionPage">;

const BuddySelectionScreen = () => {
  const { params } = useRoute<RouteProps>();
  const { childId } = params;
  const navigator = useNavigation<KidsSetupProp>();
  const [selected, setSelected] = useState<string>("");
  const { isPending, data, error, refetch } = useGetKidById(childId);

  const { mutate, isPending: isUpdating } = useSetStoryBuddy({
    kidId: childId,
    id: selected,
    onSuccess: async () => {
      navigator.navigate("welcomeScreen", { childId, selected });
    },
  });

  if (error)
    return <ErrorComponent refetch={refetch} message={error.message} />;

  return (
    <View className="flex flex-1 flex-col gap-y-5 bg-blue  pt-4 px-4">
      <Pressable onPress={() => navigator.goBack()}>
        <Icon name="ChevronLeft" color="white" />
      </Pressable>
      <View className="flex flex-col gap-y-3">
        <Text className="font-[quilka] text-3xl text-white">
          Hi, {data?.name ?? "User"}
        </Text>
        <Text className="font-[abeezee] text-[#B89DFD]">
          Choose your preferred Storytime buddy and enjoy beautiful moments.
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="flex flex-col pb-10 gap-y-10 max-w-screen-md mx-auto w-full"
      >
        <SuspenseWrapper>
          <BuddySelectionComponent
            selected={selected}
            setSelected={setSelected}
          />
        </SuspenseWrapper>

        <CustomButton
          bgColor="white"
          textColor="black"
          disabled={!selected}
          onPress={mutate}
          text="Continue"
        />
      </ScrollView>
      <LoadingOverlay visible={isPending || isUpdating} />
    </View>
  );
};

export default BuddySelectionScreen;
