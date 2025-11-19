import {
  View,
  Text,
  FlatList,
  useWindowDimensions,
  ImageSourcePropType,
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
  const [currentindex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<SlideItems> | null>(null);
  const { width } = useWindowDimensions();
  const [layoutWidth, setLayoutWidth] = useState<number | null>(null);
  console.log("layout width", layoutWidth, "width", width);

  const onScroll = () => {
    if (currentindex < onBoardingSlide.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentindex + 1 });
      console.log("clicked");
    } else {
      console.log("Last item");
    }
  };

  return (
    <View
      style={{ flex: 1, width }}
      onLayout={(e) => setLayoutWidth(e.nativeEvent.layout.width)}
    >
      <StatusBar style="light" />
      {layoutWidth && (
        <View style={{ flex: 1, width }}>
          <FlatList
            ref={flatListRef}
            data={onBoardingSlide}
            renderItem={({ item }) => <OnboardingItem item={item} />}
            bounces={false}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            keyExtractor={(item) => item.id}
            initialNumToRender={3}
            windowSize={3}
            removeClippedSubviews={false}
            getItemLayout={(_, index) => ({
              length: layoutWidth,
              offset: layoutWidth * index,
              index,
            })}
            // initialScrollIndex={2}
            onScrollToIndexFailed={(info) => {
              const offset = info.index * layoutWidth;
              flatListRef.current?.scrollToOffset({ offset, animated: true });
            }}
          />
        </View>
      )}
      {/* i used this botton to test the scrollToIndex*/}
      {/* 
      <Pressable className="p-10 bg-red-700" onPress={onScroll}>
        <Text>SCROLL</Text>
      </Pressable> */}
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
                onPress={() => navigate.navigate("auth", { screen: "signUp" })}
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
          <View
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
