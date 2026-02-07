import { ComponentProps, memo, ReactNode, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  ImageSourcePropType,
  View,
} from "react-native";

interface PropTypes extends ComponentProps<typeof Image> {
  source: ImageSourcePropType;
  height: number;
  width?: number;
}

const CustomImage = ({ source, height, width, ...rest }: PropTypes) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <View
      style={{ height, width: width || "100%" }}
      className="relative overflow-hidden rounded-xl"
    >
      {isLoading && (
        <View className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100">
          <ActivityIndicator size="large" />
        </View>
      )}
      <Image
        source={source}
        style={{ width: "100%", height: "100%" }}
        resizeMode="cover"
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
        {...rest}
      />
    </View>
  );
};

interface CustomBackgroundProptypes extends ComponentProps<typeof Image> {
  source: ImageSourcePropType;
  isPending?: boolean;
  children?: ReactNode;
}

const CustomImageBackground = memo(
  ({ source, isPending, children, ...rest }: CustomBackgroundProptypes) => {
    const [isImageLoading, setIsImageLoading] = useState(false);

    const showLoadingSpinner = isPending || isImageLoading;

    return (
      <ImageBackground
        onLoadStart={() => {
          setIsImageLoading(true);
        }}
        onLoadEnd={() => setIsImageLoading(false)}
        source={source}
        resizeMode="cover"
        {...rest}
      >
        {showLoadingSpinner && (
          <View className="absolute inset-0 items-center justify-center bg-black/40">
            <ActivityIndicator size="large" color="#EC4007" />
          </View>
        )}
        {children}
      </ImageBackground>
    );
  }
);

export { CustomImageBackground };
export default CustomImage;
