import { ComponentProps, useState } from "react";
import { ActivityIndicator, Image, View } from "react-native";

interface PropTypes extends ComponentProps<typeof Image> {
  uri: string;
  height: number;
  width?: number;
}

const CustomImage = ({ uri, height, width, ...rest }: PropTypes) => {
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading)
    return (
      <View
        style={{ height, width: height }}
        className="flex flex-col justify-center items-center"
      >
        <ActivityIndicator size={"large"} />;
      </View>
    );
  return (
    <Image
      onLoadStart={() => setIsLoading(true)}
      onLoadEnd={() => setIsLoading(false)}
      source={{ uri }}
      {...rest}
    />
  );
};

export default CustomImage;
