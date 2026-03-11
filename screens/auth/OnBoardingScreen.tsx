import {
  View,
  Text,
  FlatList,
  useWindowDimensions,
  ImageSourcePropType,
  ImageBackground,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { useRef, useState } from "react";
import defaultStyles from "../../styles";
import { useNavigation } from "@react-navigation/native";
import { RootNavigatorProp } from "../../Navigation/RootNavigator";
import { StatusBar } from "expo-status-bar";
import { onBoardingSlide } from "../../constants/constants";
import SafeAreaWrapper from "../../components/UI/SafeAreaWrapper";

type SlideItems = {
  id: string;
  title: string;
  description: string;
  image: ImageSourcePropType;
  dot: number[];
};

export default function OnBoardingScreen() {
  const [_currentindex, _setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<SlideItems> | null>(null);
  const { width } = useWindowDimensions();
  const [layoutWidth, setLayoutWidth] = useState<number | null>(null);

  return (
    <SafeAreaWrapper variant="transparent">
      <View
        style={[styles.flexOne, { width }]}
        onLayout={(e) => setLayoutWidth(e.nativeEvent.layout.width)}
      >
        <StatusBar style="light" />
        {layoutWidth && (
          <View style={[styles.flexOne, { width }]}>
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
              onScrollToIndexFailed={(info) => {
                const offset = info.index * layoutWidth;
                flatListRef.current?.scrollToOffset({ offset, animated: true });
              }}
            />
          </View>
        )}
      </View>
    </SafeAreaWrapper>
  );
}

function OnboardingItem({ item }: { item: SlideItems }) {
  const navigate = useNavigation<RootNavigatorProp>();
  const [isImageLoading, setIsImageLoading] = useState(false);
  const { width } = useWindowDimensions();
  return (
    <ImageBackground
      onLoadStart={() => {
        setIsImageLoading(true);
      }}
      onLoadEnd={() => setIsImageLoading(false)}
      source={item.image}
      resizeMode="cover"
      style={{ width }}
    >
      {isImageLoading && (
        <View className="absolute inset-0 items-center justify-center bg-black/40">
          <ActivityIndicator size="large" color="#EC4007" />
        </View>
      )}
      <View className=" flex-1 justify-end">
        <View className="mx-auto mb-10 w-[95%] rounded-[32px] bg-white px-7 py-8  ">
          <Pagination data={item} />
          <View>
            <Text style={styles.titleText} className="text-center text-[28px]">
              {item.title}
            </Text>
            <Text
              style={styles.descriptionText}
              className="mb-8 mt-4 text-center text-[18px] text-text"
            >
              {item.description}
            </Text>

            <View className="flex gap-4">
              <Pressable
                onPress={() => navigate.navigate("auth", { screen: "signUp" })}
                style={defaultStyles.button}
              >
                <Text
                  style={styles.textWhite}
                  className="text-center text-white"
                >
                  Sign up
                </Text>
              </Pressable>
              <Pressable
                onPress={() => navigate.navigate("auth", { screen: "login" })}
                style={styles.buttonWhite}
                className="border-[0.5px] border-[#4A413F]"
              >
                <Text style={styles.textDark} className="text-center">
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
    <View className="mb-6 flex-row justify-center gap-[6px]  ">
      {data.dot.map((item, i) => {
        return (
          <View
            key={i.toString()}
            style={[
              styles.paginationDot,
              { width: item },
              item === 5 && styles.paginationDotInactive,
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  titleText: {
    fontFamily: "quilka",
  },
  descriptionText: {
    fontFamily: "abeezee",
  },
  textWhite: {
    ...defaultStyles.defaultText,
    color: "white",
  },
  textDark: {
    ...defaultStyles.defaultText,
    color: "#212121",
  },
  buttonWhite: {
    ...defaultStyles.button,
    backgroundColor: "white",
  },
  paginationDot: {
    backgroundColor: "#EC2907",
    borderRadius: 5,
    height: 5,
  },
  paginationDotInactive: {
    backgroundColor: "#00000033",
  },
});
