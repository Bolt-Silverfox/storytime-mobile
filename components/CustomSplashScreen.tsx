import { Image, ImageBackground, Text, View } from "react-native";

const CustomSplashScreen = () => {
  return (
    <View className="flex flex-1 bg-white pt-[100px]">
      <View className="flex flex-col gap-y-6 px-10">
        <Image
          className="self-center"
          source={require("../assets/icons/logo-complete.png")}
        />
        <Text className="text-center text-[#646577] font-[abeezee] text-base">
          Discover beautifully told stories, created just for kids.
        </Text>
      </View>

      <View className="flex-1 relative">
        <ImageBackground
          source={require("../assets/orange-clouds.png")}
          resizeMode="cover"
          className="flex-1"
        >
          <Image
            className="absolute left-5 top-10"
            source={require("../assets/fairy.png")}
          />
          <Image
            className="absolute left-32 top-56"
            source={require("../assets/star-large.png")}
          />
          <Image
            className="absolute right-32 top-48"
            source={require("../assets/star-small.png")}
          />
          <Image
            className="absolute right-32 top-28"
            source={require("../assets/star-extra-small.png")}
          />
          <Image
            className="absolute right-24uth top-40"
            source={require("../assets/star-extra-small.png")}
          />
          <Image
            className="absolute left-40 top-20"
            source={require("../assets/star-extra-small.png")}
          />
          <Image
            className="absolute left-20 top-40"
            source={require("../assets/star-extra-small.png")}
          />
          <Image
            className="absolute right-5 top-32"
            source={require("../assets/bird.png")}
          />
          <View className="absolute bottom-10 w-full px-10">
            <Text className="font-[quilka] text-center text-xl text-[#F1D7C9]">
              Used by over <Text className="text-2xl">10,000+</Text> parents
              around the world!
            </Text>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};

export default CustomSplashScreen;
