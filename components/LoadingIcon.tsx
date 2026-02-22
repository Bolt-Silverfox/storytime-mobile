import React, { useEffect, useRef } from "react";
import { Animated, Easing, View, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";

export default function LoadingIcon() {
  const bookPulse = useRef(new Animated.Value(0)).current;
  const starShimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const bookLoop = Animated.loop(
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
      ])
    );

    const starLoop = Animated.loop(
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
      ])
    );

    bookLoop.start();
    starLoop.start();

    return () => {
      bookLoop.stop();
      starLoop.stop();
    };
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
        <Svg width="120" height="120" viewBox="0 0 512 512" fill="none">
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M407.448 227.812C409.204 227.417 410.772 228.804 410.145 230.24L379.657 299.328C378.716 301.43 376.269 301.524 375.202 299.51C375.202 299.51 365.981 275.421 357.888 260.885C354.442 254.862 350.27 249.283 345.467 244.274C344.903 243.245 345.781 241.67 347.098 241.375L407.448 227.812Z"
            fill="#4807EC"
          />
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M240.703 130.576C240.703 130.576 287.502 174.465 324.201 222.926C353.246 261.294 374.074 306.612 374.074 306.612C374.952 307.779 374.638 309.63 373.384 310.753L254.63 416.772C254.123 417.194 253.49 417.435 252.832 417.458C252.173 417.48 251.525 417.283 250.991 416.898C250.991 416.898 218.181 374.132 176.276 341.599C146.038 318.118 102.752 301.851 102.752 301.851C101.058 300.508 100.494 298.357 101.497 297.052L235.057 130.024C236.562 128.18 239.072 128.431 240.703 130.576Z"
            fill="#4807EC"
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
        <Svg width="120" height="120" viewBox="0 0 512 512" fill="none">
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M355.818 95C355.818 95 354.626 106.424 360.209 112.634C366.357 119.447 379.468 120.495 379.468 120.495C379.468 120.495 366.356 118.826 359.832 124.748C352.367 131.486 351.175 146.774 351.175 146.774C351.175 146.774 353.183 134.026 347.537 127.358C341.577 120.213 328.215 118.468 328.215 118.468C328.215 118.468 341.075 118.763 348.603 112.208C354.877 106.8 355.818 95 355.818 95Z"
            fill="#ECC607"
          />
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M303.939 158.129C303.939 158.129 303.626 161.046 305.131 162.633C306.699 164.377 310.15 164.653 310.15 164.653C310.15 164.653 306.699 164.22 305.006 165.726C303.061 167.445 302.747 171.347 302.747 171.347C302.747 171.347 303.311 168.091 301.806 166.385C300.237 164.559 296.787 164.107 296.787 164.107C296.787 164.107 300.112 164.189 302.119 162.52C303.688 161.14 303.939 158.129 303.939 158.129Z"
            fill="#ECC607"
          />
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M352.244 200.316C352.244 200.316 351.93 203.233 353.436 204.821C355.004 206.565 358.454 206.841 358.454 206.841C358.454 206.841 355.004 206.408 353.31 207.913C351.365 209.632 351.051 213.534 351.051 213.534C351.051 213.534 351.616 210.278 350.11 208.572C348.542 206.747 345.092 206.288 345.092 206.288C345.092 206.288 348.417 206.376 350.424 204.708C351.992 203.328 352.244 200.316 352.244 200.316Z"
            fill="#ECC607"
          />
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M385.553 165.82C385.553 165.82 384.925 171.51 387.748 174.609C390.76 178.003 397.284 178.518 397.284 178.518C397.284 178.518 390.76 177.69 387.498 180.644C383.859 184.007 383.232 191.623 383.232 191.623C383.232 191.623 384.236 185.274 381.413 181.949C378.464 178.392 371.877 177.526 371.877 177.526C371.877 177.526 378.213 177.671 381.977 174.396C385.051 171.699 385.553 165.82 385.553 165.82Z"
            fill="#ECC607"
          />
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M343.71 154.898C343.71 154.898 343.333 158.644 345.215 160.689C347.286 162.935 351.677 163.286 351.677 163.286C351.677 163.286 347.286 162.728 345.09 164.666C342.643 166.874 342.204 171.893 342.204 171.893C342.204 171.893 342.894 167.709 341.012 165.513C339.005 163.16 334.488 162.577 334.488 162.577C334.488 162.577 338.817 162.684 341.326 160.538C343.459 158.769 343.71 154.898 343.71 154.898Z"
            fill="#ECC607"
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
