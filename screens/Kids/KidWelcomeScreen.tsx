import React from "react";
import { View, Text, ImageBackground, Pressable } from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { KidsSetupNavigatorParamList } from "../../Navigation/KidsSetupNavigator";
import { KidsNavigatorProp } from "../../Navigation/KidsNavigator";
import useGetKidById from "../../hooks/tanstack/queryHooks/useGetKidById";
import useGetStoryBuddyById from "../../hooks/tanstack/queryHooks/useGetStoryBuddyById";
import LoadingOverlay from "../../components/LoadingOverlay";
import ErrorComponent from "../../components/ErrorComponent";
import Icon from "../../components/Icon";

type RouteProps = RouteProp<KidsSetupNavigatorParamList, "welcomeScreen">;

const KidWelcomeScreen = () => {
  const { params } = useRoute<RouteProps>();
  const navigator = useNavigation<KidsNavigatorProp>();
  const { childId, selected } = params;

  const { data: kid, isPending, error, refetch: refetchKid } = useGetKidById(childId);
  const { data: buddy, isPending: buddyLoading, error: buddyError, refetch: refetchBuddy } = useGetStoryBuddyById(selected);

  if (isPending || buddyLoading) return <LoadingOverlay visible={true} />;
  if (error) return <ErrorComponent refetch={refetchKid} message={error.message} />;
  if (buddyError) return <ErrorComponent refetch={refetchBuddy} message={buddyError.message} />;

  return (
    <View className="flex flex-col flex-1 max-w-screen-md mx-auto w-full">
      <ImageBackground
        source={
          buddy?.name?.toLowerCase() === "zylo"
            ? require("../../assets/avatars/zylo-bg.png")
            : require("../../assets/avatars/lumina-bg.png")
        }
        className="w-full h-full rounded-2xl"
        resizeMode="cover"
      >
        <View className="flex-1 my-20">
          <View className="p-7 self-center bg-[#FFFCFB] rounded-2xl">
            <Text className="text-[22px] font-[abeezee] text-black">
              Hello {kid?.name}, I am {buddy?.name}
            </Text>
            <Text className="text-[22px] font-[abeezee] text-black">
              I am your Storytime Buddy.
            </Text>
            <Text className="text-[22px] font-[abeezee] text-black">
              Ready to start reading together?
            </Text>
          </View>
        </View>

        <Pressable
          onPress={() => navigator.navigate("index", { childId })}
          className="mx-5 bg-purple/90 mb-20 flex flex-row justify-center items-center gap-x-4 sm:w-full py-4 rounded-full mt-4 max-w-screen-sm sm:mx-auto"
        >
          <Text className="text-center text-white font-[quilka] text-2xl">Let's go</Text>
          <Icon name="ArrowRight" color="white" />
        </Pressable>
      </ImageBackground>
    </View>
  );
};

export default KidWelcomeScreen;
