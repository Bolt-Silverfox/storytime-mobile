import { ComponentProps, useState } from "react";
import {
  ActivityIndicator,
  Image,
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
      />
    </View>
  );
};

export default CustomImage;
