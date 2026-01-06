import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { ImageBackground, Text, View } from "react-native";
import { KidsNavigatorProp } from "../../Navigation/KidsNavigator";
import { KidsSetupNavigatorParamList } from "../../Navigation/KidsSetupNavigator";
import ErrorComponent from "../../components/ErrorComponent";
import LoadingOverlay from "../../components/LoadingOverlay";
import CustomButton from "../../components/UI/CustomButton";
import useGetKidById from "../../hooks/tanstack/queryHooks/useGetKidById";
import queryStoryBuddyById from "../../hooks/tanstack/queryHooks/useGetStoryBuddyById";

type RouteProps = RouteProp<KidsSetupNavigatorParamList, "welcomeScreen">;

const KidWelcomeScreen = () => {
  const { params } = useRoute<RouteProps>();
  const navigator = useNavigation<KidsNavigatorProp>();
  const { childId, selected } = params;

  const {
    data: kid,
    isPending,
    error,
    refetch: refetchKid,
  } = useGetKidById(childId);
  const {
    data: buddy,
    isPending: buddyLoading,
    error: buddyError,
    refetch: refetchBuddy,
  } = useQuery(queryStoryBuddyById(selected));

  if (isPending || buddyLoading) return <LoadingOverlay visible={true} />;
  if (error)
    return <ErrorComponent refetch={refetchKid} message={error.message} />;
  if (buddyError)
    return (
      <ErrorComponent refetch={refetchBuddy} message={buddyError.message} />
    );

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
        <View className="flex-1 my-20 relative">
          <View
            className={`p-7 self-center bg-[#FFFCFB] rounded-2xl ${buddy.name.toLowerCase() === "lumina" && "absolute bottom-0"}`}
          >
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
        <CustomButton
          text="Let's go"
          onPress={() =>
            navigator.replace("index", { screen: "home", params: { childId } })
          }
          bgColor="white"
          textColor="black"
        />
        <View className="mb-10" />
      </ImageBackground>
    </View>
  );
};

export default KidWelcomeScreen;
