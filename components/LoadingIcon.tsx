import LottieView from "lottie-react-native";
import { View, StyleSheet } from "react-native";

export default function LoadingIcon() {
  return (
    <View style={styles.container}>
      <LottieView
        source={require("../assets/lottie/storytime.json")}
        autoPlay
        loop
        speed={1}
        renderMode="SOFTWARE"
        style={styles.animation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  animation: {
    width: 200,
    height: 200,
  },
});
