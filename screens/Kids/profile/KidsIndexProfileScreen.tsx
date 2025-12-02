import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import { CloudMinus, MagicStar } from "iconsax-react-nativejs";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import defaultStyles from "../../../styles";
import {
  KidsProfileNavigatorParams,
  kidsProfileNavigatorProp,
} from "../../../Navigation/KidsProfileNavigator";
import useGetKidById from "../../../hooks/tanstack/queryHooks/useGetKidById";
import React from "react";
import KidAvatar from "../../../components/KidAvatar";
import LoadingOverlay from "../../../components/LoadingOverlay";
import { KidsTabNavigatorProp } from "../../../Navigation/KidsTabNavigator";

type ProfileParams = RouteProp<KidsProfileNavigatorParams, "indexPage">;
const KidsIndexProfileScreen = () => {
  const { params } = useRoute<ProfileParams>();
  const navigator = useNavigation<kidsProfileNavigatorProp>();
  const tabsNavigator = useNavigation<KidsTabNavigatorProp>();
  const { data, isLoading, isFetching } = useGetKidById(params.childId);
  const kidAvatar = data?.avatar?.url;
  const kidName = data?.name;
  const kidAge = data?.ageRange;
  console.log(data);
  return (
    <ScrollView className=" flex-1">
      <View>
        <Text style={defaultStyles.heading} className="mt-3">
          Profile
        </Text>
        <View className="items-center">
          <MagicStar
            color="#EC40071F"
            style={{ position: "absolute", left: 10 }}
          />
          <CloudMinus
            color="#EC40071F"
            style={{ position: "absolute", right: 10 }}
          />
          <KidAvatar uri={kidAvatar} size={100} />
          <Image source={{ uri: kidAvatar }} className="mx-auto" />
          <Text className="font-[quilka] text-xl">{kidName}</Text>
          <Text className="font-[abeezee]">{kidAge} years</Text>
          <MagicStar
            color="#EC40071F"
            style={{ position: "absolute", bottom: 20, left: 40 }}
          />
          <CloudMinus
            color="#EC40071F"
            style={{ position: "absolute", right: 50, bottom: 50 }}
          />
        </View>

        <View className="mt-[66] gap-[30] mx-auto ">
          <View className="flex-row justify-between max-w-[390] gap-3">
            <Pressable
              onPress={() =>
                navigator.navigate("changeKidAvatar", {
                  childId: params.childId,
                })
              }
              className="bg-[#8681FF] border-b-[5px] w-[177px] overflow-hidden justify-center items-center h-[169px] rounded-[20px] border-[#3B34DD]"
            >
              <View className="w-[93] h-[79] absolute -right-[35px] -top-[15px] rounded-full bg-[#938FFE]" />

              <Image
                source={require("../../../assets/icons/changeAvatar.png")}
              />
              <Text className="text-[16px] text-[#0731EC] font-[abeezee]">
                Change Avatar
              </Text>
              <View className="w-[93] h-[79] absolute -left-[35px] -bottom-[35px] rounded-full bg-[#5953F6]" />
            </Pressable>

            <Pressable
              onPress={() =>
                tabsNavigator.navigate("library", {
                  childId: params.childId,
                })
              }
              className="bg-[#FEBADC] border-b-[5px] w-[177px] overflow-hidden justify-center items-center h-[169px] rounded-[20px] border-[#EC0794]"
            >
              <View className="w-[93] h-[79] absolute -right-[35px] -top-[15px] rounded-full bg-[#FFD2E8]" />

              <Image source={require("../../../assets/icons/read.png")} />
              <Text className="text-[16px] text-[#EC0794] font-[abeezee]">
                Read history
              </Text>
              <View className="w-[93] h-[79] absolute -left-[35px] -bottom-[35px] rounded-full bg-[#FF66B2]" />
            </Pressable>
          </View>

          <View className="flex-row justify-between  max-w-[390] ">
            {/* <Pressable
              onPress={() => navigator.navigate("changeKidTheme")}
              className="bg-[#EFCDFB]  border-b-[5px] w-[177px] overflow-hidden justify-center items-center h-[169px] rounded-[20px] border-[#B362D0]"
            >
              <View className="w-[93] h-[79] absolute -right-[35px] -top-[15px] rounded-full bg-[#FAEBFF]" />

              <Image source={require("../../../assets/icons/theme.png")} />
              <Text className="text-[16px] text-[#AF55CF] font-[abeezee]">
                Change Theme
              </Text>
              <View className="w-[93] h-[79] absolute -left-[35px] -bottom-[35px] rounded-full bg-[#D786F5]" />
            </Pressable> */}

            <Pressable
              onPress={() =>
                tabsNavigator.navigate("progress", { childId: params.childId })
              }
              className="bg-[#9FFFF7] border-b-[5px] w-[177px] overflow-hidden justify-center items-center h-[169px] rounded-[20px] border-[#3DC4B9]"
            >
              <View className="w-[93] h-[79] absolute -right-[35px] -top-[15px] rounded-full bg-[#CDFBF7]" />

              <Image source={require("../../../assets/icons/achieve.png")} />
              <Text className="text-[16px] text-[#487F7B] font-[abeezee]">
                Achievement
              </Text>
              <View className="w-[93] h-[79] absolute -left-[35px] -bottom-[35px] rounded-full bg-[#6FE6DC]" />
            </Pressable>
          </View>
          <MagicStar
            color="#EC40071F"
            style={{ position: "absolute", bottom: -70, left: 40 }}
          />
          <MagicStar
            color="#EC40071F"
            style={{ position: "absolute", bottom: -70, left: 150 }}
          />
          <CloudMinus
            color="#EC40071F"
            style={{ position: "absolute", right: 50, bottom: -50 }}
          />
        </View>
      </View>
      <LoadingOverlay visible={isLoading || isFetching} />
    </ScrollView>
  );
};
export default KidsIndexProfileScreen;
