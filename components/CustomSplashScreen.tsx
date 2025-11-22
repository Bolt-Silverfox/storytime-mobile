import { StyleSheet, View, Text, Image } from "react-native";
import colours from "../colours";

const CustomSplashScreen = () => {
  return (
    <View style={styles.screen}>
      <View style={styles.imageContainer}>
        <Image
          alt="Storytime4Kids logo"
          source={require("../assets/icons/new-logo.png")}
        />
      </View>
      <Text className="text-primary font-[abeezee] text-xl text-center">
        Re-defining storytelling for kids with big imagination
      </Text>
    </View>
  );
};

export default CustomSplashScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colours["bg-light"],
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 50,
  },
  image: {
    width: 322.35,
    height: 60,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    flex: 1,
  },
  text: {
    textAlign: "center",
    fontFamily: "abeezee",
    fontSize: 16,
    color: colours["primary-light"],
  },
});
