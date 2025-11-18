import {
  View,
  Text,
  Image,
  useWindowDimensions,
  Pressable,
} from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import defaultStyles from "../../styles";
import { ChevronRight, User } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { RootNavigatorProp } from "../../Navigation/RootNavigator";
import { AuthNavigatorParamList } from "../../Navigation/AuthNavigator";
import { ChooseUserData } from "../../constants/constants";

export interface ChooseUserDataType {
  name: string;
  description: string;
  link: keyof AuthNavigatorParamList;
}

export default function ChooseUser() {
  const inset = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const navigate = useNavigation<RootNavigatorProp>();

  return (
    <View
      style={[{ paddingTop: inset.top, paddingBottom: inset.bottom, width }]}
      className="bg-[##FFFCFBFB] flex-1"
    >
      <View className="w-[90%] mx-auto flex-1 rounded-[26px] pt-8 items-center ">
        <View className=" mx-auto    w-full">
          <View className="items-center">
            <Image
              source={require("../../assets/logo.png")}
              className=""
              style={{ width: 153, height: 23 }}
            />
            <Text style={[defaultStyles.heading]} className="mt-10">
              Who is Using Storytime
            </Text>
            <Text style={[defaultStyles.defaultText]}>Pick your role</Text>
          </View>

          <View className="gap-4 mt-11">
            {ChooseUserData.map((user, i) => (
              <Pressable
                onPress={() => navigate.navigate("auth", { screen: user.link })}
                key={i}
              >
                <View
                  className="flex-row  p-6 gap-2 rounded-[16px] shadow-md "
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 4,
                    elevation: 5,
                    backgroundColor: "white",
                  }}
                >
                  <View className="relative">
                    <View className="w-[65px] h-[65px] bg-[#FEEAE6] border border-[#FB9583] rounded-full justify-center items-center">
                      <User
                        fill={"#EC4007"}
                        strokeWidth={0}
                        className="absolute border border-black w-5 h-5"
                        size={65}
                      />
                    </View>
                  </View>
                  <View className="flex-1">
                    <Text
                      style={[
                        defaultStyles.defaultText,
                        { color: "black", fontSize: 24 },
                      ]}
                    >
                      {user.name}
                    </Text>
                    <Text style={[defaultStyles.defaultText]}>
                      {user.description}
                    </Text>
                  </View>

                  <ChevronRight size={24} style={{ alignSelf: "center" }} />
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}
