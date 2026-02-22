import React, { useEffect, useRef } from "react";
import { Animated, Easing, View, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";

export default function LoadingIcon() {
  const bookPulse = useRef(new Animated.Value(0)).current;
  const starShimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bookPulse, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(bookPulse, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(starShimmer, {
          toValue: 1,
          duration: 300,
          easing: Easing.in(Easing.exp),
          useNativeDriver: true,
        }),
        Animated.timing(starShimmer, {
          toValue: 0.2,
          duration: 800,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [bookPulse, starShimmer]);

  const bookScale = bookPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.95, 1.05],
  });

  const bookOpacity = bookPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  const starScale = starShimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1.2],
  });

  const starOpacity = starShimmer;

  return (
    <View style={styles.container}>
      {/* The Purple Book (Pulsating) */}
      <Animated.View
        style={[
          styles.staticLayer,
          { transform: [{ scale: bookScale }], opacity: bookOpacity },
        ]}
      >
        <Svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <Path
            d="M56 30.5L88 64.5V74L59 104L25 68V58.5L56 30.5Z"
            fill="#3D00FF"
          />
          <Path d="M81 57L96 54.5L88 74L81 57Z" fill="#3D00FF" />
          <Path
            d="M25 68C25 68 35 60 41 64C47 68 59 104 59 104L25 68Z"
            fill="#3D00FF"
          />
        </Svg>
      </Animated.View>

      {/* The Golden Stars (Shimmering) */}
      <Animated.View
        style={[
          styles.staticLayer,
          { transform: [{ scale: starScale }], opacity: starOpacity },
        ]}
      >
        <Svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <Path
            d="M83 23C83 27 80 29 80 29C80 29 83 31 83 35C83 31 86 29 86 29C86 29 83 27 83 23Z"
            fill="#FFC700"
          />
          <Path
            d="M90 40C90 42 88.5 43 88.5 43C88.5 43 90 44 90 46C90 44 91.5 43 91.5 43C91.5 43 90 42 90 40Z"
            fill="#FFC700"
          />
          <Path
            d="M79.5 37.5C79.5 38.5 78.5 39 78.5 39C78.5 39 79.5 39.5 79.5 40.5C79.5 39.5 80.5 39 80.5 39C80.5 39 79.5 38.5 79.5 37.5Z"
            fill="#FFC700"
          />
          <Path
            d="M71 38C71 38.5 70.5 38.5 70.5 38.5C70.5 38.5 71 38.5 71 39C71 38.5 71.5 38.5 71.5 38.5C71.5 38.5 71 38.5 71 38Z"
            fill="#FFC700"
          />
          <Path
            d="M81.5 48.5C81.5 49 81 49 81 49C81 49 81.5 49 81.5 49.5C81.5 49 82 49 82 49C82 49 81.5 49 81.5 48.5Z"
            fill="#FFC700"
          />
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 120,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  staticLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
