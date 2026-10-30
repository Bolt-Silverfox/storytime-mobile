import { Image, ImageBackground, Text, View } from "react-native";

const CustomSplashScreen = () => {
  return (
    <View className="bg-surface flex flex-1 pt-[100px]">
      <View className="flex flex-col gap-y-6 px-10">
        <Image
          className="self-center"
          source={require("../assets/icons/logo-complete.png")}
        />
        <Text className="text-muted text-center font-[abeezee] text-base">
          Discover beautifully told stories, crafted just for you.
        </Text>
      </View>

      <View className="relative flex-1">
        <ImageBackground
          source={require("../assets/orange-clouds.png")}
          resizeMode="cover"
          className="flex-1"
        >
          <Image
            className="absolute top-10 left-5"
            source={require("../assets/fairy.png")}
          />
          <Image
            className="absolute top-56 left-32"
            source={require("../assets/star-large.png")}
          />
          <Image
            className="absolute top-48 right-32"
            source={require("../assets/star-small.png")}
          />
          <Image
            className="absolute top-28 right-32"
            source={require("../assets/star-extra-small.png")}
          />
          <Image
            className="absolute top-40 right-24"
            source={require("../assets/star-extra-small.png")}
          />
          <Image
            className="absolute top-20 left-40"
            source={require("../assets/star-extra-small.png")}
          />
          <Image
            className="absolute top-40 left-20"
            source={require("../assets/star-extra-small.png")}
          />
          <Image
            className="absolute top-32 right-5"
            source={require("../assets/bird.png")}
          />
          <View className="absolute bottom-10 w-full px-10">
            <Text className="text-center font-[quilka] text-xl text-[#F1D7C9]">
              Used by over <Text className="text-fg text-2xl">10,000+</Text>{" "}
              readers around the world!
            </Text>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};

export default CustomSplashScreen;
