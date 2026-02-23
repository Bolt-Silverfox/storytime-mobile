import { ReactNode } from "react";
import { Animated, ViewProps } from "react-native";

const AnimatedControlWrapper = ({
  controlsOpacity,
  controlsVisible,
  children,
  ...rest
}: {
  controlsOpacity: Animated.Value;
  controlsVisible: boolean;
  children: ReactNode;
} & Omit<ViewProps, "style">) => (
  <Animated.View
    style={{ opacity: controlsOpacity }}
    pointerEvents={controlsVisible ? "auto" : "none"}
    {...rest}
  >
    {children}
  </Animated.View>
);

export default AnimatedControlWrapper;
