import { ComponentProps, memo, ReactNode, useState } from "react";
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

const CustomImage = ({
  source,
  height,
  width,
  className: _className,
  style: _style,
  ...rest
}: PropTypes & { className?: string }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <View
      style={{ height, width: width || "100%" }}
      className={`relative overflow-hidden rounded-xl ${_className ?? ""}`}
    >
      {isLoading && (
        <View className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100">
          <ActivityIndicator size="large" />
        </View>
      )}
      <Image
        {...rest}
        source={source}
        style={[{ width: "100%", height: "100%" }, _style]}
        resizeMode="cover"
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
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
