import {
  View,
  Text,
  FlatList,
  useWindowDimensions,
  ImageSourcePropType,
  Animated,
  ImageBackground,
  Pressable,
} from "react-native";
import React, { useRef, useState } from "react";
import defaultStyles from "../../styles";
import { useNavigation } from "@react-navigation/native";
import { RootNavigatorProp } from "../../Navigation/RootNavigator";
import { StatusBar } from "expo-status-bar";
import { onBoardingSlide } from "../../constants/constants";

type SlideItems = {
  id: string;
  title: string;
  description: string;
  image: ImageSourcePropType;
  dot: number[];
};

export default function OnBoardingScreen() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" />

      <View style={{ flex: 1 }}>
        <FlatList
          data={onBoardingSlide}
          renderItem={({ item }) => <OnboardingItem item={item} />}
          bounces={false}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          keyExtractor={(item) => item.id}
          scrollEventThrottle={32}
        />
      </View>
    </View>
  );
}

function OnboardingItem({ item }: { item: SlideItems }) {
  const navigate = useNavigation<RootNavigatorProp>();

  const { width } = useWindowDimensions();
  return (
    <ImageBackground
      source={item.image}
      resizeMode="cover"
      style={{ width: width }}
    >
      <View className=" flex-1 justify-end">
        <View className="bg-white rounded-[32px] w-[95%] mx-auto mb-10 px-7 py-8  ">
          <Pagination data={item} />
          <View>
            <Text
              style={[{ fontFamily: "quilka" }]}
              className="text-[28px] text-center"
            >
              {item.title}
            </Text>
            <Text
              style={[{ fontFamily: "abeezee" }]}
              className="text-[18px] mt-4 mb-8 text-center text-text"
            >
              {item.description}
            </Text>

            <View className="gap-4 flex">
              <Pressable
                onPress={() =>
                  navigate.navigate("auth", { screen: "chooseUser" })
                }
                style={[defaultStyles.button]}
              >
                <Text
                  style={[defaultStyles.defaultText, { color: "white" }]}
                  className="text-center text-white"
                >
                  Sign up
                </Text>
              </Pressable>
              <Pressable
                onPress={() => navigate.navigate("auth", { screen: "login" })}
                style={[defaultStyles.button, { backgroundColor: "white" }]}
                className="border-[#4A413F] border-[0.5px]"
              >
                <Text
                  style={[defaultStyles.defaultText, { color: "#212121" }]}
                  className="text-center"
                >
                  Log in
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

function Pagination({ data }: { data: SlideItems }) {
  return (
    <View className="flex-row justify-center gap-[6px] mb-6  ">
      {data.dot.map((item, i) => {
        return (
          <Animated.View
            key={i.toString()}
            style={[
              {
                width: item,

                backgroundColor: item == 5 ? "#00000033" : "#EC2907",
                borderRadius: 5,
                height: 5,
              },
            ]}
          />
        );
      })}
    </View>
  );
}
