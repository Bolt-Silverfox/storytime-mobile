import { useNavigation } from "@react-navigation/native";
import { ArrowRight2 } from "iconsax-react-nativejs";
import React from "react";
import { Pressable, Text, View } from "react-native";
import PageTitle from "../../../components/PageTitle";
import { ParentProfileNavigatorProp } from "../../../Navigation/ParentProfileNavigator";
import defaultStyles from "../../../styles";
import useGetUserProfile from "../../../hooks/tanstack/queryHooks/useGetUserProfile";
import LoadingOverlay from "../../../components/LoadingOverlay";
import ErrorComponent from "../../../components/ErrorComponent";
import CustomButton from "../../../components/UI/CustomButton";

export default function ManagePassword() {
  const navigator = useNavigation<ParentProfileNavigatorProp>();
  const { data, isPending, error, refetch } = useGetUserProfile();

  if (isPending) return <LoadingOverlay visible={isPending} />;
  if (error)
    return <ErrorComponent refetch={refetch} message={error.message} />;

  return (
    <View className="bg-[#FFFCFBFB] flex-1">
      <PageTitle
        title="Manage Password/Pin"
        goBack={() => navigator.goBack()}
      />
      <View className="mt-[24px] mx-[16] w-full md:mx-auto max-w-screen-md gap-4">
        <Pressable
          onPress={() => navigator.navigate("resetParentPassword")}
          className="flex-row py-[34] border-[0.5px] border-[#EAE8E8]  justify-between rounded-[20px] px-[16] bg-white"
        >
          <Text
            style={[defaultStyles.defaultText, { color: "black" }]}
            className="self-center"
          >
            Reset Password
          </Text>
          <ArrowRight2 />
        </Pressable>
        {data?.pinSet ? (
          <Pressable
            className="flex-row py-[34] border-[0.5px] border-[#EAE8E8]  justify-between rounded-[20px] px-[16] bg-white"
            onPress={() => navigator.navigate("updatePin")}
          >
            <Text
              style={[defaultStyles.defaultText, { color: "black" }]}
              className="self-center"
            >
              Update pin
            </Text>
            <ArrowRight2 />
          </Pressable>
        ) : (
          <Pressable
            className="flex-row py-[34] border-[0.5px] border-[#EAE8E8]  justify-between rounded-[20px] px-[16] bg-white"
            onPress={() => navigator.navigate("setPin")}
          >
            <Text
              style={[defaultStyles.defaultText, { color: "black" }]}
              className="self-center"
            >
              Set pin
            </Text>
            <ArrowRight2 />
          </Pressable>
        )}
      </View>
      <View className="flex-1 justify-end  px-4 gap-6 mb-5">
        <CustomButton
          onPress={() => navigator.navigate("indexPage")}
          text="Save"
        />
      </View>
    </View>
  );
}
